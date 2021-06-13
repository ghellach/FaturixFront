import React, { Component } from 'react'
import { connect } from 'react-redux'
import {Redirect, Link, withRouter} from 'react-router-dom';
import CurrencyInput from 'react-currency-input-field';
import {v4 as uuid} from 'uuid';

import { CommonTaxSelect, CustomTaxField, FinalStepProcessor, quantityUpdater } from './lib';
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
            updaterButton: false,
            submitting: false,
            allDone: false,
            nextBlock: "",

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

    statusDomObject = (status, quantity) => {
        let dom = ["secondary", ".", ""];
        if (status === 0) dom = ["success", "Disponible", <i class="fas fa-check"></i>];
        if (status === 1) dom = ["success", quantity+" en stock", <i class="fas fa-check"></i>];
        if (status === 2) dom = ["danger", "Pas en stock", <i className="fas fa-exclamation-triangle"></i>];
        if (status === 3) dom = ["warning", "Archivé", <i class="fas fa-archive"></i>];
        if (status === 5) dom = ["warning", "Product suspendu", <i className="fas fa-exclamation-triangle"></i>];
        return <h5><span class={"badge bg-"+dom[0]}>{dom[2]} {dom[1]}</span></h5>;
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
                                    <form onSubmit={this.state.newProduct ? this.goToQuantity : e => this.finalButton(3, 2, e)}>
                                        <div className="row">
                                            {this.state.newProduct ? <h4>Add a new product</h4> : 
                                                <div className="row">
                                                    <div className="col-sm-12 col-md-9">
                                                        <h4>{this.props.lang.product.product}: {this.props.name}</h4>
                                                        {this.statusDomObject(this.props.status, this.props.quantity)}
                                                        <br/>
                                                    </div>
                                                    <div className="col-sm-12 col-md-3">
                                                        <button className="btn btn-secondary" onClick={() => this.setState({viewing: false})}><i class="fas fa-tools"></i> Edit product</button>
                                                    </div>
                                                    <hr/>
                                                </div>
                                            }
                                            <div className="col-md-12 col-lg-6">

                                                <h6>Name of the product</h6>
                                                <input required="true" name="name" value={this.state.name} onChange={this.onChange} className="form-control" style={{borderRadius: "1rem"}}></input>
                                                <br/>

                                                <h6>Price</h6>
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

                                                <h6>Currency</h6>
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
                                                <h6>Taxes</h6>
                                                <p>* Taxes are applied depending on the customer's location defined at invoice generation</p>
                                                <div className="row">
                                                    <div className="col-6">
                                                        <button type="button" style={{width: "100%"}} className="btn btn-success" onClick={() => this.setState({bufferTaxes: [...this.state.bufferTaxes, {type: 0}]})}><i className="fas fa-plus"/> Add a common tax</button>
                                                    </div>
                                                    <div className="col-6">
                                                        <button type="button" style={{width: "100%"}} className="btn btn-outline-primary" onClick={() => this.setState({bufferTaxes: [...this.state.bufferTaxes, {type: 1}]})}><i className="fas fa-plus"/> Add a custom tax</button>
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
                                                    Continue to quantity <i className="fas fa-arrow-circle-right"></i>
                                                </button>
                                                : <button type="submit" className="btn btn-primary"><i class="fas fa-check"></i> Save updates</button>
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