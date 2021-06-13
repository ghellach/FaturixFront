import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import { Redirect, Link } from 'react-router-dom';

export default function NavBar (props) {

    const gProps = useSelector(state => state);

    const [redirect, setRedirect] = useState(false);

    if(redirect) return <Redirect to="/logout" />
    return (
        <React.Fragment>
            <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
                <div className="container-fluid">
                    <Link to="/my" style={{ textDecoration: 'none' }}>
                        <div className="navbar-brand"><img alt="" width="115px" src={gProps.APP_URL+"/assets/icons/white.png"} /></div>
                    </Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon" />
                    </button>
                    <div className="collapse navbar-collapse" id="navbarCollapse">
                    <ul className="navbar-nav me-auto mb-2 mb-md-0">
                        <li className="nav-item">
                            <a className="nav-link active" aria-current="page" href="/my">Menu</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/products"><i class="fas fa-store"></i> {gProps.lang.main.products}</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/qr"><i class="fas fa-qrcode"></i> Scanner QR/Barre</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/select"><i class="fas fa-retweet"></i>{gProps.lang.main.change_company}</a>
                        </li>
                        
                    </ul>
                    <div className="d-flex" data-children-count={2}>
                        <button onClick={gProps.changeLang} className="btn btn-outline-secondary" style={{color: "white"}}>
                            {gProps.langIso === "fr" ? 
                                <React.Fragment>In English <img alt="" src={gProps.APP_URL+"/assets/icons/en.png"} width="30px" /></React.Fragment>
                                :  <React.Fragment>En Français <img alt="" src={gProps.APP_URL+"/assets/icons/fr.png"} width="30px" /></React.Fragment>
                            }
                            
                        </button>
                        <button className="btn btn-danger" onClick={() => setRedirect(true)}>Déconnection</button>
                    </div>
                    </div>
                </div>
            </nav>
            <br/>
        </React.Fragment>
       

    )
}