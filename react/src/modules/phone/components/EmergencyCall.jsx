/* eslint-disable no-undef */
import React, {Component, Fragment} from 'react';
import { closeAppDisplay } from "../actions/action.apps";
import {connect} from "react-redux";

import HeadAppPhone from "./HeadAppPhone";
import warning from '../../../imgs/phone/warning.svg';

class EmergencyCall extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: ''
        };

        this.handleChangeMessage = this.handleChangeMessage.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
    }

    handleChangeMessage(e) {
        const { message } = this.state;

        this.setState({ message: e.target.value, isError: false });
    }

    sendMessage(type) {
        const { closeApp } = this.props;
        const { message } = this.state;

        if (message) {
            this.setState({ isError: false });
            
            if (type == 'pd') {
                mp.trigger('callRemote', 'mapCase.pd.calls.add', message);
            } else if (type == 'ems') {
                mp.trigger('callRemote', 'mapCase.ems.calls.add', message);
            }

            closeApp();
        } else {
            this.setState({ isError: true });
        }
    }

    render() {
        const { closeApp } = this.props;
        const { message, isError } = this.state;

        return (
            <Fragment>
                <div className="back_page-phone-react">
                    <HeadAppPhone title='Экстренный вызов' />

                    <div style={{ textAlign: 'center', marginTop: '25%' }}>
                        <img style={{ width: '20%' }} src={warning} />
                        <div style={{ marginTop: '5%' }}>Выберите службу для вызова из списка</div>
                    </div>

                    <h2 style={{ color: '#343c47', textAlign: 'center', fontSize: '100%' }}>Причина вызова</h2>
                    <div style={{ textAlign: 'center' }}>
                        <textarea 
                            style={{ border: isError ? '1px solid red' :'1px solid #343c47' }}
                            className="news_input" 
                            placeholder={isError ? "Вы не ввели причину!" :"Введите причину..."}
                            maxLength="60"
                            rows="3"
                            value={message}
                            onChange={this.handleChangeMessage}
                        >
                        </textarea>
                    </div>
                    <span style={{ marginLeft: '5%' }}>{60 - message.length}/60 символов</span>

                    <div className='house_buttons-phone-react' style={{ bottom: '2%', position: 'absolute' }}>
                        <div className='house_button-phone-react' onClick={() => this.sendMessage('pd')}>
                            <div>PD</div>
                        </div>
                        <div className='house_button-phone-react' onClick={() => this.sendMessage('ems')}>
                            <div>EMS</div>
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }
}

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
    closeApp: () => dispatch(closeAppDisplay())
});

export default connect(mapStateToProps, mapDispatchToProps)(EmergencyCall);