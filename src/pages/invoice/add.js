import React, { Component, useState } from 'react'
import { connect } from 'react-redux'
import {Redirect} from 'react-router-dom';
import InvoiceApp from '../../Apps/Invoice/InvoiceApp';


export class AddInvoice extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [
                {
                    name: "Cahier Canada 25 pages",
                    quantity: "4",
                    unitPrice: 5.00,
                    unitTax: 14.975,
                    currency: "CAD"
                },
                {
                    name: "Calculatrice Graphique Casio ",
                    quantity: "4",
                    unitPrice: 5.00,
                    unitTax: 14.975,
                    currency: "CAD"
                }
            ]
        }
    }

    componentDidMount() {
        this.setState({loaded: true});
    }

    onChange = e => this.setState({[e.target.name]: e.target.value});

    clickedInput = (i, n) => {
        console.log(i, n);
    }
    
    render() {

        // redirectors
        if(this.state.redirectToMy) return <Redirect to="/"/>

        return (
        
            <React.Fragment>
                {this.state.loaded ? 
                    <InvoiceApp />
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

export default connect(mapStateToProps, mapDispatchToProps)(AddInvoice);