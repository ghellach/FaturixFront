import React, {useEffect, useState} from 'react';
import {Helmet} from 'react-helmet';
import {useSelector} from 'react-redux';

export default function Login (props) {

    const gProps = useSelector(state => state);
    const [state, setState] = useState({
        loaded: false,
        email: "",
        password: ""
    });

    useEffect(() => {
        setTimeout(() => {
            setState({loaded: true});
        })
        
    });

    const loginProcess = e => {

    }

    const onChange = e => setState({[e.target.name]: e.target.value});


    return (
        <React.Fragment>
            <Helmet>
                <link rel="stylesheet" href="assets/auth.css"/>
            </Helmet>
            {state.loaded ? 
            <div className="container">
                <div className="row" >
                    <div className="col-lg-10 col-xl-9 mx-auto">
                        <div className="card card-signin flex-row my-5">
                            <div className="card-img-left d-none d-md-flex">
                            </div>
                            <div className="card-body">
                                <div className="text-center">
                                    <img src={gProps.APP_URL+"/assets/icons/logo.png"} width="200px" />
                                </div>
                                
                                <h5 className="card-title text-center">Login to your Business Panel</h5>
                                <form className="form-signin" onSubmit={loginProcess}>
                                    <div className="form-label-group">
                                        <input name="email" value={state.email} onChange={e => onChange(e)} type="text" id="email" className="form-control" placeholder="." required autofocus />
                                        <label htmlFor="email">Email address</label>
                                    </div>
                                    <div className="form-label-group">
                                        <input name="password" value={state.password} onChange={e => onChange(e)} type="password" id="password" className="form-control" placeholder="." required />
                                        <label htmlFor="password">Password</label>
                                    </div>
                                    <hr />
                                    <button style={{width: "100%"}} className="btn btn-lg btn-primary btn-block text-uppercase" type="submit">Login</button>
                                    <hr/>
                                    <p>New to Faturix. Sign-up for a 30 days free trial ?</p>
                                    <button style={{width: "100%"}} className="btn btn-lg btn-secondary btn-block text-uppercase" type="submit">Sign-up</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>: 
            <React.Fragment>
                <gProps.loadingComp/>
            </React.Fragment>
            }

        </React.Fragment>
    )
}