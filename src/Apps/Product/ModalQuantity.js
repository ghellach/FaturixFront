import CurrencyInput from 'react-currency-input-field';

export default function () {
    return (
        <div className="modal fade" id="Modal" tabindex="-1"  data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                {this.state.submitting ? 
                    <div style={{borderRadius: "2rem"}} className="modal-content">
                        {this.state.allDone ? 
                            <div className="modal-body text-center">
                                <i className="fas fa-check fa-3x" style={{color: "#00db6a"}} />
                                <br/>
                                <h4>{this.state.name} {this.props.lang.product.q.savedToCluster}</h4>
                                <hr/>
                                {this.state.newProduct 
                                ? <button onClick={() => window.location.href = "/products"} className="btn btn-success">{this.props.lang.product.q.toProductsPage}</button>
                                : this.state.allowBack ? <button data-bs-dismiss="modal" class="btn btn-secondary"><i class="fas fa-times"></i> {this.props.lang.product.q.close}</button>
                                :   <button onClick={() => window.location.href = "/product/"+this.state.nextBlock} className="btn btn-success"><i class="fas fa-times"></i> {this.props.lang.product.q.close}</button>
                            }
                            </div>
                            : <div className="modal-body text-center">
                                <img src={this.props.APP_URL+"/assets/icons/loaderyes.gif"} width="300px" />
                                <h4>{this.props.lang.product.q.saving} {this.state.name} ...</h4>
                                <br/>
                            </div>
                        } 
                    </div>
                : <div style={{borderRadius: "2rem"}} className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">{this.props.lang.product.q.quantity}</h5>
                    </div>
                    <div className="modal-body">
                        
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
                            onValueChange={(value, name) => this.onChange({target: {name, value}})} 
                        /><br/>
                        {this.state.finiteButton ?
                            <button style={{width: "100%"}} className="btn btn-primary" onClick={() => this.finalButton(1, 2, null, this.state.newProduct ? false : true)}><i class="fas fa-redo"></i> {this.props.lang.product.q.clickAgain}</button>
                            : <button style={{width: "100%"}} className="btn btn-primary" onClick={() => this.finalButton(1, 1, null, this.state.newProduct ? false : true)}><i class="fas fa-list-ol"></i> {this.props.lang.product.q.withDefinite}</button>
                        }
                        
                        
                        <hr/>
                        <div className="text-center">{this.props.lang.product.q.or}</div>
                        <hr/>

                        {this.state.infiniteButton ?
                                <button style={{width: "100%"}} className="btn btn-primary" onClick={() => this.finalButton(2, 2, null, this.state.newProduct ? false : true)}><i class="fas fa-redo"></i> {this.props.lang.product.q.clickAgain}</button>
                            : <button style={{width: "100%"}} className="btn btn-primary" onClick={() => this.finalButton(2, 1, null, this.state.newProduct ? false : true)}><i class="fas fa-infinity"></i> {this.props.lang.product.q.withIndefinite}</button>
                        }

                        <hr/>
                        <div className="text-center">{this.props.lang.product.q.or}</div>
                        <hr/>

                        {this.state.outOfButton ?
                            <button style={{width: "100%"}} className="btn btn-danger" onClick={() => this.finalButton(4, 2, null, this.state.newProduct ? false : true)}><i class="fas fa-redo"></i> {this.props.lang.product.q.clickAgain}</button>
                            : <button style={{width: "100%"}} className="btn btn-danger" onClick={() => this.finalButton(4, 1, null, this.state.newProduct ? false : true)}><i class="fas fa-exclamation-triangle"></i> {this.props.lang.product.q.withOutOfStock}</button>
                        }
                    </div>
                    <div className="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"><i class="fas fa-arrow-circle-left"></i> {this.props.lang.product.q.close}</button>
                    </div>
                </div> }
            </div>
        </div>

    )
}