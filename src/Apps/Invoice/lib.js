import React from 'react';

const errorHandler =(e, r) => console.log(e);



export function modelInvoice () {return this.invoiceModeller(this.state.currency, this.state.items, this.state.taxes, false, false) };


export function invoiceModeller ( 
    cur, 
    initialProducts, 
    initialTaxes, 
    checkAvailability, 
    checkQuantity, 
) {

    /*
        takes in: res object, initial products and initial taxes
        needs: product provider with uuid and same for taxprovider
    */
        // taxes init
        let taxes = [];
        let taxesBody = [];
        let rejectT = false;


        // currencty checl
        const currency = cur;

        // used taxes maper
        initialTaxes.map( tax => {
            if(rejectT) return;
            const fetch = this.taxProvider(tax);
            if(!fetch) {
                rejectT = true;
                return errorHandler("badParams");
            }else {
                taxes.push(fetch.uuid);
                taxesBody.push(fetch);
            }
        });
        if(rejectT) return false;

        // products fetch
        let rejectP = false;
        const products = initialProducts.map(ident => {
            // prevent crash by checking previous error
            if(rejectP) return false;


            const product = this.productProvider(ident.uuid);
            if(!product) {
                rejectP = true;
                return errorHandler("notAvailable");
            }

            if(checkQuantity && product.status !== 0) if(!ident.quantity || ident?.quantity > product.quantity) {
                rejectP = true;
                return 
            }

            const quantity = ident.quantity;
            const unitPrice = ident.unitPrice ? ident.unitPrice : product.unitPrice;

            const priceComputing = () => {
                let taxCal = [];
                let otherTaxCal = [];
                
                product.unitTaxes?.forEach(t => {
                    if(t.uuid) {
                        taxes.forEach(c => {
                            if(t.uuid === c) {
                                taxCal.push({uuid: t.uuid, value: unitPrice*(1+t.rate*0.01)-unitPrice})
                            }
                        })
                    }else {
                        otherTaxCal.push({name: t.names.en, value: unitPrice*(1+t.rate*0.01)-unitPrice})
                    }
                });

                let finalUnitPrice = unitPrice;

                taxCal.forEach(t => finalUnitPrice = finalUnitPrice+t.value)
                otherTaxCal.forEach(t => finalUnitPrice = finalUnitPrice+t.value)

                const unit = {
                    subTotal: unitPrice,
                    total: finalUnitPrice,
                    taxes: taxCal.map(t => {
                        return {
                            uuid: t.uuid,
                            value: t.value
                        }
                    }),
                    otherTaxes: otherTaxCal.map(t => {
                        return {
                            name: t.name,
                            value: t.value
                        }
                    })
                }

                const total = {
                    subTotal: unit.subTotal*quantity,
                    total: finalUnitPrice*quantity,
                    taxes: unit.taxes.map(t => {
                        return {
                            ...t,
                            value: t.value*quantity,
                        }
                    }),
                    otherTaxes: otherTaxCal.map(t => {
                        return {
                            name: t.name,
                            value: t.value*quantity
                        }
                    })
                }

                const p = {
                    uuid: product.uuid,
                    name: product.name,
                    quantity,
                    unit,
                    total
                }

                return p
            }

            return priceComputing();

        });

        if(rejectP) return false;

        const finalTaxes = taxesBody.map(tax => {
            let sum = 0;
            products.forEach(product => {
                product.total.taxes.forEach(t => {
                    if(tax.uuid === t.uuid) sum = sum + t.value;
                })
            });
            return {
                ...tax, 
                total: sum
            }
        });

        const finalOtherTaxes = [];
        products.forEach(product =>  product.total.otherTaxes.forEach(t => finalOtherTaxes.push({...t, value: undefined, total: t.value, product: product.uuid})));

        let taxesTotal = 0;
        Array(...finalTaxes, ...finalOtherTaxes).forEach(tax => taxesTotal = taxesTotal+tax.total);
        let subTotal = 0;
        products.forEach(p => subTotal = subTotal + p.total.subTotal);
        let grossTotal = subTotal + taxesTotal;

        if(this.state.reduction) {
            if(this.state.reduction?.type === 0) {
                if(this.state.reduction?.payload <= 0) grossTotal = grossTotal;
                else if(this.state.reduction?.payload >= 100) grossTotal = 0;
                grossTotal = grossTotal * 0.01*(100-Number(this.state.reduction.payload))
            }
            else if (this.state.reduction?.type === 1) {
                if(this.state.reduction.payload >= grossTotal) grossTotal = 0
                else grossTotal = grossTotal - Number(this.state.reduction.payload)
            }
        }

        const body = {
            currency: currency.uuid,
            sums: {
                taxesTotal: Number(taxesTotal).toFixed(2),
                subTotal: Number(subTotal).toFixed(2),
                grossTotal: Number(grossTotal).toFixed(2)
            },
            grossTaxes: [...finalTaxes, ...finalOtherTaxes],
            products
        }

        return this.setState({
            sums: body.sums,
            items: body.products,
            grossTaxes: body.grossTaxes
        }, () => {
            return body
        });
}

export function SavingModal (props) {
    return (<div className="modal fade" id="savingModal" tabindex="-1"  data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                    <div style={{borderRadius: "2rem"}} className="modal-content">
                        {props?.reasonFailed ? 
                            <div className="modal-body">
                                {props.reasonFailed === "noCustomer" ? <h6>
                                    Make sure to enter all required customer info.
                                </h6> : null}

                                {props.reasonFailed === "alreadyFinalized" ? <h6>
                                    Invoice already finalized, reload to view.
                                </h6> : null}

                                {props.reasonFailed === "quantityOverflow" ? 
                                <React.Fragment>
                                    <p>
                                        {props.whichFailed.quantity === 0 ? 
                                            <React.Fragment>
                                                {props.items.map(item => item.uuid === props.whichFailed.uuid ? 
                                                <React.Fragment>
                                                    <b>{item.name}</b>
                                                </React.Fragment> : undefined)} <br/>is not available anymore. Please update the product's availability by clicking <a href={"/product/"+props.whichFailed.uuid}>here.</a>
                                            </React.Fragment> : 
                                            <React.Fragment>
                                                The maximum quantity for <br/>
                                                {props.items.map(item => item.uuid === props.whichFailed.uuid ? 
                                                <React.Fragment>
                                                    <b>{item.name}</b> is {props.whichFailed.quantity}
                                                </React.Fragment> : undefined)} <br/>
                                                Please decrease quantity, or update the product's availability by clicking <a href={"/product/"+props.whichFailed.uuid}>here.</a>
                                            </React.Fragment>
                                        }
                                            
                                    </p>
                               </React.Fragment> : null}
                                <hr/>
                                <div className="row">
                                    <div className="col-md-12 col-lg-12">
                                        <button  className="btn btn-primary" onClick={() => window.location.href = "/invoice/"+props.whichFailed.uuid} style={{width: "100%"}}><i className="fas fa-times"/> Close window</button>
                                    </div>
                                </div>
                            </div>
                        :
                        props?.allDone ? 
                            <div className="modal-body text-center">
                                <i className="fas fa-check fa-3x" style={{color: "#00db6a"}} />
                                <br/>
                                <h4>{props.lang.product.q.savedToCluster}</h4>
                                <hr/>
                                <div className="row">
                                    <div className="col-md-12 col-lg-6">
                                        <a  className="btn btn-primary" href="/my" style={{width: "100%"}}><i class="fas fa-home"></i> Go to menu</a>
                                    </div>
                                    <div className="col-md-12 col-lg-6">
                                        <a className="btn btn-success" href={"/invoice/"+props.invoiceUuid} style={{width: "100%"}}><i class="fas fa-eye"></i> View invoice</a>
                                    </div>
                                </div>
                            </div>
                            : <div className="modal-body text-center">
                                <img src={props.APP_URL+"/assets/icons/loaderyes.gif"} width="300px" />
                                <h4>{props.lang.product.q.saving} ...</h4>
                                <br/>
                            </div>
                        } 
                    </div>
            </div>
        </div>);
}



