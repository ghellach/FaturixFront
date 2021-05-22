import React, { Component } from 'react'
import { connect } from 'react-redux'
import {Redirect} from 'react-router-dom';


export class AddInvoice extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    componentDidMount() {
        this.setState({loaded: true});
    }

    onChange = e => this.setState({[e.target.name]: e.target.value});
    
    render() {

        // redirectors
        if(this.state.redirectToMy) return <Redirect to="/"/>

        return (
        
            <React.Fragment>
                {this.state.loaded ? 
                    <div className="row">
                        <this.props.Library.BackButton to="/my" name={this.props.lang.my.name} />
                        <br/>
                        <br/>
                        <div className="col-12">
                            <h3>Ajouter une nouvelle facture pour un client</h3>
                        </div>
                        <div className="col-sm-12 col-md-8">
                            <div className="card">
                                <div className="card-body">
                                    <form>
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
                                    </form>
                                </div>
                            </div>
                            <br/>
                        </div>
                        <div className="col-sm-12 col-md-4">
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