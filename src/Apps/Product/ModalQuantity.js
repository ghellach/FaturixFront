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
                                <h4>{this.state.name} saved to the cluster successfully !</h4>
                                <hr/>
                                {this.state.newProduct 
                                ? <button onClick={() => window.location.href = "/products"} className="btn btn-success">Go to the products page</button>
                                : <a href={`/product/`+this.state.nextBlock} class="btn btn-secondary"><i class="fas fa-arrow-circle-left"></i> Go back to {this.state.name}</a>
                                }
                            </div>
                            : <div className="modal-body text-center">
                                <img src={this.props.APP_URL+"/assets/icons/loaderyes.gif"} width="300px" />
                                <h4>Saving {this.state.name} ...</h4>
                                <br/>
                            </div>
                        } 
                    </div>
                : <div style={{borderRadius: "2rem"}} className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">Quantity</h5>
                    </div>
                    <div className="modal-body">
                        
                        <CurrencyInput
                            style={{borderRadius: "1rem"}}
                            className="form-control"
                            decimalSeparator="." groupSeparator=""
                            placeholder="Units: "
                            prefix="Units: "
                            name="quantity"
                            allowNegativeValue={false}
                            allowDecimals={false}
                            required="true"
                            onValueChange={(value, name) => this.onChange({target: {name, value}})} 
                        /><br/>
                        {this.state.finiteButton ?
                            <button style={{width: "100%"}} className="btn btn-primary" onClick={() => this.finalButton(1, 2, null, this.state.newProduct ? false : true)}><i class="fas fa-redo"></i> Click again to save</button>
                            : <button style={{width: "100%"}} className="btn btn-primary" onClick={() => this.finalButton(1, 1, null, this.state.newProduct ? false : true)}><i class="fas fa-list-ol"></i> Save with definite quantity</button>
                        }
                        
                        
                        <hr/>
                        <div className="text-center">Or</div>
                        <hr/>

                        {this.state.infiniteButton ?
                                <button style={{width: "100%"}} className="btn btn-primary" onClick={() => this.finalButton(2, 2, null, this.props.newProduct ? false : true)}><i class="fas fa-redo"></i> Click again to save</button>
                            : <button style={{width: "100%"}} className="btn btn-primary" onClick={() => this.finalButton(2, 1, null, this.props.newProduct ? false : true)}><i class="fas fa-infinity"></i> Save as infinitely available</button>
                        }
                    </div>
                    <div className="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"><i class="fas fa-arrow-circle-left"></i> Go back to product page</button>
                    </div>
                </div> }
            </div>
        </div>

    )
}