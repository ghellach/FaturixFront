import React, { Component, useState } from 'react'
import { connect } from 'react-redux'
import {Redirect} from 'react-router-dom';
import AddProduct from './AddProduct';
import Item from './Item';

import { invoiceModeller } from './lib';


export class AddInvoiceApp extends Component {
    constructor(props) {
        super(props);
        this.state = {
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
            taxes: ["52974fbd-4be7-4df8-9363-77c1a2d9ee7c", "93974fbd-6be7-4df8-9363-77c1a2d9t57c"],
            taxesFull: [ {
                "names": {
                    "fr": "TVQ",
                    "en": "TVQ"
                },
                "rate": 9.975,
                "uuid": "52974fbd-4be7-4df8-9363-77c1a2d9ee7c"
            },
            {
                "names": {
                    "fr": "TPS",
                    "en": "TPS"
                },
                "rate": 5,
                "uuid": "93974fbd-6be7-4df8-9363-77c1a2d9t57c"
            }],
            items: [],
            products: [],
        }

        this.invoiceModeller = invoiceModeller.bind(this);
    }

    componentDidMount() {

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
        this.setState({
            items: [...this.state.items, {...product, quantity: 1}],
            products: [...this.state.products, {...product}]
        }, () => {
            this.invoiceModeller(this.state.currency, this.state.items, this.state.taxes, false, false)
        });
    }


    ///////

    changeQuantity = (i, q) => this.setState({items: this.state.items.map((item, j) => i === j ? {...item, quantity: q} : item)}, () => {
        
        this.invoiceModeller(this.state.currency, this.state.items, this.state.taxes, false, false)
    });
    saveBuffer = (i, buffer) => {
        console.log(buffer);
        const products = this.state.products.map((p, j) => i === j ? Object({
            ...p,
            quantity: buffer.quantity,
            unitPrice: buffer.unitPrice ? buffer.unitPrice : p.unitPrice,
        }) : p)
        this.setState({products}, 
            () => this.invoiceModeller(this.state.currency, this.state.items, this.state.taxes, false, false)
        )
    };

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
                                    if(tax.uuid) return <h6>{tax.names[this.props.langIso]} ({tax.rate}%): {tax.total.toFixed(2)} {this.state.currency.isoSign}</h6>
                                    else return <h6>{tax.name}: {tax.total.toFixed(2)} {this.state.currency.isoSign}</h6>
                                })}
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
                                <h4>Options</h4>
                                <button className="btn btn-outline-primary">
                                    <i className="far fa-save"></i> Enregister comme brouillon
                                </button>
                                <button className="btn btn-primary">
                                    <i className="fas fa-save"></i> Enregister la facture
                                </button>
                                <button className="btn btn-success">
                                    <i className="fas fa-share-square"></i> Enregister et envoyer au client
                                </button>
                            </div>
                        </div>

                    </div>
                    <AddProduct 
                        currency={this.state.currency} 
                        addToItems={this.addToItems}
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

export default connect(mapStateToProps, mapDispatchToProps)(AddInvoiceApp);