import React, {Component, Fragment} from 'react';
import { connect } from 'react-redux';

import { addMessageToPhone } from '../actions/action.dialogs';
import {addAppDisplay, closeAppDisplay} from "../actions/action.apps";
import Contacts from "./Contacts";
import Dialogs from "./Dialogs";

const styles = {
    overflowWrap: 'break-word',
    wordWrap: 'break-word',
    wordBreak: 'break-all',
    lineBreak: 'auto',
    hyphens: 'manual',
}

class DialogPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inputMessage: ''
        };

        this.handleChangeMessage = this.handleChangeMessage.bind(this);
    }

    componentDidMount() {
        const objDiv = this.refList;
        objDiv.scrollTop = objDiv.scrollHeight;
    }

    componentDidUpdate() {
        const objDiv = this.refList;
        objDiv.scrollTop = objDiv.scrollHeight;
    }

    handleChangeMessage(e) {
        this.setState({ inputMessage: e.target.value })
    }

    sendMessage() {
        const { inputMessage } = this.state;
        const { dialog, addMessage } = this.props;

        if (inputMessage) {
            addMessage(inputMessage, dialog.number, true);
            // eslint-disable-next-line no-undef
            mp.trigger('phone.message.send', inputMessage, dialog.number);
            this.setState({ inputMessage: '' });
        }
    }

    isValid(message) {
        let words = message.split(' ');

        if (words.some(word => word.length > 25)) {
            return false;
        }

        return true;
    }

    getMessages(number) {
        const { dialogs } = this.props;

        let messages = dialogs.find(d => d.number === number).PhoneMessages;

        if (messages.length !== 0) {
            return (
                messages.map((message, index) => (
                    message.isMine ?
                        <div className='my_message_block-phone-react' style={ !this.isValid(message.text) ? styles : {}}>
                            <span key={index*100} className='my_message-phone-react'>
                                {message.text}
                            </span>
                        </div>
                        :
                        <div className='him_message_block-phone-react' style={!this.isValid(message.text) ? styles : {}}>
                            <span key={index*100} className='him_message-phone-react'>
                                {message.text}
                            </span>
                        </div>
                ))
            )
        }
    }

    keyDown(e) {
        if (e.keyCode === 13) {
            e.preventDefault();
            this.sendMessage();
        }
    }

    back() {
        const { closeApp, addApp } = this.props;

        closeApp();
        addApp({name: 'Dialogs', form: <Dialogs />});
    }

    render() {

        const { dialog, dialogs, closeApp } = this.props;

        return (
            <Fragment>
                <div className="back_page-phone-react">
                    <div className="head_app-phone-react">
                        <span style={{ float: 'left', margin: '5% 0 0 10%' }} onClick={this.back.bind(this)}
                        >
                            {'< '}Назад
                        </span>
                        <span style={{ float: 'right', margin: '5% 10% 0 0' }}>
                            { dialog.name ? dialog.name : dialog.number }
                        </span>
                    </div>

                    <div className='messages_list-phone-react' ref={(list) => {this.refList = list}}>
                        {this.getMessages(dialog.number)}
                    </div>

                        <div>
                            <textarea className='input_message-phone-react' onKeyDown={this.keyDown.bind(this)}
                                  type='text' onChange={this.handleChangeMessage}
                                  value={this.state.inputMessage}
                                  placeholder='Написать...'
                            />
                            <button onClick={this.sendMessage.bind(this)} id='button_send_message-phone-react'>
                                <svg xmlns="http://www.w3.org/2000/svg" className='ico_but_send_message' viewBox="0 0 31 40.762">
                                    <g id="Group_1" data-name="Group 1" transform="translate(6.824 7.73)">
                                        <path id="Fill_162" data-name="Fill 162" d="M29.5,0H1.5a1.5,1.5,0,0,0,0,3h28a1.5,1.5,0,0,0,0-3" transform="translate(-6.824 30.032)" fill="#1a1919"/>
                                        <path id="Fill_163" data-name="Fill 163" d="M2.56,15.186,12.6,5.152V32.229a1.5,1.5,0,0,0,3,0V5.139l9.83,10.016a1.5,1.5,0,0,0,2.141-2.1L15.2.449a1.5,1.5,0,0,0-2.132-.01L.439,13.064A1.5,1.5,0,0,0,2.56,15.186" transform="translate(-5.412 -7.73)" fill="#1a1919"/>
                                    </g>
                                </svg>
                            </button>
                        </div>
                </div>
            </Fragment>
        );
    }
}

const mapStateToProps = state => ({
   dialogs: state.dialogs
});

const mapDispatchToProps = dispatch => ({
    addMessage: (text, number, isMine) => dispatch(addMessageToPhone(text, number, isMine)),
    closeApp: () => dispatch(closeAppDisplay()),
    addApp: app => dispatch(addAppDisplay(app)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DialogPage);