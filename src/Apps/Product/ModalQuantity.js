import React from 'react';
import { connect } from 'react-redux'
import CurrencyInput from 'react-currency-input-field';

class ModalQuantity extends React.Component {

    constructor(props) {
        super(props)
    }
    
    render() {
        return (
        <div className="modal fade" id="Modal" tabindex="-1"  data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                {this.props.submitting ? 
                    <div style={{borderRadius: "2rem"}} className="modal-content">
                        {this.props.allDone ? 
                            <div className="modal-body text-center">
                                <i className="fas fa-check fa-3x" style={{color: "#00db6a"}} />
                                <br/>
                                <h4>{this.props.name} {this.props.lang.product.q.savedToCluster}</h4>
                                <hr/>
                                {this.props.newProduct 
                                ? <button onClick={() => window.location.href = "/product/"+this.props.nextBlock} className="btn btn-success">{this.props.lang.product.q.toProductsPage}</button>
                                : this.props.allowBack ? <button data-bs-dismiss="modal" class="btn btn-secondary"><i class="fas fa-times"></i> {this.props.lang.product.q.close}</button>
                                :   <button onClick={() => window.location.href = "/product/"+this.props.nextBlock} className="btn btn-success"><i class="fas fa-times"></i> {this.props.lang.product.q.close}</button>
                            }
                            </div>
                            : <div className="modal-body text-center">
                                <img src={this.props.APP_URL+"/assets/icons/loaderyes.gif"} width="300px" />
                                <h4>{this.props.lang.product.q.saving} {this.props.name} ...</h4>
                                <br/>
                            </div>
                        } 
                    </div>
                : <div style={{borderRadius: "2rem"}} className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">{this.props.lang.product.q.quantity}</h5>
                    </div>
                    <div className="modal-body">
                        {this.props.modalAlertSet
                        ?  <React.Fragment>
                                <div className="alert alert-danger">
                                {this.props.modalAlert}
                            </div>
                            <hr/>
                        </React.Fragment>
                        : null
                        }
                       
                        <CurrencyInput
                            style={{borderRadius: "1rem"}}
                            className="form-control"
                            decimalSeparator="." groupSeparator=""
                            placeholder={this.props.lang.product.q.units}
                            prefix={this.props.lang.product.q.units}
                            name="quantity"
                            allowNegativeValue={false}
                            allowDecimals={false}
                            required="true"
                            onValueChange={(value, name) => this.props.onChange({target: {name, value}})} 
                        /><br/>
                        {this.props.finiteButton ?
                            <button style={{width: "100%"}} className="btn btn-primary" onClick={() => this.props.finalButton(1, 2, null, this.props.newProduct ? false : true)}><i class="fas fa-redo"></i> {this.props.lang.product.q.clickAgain}</button>
                            : <button style={{width: "100%"}} className="btn btn-primary" onClick={() => this.props.finalButton(1, 1, null, this.props.newProduct ? false : true)}><i class="fas fa-list-ol"></i> {this.props.lang.product.q.withDefinite}</button>
                        }
                        
                        
                        <hr/>
                        <div className="text-center">{this.props.lang.product.q.or}</div>
                        <hr/>

                        {this.props.infiniteButton ?
                                <button style={{width: "100%"}} className="btn btn-primary" onClick={() => this.props.finalButton(2, 2, null, this.props.newProduct ? false : true)}><i class="fas fa-redo"></i> {this.props.lang.product.q.clickAgain}</button>
                            : <button style={{width: "100%"}} className="btn btn-primary" onClick={() => this.props.finalButton(2, 1, null, this.props.newProduct ? false : true)}><i class="fas fa-infinity"></i> {this.props.lang.product.q.withIndefinite}</button>
                        }

                        <hr/>
                        <div className="text-center">{this.props.lang.product.q.or}</div>
                        <hr/>

                        {this.props.outOfButton ?
                            <button style={{width: "100%"}} className="btn btn-danger" onClick={() => this.props.finalButton(4, 2, null, this.props.newProduct ? false : true)}><i class="fas fa-redo"></i> {this.props.lang.product.q.clickAgain}</button>
                            : <button style={{width: "100%"}} className="btn btn-danger" onClick={() => this.props.finalButton(4, 1, null, this.props.newProduct ? false : true)}><i class="fas fa-exclamation-triangle"></i> {this.props.lang.product.q.withOutOfStock}</button>
                        }
                    </div>
                    <div className="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"><i class="fas fa-arrow-circle-left"></i> {this.props.lang.product.q.close}</button>
                    </div>
                </div> }
            </div>
        </div>

    )}
}

const mapStateToProps = (state) => {
    return {...state}
}

const mapDispatchToProps = dispatch => {
    return {
        //loading: (p) => actions.loading(dispatch, p)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalQuantity);