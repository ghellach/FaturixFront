import React, { Component, useState } from 'react'
import { connect } from 'react-redux'
import {Redirect} from 'react-router-dom';
import CurrencyInput from 'react-currency-input-field';

// components
import AddProduct from './AddProduct';
import AddTax from './AddTax';
import Item from './Item';

import { invoiceModeller, SavingModal, modelInvoice } from './lib';


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
            reduction: null,
            customerEmail: "",
            customerPhone: ""
        }

        this.invoiceModeller = invoiceModeller.bind(this);
        this.modelInvoice = modelInvoice.bind(this);
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
            customerFirstName: this.props.customerDetails?.firstName,
            customerLastName: this.props.customerDetails?.lastName,
            customerAddress: this.props.customerDetails?.address,
            notes: this.props.notes,
            reduction: this.props.reduction
        }, () => this.invoiceModeller(this.state.currency, this.state.items, this.state.taxes, false, false))
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

    // system

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
            },
            reduction: this.state.reduction ? {
                type: this.state.reduction.type,
                payload: this.state.reduction.payload
            } : undefined
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
                        return (
                            <li className="list-group-item " style={{backgroundColor: i % 2 ? undefined : "#ededed"}}>
                                <div className="row">
                                    <div className="col-md-12 col-lg-4">
                                        <b>{item.name}</b>
                                    </div>
                                    <div className="col-md-12 col-lg-5" >
                                        {this.props.lang.invoice.price}: <b style={{fontSize: "1.3rem"}}><u>{item.unit?.subTotal?.toFixed(2)} $CAD</u></b> <br/> ({this.props.lang.invoice.taxes}: <b>{(item.unit?.total-item.unit?.subTotal).toFixed(2)} $CAD</b>) {this.props.lang.invoice.quantity}: <b>{item.quantity}</b>
                                    </div>
                                </div>
                                
                            </li>
                        )
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
                        <h3>Facture #{this.props.number}</h3>
                        <br/>
                        <button className="btn btn-primary" onClick={this.props.downloadPDF}>Download</button>
                        <hr/>
                        {this.state.error ? <div className="alert alert-danger">{this.state.error}</div> : null}
                    </div>
                    <div className="col-md-12 col-lg-9">
                        <div className="card">
                            <div className="card-body">
                                {itemsList()}
                                <hr/>
                                {this.state.grossTaxes.map(tax => {
                                    if(tax.uuid) return <h6>
                                        {tax.names[this.props.langIso]} ({tax.rate}%): {tax.total.toFixed(2)} {this.state.currency.isoSign}
                                    </h6>
                                    else return <h6>
                                        {tax.name}: {tax.total.toFixed(2)} {this.state.currency.isoSign}
                                    </h6>
                                })}
                                {this.state.items.length !== 0 ? 
                                <React.Fragment>
                                     <hr/>
                                    {this.state.reduction ?
                                        <React.Fragment>
                                            <h5>{this.props.lang.invoice.reduction}: {(this.state.reduction?.payload).toFixed(2)}{this.state.reduction?.type === 0 ? "%" : this.state.reduction?.type === 1 ? "$" : null}
                                            </h5>
                                            
                                        </React.Fragment>
                                        : 
                                        <button className="btn btn-outline-primary btn-sm" onClick={this.addReduction}>
                                            <i className="fas fa-plus"/> Add reduction
                                        </button>
                                    }
                                </React.Fragment>
                                : null }
                                <hr/>
                                <h6>{this.props.lang.invoice.subTotal}: {this.state.sums.subTotal} {this.state.currency.isoSign}</h6>
                                <h5>{this.props.lang.invoice.grossTotal}: {this.state.sums.grossTotal} {this.state.currency.isoSign}</h5>
                        
                                
                            </div>
                        </div>
                        <br/>
                    </div>
                    <div className="col-md-12 col-lg-3">
                        <div className="card">
                            <div className="card-body d-grid gap-2">
                                <h4>{this.props.lang.invoice.customerInfo}</h4>
                                <h6>{this.props.lang.invoice.firstName}: {this.state.customerFirstName}</h6>
                                <h6>{this.props.lang.invoice.lastName}: {this.state.customerLastName}</h6>
                                <h6>{this.props.lang.invoice.phoneNumber}: {this.state.customerPhone}</h6>
                                <h6>{this.props.lang.invoice.email}: {this.state.customerEmail}</h6>
                                <h6>{this.props.lang.invoice.address}: {this.state.customerAddress}</h6>
                                
                                <hr/>
                                <h4>Options</h4>
                                <React.Fragment>
                                    <button className="btn btn-success">
                                        <i className="fas fa-share-square"></i> {this.props.lang.invoice.send}
                                    </button> 
                                </React.Fragment>

                            </div>
                        </div>

                    </div>
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