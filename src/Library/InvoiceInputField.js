
export default function InvoiceInputField (props) {
    return(
        <input 
            type="text" 
            style={{...style.buttonList}} 
            className="form-control" 
            id="exampleInputEmail1" 
            name={props.name}
            placeHolder={props.placeHolder}
            disabled
        />
    )
}


const style = {
    buttonList: {
        borderRadius: "1rem"
    }
}
