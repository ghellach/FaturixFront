import React, { Component } from 'react'
import { connect } from 'react-redux'
import {Redirect, Link, withRouter} from 'react-router-dom';
import CurrencyInput from 'react-currency-input-field';
import {v4 as uuid} from 'uuid';

import { CommonTaxSelect, CustomTaxField, FinalStepProcessor, quantityUpdater, statusDomObject } from './lib';
import ModalQuantity from './ModalQuantity';

class Assesment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // system
            loaded: false,
            uuid: this.props.uuid,
            newProduct: this.props.uuid ? false : true,
            finiteButton: false,
            infiniteButton: false,
            outOfButton: false,
            updaterButton: false,
            submitting: false,
            allDone: false,
            nextBlock: "",
            allowBack: true,

            // data
            name: this.props.name,
            unitPrice: this.props.unitPrice,
            currency: this.props.currency,
            unitTaxes: this.props.unitTaxes,
            quantity: this.props.quantity,
            feed: {
                currencies: [],
                taxes: []
            },
            status: this.props.status,
            bufferTaxes: this.props.bufferTaxes
        }
        this.ModalQuantity = ModalQuantity.bind(this);
        this.finalButton = FinalStepProcessor.bind(this);
        this.quantityUpdater = quantityUpdater.bind(this);
    }

    componentDidMount() {
        
        const workers = ["currencies", "taxes"];
        Promise.all(workers.map(async loc => {
            return await this.props.post(`/meta/${loc}/fetch`);
        }))
        .then(r => {
            workers.forEach((w, i) => this.setState({feed: {...this.state.feed, [w]: r[i].data}}))
            this.setState({loaded: true});
        })
        .catch(() => {}); //window.location.href="/products");
    }

    goToQuantity = e => {
        e.preventDefault();
        var modal = new window.bootstrap.Modal(document.getElementById("Modal"), {});
        modal.show();
    }

    onChange = e => this.setState({[e.target.name]: e.target.value});
    
    render() {

        return (
        
            <React.Fragment>
                {this.state.loaded ? 
                    <div className="row">
                        <div className="col-sm-12 col-md-12">
                            <div className="card">
                                <div className="card-body">
                                    <this.props.Library.BackButton to="/products" name={this.props.lang.product.mainBack} />
                                    <hr/>
                                    <form onSubmit={
                                        this.state.newProduct ? this.goToQuantity 
                                        : e => {
                                            this.setState({submitting: true, allowBack: false})
                                            var modal = new window.bootstrap.Modal(document.getElementById("Modal"), {});
                                            modal.show(); 
                                            this.finalButton(3, 2, e)
                                        }
                                    }>
                                        <div className="row">
                                            {this.state.newProduct ? <h4>{this.props.lang.product.a.addNew}</h4> : 
                                                <div className="row">
                                                    <div className="col-sm-12 col-md-8">
                                                        <h4>{this.props.lang.product.product}: {this.props.name}</h4>
                                                        {statusDomObject(this.props.status, this.props.quantity, this.props.lang.product)}
                                                        <br/>
                                                    </div>
                                                    <div className="col-sm-12 col-md-4">
                                                        <button className="btn btn-secondary" type="button" onClick={() => this.props?.viewing(true)}><i class="fas fa-eye"></i> {this.props.lang.product.viewProduct}</button>
                                                    </div>
                                                    <hr/>
                                                </div>
                                            }
                                            <div className="col-md-12 col-lg-6">

                                                <h6>{this.props.lang.product.a.name}</h6>
                                                <input required="true" name="name" value={this.state.name} onChange={this.onChange} className="form-control" style={{borderRadius: "1rem"}}></input>
                                                <br/>

                                                <h6>{this.props.lang.product.a.price}</h6>
                                                <CurrencyInput
                                                    style={{borderRadius: "1rem"}}
                                                    className="form-control"
                                                    prefix="$"
                                                    decimalSeparator="." groupSeparator=""
                                                    placeholder="$0"
                                                    defaultValue={this.state.unitPrice}
                                                    decimalsLimit={2}
                                                    name="unitPrice"
                                                    allowNegativeValue={false}
                                                    required="true"
                                                    onValueChange={(value, name) => this.onChange({target: {name, value}})} 
                                                />
                                                <br/>

                                                <h6>{this.props.lang.product.a.currency}</h6>
                                                <select name="currency" value={this.state.currency} required="true" style={{borderRadius: "1rem"}} className="form-control" onChange={this.onChange} >
                                                    <option style={{color: "grey"}}></option>
                                                    {this.state.feed.currencies.map(currency => (
                                                        <option value={currency.uuid}>{currency.isoName} ({currency.isoSign})</option>
                                                    ))}
                                                </select>
                                                <br/>

                                            </div>
                                            <div className="col-md-12 col-lg-6">
                                                <hr/>
                                                <h6>{this.props.lang.product.a.taxes}</h6>
                                                <p>{this.props.lang.product.a.taxesDescription}</p>
                                                <div className="row">
                                                    <div className="col-6">
                                                        <button type="button" style={{width: "100%"}} className="btn btn-success" onClick={() => this.setState({bufferTaxes: [...this.state.bufferTaxes, {type: 0}]})}><i className="fas fa-plus"/> {this.props.lang.product.a.commonTax}</button>
                                                    </div>
                                                    <div className="col-6">
                                                        <button type="button" style={{width: "100%"}} className="btn btn-outline-primary" onClick={() => this.setState({bufferTaxes: [...this.state.bufferTaxes, {type: 1}]})}><i className="fas fa-plus"/> {this.props.lang.product.a.specialTax}</button>
                                                    </div>
                                                </div>
                                                <br/>
                                                {this.state.bufferTaxes.map((tax, i) => {

                                                    const remove = () => {
                                                        const bufferTaxes = [];
                                                        this.state.bufferTaxes.forEach((t, j) => i === j ? null : bufferTaxes.push(t));
                                                        this.setState({bufferTaxes});
                                                    }

                                                    return <React.Fragment key={i}>
                                                        {(() => {
                                                            if(tax.type == 0) return (
                                                                <CommonTaxSelect 
                                                                    key={uuid()}
                                                                    langIso={this.props.langIso} 
                                                                    self={this.state.bufferTaxes[i]}
                                                                    taxes={this.state.feed.taxes}
                                                                    currentTax={e => {
                                                                        this.setState({bufferTaxes: this.state.bufferTaxes.map((one, j) => {
                                                                            if(i === j) return {...one, uuid: e.target.value}
                                                                            else return one;
                                                                        })})
                                                                    }}
                                                                    remove={remove}
                                                                />
                                                            )
                                                            else if (tax.type == 1) return (
                                                                <CustomTaxField 
                                                                    key={uuid()}
                                                                    self={this.state.bufferTaxes[i]}
                                                                    saver={(name, rate) => {
                                                                        console.log(name, rate)
                                                                        this.setState({bufferTaxes: this.state.bufferTaxes.map((one, j) => {
                                                                            if(i === j) return {...one, name, rate}
                                                                            else return one;
                                                                        })})
                                                                    }}
                                                                    remove={remove}
                                                                />
                                                            )
                                                        })()}
                                                        <br/>
                                                    </React.Fragment>
                                                })} 
                                            </div>
                                            <div className="col-12 text-center">
                                                <hr/>
                                                {this.state.newProduct
                                                ? <button type="submit" className="btn btn-primary">
                                                    {this.props.lang.product.a.toQuantityModal} <i className="fas fa-arrow-circle-right"></i>
                                                </button>
                                                : <button type="submit" className="btn btn-primary"><i class="fas fa-check"></i> {this.props.lang.product.a.saveUpdates}</button>
                                                }
                                                
                                            </div>
                                        </div>
                                    </form>
                                    
                                    <br/>
                                </div>
                            </div>
                        </div>
                        {this.ModalQuantity()}
                     </div>
                    
                :<React.Fragment>
                    <this.props.loadingComp/>
                </React.Fragment>
                }

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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Assesment));