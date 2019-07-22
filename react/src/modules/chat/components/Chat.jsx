import React, {Fragment} from 'react';
import { connect } from 'react-redux';
import { setOpacityChat, setFocusChat, pushMessage, setTagsChat, showChat } from '../actions/action.chat';
import '../styles/chat.css';

class Chat extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            cur: '',
            index: 0,
            curTagIndex: 0,
            opacity: 1
        };

        this.history = [];

        this.sendMessage = this.sendMessage.bind(this);
        this.keyDownInput = this.keyDownInput.bind(this);
        this.keyUpInput = this.keyUpInput.bind(this);
        this.pastePrevMessage = this.pastePrevMessage.bind(this);
        this.pasteNextMessage = this.pasteNextMessage.bind(this);
    }

    componentDidUpdate() {
        const objDiv = this.refList;

        if (objDiv) {
            objDiv.scrollTop = objDiv.scrollHeight;
            if(this.props.chat.isFocus) {
                this.refList.style.overflowY = 'auto'
            } else {
                this.refList.style.overflowY = 'hidden'
            }
        }
    }

    getMessage(index, message) {
        const { chat } = this.props;

        return (
            <div key={index} className='message-chat-react'>
                { chat.time &&
                <span style={{ color: message.text[0].color }} className="word-chat-react">
                    { message.time }
                </span> }
                {
                    message.text.map((word, ind) => (
                        <span style={{ color: word.color }} key={ind*10 + ind + 1} className="word-chat-react">
                            { word.text }
                        </span>
                    ))
                }
            </div>
        )
    }

    sendMessage(event) {
        const { curTagIndex } = this.state;
        const { chat, setFocusChat, setOpacityChat } = this.props;

        event.preventDefault();

        let message = this.refInput.value;

        if(message && message.length <= 300) {
            this.history.push(message);
            this.setState({index: this.history.length});
            // eslint-disable-next-line no-undef
            mp.trigger('chat.message.get', chat.tags[curTagIndex].id, message);
            this.refInput.value = ''
        }

        setFocusChat(false);
        setOpacityChat(this.state.opacity);
        // eslint-disable-next-line no-undef
        mp.trigger('chat.close');
    }

    pastePrevMessage() {
        const { index } = this.state;

        if(index > 0) {
            if(index === this.history.length) {
                this.setState({cur: this.refInput.value})
            }
            this.refInput.value = this.history[index - 1];
            this.setState({index: index - 1})
        }
    }

    pasteNextMessage() {
        const { index } = this.state;
        if(index < this.history.length - 1) {
            this.refInput.value = this.history[index + 1];
            this.setState({index: index + 1})
        } else if(index === this.history.length - 1){
            this.setState({index: index + 1});
            this.refInput.value = this.state.cur;
        }
    }

    changeType() {
        const { curTagIndex } = this.state;
        const { chat } = this.props;

        if(curTagIndex < chat.tags.length - 1) {
            this.setState({curTagIndex: curTagIndex + 1});
        } else {
            this.setState({curTagIndex: 0})
        }
    }

    keyDownInput(event) {
        let code = event.keyCode;
        switch (code) {
            case 13:
                this.sendMessage(event);
                break;
            case 38:
                event.preventDefault();
                this.pastePrevMessage();
                break;
            case 40:
                event.preventDefault();
                this.pasteNextMessage();
                break;
            case 9:
                event.preventDefault();
                this.changeType();
                break;
        }
    }

    keyUpInput(event) {
        event.preventDefault();
        const { chat, setFocusChat, setOpacityChat } = this.props;

        let code = event.keyCode;
        if(code === 27) {
            setFocusChat(false);
            setOpacityChat(this.state.opacity);
            //mp.trigger('closeChat');
        }
    }

    focusInput(event) {
        const { chat, setOpacityChat } = this.props;

        this.setState({opacity: chat.opacity});
        setOpacityChat(1);
    }

    render() {
        const { chat } = this.props;
        const { curTagIndex } = this.state;

        if (chat.isShow) {
            return (
                <div id="chat-form-react" style={{opacity: chat.opacity}}>

                    <ul id="message-list-chat-react" ref={(list) => {this.refList = list}}>
                        {
                            chat.messages.map((message, index) => (
                                this.getMessage(index, message)
                            ))
                        }
                    </ul>

                    {chat.isFocus &&
                    <div className='block-input-chat-react'>
                        <div className="tag-chat-react">
                            <span style={{ color: chat.tags[curTagIndex].color }}>
                                { chat.tags[curTagIndex].name }
                            </span>
                        </div>
                        <input
                            type='text'
                            ref={(input) => {this.refInput = input}}
                            placeholder='Введите сообщение'
                            id="chat-message-input-react"
                            onKeyDown={this.keyDownInput}
                            onKeyUp={this.keyUpInput}
                            maxLength='300'
                            onFocus={this.focusInput.bind(this)}
                            onBlur={() => {this.refInput.focus()}}
                            autoFocus={true}
                        >
                        </input>
                    </div>}
                </div>
            )
        } else  {
            return <div></div>
        }
    }
}

const mapStateToProps = state => ({
    chat: state.chat
});

const mapDispatchToProps = dispatch => ({
    setOpacityChat: opacity => dispatch(setOpacityChat(opacity)),
    setFocusChat: param => dispatch(setFocusChat(param)),
    pushMessage: mes => dispatch(pushMessage(mes)),
    setTagsChat: tags => dispatch(setTagsChat(tags)),
    showChat: param => dispatch(showChat(param))
});

export default connect(mapStateToProps, mapDispatchToProps)(Chat)