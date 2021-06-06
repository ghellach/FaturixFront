import React, { Component } from 'react'
import { connect } from 'react-redux'
import {Redirect, Link, withRouter} from 'react-router-dom';
import {statusDomObject} from './lib.js';


export class Products extends Component {
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
                                    <h4>Products List</h4>
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
                                                    <td>{statusDomObject(product.status, product.quantity)}
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