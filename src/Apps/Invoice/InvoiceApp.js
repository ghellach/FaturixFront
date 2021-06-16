import React, { Component, useState } from 'react'
import { connect } from 'react-redux'
import {Redirect} from 'react-router-dom';

// components
import AddProduct from './AddProduct';
import AddTax from './AddTax';
import Item from './Item';

import { invoiceModeller, SavingModal } from './lib';


export class InvoiceApp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //system
            error: null,
            allDone: false,
            invoiceUuid: "",


            // content
            currency: {
                "isoSign": "$",
                "uuid": "a29162bd-c6ad-437f-9be4-92fdf3e2e794",
                "isoName": "CAD"
            },
            sums: {
                grossTotal: 0,
                subTotal: 0,
                taxesTotal: 0
            },
            grossTaxes: [],
            taxes: [],
            taxesFull: [],
            items: [],
            products: [],
            customerEmail: "",
            customerPhone: ""
        }

        this.invoiceModeller = invoiceModeller.bind(this);
    }

    componentDidMount() {
        if(this.props.invoiceUuid) this.setState({
            uuid: this.props.invoiceUuid,
            currency: this.props.currency,
            taxes: this.props.taxes,
            taxesFull: this.props.taxesFull,
            items: this.props.items,
            products: this.props.products,
            customerEmail: this.props.customerDetails?.email,
            customerPhone: this.props.customerDetails?.phone,
        }, () => this.invoiceModeller(this.state.currency, this.state.items, this.state.taxes, false, false))
    }

    onChange = e => this.setState({[e.target.name]: e.target.value});

    clickedInput = (i, n) => {
    }



    /////////////

    taxProvider = (i) => {
        const ts = this.state.taxesFull;
        let final = {};
        ts.forEach(t => {
            if(i == t.uuid ) final = t;
        });
        return final;
    }

    productProvider = uuid => {
        const ps = this.state.products;
        let final = {};
        ps.forEach(p =>{
            if (p.uuid === uuid) final = p;
        })
        return final
    }

    addToItems = product => {
        let increment = false;
        let i;
        let q;
        this.state.items.forEach((p, j) => {
            if(p.uuid === product.uuid) {
                increment = true;
                i = j;
                q = p.quantity + 1;
            };
        })
        if(increment) {
            this.changeQuantity(i, q);
        } else this.setState({
            items: [...this.state.items, {...product, quantity: 1}],
            products: [...this.state.products, {...product}]
        }, () => {
            this.invoiceModeller(this.state.currency, this.state.items, this.state.taxes, false, false)
        });
    }


    ///////

    changeQuantity = (i, q) => {
        if(q <= 0) {
            this.removeItem(i);
        } else this.setState({items: this.state.items.map((item, j) => i === j ? {...item, quantity: q} : item)}, () => {
        
            this.invoiceModeller(this.state.currency, this.state.items, this.state.taxes, false, false)
        });
    }

    saveBuffer = (i, buffer) => {
        if(buffer.quantity <= 0) {
            this.removeItem(i);
        }else {
            const products = this.state.products.map((p, j) => i === j ? Object({
                ...p,
                unitPrice: buffer.unitPrice ? buffer.unitPrice : p.unitPrice,
            }) : p);
            const items = this.state.items.map((item, j) => i === j ? Object({
                ...item,
                quantity: buffer.quantity,
            }) : item);
            this.setState({products, items}, 
                () => this.invoiceModeller(this.state.currency, this.state.items, this.state.taxes, false, false)
            )
        }
       
    };

    removeItem = i => {
        let items = [];
        let products = [];
        this.state.items.forEach((p, j) => i === j ? null : items.push(p));
        this.state.products.forEach((p, j) => i === j ? null : products.push(p));
        this.setState({items, products}, 
            () => this.invoiceModeller(this.state.currency, this.state.items, this.state.taxes, false, false)
        )
    }

    // system management

    selectTax = tax => {
        const uuid = tax.uuid;
        let continuer = true;
        this.state.taxes.forEach(t => t === uuid ? continuer = false : null);
        if(continuer) this.setState({taxes: [...this.state.taxes, tax.uuid], taxesFull: [...this.state.taxesFull, tax]}, 
            () => this.invoiceModeller(this.state.currency, this.state.items, this.state.taxes, false, false)
        )
    }

    removeTax = uuid => {
        let i;
        let taxes = [];
        this.state.taxes.forEach((tax, j) => {
            if(tax === uuid) i = j;
            else taxes.push(tax);
        });
        let taxesFull = [];
        this.state.taxesFull.forEach((t, j) => i === j ? null : taxesFull.push(t));
        this.setState({taxes, taxesFull}, 
            () => this.invoiceModeller(this.state.currency, this.state.items, this.state.taxes, false, false)
        );
    }

    setError = error => this.setState({error});
    onChange = e => this.setState({[e.target.name]: e.target.value});

    // http coms

    saveDraft = () => {
        var modal = new window.bootstrap.Modal(document.getElementById("savingModal"), {});
        modal.show();

        const taxes = [];
        this.state.grossTaxes.map(tax => tax.uuid ? taxes.push(tax.uuid) : null);
        
        const body = {
            invoice: this.props.invoiceUuid ? this.props.invoiceUuid : undefined,
            products: this.state.items,
            currency: this.state.currency.uuid,
            taxes,
            customerDetails: {
                email: this.state.customerEmail,
                phone: this.state.customerPhone
            }
        }
        console.log(body);

        this.props.post("/invoice/draft", body)
        .then(res => this.setState({invoiceUuid: res.data.invoice}))
        .catch(err => console.log(err.response.data));
        setTimeout(() => this.setState({allDone: true}), 1000);
    }
    
    render() {

        // redirectors
        if(this.state.redirectToMy) return <Redirect to="/"/>

        const itemsList = () => {
            return (
                <ul className="list-group" style={{borderRadius: "1rem"}}>
                    {this.state.items.map((item, i) => {
                        return <Item 
                            key={i}
                            item={item} 
                            i={i} 
                            changeQuantity={this.changeQuantity}
                            saveBuffer={this.saveBuffer}
                            currency={this.state.currency}
                        />
                    })} 
                </ul>
            )
        }

        return (
        
            <React.Fragment>
                <div className="row">
                    <this.props.Library.BackButton to="/my" name={this.props.lang.my.name} />
                    <br/>
                    <br/>
                    <div className="col-12">
                        <h3>Ajouter une nouvelle facture pour un client</h3>
                        {this.state.error ? <div className="alert alert-danger">{this.state.error}</div> : null}
                    </div>
                    <div className="col-md-12 col-lg-9">
                        <div className="card">
                            <div className="card-body">
                                {itemsList()}
                                <hr/>
                                <button className="btn btn-success" onClick={() => {
                                    var modal = new window.bootstrap.Modal(document.getElementById("addProduct"), {});
                                    modal.show();
                                }} role="button"><i className="fas fa-arrow-down"></i> Ajouter un produit à la facture</button>
                                {/*<form>
                                    <div className="mb-3">
                                        <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                                        <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
                                        <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                                        <input type="password" className="form-control" id="exampleInputPassword1" />
                                    </div>
                                    <div className="mb-3 form-check">
                                        <input type="checkbox" className="form-check-input" id="exampleCheck1" />
                                        <label className="form-check-label" htmlFor="exampleCheck1">Check me out</label>
                                    </div>
                                    <button type="submit" className="btn btn-primary">Submit</button>
                                </form>*/}
                                <hr/>
                                {this.state.grossTaxes.map(tax => {
                                    if(tax.uuid) return <h6>
                                        {tax.names[this.props.langIso]} ({tax.rate}%): {tax.total.toFixed(2)} {this.state.currency.isoSign} <button onClick={() => this.removeTax(tax.uuid)} className="btn btn-outline-danger btn-sm" style={{borderRadius:"4rem"}}>
                                            <i className="fas fa-minus"/>
                                        </button>
                                    </h6>
                                    else return <h6>
                                        {tax.name}: {tax.total.toFixed(2)} {this.state.currency.isoSign}
                                    </h6>
                                })}
                                {this.state.items.length !== 0 ? <button className="btn btn-primary btn-sm" onClick={() => {
                                    var modal = new window.bootstrap.Modal(document.getElementById("addTax"), {});
                                    modal.show();
                                }}>
                                    <i className="fas fa-plus"/>Add tax
                                    </button> 
                                : null }
                                <hr/>
                                <h6>Sub Total: {this.state.sums.subTotal} {this.state.currency.isoSign}</h6>
                                <h5>Gross Total: {this.state.sums.grossTotal} {this.state.currency.isoSign}</h5>
                        
                                
                            </div>
                        </div>
                        <br/>
                    </div>
                    <div className="col-md-12 col-lg-3">
                        <div className="card">
                            <div className="card-body d-grid gap-2">
                                <h4>Informations du client</h4>
                                <h6>Phone number: <input className="form-control" name="customerPhone" value={this.state.customerPhone} onChange={this.onChange} type="text" style={{borderRadius: "2rem"}}/></h6>
                                <h6>Email address: <input className="form-control" name="customerEmail" value={this.state.customerEmail} onChange={this.onChange} type="email" style={{borderRadius: "2rem"}}/></h6>
                                
                                <hr/>
                                <h4>Options</h4>
                                {this.state.products.length === 0 ? <React.Fragment>
                                    <button className="btn btn-outline-primary" disabled>
                                        <i className="far fa-save"></i> Enregister comme brouillon
                                    </button>
                                    <button className="btn btn-primary" disabled>
                                        <i className="fas fa-save"></i> Enregister la facture
                                    </button>
                                    <button className="btn btn-success" disabled>
                                        <i className="fas fa-share-square"></i> Enregister et envoyer au client
                                    </button> 
                                </React.Fragment>
                                
                                :<React.Fragment> 
                                    <button onClick={this.saveDraft} className="btn btn-outline-primary">
                                        <i className="far fa-save"></i> Enregister comme brouillon
                                    </button>
                                    <button className="btn btn-primary">
                                        <i className="fas fa-save"></i> Enregister la facture
                                    </button>
                                    <button className="btn btn-success">
                                        <i className="fas fa-share-square"></i> Enregister et envoyer au client
                                    </button> 
                                </React.Fragment>}

                            </div>
                        </div>

                    </div>
                    <AddProduct 
                        currency={this.state.currency} 
                        addToItems={this.addToItems}
                    />
                    <AddTax
                        selectTax={this.selectTax}
                        setError={this.setError}
                        usedTaxes={this.state.taxes}
                    />
                    <SavingModal
                        allDone={this.state.allDone}
                        lang={this.props.lang}
                        APP_URL={this.props.APP_URL}
                        invoiceUuid={this.state.invoiceUuid}
                    />
                </div>

            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => {
    return {...state}
}

const mapDispatchToProps = dispatch => {
    return {
        //loading: (p) => actions.loading(dispatch, p)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(InvoiceApp);