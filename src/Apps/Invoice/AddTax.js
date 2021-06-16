import React from 'react';
import {connect} from 'react-redux';
import {statusDomObject} from '../Product/lib';


class AddTax extends React.Component {
    constructor(props) {
        super(props)
    
        this.state = {
            selected: "",
            name: "",
            taxes: []
        }
    }


    componentDidMount = () => this.props.post("/meta/taxes/fetch")
    .then(res => this.setState({taxes: res.data}))
    .catch(err => {
        console.log(err);
        this.props.setError("ERROR_TAXES_LOADING");
    })

    selectTax = e => {
        e.preventDefault();
        this.props.selectTax(this.state.taxes[this.state.selected]);
        this.setState({selected: "", error: false})
    }

    render() {
        return (
            <div className="modal fade" id="addTax" tabindex="-1"  data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div on className="modal-dialog modal-dialog-centered modal-dialog-scrollable" >
                    <div className="modal-content" style={{borderRadius: "2rem"}}>
                        <div className="modal-header">
                            <h5 className="modal-title">Ajouter une taxe</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <form onSubmit={this.selectTax}>

                            <div className="modal-body">

                                <select value={this.state.selected} style={{borderRadius:"2rem"}} required onChange={e => this.setState({selected: e.target.value})} className="form-control">
                                    <option value="">Selectionnez une taxe</option>
                                    {this.state.taxes.map((tax, i) => {
                                        let used = false;
                                        this.props.usedTaxes.forEach(t => t===tax.uuid ? used = true : null);
                                        return used ? null : <option value={i}>{tax.names[this.props.langIso]} ({tax.rate} %)</option>
                                    })}
                                </select>
                                <br/>
                                {this.state.selected ? <button style={{width: "100%"}} type="submit" onClick={this.selectTax} className="btn btn-secondary" data-bs-dismiss="modal">Ok</button> : <button style={{width: "100%"}} type="button" className="btn btn-secondary" disabled>Ok</button>}

                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal"><i className="fas fa-undo-alt"></i> Annuler</button>
                                {/*<button type="button" className="btn btn-primary"><i className="fas fa-check"></i> Enregister</button>*/}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
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
export default connect(mapStateToProps, mapDispatchToProps)(AddTax);