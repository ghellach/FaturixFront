import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import {Redirect} from 'react-router-dom';

export default function Index (props) {

    const gProps = useSelector(state => state);

    const [redirect, setRedirect] = useState(false);

    setTimeout(() => {
        setRedirect(true);
    }, 500)

    if(redirect === true) return <Redirect to="/my"/>
    return (
        <div className="corecenter text-center">
            <img className="fade-in-image" alt="" src={gProps.APP_URL+"/assets/icons/logo.png"} width="250px" />
            <br/>
            <i className="fade-in-text" className="fas fa-circle-notch fa-spin fa-3x" style={{color: "gray"}}></i>
        </div>
    )

}   