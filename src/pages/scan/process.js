import React from "react";
import {withRouter} from 'react-router-dom';

class Process extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            scanData: "hey"
        }
    }
    componentDidMount = () => {
        const mobile = window.localStorage.getItem("mobileAPICom");
        if(mobile) {
            var url_string = window.location.href; //window.location.href
            var url = new URL(url_string);
            var c = url.searchParams.get("scandata");
            if(!c)window.location.href="/my";
            this.dataParser(c);
            //else window.location.href="/my";
        }else window.location.href="/my";
    }

    dataParser = data => {
        //this.setState({scanData: JSON.stringify(data, null, 4)})
        try {
            const json = JSON.parse(data);
            if(json?.type === "product") this.props.history.push(String("/product/"+json.uuid));
        }catch(err) {
            window.location.href="/my";
        }
       
      }
    render = () => <div>{this.state.scanData}</div>
}

export default withRouter(Process);