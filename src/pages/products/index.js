import React, { Component } from 'react'
import { connect } from 'react-redux'
import {Redirect, Link, withRouter} from 'react-router-dom';


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

    taxCalculation = taxes => {
        let sum = 0;
        taxes.forEach(tax => sum = sum + tax.rate);
        return sum;
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
                                                    <td>{this.statusDomObject(product.status, product.quantity)}
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