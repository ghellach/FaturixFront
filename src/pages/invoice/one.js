import React, { Component, useState } from 'react'
import { connect } from 'react-redux'
import {Redirect, withRouter} from 'react-router-dom';
import InvoiceApp from '../../Apps/Invoice/InvoiceApp';


class Invoice extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uuid: this.props.match.params.uuid,
            currency: "",
            taxes: [],
            taxesFull: [],
            items: [],
            products: [],
            finalized: true,
            paid: true,
            createdAt: null,
            updatedAt: null,
            customerDetails: {}
        }
    }

    componentDidMount = () => {
        this.props.post("/invoice/fetch", {invoice: this.props.match.params.uuid})
        .then(res => this.setState({...res?.data, loaded: true}))
        .catch(err => console.log(err));
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
                    <InvoiceApp
                        invoiceUuid={this.state.uuid}
                        currency={this.state.currency}
                        taxes={this.state.taxes}
                        taxesFull={this.state.taxesFull}
                        items={this.state.items}
                        products={this.state.products}
                        finalized={this.state.finalized}
                        paid={this.state.paid}
                        reduction={this.state.reduction}
                        notes={this.state.notes}
                        createdAt={this.state.createdAt}
                        updatedAt={this.state.updatedAt}
                        customerDetails={this.state.customerDetails}
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Invoice));