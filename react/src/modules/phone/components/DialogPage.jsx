/* eslint-disable no-undef */
import React, {Component, Fragment} from 'react';
import { connect } from 'react-redux';

import {addMessageToPhone, deleteDialog, readDialogMessages, loadMessagesToDialog} from '../actions/action.dialogs';
import {addAppDisplay, closeAppDisplay} from "../actions/action.apps";

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
            inputMessage: '',
            isLoad: false,
            isMyMessage: true
        };

        this.handleChangeMessage = this.handleChangeMessage.bind(this);
        this.loadMessages = this.loadMessages.bind(this);
        this.getNotReadMessages = this.getNotReadMessages.bind(this);
    }

    componentDidMount() {
        const { readDialog, dialog } = this.props;

        const objDiv = this.refList;
        objDiv.scrollTop = objDiv.scrollHeight;

        readDialog(dialog.number);

        // setInterval(() => {
        //     this.props.addMessage('hi', Date.now(), dialog.number, false, false);
        // }, 1000);
    }

    componentDidUpdate() {
        const { isLoad, isMyMessage } = this.state;
        const { readDialog, dialog } = this.props;
        const objDiv = this.refList;

        if (!isLoad && isMyMessage) {
            objDiv.scrollTop = objDiv.scrollHeight;
            this.setState({ isMyMessage: false });
            readDialog(dialog.number);
        }
    }

    componentWillUnmount() {
        const { readDialog, dialog } = this.props;

        readDialog(dialog.number);

        // eslint-disable-next-line no-undef
        mp.trigger('phone.dialog.read', dialog.number);
    }

    handleChangeMessage(e) {
        this.setState({ inputMessage: e.target.value })
    }

    sendMessage() {
        const { inputMessage } = this.state;
        const { dialog, addMessage } = this.props;

        if (inputMessage) {
            addMessage(inputMessage, Date.now(), dialog.number, true, true);
            // eslint-disable-next-line no-undef
            mp.trigger('phone.message.send', inputMessage, dialog.number);
            this.setState({ inputMessage: '', isLoad: false, isMyMessage: true });
        }
    }

    isValid(message) {
        let words = message.split(' ');

        if (words.some(word => word.length > 25)) {
            return false;
        }

        return true;
    }

    loadMessages() {
        const { loadMessages, dialog } = this.props;

        this.setState({ isLoad: true });
        mp.trigger('phone.message.load', dialog.number);

        // loadMessages(dialog.number, [
        //     {
        //         text: 'kiii',
        //         isRead: true,
        //         isMine: true
        //     },
        //     {
        //         text: 'etttt',
        //         isRead: true,
        //         isMine: false
        //     },
        //     {
        //         text: 'aw',
        //         isRead: true,
        //         isMine: true
        //     },
        // ])
    }

    getMessages(number) {
        const { dialogs } = this.props;

        let messages = dialogs.list.find(d => d.number === number).PhoneMessages;

        if (messages.length !== 0) {
            return (
                <Fragment>
                    {messages.length > 5 && <div className="messages_load_phone-react" onClick={this.loadMessages}>Загрузить еще</div>}
                    { messages.map((message, index) => (
                            <div>
                                {
                                    (index === 0 || (message.date && (new Date(message.date).toDateString() !== new Date(messages[index - 1].date).toDateString()))) &&
                                    <div className='date_messages_block-phone-react'>
                                        { new Date(message.date).toLocaleDateString('ru-RU') }
                                    </div>
                                }
                                <div className={message.isMine ? 'my_message_block-phone-react' : 'him_message_block-phone-react'} style={ !this.isValid(message.text) ? styles : {}}>
                                    <span key={index*100} className={message.isMine ? 'my_message-phone-react' : 'him_message-phone-react'}>
                                        {message.text}
                                    </span>
                                </div>
                                {
                                    message.date &&
                                    <div
                                        className='time_message_block-phone-react'
                                        style={{ float: message.isMine ? 'right' : 'left', marginLeft: !message.isMine && '-3%' }}
                                    >
                                        { this.getTimeMessage(message.date) }
                                    </div>
                                }
                            </div>
                        ))}
                </Fragment>
            )
        }
    }

    getTimeMessage(date) {
        return `${String('00' + new Date(date).getHours()).slice(-2)}:${String('00' + new Date(date).getMinutes()).slice(-2)}`
    }

    keyDown(e) {
        if (e.keyCode === 13) {
            e.preventDefault();
            this.sendMessage();
        }
    }

    back() {
        const { closeApp, deleteDialog, dialog, dialogs } = this.props;

        if (dialogs.list.find(d => d.number === dialog.number).PhoneMessages.length === 0) {
            deleteDialog(dialog.number);
        }

        closeApp();
    }

    getNotReadMessages() {
        const { dialog, readDialog } = this.props;

        return (
            <div 
                className="not_read_phone-react"
                onClick={() => {
                readDialog(dialog.number);
                this.setState({ isLoad: false });
                this.refList.scrollTop = this.refList.scrollHeight;
            }}>
                <span>{ dialog.PhoneMessages.filter(message => !message.isRead).length }</span>
            </div>
        )
    }

    render() {

        const { dialog } = this.props;

        return (
            <Fragment>
                <div className="back_page-phone-react">
                    <div className="head_app-phone-react">
                        <div style={{ float: 'left', margin: '6% 0 0 10%', display: 'inline-block', width: '23%' }}
                             onClick={this.back.bind(this)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="11%" height="6%" viewBox="0 0 18.812 35.125">
                                <path id="_6A" data-name="6A" d="M17.311,35.125a1.5,1.5,0,0,0,1.069-2.553L3.6,17.562,18.38,2.552a1.5,1.5,0,1,0-2.137-2.1L.431,16.51a1.5,1.5,0,0,0,0,2.1L16.243,34.677a1.5,1.5,0,0,0,1.068.448" transform="translate(0 0)" fill="#fff"/>
                            </svg>
                            Назад
                        </div>
                        <div style={{ float: 'right', margin: '6% 10% 0 0' }}>
                            { dialog.name ? dialog.name : dialog.number }
                        </div>
                    </div>

                    

                    <div className='messages_list-phone-react' ref={(list) => {this.refList = list}}
                        onScroll={() => { 
                            if (this.refList.offsetHeight + this.refList.scrollTop >= this.refList.scrollHeight) {
                                this.props.readDialog(dialog.number)
                            }
                         }}
                    >
                        {this.getMessages(dialog.number)}
                    </div>

                    { dialog.PhoneMessages && dialog.PhoneMessages.some(message => !message.isRead) 
                        && this.refList
                        && this.refList.scrollTop !== this.refList.scrollHeight 
                        && this.getNotReadMessages() }

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
    addMessage: (text, date, number, isMine, isRead) => dispatch(addMessageToPhone(text, date, number, isMine, isRead)),
    closeApp: () => dispatch(closeAppDisplay()),
    addApp: app => dispatch(addAppDisplay(app)),
    deleteDialog: number => dispatch(deleteDialog(number)),
    readDialog: number => dispatch(readDialogMessages(number)),
    loadMessages: (number, messages) => dispatch(loadMessagesToDialog(number, messages))
});

export default connect(mapStateToProps, mapDispatchToProps)(DialogPage);