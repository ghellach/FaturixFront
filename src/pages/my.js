import React, { Component } from 'react'
import { connect } from 'react-redux'
import {Redirect, Link} from 'react-router-dom';


export class My extends Component {
    constructor(props) {
        super(props);
        this.state = {
            invoices: []
        }
    }

    componentDidMount() {
        this.props.post("/invoice/fetch/all") 
        .then(res => {
            this.setState({invoices: res.data, loaded: true})
        })
        .catch(e => {
            const err = this.props.errorParser(e);
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
                        <div className="col-12">
                            <h4>{this.props.lang.my.top(this.props.user.firstName)}</h4>
                            <h3>{this.props.lang.my.one} {this.props.company.name}</h3>
                        </div>
                        <div className="col-sm-12 col-md-3">
                            <Link to="/invoices/new" style={{ textDecoration: 'none' }}>
                                <div className="card" style={{borderWidth: "0px"}}>
                                    <div className="card-body" style={{borderWidth: "0px", backgroundImage:"linear-gradient(45deg, #4ad8ff, #5472d6)"}}>
                                        <i style={{color: "white"}} className="fas fa-file-invoice fa-6x"></i>
                                        <br/><br/>
                                        <h1 style={{fontSize: "30px", color: "white"}}>Ajouter une facture</h1>
                                    </div>
                                </div>
                            </Link>
                                <br/>
                                <div className="card" style={{borderWidth: "0px"}}>
                                    <div className="card-body" style={{borderWidth: "0px", backgroundImage:"linear-gradient(45deg, #ff894a, #d65454)"}}>

                                        <i style={{color: "white"}} className="fas fa-folder-plus fa-6x"></i>
                                        <br/>
                                        <h1 style={{fontSize: "30px", color: "white"}}>Ajouter une d??pense</h1>
                                    </div>
                                </div>
                           
                            
                        </div>
                        <div className="col-sm-12 col-md-9">
                            <div className="card">
                                <div className="card-body">
                                    <div className="table-responsive">
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th scope="col">#</th>
                                                    <th scope="col">Client</th>
                                                    <th scope="col">Total</th>
                                                    <th scope="col">Produits</th>
                                                    <th scope="col">Faite le</th>
                                                    <th scope="col"></th>
                                                    <th scope="col"></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                            {this.state.invoices.map(invoice => {
                                                const {customer, sums, currency} = invoice;
                                                return(
                                                    <tr>
                                                        <th scope="row">{invoice.number}</th>
                                                        <td>{customer.name ? customer.name : customer.phone ? customer.phone : customer.email}</td>
                                                        <td>{sums.grossTotal} {currency.isoSign}</td>
                                                        <td>{invoice.productsCount}</td>
                                                        <td>{invoice.uuids}</td>
                                                        <td>
                                                            {
                                                                invoice.refunded 
                                                                ? <span style={{width: "100%"}} className="btn btn-success btn-sm"><i class="fas fa-undo-alt"></i> Rembours??e</span>
                                                                : 
                                                                invoice.finalized 
                                                                ? <span style={{width: "100%"}} className="btn btn-success btn-sm"><i class="fas fa-check"></i> Finalis??e</span>
                                                                : <span style={{width: "100%"}} className="btn btn-secondary btn-sm"><i class="fas fa-truck-loading"></i> En cours</span>
                                                            }
                                                        </td>
                                                        <td>
                                                            <Link to={"/invoice/"+invoice.uuid}>
                                                                <button style={{width: "100%"}} className="btn btn-secondary btn-sm"><i class="fas fa-eye"></i> Afficher</button>
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                            </tbody>
                                        </table>
                                    </div>

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

export default connect(mapStateToProps, mapDispatchToProps)(My);