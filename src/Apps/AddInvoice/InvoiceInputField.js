import {CurrencyInput} from 'react-currency-input-field';

export default function InvoiceInputField (props) {
    return(
        <input 
            type="text" 
            style={{...style.buttonList}} 
            className="form-control" 
            id="exampleInputEmail1" 
            name={props.name}
            value={props.quantity}
        />
    )
}


const style = {
    buttonList: {
        borderRadius: "1rem"
    }
}
