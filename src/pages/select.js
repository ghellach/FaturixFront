import React, { Component } from 'react'
import { connect } from 'react-redux'
import {Redirect, Link} from 'react-router-dom';
import * as actions from '../store/actions/actions';


class Select extends Component {
    constructor(props) {
        super(props);
        this.state = {
            alertText: "",
            alert: false,
            loaded: false,
            redirectToMy: false,
            companies: [],
            loadingCompany: "",
        }
    }

    UNSAFE_componentWillMount() {
        this.setState({loaded: true})
        this.props.post("/company/fetch/all")
        .then(res => {
            const companies = res.data;
            if(companies.length == 0) window.location.href = "/create";
            this.setState({companies: res.data});
        })
    }

    onChange = e => this.setState({[e.target.name]: e.target.value});

    selectCompany = uuid => {
        this.setState({loadingCompany: uuid});
        this.props.post("/user/select/company", {uuid})
        .then(async () => {
            await this.props.setCompanyState(uuid, true);
            this.setState({redirectToMy: true});
        })
        .catch(() => window.location.href="/select");
    }
    
    render() {

        // redirectors
        if(this.state.redirectToMy) return <Redirect to="/"/>

        return (
        
            <div className="container">
                <br/>
                {this.state.loaded ? 
                    <div className="row d-flex justify-content-center">
                        <div className="col-md-12 col-lg-10 ">
                            <div className="card" style={{borderColor: "white"}}>
                                <div className="card-body row">
                                    
                                    <div className="col-sm-12 col-md-12" >
                                        <img alt="" src={this.props.APP_URL+"/assets/icons/logo.png"} width="200px" />
                                        <br/>
                                        <h4>{this.props.lang.select.text_first}</h4>
                                        
                                    </div>
                                    <div className="col-12 row">
                                        {this.state.companies.map(company => {
                                            return <div className="col-3">
                                                <div class="card" style={{width: "18rem"}}>
                                                    <div class="card-body">
                                                        <h5 class="card-title">{company.name}</h5>
                                                        {this.state.loadingCompany === company.uuid 
                                                        ? <button className="btn btn-outline-primary disabled">{this.props.style.loadingIcon} {this.props.lang.select.next_button}</button>
                                                        : <button className="btn btn-outline-primary" onClick={() => this.selectCompany(company.uuid)}><i class="fas fa-arrow-right"></i> {this.props.lang.select.next_button}</button>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        })}
                                        
                                    </div>
                                    <div className="col-sm-12 col-md-12 text-center" >

                                        <img src={this.props.APP_URL+"/assets/svg/bgselect.svg"} width="75%" />
                                
                                    </div>
                                </div>
                            </div>
                            <br/>
                            
                        </div>
                    </div>
                    
                : <div className="corecenter text-center">
                    <img className="fade-in-image" alt="" src={this.props.APP_URL+"/assets/icons/logo.png"} width="250px" />
                    <br/>
                    <i className="fade-in-text" className="fas fa-circle-notch fa-spin fa-3x" style={{color: "gray"}}></i>
                </div>
                }

            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {...state}
}

const mapDispatchToProps = dispatch => {
    return {
        setCompanyState: (which, has) => actions.setCompanyState(dispatch, which, has),
        //loading: (p) => actions.loading(dispatch, p)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Select);