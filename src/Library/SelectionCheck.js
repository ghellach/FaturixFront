import React from 'react'
import { connect } from 'react-redux'
import {withRouter, Redirect} from 'react-router-dom';
import * as actions from '../store/actions/actions';

class SelectionCheck extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            redirectToCreate: false,
            redirectToSelect: false,
            loaded: false,
        }

    }

    async componentDidMount() {
        const {pathname} = this.props.location;
        if(
            pathname !== "/login" &&
            pathname !== "/new" &&
            pathname !== "/logout" &&
            pathname !== "/index" &&
            pathname !== "/create" &&
            pathname !== "/select" &&
            pathname !== "/"
        ) {
            if(!this.props.hasCompany) this.setState({redirectToCreate: true});
            if(!this.props.selectedCompany) this.setState({redirectToSelect: true});
            if(!this.props.company)  this.setState({redirectToSelect: true});
            await this.props.setCompanyState(window.localStorage.getItem("company"), true);
            this.setState({loaded: true});

        } 
    }

    render() {
        if(this.state.redirectToCreate) return <Redirect to="/create" />;
        if(this.state.selectedCompany) return <Redirect to="/select" />
        return this.props.children;
    }
    

}

const mapStateToProps = (state) => {
    return {...state}
}

const mapDispatchToProps = dispatch => {
    return {
        setCompanyState: (which, has) => actions.setCompanyState(dispatch, which, has),
        pingUser: () => actions.pingUser(dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SelectionCheck));