/* eslint-disable default-case */
import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';

import '../../house/styles/house.css';
import '../styles/business.css';

import {
    closeBusiness,
    loadBusinessInfo,
    setAnswerBuyBusiness,
    setBusinessFormBlur,
    setLoadingBusiness,
    showBusiness
} from "../actions/action.business";

class Business extends Component {
    constructor(props) {
        super(props);
        this.state = {
            colorBuy: '#e1c631',
            colorActions: '#e1c631',
            colorActionButton: '#e1c631',
            isActionsMenu: false,
            isConfirm: false
        };

        this.getForm = this.getForm.bind(this);
        this.getMessage = this.getMessage.bind(this);
        this.getButtons = this.getButtons.bind(this);
        this.startBuy = this.startBuy.bind(this);
        this.closeMenu = this.closeMenu.bind(this);
        this.showConfirmBuy = this.showConfirmBuy.bind(this);
    }

    getLoader() {
        return (
            <div className='block_loader-house-react'>
                <div className='loader-house'></div>
            </div>
        )
    }

    showConfirmBuy() {
        const { blurForm } = this.props;

        return (
            <div className='message_back-house-react' style={{ height: '35%' }}>
                Вы действительно хотите приобрести бизнес?
                <div>
                    <button onClick={this.startBuy}>Да</button>
                    <button onClick={() => {
                        this.setState({ isConfirm: false });
                        blurForm(false);
                    }}>Нет</button>
                </div>
            </div>
        )
    }

    startBuy() {
        const { business, setLoading, setAnswer, blurForm } = this.props;

        if (!business.isLoading) {
            this.setState({ isConfirm: false });

            setLoading(true);
            blurForm(true);

            // eslint-disable-next-line no-undef
            mp.trigger('biz.buy');

            //  setTimeout(() => {
            //      setAnswer({answer: 1, owner: 'Dun Hill'});
            //  }, 1000)
        }
    }

    showActionsMenu() {
        const { business } = this.props;

        if (business.actions && business.actions.length !== 0) {
            return (
                <div className='message_back-house-react' style={{ height: '40%' }}>
                    <div className='exitEnterBusiness' name='exit'
                        onClick={() => {
                            this.setState({ isActionsMenu: false });
                            this.props.blurForm(false);
                        }}
                    >
                    </div>
                    { business.actions.map(action => this.getButton(action)) }
                </div>
            )
        } else {
            return (
                <div className='message_back-house-react' style={{ height: '40%' }} onClick={() => {
                    this.setState({ isActionsMenu: false });
                    this.props.blurForm(false);
                }}>
                    <div className='exitEnterBusiness' name='exit'></div>
                    Список действий пуст<br/>
                    <div>
                        <svg style={{ display: 'block', margin: '5% 45%' }} id="Group_10" data-name="Group 10" xmlns="http://www.w3.org/2000/svg" width="10%" height="10%" viewBox="0 0 233.069 233.069">
                            <path id="Path_26" data-name="Path 26" d="M116.535,0A116.535,116.535,0,1,0,233.069,116.535,116.666,116.666,0,0,0,116.535,0Zm0,224.1A107.57,107.57,0,1,1,224.1,116.535,107.7,107.7,0,0,1,116.535,224.1Z" fill="#e1c631"/>
                            <path id="Path_27" data-name="Path 27" d="M104.33,17.314a4.477,4.477,0,0,0-6.338,0l-37.17,37.17-37.17-37.17a4.481,4.481,0,1,0-6.338,6.338l37.17,37.17-37.17,37.17a4.481,4.481,0,1,0,6.338,6.338l37.17-37.17,37.17,37.17a4.481,4.481,0,0,0,6.338-6.338L67.16,60.822l37.17-37.17A4.477,4.477,0,0,0,104.33,17.314Z" transform="translate(55.713 55.713)" fill="#e1c631"/>
                        </svg>
                    </div>
                    Нажмите на это сообщение для продолжения
                </div>
            )
        }
    }

    showActions() {
        const { blurForm, business } = this.props;

        if (!business.isBlur) {
            this.setState({ isActionsMenu: true });
            blurForm(true);
        }
    }

    getButton(name) {
        const { blurForm, closeBusiness } = this.props;

        switch (name) {
            case 'buy':
                return (
                    <div className='button-house-react'
                         onClick={() => {
                             this.setState({ isConfirm: true });
                             blurForm(true);
                         }}
                         onMouseOver={() => this.setState({ colorBuy: 'black' })}
                         onMouseOut={() => this.setState({ colorBuy: '#e1c631' })}
                    >
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="40%" height="40%" viewBox="0 0 478.856 462.891" fill={this.state.colorBuy}>
                                <g id="Group_8" data-name="Group 8" transform="translate(0 -7.982)">
                                    <path id="Path_11" data-name="Path 11" d="M202.856,254.873h-8c-2.488,0-4-1.392-4-2s1.512-2,4-2h20a8,8,0,0,0,0-16h-8a8,8,0,0,0-16,0v.36a18.624,18.624,0,0,0-16,17.6,19.1,19.1,0,0,0,20,18.04h8c2.488,0,4,1.392,4,2s-1.512,2-4,2h-20a8,8,0,0,0,0,16h8a8,8,0,0,0,16,0v-.36a18.624,18.624,0,0,0,16-17.6A19.1,19.1,0,0,0,202.856,254.873Z"/>
                                    <path id="Path_12" data-name="Path 12" d="M134.856,320.009H74.384l-28.672-31.36v-52l31.664-30.92h57.48a6.856,6.856,0,1,0,0-13.712H74.592a6.863,6.863,0,0,0-4.8,1.944L34.056,228.817a8.594,8.594,0,0,0-2.064,5.6v56.9a6.861,6.861,0,0,0,1.792,4.624l32.5,35.552a6.855,6.855,0,0,0,5.064,2.232h63.5a6.856,6.856,0,1,0,0-13.712Z"/>
                                    <path id="Path_13" data-name="Path 13" d="M390.856,214.873c-42.4,0-88,10.016-88,32v192c0,21.984,45.6,32,88,32s88-10.016,88-32v-192C478.856,224.889,433.256,214.873,390.856,214.873Zm72,223.88c-1.208,4.44-25.2,16.12-72,16.12s-70.792-11.68-72-16V426.3c17.024,8.576,45.144,12.576,72,12.576s54.984-4.04,72-12.584Zm0-32c-1.208,4.44-25.2,16.12-72,16.12s-70.792-11.68-72-16V394.3c17.024,8.576,45.144,12.576,72,12.576s54.984-4.04,72-12.584Zm0-32c-1.208,4.44-25.2,16.12-72,16.12s-70.792-11.68-72-16V362.3c17.024,8.576,45.144,12.576,72,12.576s54.984-4.04,72-12.584Zm0-32c-1.208,4.44-25.2,16.12-72,16.12s-70.792-11.68-72-16V330.3c17.024,8.576,45.144,12.576,72,12.576s54.984-4.04,72-12.584Zm0-32c-1.208,4.44-25.2,16.12-72,16.12s-70.792-11.68-72-16V298.3c17.024,8.536,45.144,12.576,72,12.576s54.984-4.04,72-12.584Zm0-32c-1.208,4.44-25.2,16.12-72,16.12s-70.792-11.68-72-16V266.3c17.024,8.536,45.144,12.576,72,12.576s54.984-4.04,72-12.584Zm-72-15.88c-46.728,0-70.712-11.648-72-15.856v-.048c1.288-4.456,25.272-16.1,72-16.1,46.4,0,70.4,11.472,72,16C461.256,251.4,437.256,262.873,390.856,262.873Z"/>
                                    <path id="Path_14" data-name="Path 14" d="M198.856,192.473a70.4,70.4,0,1,0,70.4,70.4A70.4,70.4,0,0,0,198.856,192.473Zm0,128a57.6,57.6,0,1,1,57.6-57.6A57.6,57.6,0,0,1,198.856,320.473Z"/>
                                    <path id="Path_15" data-name="Path 15" d="M326.352,192.017h-63.5a6.856,6.856,0,0,0,0,13.712h63.5a6.856,6.856,0,0,0,0-13.712Z"/>
                                    <path id="Path_16" data-name="Path 16" d="M321.5,88.513l-192-80a6.88,6.88,0,0,0-8.8,3.272l-16,32a6.88,6.88,0,1,0,12.1,6.544c.071-.131.138-.265.2-.4v.016l13.128-26.272L316.208,101.2a6.874,6.874,0,1,0,5.3-12.687Z"/>
                                    <path id="Path_17" data-name="Path 17" d="M360.36,128.185l-320-72a6.855,6.855,0,0,0-8.2,5.2l-16,72a6.859,6.859,0,1,0,13.392,2.976l14.5-65.288,313.3,70.488a6.467,6.467,0,0,0,1.512.168,6.856,6.856,0,0,0,1.5-13.544Z"/>
                                    <path id="Path_18" data-name="Path 18" d="M406.872,160.017H6.856A6.848,6.848,0,0,0,0,166.857V358.873a6.848,6.848,0,0,0,6.84,6.856H278.856a6.856,6.856,0,0,0,0-13.712H13.712V173.729H400v17.144a6.848,6.848,0,0,0,6.84,6.856h.016a6.848,6.848,0,0,0,6.856-6.84V166.873A6.849,6.849,0,0,0,406.872,160.017Z"/>
                                </g>
                            </svg>
                        </div>
                        Купить
                    </div>
                );

            case 'actions':
                return (
                    <div className='button-house-react' onClick={this.showActions.bind(this)}
                         onMouseOver={() => this.setState({ colorActions: 'black' })}
                         onMouseOut={() => this.setState({ colorActions: '#e1c631' })}
                    >
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="40%" height="40%" viewBox="0 0 217.794 216.8" fill={this.state.colorActions}>
                                <path id="two-settings-cogwheels" d="M113.6,133.642l-5.932-13.169a57.493,57.493,0,0,0,14.307-15.209l13.507,5.118a5,5,0,0,0,6.447-2.9l4.964-13.1a5,5,0,0,0-2.9-6.447L130.476,82.81a57.471,57.471,0,0,0-.637-20.871l13.169-5.932a5,5,0,0,0,2.5-6.613l-5.755-12.775a5,5,0,0,0-6.612-2.505l-13.169,5.932a57.493,57.493,0,0,0-15.209-14.307l5.118-13.507a5,5,0,0,0-2.9-6.447L93.88.82a5,5,0,0,0-6.447,2.905L82.316,17.231a57.327,57.327,0,0,0-20.872.636L55.513,4.7a5,5,0,0,0-6.613-2.5L36.124,7.949a5,5,0,0,0-2.505,6.612L39.551,27.73A57.493,57.493,0,0,0,25.244,42.939L11.737,37.821a5,5,0,0,0-6.447,2.9L.326,53.828a5,5,0,0,0,2.9,6.447l13.507,5.118a57.471,57.471,0,0,0,.637,20.871L4.2,92.2a5,5,0,0,0-2.5,6.613l5.755,12.775a5,5,0,0,0,6.612,2.505l13.169-5.932a57.462,57.462,0,0,0,15.209,14.307l-5.118,13.507a5,5,0,0,0,2.9,6.447l13.1,4.964a5,5,0,0,0,6.447-2.9L64.9,130.971a57.348,57.348,0,0,0,20.872-.636L91.7,143.5a5,5,0,0,0,6.613,2.5l12.775-5.754A5,5,0,0,0,113.6,133.642Zm-8.286-47.529A33.864,33.864,0,0,1,61.595,105.8,33.9,33.9,0,0,1,41.9,62.09,33.864,33.864,0,0,1,85.618,42.4a33.9,33.9,0,0,1,19.691,43.714Zm111.169,68.276a5,5,0,0,0-3.469-1.615l-9.418-.4a43.2,43.2,0,0,0-4.633-12.7L205.9,133.3a5,5,0,0,0,.3-7.064l-6.9-7.514a5,5,0,0,0-7.065-.3l-6.944,6.374a43.211,43.211,0,0,0-12.254-5.7l.4-9.418a5,5,0,0,0-4.782-5.209l-10.189-.437a5.018,5.018,0,0,0-5.209,4.781l-.4,9.418a43.251,43.251,0,0,0-12.7,4.632l-6.374-6.945a5,5,0,0,0-7.064-.3l-7.514,6.9a5,5,0,0,0-.3,7.064l6.374,6.945a43.2,43.2,0,0,0-5.7,12.254l-9.417-.4a5.012,5.012,0,0,0-5.21,4.781l-.437,10.189a5,5,0,0,0,4.782,5.21l9.417.4a43.247,43.247,0,0,0,4.632,12.7l-6.944,6.374a5,5,0,0,0-.3,7.064L123,202.6a5,5,0,0,0,7.065.3l6.944-6.374a43.211,43.211,0,0,0,12.254,5.7l-.4,9.418a5,5,0,0,0,4.781,5.209l10.189.437c.072,0,.143,0,.214,0a5,5,0,0,0,5-4.785l.4-9.418a43.251,43.251,0,0,0,12.7-4.632l6.374,6.945a5,5,0,0,0,7.064.3l7.514-6.9a5,5,0,0,0,.3-7.064l-6.374-6.945a43.2,43.2,0,0,0,5.7-12.254l9.417.4a5.011,5.011,0,0,0,5.21-4.781l.437-10.189A5,5,0,0,0,216.478,154.389Zm-56.321,29.564a23.315,23.315,0,0,1,.978-46.609q.507,0,1.019.022a23.315,23.315,0,1,1-2,46.587Z" transform="translate(0 -0.496)"/>
                            </svg>
                        </div>
                        Действия
                    </div>
                );

            case 'finance':
                    return (
                        <div className='button-house-react' 
                            onClick={() => { 
                                // eslint-disable-next-line no-undef
                                mp.trigger('biz.actions', 'finance');
                                // eslint-disable-next-line no-undef
                                mp.trigger('biz.menu.close');
                                closeBusiness();
                             }}
                            onMouseOver={() => this.setState({ colorActionButton: 'black' })}
                            onMouseOut={() => this.setState({ colorActionButton: '#e1c631' })}
                        >
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="40%" height="40%" viewBox="0 0 217.794 216.8" fill={this.state.colorActionButton}>
                                    <path id="two-settings-cogwheels" d="M113.6,133.642l-5.932-13.169a57.493,57.493,0,0,0,14.307-15.209l13.507,5.118a5,5,0,0,0,6.447-2.9l4.964-13.1a5,5,0,0,0-2.9-6.447L130.476,82.81a57.471,57.471,0,0,0-.637-20.871l13.169-5.932a5,5,0,0,0,2.5-6.613l-5.755-12.775a5,5,0,0,0-6.612-2.505l-13.169,5.932a57.493,57.493,0,0,0-15.209-14.307l5.118-13.507a5,5,0,0,0-2.9-6.447L93.88.82a5,5,0,0,0-6.447,2.905L82.316,17.231a57.327,57.327,0,0,0-20.872.636L55.513,4.7a5,5,0,0,0-6.613-2.5L36.124,7.949a5,5,0,0,0-2.505,6.612L39.551,27.73A57.493,57.493,0,0,0,25.244,42.939L11.737,37.821a5,5,0,0,0-6.447,2.9L.326,53.828a5,5,0,0,0,2.9,6.447l13.507,5.118a57.471,57.471,0,0,0,.637,20.871L4.2,92.2a5,5,0,0,0-2.5,6.613l5.755,12.775a5,5,0,0,0,6.612,2.505l13.169-5.932a57.462,57.462,0,0,0,15.209,14.307l-5.118,13.507a5,5,0,0,0,2.9,6.447l13.1,4.964a5,5,0,0,0,6.447-2.9L64.9,130.971a57.348,57.348,0,0,0,20.872-.636L91.7,143.5a5,5,0,0,0,6.613,2.5l12.775-5.754A5,5,0,0,0,113.6,133.642Zm-8.286-47.529A33.864,33.864,0,0,1,61.595,105.8,33.9,33.9,0,0,1,41.9,62.09,33.864,33.864,0,0,1,85.618,42.4a33.9,33.9,0,0,1,19.691,43.714Zm111.169,68.276a5,5,0,0,0-3.469-1.615l-9.418-.4a43.2,43.2,0,0,0-4.633-12.7L205.9,133.3a5,5,0,0,0,.3-7.064l-6.9-7.514a5,5,0,0,0-7.065-.3l-6.944,6.374a43.211,43.211,0,0,0-12.254-5.7l.4-9.418a5,5,0,0,0-4.782-5.209l-10.189-.437a5.018,5.018,0,0,0-5.209,4.781l-.4,9.418a43.251,43.251,0,0,0-12.7,4.632l-6.374-6.945a5,5,0,0,0-7.064-.3l-7.514,6.9a5,5,0,0,0-.3,7.064l6.374,6.945a43.2,43.2,0,0,0-5.7,12.254l-9.417-.4a5.012,5.012,0,0,0-5.21,4.781l-.437,10.189a5,5,0,0,0,4.782,5.21l9.417.4a43.247,43.247,0,0,0,4.632,12.7l-6.944,6.374a5,5,0,0,0-.3,7.064L123,202.6a5,5,0,0,0,7.065.3l6.944-6.374a43.211,43.211,0,0,0,12.254,5.7l-.4,9.418a5,5,0,0,0,4.781,5.209l10.189.437c.072,0,.143,0,.214,0a5,5,0,0,0,5-4.785l.4-9.418a43.251,43.251,0,0,0,12.7-4.632l6.374,6.945a5,5,0,0,0,7.064.3l7.514-6.9a5,5,0,0,0,.3-7.064l-6.374-6.945a43.2,43.2,0,0,0,5.7-12.254l9.417.4a5.011,5.011,0,0,0,5.21-4.781l.437-10.189A5,5,0,0,0,216.478,154.389Zm-56.321,29.564a23.315,23.315,0,0,1,.978-46.609q.507,0,1.019.022a23.315,23.315,0,1,1-2,46.587Z" transform="translate(0 -0.496)"/>
                                </svg>
                            </div>
                            Финансы
                        </div>
                    );
        }
    }

    getButtons() {
        const { business } = this.props;

        if (business.owner) {
            return (
                <Fragment>
                    { this.getButton('actions') }
                </Fragment>
            )
        } else {
            return (
                <Fragment>
                    { business.price && this.getButton('buy') }
                    { this.getButton('actions') }
                </Fragment>
            )
        }
    }

    exit() {
        const { business, closeBusiness } = this.props;

        if (!business.isLoading) {
            //showBusiness(false);
            closeBusiness();
            // eslint-disable-next-line no-undef
            mp.trigger('biz.menu.close')
        }
    }

    getForm() {
        const { business } = this.props;

        return (
            <Fragment>
                <div style={{ filter: business.isBlur ? 'blur(2px)' : 'blur(0px)' }}>
                    <div className='header-house-react'>
                        <span>Бизнес "{ business.name }"</span>
                        <div className='exitBusiness' name='exit' onClick={this.exit.bind(this)}></div>
                    </div>

                    <div className='main_page-house-react'>
                        <div className='label-house-react'>Общая информация</div>
                        {
                            !business.owner &&
                            <div className='block_price-house-react'>
                                <span>Цена: </span>
                                <span style={{ color: '#a2dd03 ', marginLeft: '5%' }}>${ business.price }</span>
                            </div>
                        }

                        <div className='info-house-react'>
                            <div>Район: <span>{ business.area }</span></div>
                            <div>Тип: <span>{ business.type }</span></div>
                            {
                                business.rent &&
                                <div>Налог:
                                    <span style={{ color: '#a2dd03 ' }}> ${ business.rent }</span>
                                    <span> в сутки</span>
                                </div>
                            }
                            { business.owner && <div>Владелец: <span>{ business.owner }</span></div> }
                            { business.faction && <div>Крыша: <span>{ business.faction }</span></div> }
                        </div>

                        <div className='buttons-house-react' style={{ top: '40%' }}>
                            { this.getButtons() }
                        </div>
                    </div>
                </div>
            </Fragment>
        )
    }

    closeMenu() {
        const { setAnswer, blurForm } = this.props;

        setAnswer({ answer: null });
        blurForm(false);
    }

    getMessage(answer) {
        if (answer === 0 || answer === 2) {
            return (
                <div className='message_back-house-react' onClick={this.closeMenu} style={{ height: '35%' }}>
                    <div className='exitEnterBusiness' name='exit'></div>
                    {answer === 0 ? 'У Вас недостаточно денег для покупки' : 'У Вас уже есть бизнес'}<br/>
                    <div>
                        <svg style={{ display: 'block', margin: '5% 45%' }} id="Group_10" data-name="Group 10" xmlns="http://www.w3.org/2000/svg" width="10%" height="10%" viewBox="0 0 233.069 233.069">
                            <path id="Path_26" data-name="Path 26" d="M116.535,0A116.535,116.535,0,1,0,233.069,116.535,116.666,116.666,0,0,0,116.535,0Zm0,224.1A107.57,107.57,0,1,1,224.1,116.535,107.7,107.7,0,0,1,116.535,224.1Z" fill="#e1c631"/>
                            <path id="Path_27" data-name="Path 27" d="M104.33,17.314a4.477,4.477,0,0,0-6.338,0l-37.17,37.17-37.17-37.17a4.481,4.481,0,1,0-6.338,6.338l37.17,37.17-37.17,37.17a4.481,4.481,0,1,0,6.338,6.338l37.17-37.17,37.17,37.17a4.481,4.481,0,0,0,6.338-6.338L67.16,60.822l37.17-37.17A4.477,4.477,0,0,0,104.33,17.314Z" transform="translate(55.713 55.713)" fill="#e1c631"/>
                        </svg>
                    </div>
                    Нажмите на это сообщение для продолжения
                </div>
            )
        }

        if (answer === 1) {
            return (
                <div className='message_back-house-react' onClick={this.closeMenu} style={{ height: '35%' }}>
                    <div className='exitEnterBusiness' name='exit' ></div>
                    Бизнес успешно куплен<br/>
                    <div>
                        <svg style={{ display: 'block', margin: '5% 45%' }} xmlns="http://www.w3.org/2000/svg" width="10%" height="10%" viewBox="0 0 52 52">
                            <g id="Group_11" data-name="Group 11" transform="translate(-469 -736.982)">
                                <path id="Path_28" data-name="Path 28" d="M26,0A26,26,0,1,0,52,26,26.029,26.029,0,0,0,26,0Zm0,50A24,24,0,1,1,50,26,24.028,24.028,0,0,1,26,50Z" transform="translate(469 736.982)" fill="#e1c631"/>
                                <path id="Path_29" data-name="Path 29" d="M38.252,15.336,22.883,32.626l-9.259-7.407a1,1,0,0,0-1.249,1.562l10,8a1,1,0,0,0,1.373-.117l16-18a1,1,0,0,0-1.5-1.328Z" transform="translate(469 736.982)" fill="#e1c631"/>
                            </g>
                        </svg>
                    </div>
                    Нажмите на это сообщение для продолжения
                </div>
            )
        }
    }

    render() {
        const { business } = this.props;
        const { isActionsMenu, isConfirm } = this.state;

        return (
            <Fragment>
                {
                    <div className='business_form-react'>
                        { Object.keys(business).length > 0 ? this.getForm() : this.getLoader() }
                        { business.answerBuy !== null && this.getMessage(business.answerBuy) }
                        { isActionsMenu && this.showActionsMenu() }
                        { isConfirm && this.showConfirmBuy() }
                    </div>
                }
                { business.isLoading && this.getLoader() }
            </Fragment>
        );
    }
}

const mapStateToProps = state => ({
    business: state.business,
});

const mapDispatchToProps = dispatch => ({
    loadInfo: info => dispatch(loadBusinessInfo(info)),
    setLoading: flag => dispatch(setLoadingBusiness(flag)),
    showBusiness: flag => dispatch(showBusiness(flag)),
    setAnswer: answer => dispatch(setAnswerBuyBusiness(answer)),
    blurForm: flag => dispatch(setBusinessFormBlur(flag)),
    closeBusiness: () => dispatch(closeBusiness()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Business);