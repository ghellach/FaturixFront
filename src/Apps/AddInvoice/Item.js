import {useState} from 'react';
import CurrencyInput from 'react-currency-input-field';

export default function Item (props) {

    const item = props.item;

    const [buffer, setBuffer] = useState({
        ...item,
        unitPrice: Number(item.unit?.subTotal)
    });

    const clearBuffer = () => setBuffer({...item});
    
    const modal = () => {
        return <div  className="modal fade" id={"item"+String(props.i)} aria-hidden="true" aria-labelledby={"#"+props.i} tabindex="-1">
            <div className="modal-dialog modal-dialog-centered" >
                <div className="modal-content" style={{borderRadius: "2rem"}}>
                    <div className="modal-header">
                        <h5 className="modal-title">Modifier {item.name}</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">

                        {/*<h6>Produit</h6>
                        <input value={buffer.name} onChange={(e) => setBuffer({...buffer, name: e.target.value})} className="form-control" style={{borderRadius: "1rem"}}></input>
                        <br/>*/}

                        <h6>Prix</h6>
                        <CurrencyInput
                            style={{borderRadius: "1rem"}}
                            class="form-control"
                            prefix="$"
                            decimalSeparator="." groupSeparator=","
                            placeholder={props.currency.isoSign+buffer.unit?.subTotal}
                            decimalsLimit={2}
                            onValueChange={(unitPrice, d) => setBuffer({...buffer, unitPrice: Number(unitPrice)})} 
                        />
                        <br/>

                        {/*<h6>Taxe</h6>
                        <CurrencyInput
                            style={{borderRadius: "1rem"}}
                            class="form-control"
                            prefix="%"
                            decimalSeparator="." groupSeparator=","
                            placeholder="%0.000"
                            decimalsLimit={3}
                            defaultValue={buffer.unitTax}
                            onChangeValue={(e) => setBuffer({...buffer, unitTax: e.target.value})} 
                        />
                        <br/>*/}

                        <h6>Quantité</h6>
                        <input type="number" pattern="[0-9]*" value={buffer.quantity} onChange={(e) => setBuffer({...buffer, quantity: Number(e.target.value), unitPrice: Number(buffer.unitPrice)})} className="form-control" style={{borderRadius: "1rem"}}></input>
                        <br/>

                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal"><i className="fas fa-undo-alt"></i> Annuler</button>
                        <button type="button" className="btn btn-primary" onClick={() => props.saveBuffer(props.i, buffer)} data-bs-dismiss="modal"><i className="fas fa-check"></i> Enregister</button>
                    </div>
                </div>
            </div>
        </div>
    }

    return <li className="list-group-item " style={{backgroundColor: props.i % 2 ? undefined : "#ededed"}}>
        <div className="row">
            <div className="col-md-12 col-lg-4">
                <b>{item.name}</b>
            </div>
            <div className="col-md-12 col-lg-5" >
                Prix: <b style={{fontSize: "1.3rem"}}><u>{item.unit?.subTotal?.toFixed(2)} $CAD</u></b> <br/> (Taxes: <b>{(item.unit?.total-item.unit?.subTotal).toFixed(2)} $CAD</b>) Quantité: <b>{item.quantity}</b>
            </div>
            <div className="col-md-12 col-lg-3">
                <button className="btn btn-outline-success" onClick={() => props.changeQuantity(props.i, Number(item.quantity+1))} style={{width: "33%"}}><i className="fas fa-plus"></i> 1</button>
                <button className="btn btn-outline-danger" onClick={() => props.changeQuantity(props.i, Number(item.quantity-1))} style={{width: "33%"}}><i className="fas fa-minus"></i> 1</button>
                <a className="btn btn-outline-primary" onClick={clearBuffer} style={{width: "34%"}} data-bs-toggle="modal" href={"#item"+String(props.i)} role="button"><i className="fas fa-sync-alt"></i></a>
            </div>
            {modal()}
        </div>
        
    </li>
}
