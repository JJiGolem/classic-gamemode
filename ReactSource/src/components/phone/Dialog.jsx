import React from 'react';
import {connect} from 'react-redux';
import { setApp, addApp, closeApp } from '../../actions/phone.js';
import { addMessage } from '../../actions/dialogs.js';
import Dialogs from './Dialogs.jsx';

class Dialog extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            text: undefined,
            messageList: []
        }
    }

    componentDidUpdate() {
        const objDiv = this.refList;
        objDiv.scrollTop = objDiv.scrollHeight;
    }

    handleChangeInput(event) {
        event.preventDefault();
        this.setState({text: event.target.value})
    }

    back(event) {
        event.preventDefault();
        this.props.setApp(<Dialogs />)
    }

    getMessages() {
        const { dialog } = this.props;
        var current = dialog.messages;
        if(current) {
            return(
                current.map((message, index) => (
                    message.isMine ? 
                    <div className='myMesBlock'>
                        <span key={index*100} className='myMes'>
                            {message.text}
                        </span>
                    </div>
                    : 
                    <div className='himMesBlock'>
                        <span key={index*100} className='himMes'>
                            {message.text}
                        </span>
                    </div>
                ))
            )
        }
    }

    sendMessage(event) {
        event.preventDefault();
        if(this.state.text) {
            this.props.addMessage(this.state.text, this.props.dialog.number, true);
            mp.trigger('sendMessage.client', this.state.text, this.props.dialog.number)
        }
        this.refInput.value = '';
        this.setState({text: ''})
    }

    keyDown(event) {
        let code = event.keyCode;
        if(code === 13) {
            this.sendMessage(event)
        }
    }

    render() {
        return(
            <div style={{backgroundColor: 'white', height: '364px', fontSize: '14px'}}>
                <div className='headContacts'>
                    <button onClick={this.back.bind(this)} id='idBackContacts'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18.812" height="35.125" viewBox="0 0 18.812 35.125" style={{transform: 'scale(0.4)', marginTop: '-2px'}}>
                            <path id="_6A" data-name="6A" d="M17.311,35.125a1.5,1.5,0,0,0,1.069-2.553L3.6,17.562,18.38,2.552a1.5,1.5,0,1,0-2.137-2.1L.431,16.51a1.5,1.5,0,0,0,0,2.1L16.243,34.677a1.5,1.5,0,0,0,1.068.448" transform="translate(0 0)" fill="#fff"/>
                        </svg>
                        <span style={{paddingTop: '2px'}}>Назад</span>
                    </button>
                    <div style={{width: '60px', fontSize: '14px', position: 'absolute', right: '20px', top: '15px', color: 'white'}}>{this.props.dialog.name !== '' ? <span>{this.props.dialog.name}</span> : <span>{this.props.dialog.number}</span>}</div>
                </div>
                <div className='listMessage' ref={(list) => {this.refList = list}}>
                    {this.getMessages()}
                </div>
                <div style={{marginBottom: '100px'}}>
                    <textarea className='inputContacts' onKeyDown={this.keyDown.bind(this)} style={{height: '35px', margin: '0 0 0 10px', bottom: '10px', padding: '8px', resize: 'none', width: '75%', position: 'absolute'}} 
                        type='text' onChange={this.handleChangeInput.bind(this)} 
                        ref={(input) => {this.refInput = input}}
                        placeholder='Написать...'/>
                    <button onClick={this.sendMessage.bind(this)} id='idButSendMessage'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="31" height="40.762" viewBox="0 0 31 40.762" style={{transform: 'scale(.3)', position: 'absolute', right: '2px', bottom: '-2px'}}>
                            <g id="Group_1" data-name="Group 1" transform="translate(6.824 7.73)">
                                <path id="Fill_162" data-name="Fill 162" d="M29.5,0H1.5a1.5,1.5,0,0,0,0,3h28a1.5,1.5,0,0,0,0-3" transform="translate(-6.824 30.032)" fill="#1a1919"/>
                                <path id="Fill_163" data-name="Fill 163" d="M2.56,15.186,12.6,5.152V32.229a1.5,1.5,0,0,0,3,0V5.139l9.83,10.016a1.5,1.5,0,0,0,2.141-2.1L15.2.449a1.5,1.5,0,0,0-2.132-.01L.439,13.064A1.5,1.5,0,0,0,2.56,15.186" transform="translate(-5.412 -7.73)" fill="#1a1919"/>
                            </g>
                        </svg>
                    </button>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    ...state,
    info: state.phoneInfo,
    dialogs: state.dialogs
})

const mapDispathToProps = dispatch => ({
    setApp: app => dispatch(setApp(app)),
    addApp: app => dispatch(addApp(app)),
    closeApp: () => dispatch(closeApp()),
    addMessage: (mes, num, isMine) => dispatch(addMessage(mes, num, isMine))
})

export default connect(mapStateToProps, mapDispathToProps)(Dialog)