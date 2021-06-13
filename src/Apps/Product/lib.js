import {useState} from 'react';
import CurrencyInput from 'react-currency-input-field';

export const CommonTaxSelect = props => {
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
    const rate = taxCalculation(product.unitTaxes);
    const {unitPrice} = product;
    return {
        rate,
        ammount: Number((unitPrice * (1 + rate*0.01)) - unitPrice).toFixed(2)
    }
}

export async function FinalStepProcessor (which, step, e, onlyQuantity) {
    if(e) e.preventDefault();


    let button;
    if(which === 1) button = "finiteButton";
    else if(which === 2) button = "infiniteButton";
    else if(which === 3) button = "updaterButton";
    else if(which === 4) button = "outOfButton";
    else return;

    if(step === 1) {
        this.setState({[button]: true});
        setTimeout(() => this.setState({[button]: false}), 2000);
    }
    else if(step === 2) {
        this.setState({submitting: true, status: which === 4 ? 1 : which === 1 ? 1 : 0, quantity: which === 4 ? 0 : this.state.quantity});
        setTimeout(() => {}, 10000);
        const body = {
            name: this.state?.name, 
            unitPrice: this.state?.unitPrice,
            currency: this.state?.currency,
            unitTaxes: this.state?.bufferTaxes?.map(tax => {
                if(tax.type === 0) return tax;
                else if(tax.type === 1) return {
                    names: {
                        fr: tax.name,
                        en: tax.name
                    },
                    rate: tax.rate
                }
            }),
            // if previous block provided
            previousBlock: this.props?.previousBlock
        }
        try {
            if(onlyQuantity) {
                const uuid = this.state.product.uuid;
                await this.quantityUpdater(uuid, which);
                this.setState({nextBlock: uuid});
            }else {
                const res = await this.props.post("/product/add", body);
                if(this.state.newProduct) await this.quantityUpdater(res.data.uuid);
                else this.setState({nextBlock: res.data.uuid})
            }
            setTimeout(() => this.setState({allDone: true}), 2000);
        }catch(err) {console.log(err.response); this.setState({submitting: false})}
    } 
    else return

}


export async function quantityUpdater (uuid, which) {
    await this.props.post("/product/update/quantity", {
        uuid,
        status: which ? which === 4 ? 1 : which === 1 ? 1 : 0 : this.state.status,
        quantity: Number(this.state.quantity)
    });
    if(!this.state.newProduct) {
        this.props.post("/product/fetch", {uuid: this.props.match.params.uuid})
        .then(res => {
            this.setState({product: res.data, loaded: true});
            //document.getElementById("json").textContent = JSON.stringify(this.state.product, undefined, 2);
        })
        .catch(() => this.props.history.push("/products"))
    }
}


export function statusDomObject (status, quantity, langVars) {
    let dom = ["secondary", ".", ""];
    if (status === 0) dom = ["success", langVars[0], <i class="fas fa-check"></i>];
    if (status === 1) dom = ["success", quantity+" "+langVars[1], <i class="fas fa-check"></i>];
    if (status === 2) dom = ["danger", langVars[2], <i className="fas fa-exclamation-triangle"></i>];
    if (status === 3) dom = ["warning", langVars[3], <i class="fas fa-archive"></i>];
    if (status === 5) dom = ["warning", langVars[5], <i className="fas fa-exclamation-triangle"></i>];
    return <h5><span class={"badge bg-"+dom[0]}>{dom[2]} {dom[1]}</span></h5>;
}