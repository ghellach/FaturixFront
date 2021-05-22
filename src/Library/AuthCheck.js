import React from 'react'
import { connect } from 'react-redux'
import {withRouter} from 'react-router-dom';
import * as actions from '../store/actions/actions';

class AuthCheck extends React.Component {

    UNSAFE_componentWillMount() {
        const {pathname} = this.props.location;
        if(pathname !== "/login" && pathname !== "/new" && window.localStorage.getItem("session") === "") {
            if(pathname === "/") setTimeout(() => this.props.history.push("/login"), 2000);
            else this.props.history.push("/login")
        }
        this.props.post("/auth/ping")
        .then(() => {
            this.props.pingUser();
            if(pathname === "/login" || pathname === "/new") this.props.history.push("/my");
        })
        .catch(() => {
            if(pathname === "/") setTimeout(() => this.props.history.push("/login"), 2000);
            else this.props.history.push("/login")
        })
    }

    render() {
        return this.props.children
    }
    

}

const mapStateToProps = (state) => {
    return {...state}
}

const mapDispatchToProps = dispatch => {
    return {
        pingUser: () => actions.pingUser(dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AuthCheck));