import React, { Component } from 'react'
import QrReader from 'react-qr-reader'
import {withRouter} from 'react-router-dom';
 
class QRCodeScanner extends Component {
    state = {
        result: 'No result'
    }

    componentDidMount = () => {
        console.log(this.props);
        
        const mobile = window.localStorage.getItem("mobileAPICom");
        if(mobile) {
            window.ReactNativeWebView.postMessage("qrcode");
            const scanData = window.localStorage.getItem("scanData");
            if(scanData) this.dataParser(scanData);
        }
    }
  

    dataParser = data => {
        const json = JSON.parse(data);
        if(json?.type === "product") this.props.history.push(String("/product/"+json.uuid));
    }
  
 
    handleScan = data => {
        console.log(data);
        if (data) this.dataParser(data) 
    }
    handleError = err => {
        this.setState({result: "error"})
    }
    render() {
        return (
        <div>
            <div id="#videoElement" />
            <p>{this.state.result}</p>
            <QrReader
                onError={this.handleError}
                onScan={this.handleScan}
                style={{ width: '100%' }}
            />
            
        </div>
        )
    }
}

export default withRouter(QRCodeScanner);