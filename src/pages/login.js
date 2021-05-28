import {Helmet} from 'react-helmet';
import React, { Component } from 'react'
import { connect } from 'react-redux'
import {Redirect} from 'react-router-dom';
import * as actions from '../store/actions/actions';


export class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //system
            loaded: false,
            alert: false,
            alertText: "",
            loggingIn: false,
            redirectToMy: false,

            //content
            email: "",
            password: ""
        }
    }

    componentDidMount() {
        this.setState({loaded: true});
    }

    onChange = e => this.setState({[e.target.name]: e.target.value});

    loginRequest = e => {
        this.setState({loggingIn: true});
        e.preventDefault();
        this.props.post("/auth/login", {email: this.state.email, password: this.state.password, client: "b"}, true)
        .then(async res => {
            window.localStorage.setItem("session", res.data.session);
            window.localStorage.removeItem("company");
            this.props.pingUser();
            await this.props.setCompanyState(false, res.data.hasCompanies);
            this.setState({redirectToMy: true});
        })
        .catch(err => {
            console.log(err);
            try {
                this.setState({alertText: this.props.lang.auth.login.alert[err.response.data.code]})
            }catch{
                this.setState({alertText: this.props.lang.main.serverError})
            }
            this.setState({alert: true, loggingIn: false});
        });
    }
    
    render() {

        // redirectors
        if(this.state.redirectToMy) return <Redirect to="/"/>

        return (
        
            <React.Fragment>
                <Helmet>
                    <link rel="stylesheet" href="assets/auth.css"/>
                </Helmet>
                {this.state.loaded ? 
                <div className="container">
                    <div className="row" >
                        <div className="col-lg-10 col-xl-9 mx-auto">
                            <div className="card card-signin flex-row my-5">
                                <div className="card-img-left d-none d-md-flex">
                                </div>
                                <div className="card-body">
                                    <div className="text-center">
                                        <img alt="" src={this.props.APP_URL+"/assets/icons/logo.png"} width="200px" />
                                    </div>
                                    
                                    <h5 className="card-title text-center">{this.props.lang.auth.login.top}</h5>
                                    {this.state.alert ? <div className="alert alert-danger">{this.state.alertText}</div> : null}
                                    <form className="form-signin" onSubmit={this.loginRequest}>
                                        <div className="form-label-group">
                                            <input name="email" value={this.state.email} onChange={this.onChange} type="text" id="email" className="form-control" placeholder="." required />
                                            <label htmlFor="email">{this.props.lang.auth.login.emailAddress}</label>
                                        </div>
                                        <div className="form-label-group">
                                            <input name="password" value={this.state.password} onChange={this.onChange} type="password" id="password" className="form-control" placeholder="." required />
                                            <label htmlFor="password">{this.props.lang.auth.login.password}</label>
                                        </div>
                                        <hr />
                                        {this.state.loggingIn ?
                                            <button style={{width: "100%"}} className="btn btn-lg btn-primary btn-block text-uppercase disabled" type="submit">{this.props.style.loadingIcon} {this.props.lang.auth.login.login}</button>
                                            : <button style={{width: "100%"}} className="btn btn-lg btn-primary btn-block text-uppercase" type="submit"><i className="fas fa-sign-in-alt"></i> {this.props.lang.auth.login.login}</button>
                                        }
                                       
                                        <hr/>
                                        <p>{this.props.lang.auth.login.bottom}</p>
                                        <button style={{width: "100%"}} className="btn btn-lg btn-secondary btn-block text-uppercase" type="submit">{this.props.lang.auth.login.new}</button>
                                        <br/>
                                        <hr/>
                                        <a href="/" onClick={this.props.changeLang} style={{color: "black"}}>
                                            {this.props.langIso === "fr" ? 
                                                <React.Fragment>In English <img src={this.props.APP_URL+"/assets/icons/en.png"} width="30px" /></React.Fragment>
                                                :  <React.Fragment>En Français <img src={this.props.APP_URL+"/assets/icons/fr.png"} width="30px" /></React.Fragment>
                                            }
                                            
                                        </a>
                                    
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>: 
                <React.Fragment>
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
        setCompanyState: (which, has) => actions.setCompanyState(dispatch, which, has),
        pingUser: () => actions.pingUser(dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);