import React from 'react'
import { connect } from 'react-redux'
import NavBar from './NavBar';

class CoreTheme extends React.Component {

    render() {
        return (
            <React.Fragment>
                <NavBar/>
                <br/><br/>
                <main className="container">
                    {this.props.children}
                </main>
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

export default connect(mapStateToProps, mapDispatchToProps)(CoreTheme);