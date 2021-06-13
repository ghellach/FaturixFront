import {useState} from 'react';
import CurrencyInput from 'react-currency-input-field';

export const CommonTaxSelect = props => {
    console.log(props.keys)
    const taxes = props.taxes;

    return (
        <div className="row">
            <div className="col-md-12 col-lg-9">
                <select required="true" value={props.self.uuid} onChange={props.currentTax} style={{borderRadius: "1rem"}} className="form-control">
                    <option value="">Select a tax</option>
                    {taxes.map(tax => (
                        <option value={tax.uuid}>{tax.names[props.langIso]} - {tax.rate} %</option>
                    ))}
                </select>
            </div>
            <div className="col-md-12 col-lg-3">
                <button onClick={props.remove} style={{width: "100%"}} className="btn btn-outline-danger">
                    <i className="fas fa-times"/> Remove
                </button>
            </div>
        </div>
    )
}

export const CustomTaxField = props => {

    const [saved, setSaved] = useState(true);

    const [buffer, setBuffer] = useState({
        name: props.self.name,
        rate: props.self.rate
    });

    const onChange = e => {
        setSaved(false);
        setBuffer({
            ...buffer,
            [e.target.name]: e.target.value
        })
    }

    const saver = () => {
        console.log(buffer);
        props.saver(buffer.name, buffer.rate);
        setSaved(true);
    }

    return <div className="row">
        <div className="col-md-5">
            <input required="true" placeholder="Tax name" style={{borderRadius: "1rem"}} className="form-control" name="name" onChange={onChange} value={buffer.name}/>
        </div>
        <div className="col-md-4">
            <CurrencyInput
                style={{borderRadius: "1rem"}}
                className="form-control"
                prefix="%"
                name="rate"
                max={100}
                defaultValue={buffer.rate}
                decimalSeparator="." groupSeparator=""
                placeholder={`%rate`}
                decimalsLimit={3}
                allowNegativeValue={false}
                required={true}
                onValueChange={(value, name) => onChange({target: {name, value: Number(value)}})}
            />
        </div>
        <div className="col-md-3">
            {saved ? 
            <button onClick={props.remove} style={{width: "100%"}} className="btn btn-outline-danger">
                <i className="fas fa-times"/> Remove
            </button>   
            :
            <button onClick={saver} style={{width: "100%"}} className="btn btn-outline-primary">
                <i className="fas fa-check"/> Save
            </button>   
            }
            
        </div><br/>
    </div>
}


// real lib

const taxCalculation = taxes => {
    let sum = 0;
    taxes.forEach(tax => sum = sum + tax.rate);
    return sum;
}

export const taxRateToAmmount = product => {
    console.log(product);
    const rate = taxCalculation(product.unitTaxes);
    const {unitPrice} = product;
    return {
        rate,
        ammount: Number((unitPrice * (1 + rate*0.01)) - unitPrice).toFixed(2)
    }
}

export const statusDomObject = (status, quantity) => {
    let dom = ["secondary", ".", ""];
    if (status === 0) dom = ["success", "Disponible", <i className="fas fa-check"></i>];
    if (status === 1) dom = ["success", quantity+" en stock", <i className="fas fa-check"></i>];
    if (status === 2) dom = ["danger", "Pas en stock", <i className="fas fa-exclamation-triangle"></i>];
    if (status === 3) dom = ["warning", "Archivé", <i className="fas fa-archive"></i>];
    if (status === 5) dom = ["warning", "Product suspendu", <i className="fas fa-exclamation-triangle"></i>];
    return <h5><span className={"badge bg-"+dom[0]}>{dom[2]} {dom[1]}</span></h5>;
}