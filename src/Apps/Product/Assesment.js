import React, { Component } from 'react'
import { connect } from 'react-redux'
import {Redirect, Link, withRouter} from 'react-router-dom';
import CurrencyInput from 'react-currency-input-field';
import { CommonTaxSelect, CustomTaxField } from './lib';
import {v4 as uuid} from 'uuid';

class Assesment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // system
            loaded: false,
            finiteButton: false,
            infiniteButton: false,
            submitting: false,
            allDone: false,

            // data
            name: this.props.name,
            unitPrice: this.props.unitProce,
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

    finalButton = async (which, step) => {
        console.log(which, step)
        let button;
        if(which === 1) button = "finiteButton";
        else if(which === 2) button = "infiniteButton";
        else return;

        if(step === 1) {
            this.setState({[button]: true});
            setTimeout(() => this.setState({[button]: false}), 2000);
        }
        else if(step === 2) {
            this.setState({submitting: true, status: which === 1 ? 1 : 0});
            const body = {
                name: this.state.name, 
                unitPrice: this.state.unitPrice,
                currency: this.state.currency,
                unitTaxes: this.state.bufferTaxes.map(tax => {
                    if(tax.type === 0) return tax;
                    else if(tax.type === 1) return {
                        names: {
                            fr: tax.name,
                            en: tax.name
                        },
                        rate: tax.rate
                    }
                }),
            }
            try {
                const res = await this.props.post("/product/add", body);
                await this.props.post("/product/update/quantity", {
                    uuid: res.data.uuid,
                    status: this.state.status,
                    quantity: this.state.quantity
                });
                setTimeout(() => this.setState({allDone: true}), 2000);
            }catch(err) {console.log(err.response); this.setState({submitting: false})}
            console.log(body);
        } 
        else return

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
                                    <form onSubmit={this.goToQuantity}>
                                        <div className="row">
                                            <h4>Add a new product</h4>
                                            <br/>
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
                                                    decimalsLimit={2}
                                                    name="unitPrice"
                                                    allowNegativeValue={false}
                                                    required="true"
                                                    onValueChange={(value, name) => this.onChange({target: {name, value}})} 
                                                />
                                                <br/>

                                                <h6>Currency</h6>
                                                <select name="currency" required="true" style={{borderRadius: "1rem"}} className="form-control" onChange={this.onChange} >
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
                                                <button type="submit" className="btn btn-primary">
                                                    Continue to quantity <i className="fas fa-arrow-circle-right"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                    
                                    <br/>
                                </div>
                            </div>
                        </div>
                        <div className="modal fade" id="Modal" tabindex="-1"  data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered">
                                {this.state.submitting ? 
                                    <div style={{borderRadius: "2rem"}} className="modal-content">
                                        {this.state.allDone ? 
                                            <div className="modal-body text-center">
                                                <i className="fas fa-check fa-3x" style={{color: "#00db6a"}} />
                                                <br/>
                                                <h4>{this.state.name} saved to the cluster successfully !</h4>
                                                <hr/>
                                                <button onClick={() => window.location.href = "/products"} className="btn btn-success">Go to the products page</button>
                                            </div>
                                            : <div className="modal-body text-center">
                                                <img src={this.props.APP_URL+"/assets/icons/loaderyes.gif"} width="300px" />
                                                <h4>Saving {this.state.name} ...</h4>
                                                <br/>
                                            </div>
                                        } 
                                    </div>
                                : <div style={{borderRadius: "2rem"}} className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="exampleModalLabel">Quantity</h5>
                                    </div>
                                    <div className="modal-body">
                                        
                                        <CurrencyInput
                                            style={{borderRadius: "1rem"}}
                                            className="form-control"
                                            decimalSeparator="." groupSeparator=""
                                            placeholder="Units: "
                                            prefix="Units: "
                                            name="quantity"
                                            allowNegativeValue={false}
                                            allowDecimals={false}
                                            required="true"
                                            onValueChange={(value, name) => this.onChange({target: {name, value}})} 
                                        /><br/>
                                        {this.state.finiteButton ?
                                            <button style={{width: "100%"}} className="btn btn-primary" onClick={() => this.finalButton(1, 2)}><i class="fas fa-redo"></i> Click again to save</button>
                                            : <button style={{width: "100%"}} className="btn btn-primary" onClick={() => this.finalButton(1, 1)}><i class="fas fa-list-ol"></i> Save with definite quantity</button>
                                        }
                                        
                                        
                                        <hr/>
                                        <div className="text-center">Or</div>
                                        <hr/>

                                        {this.state.infiniteButton ?
                                                <button style={{width: "100%"}} className="btn btn-primary" onClick={() => this.finalButton(2, 2)}><i class="fas fa-redo"></i> Click again to save</button>
                                            : <button style={{width: "100%"}} className="btn btn-primary" onClick={() => this.finalButton(2, 1)}><i class="fas fa-infinity"></i> Save as infinitely available</button>
                                        }
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"><i class="fas fa-arrow-circle-left"></i> Go back to product page</button>
                                    </div>
                                </div> }
                            </div>
                        </div>
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