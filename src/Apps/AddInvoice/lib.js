const errorHandler =(e, r) => console.log(e);

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

        console.log(taxes, taxesBody, initialProducts)

        // currencty checl
        const currency = cur;

        // used taxes maper
        initialTaxes.map( tax => {
            if(rejectT) return;
            const fetch = this.taxProvider(tax);
            console.log(fetch);
            if(!fetch) {
                rejectT = true;
                console.log(tax);
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

            console.log("fuck");

            const product = this.productProvider(ident.uuid);
            console.log(product);
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
                        console.log(t);
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