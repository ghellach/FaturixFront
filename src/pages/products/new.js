import React, { Component } from 'react'
import { connect } from 'react-redux'
import {Redirect, Link, withRouter} from 'react-router-dom';
import CurrencyInput from 'react-currency-input-field';
import { CommonTaxSelect, CustomTaxField } from '../../Apps/Product/lib.js';
import Assesment from '../../Apps/Product/Assesment.js';
import {v4 as uuid} from 'uuid';

class NewProduct extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // system
            loaded: false,

            // data
            name: "",
            unitPrice: 0,
            currency: "",
            unitTaxes: [],
            quantity: 0,
            feed: {
                currencies: [],
                taxes: []
            },
            status: 1,
            bufferTaxes: []
        }
    }

    componentDidMount() {
        
        this.setState({loaded: true});
    }

    render() {

        return (
        
            <React.Fragment>
                {this.state.loaded ? 
                    <Assesment 
                    
                        // data
                        name= ""
                        unitPrice={0}
                        currency=""
                        unitTaxes={[]}
                        quantity={0}
                        status={1}
                        bufferTaxes={[]}
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(NewProduct));