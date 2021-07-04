import React from 'react';
import {connect} from 'react-redux';
import { jsPDF } from "jspdf";
import 'jspdf-autotable';

import {withRouter} from 'react-router-dom';
import axios from 'axios';

class PDFInv extends React.Component{
    constructor(props) {
        super(props)
    
        this.state = {
            gen: false,
            uuid: ""
        }
    }
    

    componentDidMount  ()  {

        this.setState({uuid: this.props.match.params.uuid}, () => {
            axios.post(this.props.API_URL+"/invoice/public/fetch", {uuid: this.state.uuid})
            .then(res => {
                const invoice = res.data;
                console.log(invoice);
    
                if(!this.state.gen) {
                    const doc = new jsPDF();
                    doc.text("Hello world!", 10, 10);
                    doc.autoTable({
                        head: [['Name', 'Email', 'Country']],
                        body: [
                          ['David', 'david@example.com', 'Sweden'],
                          ['Castille', 'castille@example.com', 'Spain'],
                          // ...
                        ],
                      })
                    doc.save("a4.pdf");
                }
        
                this.setState({gen: true});
            })
            .catch(err => console.log(err.response))//window.location.href = "/");
    
            console.log(this.props);
        });

        
        
       
    }
    render() {
        return <div>
        
        </div>
    }
    
}

const mapStateToProps = (state) => {
    return {...state}
}

const mapDispatchToProps = dispatch => {
    return {
        //loading: (p) => actions.loading(dispatch, p)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(PDFInv));