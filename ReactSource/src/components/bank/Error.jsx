import React from 'react';
import { connect } from 'react-redux';
import { closeForm } from '../../actions/forms.js';

class Error extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    back(event) {
        event.preventDefault();
        this.props.closeForm()
    }

    render() {
        return (
            <div className='formBank' style={{background: 'rgb(0,0,0,0.8)', color: 'white'}} onClick={this.back.bind(this)}>
                <div className='exitBankErr'></div>
                <div className='blockPayBank'>
                    <div className='successIcon'>
                        <svg id="Group_53" data-name="Group 53" xmlns="http://www.w3.org/2000/svg" width="129.122" height="129.122" viewBox="0 0 129.122 129.122" fill='white'>
                            <path id="Path_99" data-name="Path 99" d="M64.561,0a64.561,64.561,0,1,0,64.561,64.561A64.634,64.634,0,0,0,64.561,0Zm0,124.156a59.595,59.595,0,1,1,59.595-59.595A59.664,59.664,0,0,1,64.561,124.156Z"/>
                            <path id="Path_100" data-name="Path 100" d="M64.935,16.728a2.48,2.48,0,0,0-3.511,0L40.832,37.32,20.239,16.728a2.483,2.483,0,1,0-3.511,3.511L37.32,40.832,16.728,61.424a2.483,2.483,0,1,0,3.511,3.511L40.832,44.343,61.424,64.935a2.483,2.483,0,0,0,3.511-3.511L44.343,40.832,64.935,20.239A2.48,2.48,0,0,0,64.935,16.728Z" transform="translate(23.729 23.729)"/>
                        </svg>
                    </div>
                    <div className='sucTextBank'>
                        <span style={{fontSize: '44px', fontWeight: 'bold'}}>Ошибка</span>
                        <br></br>
                        <span>{this.props.text}</span>
                    </div>
                </div>
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => ({
    closeForm: () => dispatch(closeForm())
})

export default connect(null, mapDispatchToProps)(Error)