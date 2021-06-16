import React from 'react';
import {connect} from 'react-redux';
import {statusDomObject} from '../Product/lib';


class AddProduct extends React.Component {
    constructor(props) {
        super(props)
    
        this.state = {
            name: "",
            results: []
        }
    }

    activeSearch = e => {
        this.setState({name: e.target.value});
        const name = e.target.value;
        if(name !== "") {
            this.props.post("/product/search", {search: String(name), currency: this.props.currency.uuid}).
            then(res => this.setState({results: res.data}))
            .catch(err => this.props.errorParser(err));
        }else this.setState({results: []})
    }

    addToItems = product => {
        this.props.addToItems(product);
        this.setState({name: "", results: []});
    }

    render() {
        return (
            <div className="modal fade" id="addProduct" tabindex="-1"  data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg" >
                <div className="modal-content" style={{borderRadius: "2rem"}}>
                    <div className="modal-header">
                        <h5 className="modal-title">Chercher un produit</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">

                        <h6>Entrer le nom</h6>
                        <input type="text" name="name" className="form-control" onChange={this.activeSearch} value={this.state.name} />
                        <ul className="list-group">
                            {this.state.results.map(product => (
                                <button data-bs-dismiss="modal" onClick={() => this.addToItems(product)} className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                                    {product.name}
                                    <h5>{statusDomObject(product.status, product.quantity, this.props.lang.product, true)}
                                    <span className={"badge bg-secondary rounded-pill"}>$15.90</span></h5>
                                </button>
                            ))}
                        </ul>

                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal"><i className="fas fa-undo-alt"></i> Annuler</button>
                        {/*<button type="button" className="btn btn-primary"><i className="fas fa-check"></i> Enregister</button>*/}
                    </div>
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
export default connect(mapStateToProps, mapDispatchToProps)(AddProduct);