import React, { Component } from 'react'
import { connect } from 'react-redux'
import {Redirect, Link, withRouter} from 'react-router-dom';
import QRCode from "react-qr-code";
import {taxRateToAmmount, statusDomObject, FinalStepProcessor, quantityUpdater} from '../../Apps/Product/lib.js';
import Assesment from '../../Apps/Product/Assesment.js';
import ModalQuantity from '../../Apps/Product/ModalQuantity';


export class Product extends Component {
    constructor(props) {
        super(props);
        this.state = {
            product: {unitTaxes: []},
            loaded: true,
            viewing: true,


            // for quantity updater
            finiteButton: false,
            infiniteButton: false,
            submitting: false,
            allDone: false,
            quantity: 0,
            status: 0,
        }

        this.ModalQuantity = ModalQuantity.bind(this);
        this.finalButton = FinalStepProcessor.bind(this);
        this.quantityUpdater = quantityUpdater.bind(this);
    }

    componentDidMount() {
        this.props.post("/product/fetch", {uuid: this.props.match.params.uuid})
        .then(res => {
            this.setState({product: res.data, loaded: true})
            //document.getElementById("json").textContent = JSON.stringify(this.state.product, undefined, 2);
        })
        .catch(() => this.props.history.push("/products"))
    }

    taxCalculation = taxes => {
        let sum = 0;
        taxes.forEach(tax => sum = sum + tax.rate);
        return sum;
    }

    taxRateToAmmount = product => {
        console.log(product);
        const rate = this.taxCalculation(product.unitTaxes);
        const {unitPrice} = product;
        return {
            rate,
            ammount: Number((unitPrice * (1 + rate*0.01)) - unitPrice).toFixed(2)
        }
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

        // redirectors
        if(this.state.redirectToMy) return <Redirect to="/"/>

        const product = this.state.product;

        return (
        
            <React.Fragment>
                {this.state.loaded ? 
                    this.state.viewing ?
                    <div className="row">
                        <div className="col-sm-12 col-md-12">
                            <div className="card">
                                <div className="card-body">
                                    <this.props.Library.BackButton to="/products" name={this.props.lang.product.mainBack} />
                                    <hr/>
                                    <div className="row">
                                        <div className="col-sm-12 col-md-8">
                                            <h4>{this.props.lang.product.product}: {product.name}</h4>
                                            {this.statusDomObject(product.status, product.quantity)}
                                            <br/>
                                        </div>
                                        <div className="col-sm-12 col-md-4">
                                            <button className="btn btn-secondary" style={{marginRight: "3px"}} onClick={() => this.setState({viewing: false})}><i class="fas fa-tools"></i> Edit product</button>
                                            <button className="btn btn-secondary" onClick={() => {
                                                var modal = new window.bootstrap.Modal(document.getElementById("Modal"), {});
                                                modal.show();
                                            }}>
                                                <i class="fas fa-boxes"></i> Edit quantity
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <hr/>
                                    <div className="row">
                                        <div className="col-md-12 col-lg-6">
                                            <h4><b>{this.props.lang.product.unitPrice}: {Number(product.unitPrice).toFixed(2)} {product.currency?.isoSign}</b></h4>
                                            <h5>{this.props.lang.product.unitTaxes}: {/*{taxRateToAmmount(product).ammount} {product.currency?.isoSign}*/}</h5>
                                            <ul>
                                                {product.unitTaxes.map(tax => {
                                                    return (
                                                        <li>
                                                            {tax.names.fr}: {tax.rate} % ({Number((product.unitPrice * (1 + tax.rate*0.01)) - product.unitPrice).toFixed(2)} {product.currency?.isoSign})
                                                        </li>
                                                    )
                                                })}
                                            </ul>
                                            <hr/>
                                            {this.props.lang.product.qrCode}: <br/>
                                            <QRCode value={JSON.stringify({type: "product", uuid: product.uuid})} />
                                        </div>
                                        <div className="col-md-12 col-lg-6">
                                        <table class="table">
                                            <thead>
                                                <tr>
                                                <th scope="col">Action</th>
                                                <th>Date</th>
                                                <th></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {product?.actionsArchive?.actionsArchive.map(one => {
                                                    return (
                                                        <tr>
                                                            <th scope="row">{this.props.lang.product.actionsType?.[one.type]}</th>
                                                            <td>{one.createdAt}</td>
                                                            <td>
                                                                <button className="btn btn-outline-secondary btn-sm">
                                                                    Afficher les détails
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    
                                    <br/><br/>
                                    <br/><br/><br/><br/><br/><br/><hr/>
                                    <pre id="json"></pre>
                                </div>
                            </div>
                        </div>
                        {this.ModalQuantity()}
                    </div>
                    : <Assesment
                        // data
                        uuid={this.state.product.uuid}
                        name={this.state.product.name}
                        unitPrice={this.state.product.unitPrice}
                        currency={this.state.product.currency?.uuid}
                        unitTaxes={this.state.product.unitTaxes}
                        quantity={this.state.product.quantity}
                        status={this.state.product.status}
                        bufferTaxes={this.state.product.unitTaxes.map(tax => {
                            if(tax.uuid) return {...tax, type: 0, name: tax?.names.en}
                            else return {...tax, type: 1, name: tax?.names.en}
                        })} 
                        previousBlock={this.state.product.uuid}
                    />
                    
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Product));