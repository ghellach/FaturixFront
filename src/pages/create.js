import React, { Component } from 'react'
import { connect } from 'react-redux'
import {Redirect, Link} from 'react-router-dom';
import * as actions from '../store/actions/actions';


export class Create extends Component {
    constructor(props) {
        super(props);
        this.state = {
            alertText: "",
            alert: false,
            name: "",
            requesting: false,
            loaded: false
        }
    }

    componentDidMount() {
        setTimeout(() => this.setState({loaded: true}), 2000);
    }

    onChange = e => this.setState({[e.target.name]: e.target.value});

    request = () => {
        this.setState({requesting: true});
        this.props.post("/company/add/company", {
            name: this.state.name
        })
        .then(async res => {
            this.setState({alert: false})
            console.log(res.data.company, window.localStorage.getItem("hasCompany"));
            await this.props.setCompanyState(res.data.company, this.props.hasCompany);
            setTimeout(() => this.setState({redirectToMy: true}), 2000);
        })
        .catch(err => {
            console.log(err.response);
            if(err.response.data.section+"."+err.response.data.code == "company.sameNameCompany") this.setState({alertText: this.props.lang.create.alert.sameNameCompany});
            else this.setState({alertText: this.props.lang.main.serverError});
            this.setState({requesting: false, alert: true});
        });
    }
    
    render() {

        // redirectors
        if(this.state.redirectToMy) return <Redirect to="/"/>

        return (
        
            <div className="container">
                <br/>
                {this.state.loaded ? 
                    <div className="row d-flex justify-content-center">
                        <div className="col-sm-12 col-md-8 ">
                            <div className="card">
                                <div className="card-body row">
                                    
                                    <div className="col-sm-12 col-md-6" >
                                        <img alt="" src={this.props.APP_URL+"/assets/icons/logo.png"} width="200px" />
                                        <br/>
                                        <h3>{this.props.lang.create.top(this.props.user.firstName)}</h3>
                                        <h4>{this.props.lang.create.text_first}</h4>
                                        {this.state.alert ? <div className="alert alert-danger">{this.state.alertText}</div> : null}
                                        <hr/>
                                        <div className="input-group input-group-lg">
                                            <input onChange={this.onChange} name="name" value={this.state.name} placeholder={this.props.lang.create.placeHolder_name} type="text" className="form-control" aria-label="Large" aria-describedby="inputGroup-sizing-sm"/>
                                        </div>
                                        <br/>
                                        {this.state.requesting ? 
                                            <button className="btn btn-outline-primary disabled">{this.props.style.loadingIcon} {this.props.lang.create.next_button}</button>:
                                            <button onClick={this.request} className="btn btn-outline-primary"> <i className="fas fa-arrow-right"></i> {this.props.lang.create.next_button}</button>
                                        }
                                        
                                    </div>
                                    <div className="col-sm-12 col-md-6 text-center" >

                                        <img src={this.props.APP_URL+"/assets/svg/1.svg"} width="75%" />
                                
                                    </div>
                                    <div className="col-12">
                                        <hr/>
                                        <a href="/" onClick={this.props.changeLang} style={{color: "black"}}>
                                            {this.props.langIso === "fr" ? 
                                                <React.Fragment>In English <img src={this.props.APP_URL+"/assets/icons/en.png"} width="30px" /></React.Fragment>
                                                :  <React.Fragment>En Français <img src={this.props.APP_URL+"/assets/icons/fr.png"} width="30px" /></React.Fragment>
                                            }
                                            
                                        </a>
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

export default connect(mapStateToProps, mapDispatchToProps)(Create);