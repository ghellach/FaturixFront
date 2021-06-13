import React, { Component } from 'react'
import { connect } from 'react-redux'
import {Redirect, Link, withRouter} from 'react-router-dom';
import {statusDomObject} from '../../Apps/Product/lib.js';


class Products extends Component {
    constructor(props) {
        super(props);
        this.state = {
            products: [],
            loaded: true
        }
    }

    componentDidMount() {
        this.props.post("/product/fetch/all") 
        .then(res => {
            this.setState({products: res.data, loaded: true})
        })
        .catch(e => {
            const err = this.props.errorParser(e);
            console.log(err);
        })
    }

    

    onChange = e => this.setState({[e.target.name]: e.target.value});
    
    render() {

        // redirectors
        if(this.state.redirectToMy) return <Redirect to="/"/>

        return (
        
            <React.Fragment>
                {this.state.loaded ? 
                    <div className="row">
                        <div className="col-sm-12 col-md-12">
                            <div className="card">
                                <div className="card-body">
                                    <this.props.Library.BackButton to="/my" name={this.props.lang.my.name} />
                                    <hr/>
                                    <div className="row">
                                        <div className="col-sm-12 col-md-9">
                                            <h4>Products List</h4>
                                        </div>
                                        <div className="col-sm-12 col-md-3">
                                            <Link to="/products/new" style={{textDecoration: "none"}}>
                                                <button className="btn btn-primary">
                                                    <i className="fas fa-plus"/> Ajouter un produit
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                    <table class="table">
                                        <thead>
                                            <tr>
                                                <th scope="col">{this.props.lang.product.product}</th>
                                                <th scope="col">{this.props.lang.product.unitPrice}</th>
                                                <th scope="col"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.products.map(product => {
                                                return <tr>
                                                    <th scope="row">{product.name}</th>
                                                    <td>{product.unitPrice} {product.currency.isoSign}</td>
                                                    <td>{statusDomObject(product.status, product.quantity, this.props.lang.product)}
                                                    <button className="btn btn-secondary btn-sm" onClick={() => this.props.history.push(String("/product/"+product.uuid))}><i class="fas fa-chevron-circle-right"></i> Afficher</button></td>
                                                </tr>          
                                            })}
                                        </tbody>
                                    </table>
                                </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Products));