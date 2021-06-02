import React, { Component, useState } from 'react'
import { connect } from 'react-redux'
import {Redirect} from 'react-router-dom';
import Item from './Item';


export class AddInvoiceApp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [
                {
                    name: "Cahier Canada 25 pages",
                    quantity: 4,
                    unitPrice: 5.00,
                    unitTax: 14.975,
                    currency: "CAD"
                },
                {
                    name: "Calculatrice Graphique Casio ",
                    quantity: 4,
                    unitPrice: 5.00,
                    unitTax: 14.975,
                    currency: "CAD"
                }
            ]
        }
    }

    componentDidMount() {
    }

    onChange = e => this.setState({[e.target.name]: e.target.value});

    clickedInput = (i, n) => {
        console.log(i, n);
    }

    changeQuantity = (i, q) => this.setState({items: this.state.items.map((item, j) => i === j ? {...item, quantity: q} : item)});
    saveBuffer = (i, buffer) => this.setState({items: this.state.items.map((item, j) => i === j ? buffer : item)});

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
                                <button className="btn btn-success"><i className="fas fa-arrow-down"></i> Ajouter un produit à la facture</button>
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