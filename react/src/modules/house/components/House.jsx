/* eslint-disable default-case */
import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';

import '../styles/house.css';

import {
    closeHouse,
    loadHouseInfo,
    setAnswerBuyHouse,
    setHouseFormBlur,
    setLoadingHouse, showEnterMenuHouse,
    showHouse,
    setAnswerEnterHouse
} from "../actions/action.house";

class House extends Component {
    constructor(props) {
        super(props);
        this.state = {
            colorBuy: '#e1c631',
            colorLook: '#e1c631',
            colorEnterHouse: '#e1c631',
            colorEnterGarage: '#e1c631',
            colorEnter: '#e1c631',
            colorActions: '#e1c631',
            isEnterMenu: false,
            isActionsMenu: false,
            isConfirm: false
        };

        this.getForm = this.getForm.bind(this);
        this.getMessage = this.getMessage.bind(this);
        this.getButtons = this.getButtons.bind(this);
        this.startBuy = this.startBuy.bind(this);
        this.lookHouse = this.lookHouse.bind(this);
        this.closeMenu = this.closeMenu.bind(this);
        this.enterHouse = this.enterHouse.bind(this);
        this.showConfirmBuy = this.showConfirmBuy.bind(this);
    }

    // componentWillMount() {
    //     const houseInfo = {
    //         name: 228,
    //         area: 'Санта-Моника',
    //         class: 'Люкс',
    //         numRooms: 4,
    //         garage: true,
    //         carPlaces: 2,
    //         price: 45000,
    //         rent: 350,
    //     };
    //
    //     this.props.loadInfo(houseInfo);
    // }

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
            <div className='message_back-house-react'>
                Вы действительно хотите приобрести дом?
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
        const { house, setLoading, setAnswer, blurForm } = this.props;

        if (!house.isLoading) {
            this.setState({ isConfirm: false });

            setLoading(true);
            blurForm(true);

            // eslint-disable-next-line no-undef
            mp.trigger('house.buy');

            // setTimeout(() => {
            //     setAnswer({answer: 1, owner: 'Dun Hill'});
            // }, 1000)
        }
    }

    lookHouse() {
        const { showEnterMenu, blurForm, house, setLoading } = this.props;

        if (!house.isBlur) {
            if (!house.garage) {
                blurForm(true);
                setLoading(true);

                // eslint-disable-next-line no-undef
                mp.trigger('house.enter', 1);
            } else {
                blurForm(true);
                showEnterMenu(0);
            }
        }
    }

    showEnterMenu(house) {
        if(!this.state.isActionsMenu) {
            return (
                <div className='message_back-house-react'>
                    { this.getButton('enterHouse') }
                    { house.garage && this.getButton('enterGarage') }
                </div>
            )
        }
    }

    showActionsMenu(house) {
        return (
            <div className='message_back-house-react' onClick={() => {
                this.setState({ isActionsMenu: false });
                this.props.blurForm(false);
            }}>
                <div className='exitEnterHouse' name='exit'></div>
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

    showActions() {
        const { blurForm, house } = this.props;

        if (!house.isBlur) {
            this.setState({ isActionsMenu: true });
            blurForm(true);
        }
        //!house.isBlur && this.setState({ isActionsMenu: true }) && blurForm(true);
    }

    enterHouse() {
        const { blurForm, setLoading, showEnterMenu } = this.props;

        blurForm(true);
        setLoading(true);


        // eslint-disable-next-line no-undef
        mp.trigger('house.enter', 1);
    }

    getButton(name) {
        const { blurForm, showEnterMenu, house, enterMenu } = this.props;

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
                )

            case 'look':
                return (
                    <div className='button-house-react'
                         onClick={this.lookHouse}
                         onMouseOver={() => this.setState({ colorLook: 'black' })}
                         onMouseOut={() => this.setState({ colorLook: '#e1c631' })}
                    >
                        <div>
                            <svg id="Group_9" data-name="Group 9" xmlns="http://www.w3.org/2000/svg" width="40%" height="40%" viewBox="0 0 512 512" fill={this.state.colorLook}>
                                <path id="Path_22" data-name="Path 22" d="M312.065,157.073A120.189,120.189,0,0,0,200,80a10,10,0,0,0,0,20,100.683,100.683,0,0,1,93.4,64.247,10,10,0,1,0,18.669-7.174Z"/>
                                <path id="Path_23" data-name="Path 23" d="M200,40C111.775,40,40,111.775,40,200s71.775,160,160,160,160-71.775,160-160S288.225,40,200,40Zm0,300c-77.2,0-140-62.8-140-140S122.8,60,200,60s140,62.8,140,140S277.2,340,200,340Z"/>
                                <path id="Path_24" data-name="Path 24" d="M500.281,443.719,366.8,310.239A198.2,198.2,0,0,0,400,200C400,89.72,310.28,0,200,0S0,89.72,0,200,89.72,400,200,400a198.214,198.214,0,0,0,110.239-33.2L347.134,403.7l.016.016,96.568,96.568a40,40,0,1,0,56.563-56.562ZM305.536,345.727s0,0,0,0A178.459,178.459,0,0,1,200,380c-99.252,0-180-80.748-180-180S100.748,20,200,20s180,80.748,180,180a178.458,178.458,0,0,1-34.272,105.535A180.872,180.872,0,0,1,305.536,345.727Zm20.98,9.066a200.675,200.675,0,0,0,28.277-28.277l28.371,28.371a242.731,242.731,0,0,1-28.277,28.277ZM486.139,486.139a19.985,19.985,0,0,1-28.278,0l-88.8-88.8a262.774,262.774,0,0,0,28.277-28.277l88.8,88.8a19.982,19.982,0,0,1,0,28.274Z"/>
                                <path id="Path_25" data-name="Path 25" d="M310,190a10,10,0,1,0,10,10A10,10,0,0,0,310,190Z"/>
                            </svg>
                        </div>
                        Осмотреть
                    </div>
                )

            case 'enter':
                return (
                    <div className='button-house-react' onClick={() => {
                        // house.garage ? (showEnterMenu(0) && blurForm(true)) : this.enterHouse()

                        if (house.garage) {
                            showEnterMenu(0);
                            blurForm(true);
                        } else {
                            this.enterHouse();
                        }
                    }}
                         onMouseOver={() => this.setState({ colorEnter: 'black' })}
                         onMouseOut={() => this.setState({ colorEnter: '#e1c631' })}
                    >
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="40%" height="40%" viewBox="0 0 504.043 512" fill={this.state.colorEnter}>
                                <g id="Group_13" data-name="Group 13" transform="translate(-3.978)">
                                    <path id="Path_34" data-name="Path 34" d="M387.638,73.144a47.237,47.237,0,1,0,47.237,47.237A47.29,47.29,0,0,0,387.638,73.144Zm0,69.252a22.015,22.015,0,1,1,22.015-22.015A22.04,22.04,0,0,1,387.638,142.4Z"/>
                                    <path id="Path_35" data-name="Path 35" d="M334.974,0C239.555,0,161.925,77.63,161.925,173.049a171.967,171.967,0,0,0,11.211,61.4L7.672,399.928a12.613,12.613,0,0,0-3.694,8.917v90.544A12.611,12.611,0,0,0,16.589,512H91.205a12.61,12.61,0,0,0,8.91-3.686l25.145-25.107a12.611,12.611,0,0,0,3.7-8.925V443.406H159.8A12.611,12.611,0,0,0,172.409,430.8v-12.36H184.77a12.611,12.611,0,0,0,12.611-12.611V378.688h27.136a12.614,12.614,0,0,0,8.917-3.694l40.121-40.121A171.881,171.881,0,0,0,334.972,346.1c95.419,0,173.049-77.63,173.049-173.049S430.393,0,334.974,0Zm0,320.874a146.7,146.7,0,0,1-59.339-12.393,12.611,12.611,0,0,0-13.871,2.525c-.039.037-.077.067-.115.106L219.3,353.466H184.772a12.611,12.611,0,0,0-12.611,12.611v27.136H159.8a12.611,12.611,0,0,0-12.611,12.611v12.36H116.351a12.611,12.611,0,0,0-12.611,12.611v38.257L85.987,486.777H29.2V468.956l154.141-154.14a11.35,11.35,0,0,0-16.053-16.051L29.2,436.854V414.07L196.9,246.362c.038-.038.067-.073.1-.11a12.609,12.609,0,0,0,2.53-13.872,146.8,146.8,0,0,1-12.38-59.33c0-81.512,66.315-147.827,147.827-147.827S482.8,91.537,482.8,173.05,416.484,320.874,334.974,320.874Z"/>
                                </g>
                            </svg>
                        </div>
                        Войти
                    </div>
                )

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
        }
    }

    getButtons() {
        const { house } = this.props;

        if (house.owner) {
            return (
                <Fragment>
                    { this.getButton('enter') }
                    { this.getButton('actions') }
                </Fragment>
            )
        } else {
            return (
                <Fragment>
                    { this.getButton('buy') }
                    { this.getButton('look') }
                </Fragment>
            )
        }
    }

    exit() {
        const { showHouse, house, closeHouse } = this.props;

        if (!house.isLoading) {
            //showHouse(false);
            closeHouse();
            // eslint-disable-next-line no-undef
            mp.trigger('house.menu.close')
        }
    }

    getForm() {
        const { house } = this.props;

        return (
            <Fragment>
                <div style={{ filter: house.isBlur ? 'blur(2px)' : 'blur(0px)' }}>
                    <div className='header-house-react'>
                        <span>Дом №{ house.name }</span>
                        <div className='exitHouse' name='exit' onClick={this.exit.bind(this)}></div>
                    </div>

                    <div className='main_page-house-react'>
                        <div className='label-house-react'>Общая информация</div>
                        {
                            !house.owner &&
                            <div className='block_price-house-react'>
                                <span>Цена: </span>
                                <span style={{ color: '#a2dd03 ', marginLeft: '5%' }}>${ house.price }</span>
                            </div>
                        }

                        <div className='info-house-react'>
                            <div>Район: <span>{ house.area }</span></div>
                            <div>Класс: <span>{ house.class }</span></div>
                            <div>Количество комнат: <span>{ house.numRooms }</span></div>
                            <div>Гараж: { house.garage
                                ? <span style={{ color: '#a2dd03' }}>есть</span>
                                : <span style={{ color: 'red' }}>нет</span> }
                            </div>
                            <div>Парковочных мест: <span>{ house.carPlaces }</span></div>
                            <div>Квартплата:
                                <span style={{ color: '#a2dd03 ' }}> ${ house.rent }</span>
                                <span> в сутки</span>
                            </div>
                            <div>Владелец: <span>{ house.owner ? house.owner : 'нет' }</span></div>
                        </div>

                        <div className='buttons-house-react'>
                            { this.getButtons() }
                        </div>
                    </div>
                </div>
            </Fragment>
        )
    }

    closeMenu() {
        const { setAnswer, setAnswerEnter, blurForm } = this.props;

        setAnswer({ answer: null });
        setAnswerEnter({ answer: null });
        blurForm(false);
    }

    getMessage(answer) {
        const { house } = this.props;

        if (answer === 0 || answer === 2) {
            return (
                <div className='message_back-house-react' onClick={this.closeMenu}>
                    <div className='exitEnterHouse' name='exit'></div>
                    {answer === 0 ? 'У Вас недостаточно денег для покупки' : 'У Вас уже есть дом'}<br/>
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
                <div className='message_back-house-react' onClick={this.closeMenu}>
                    <div className='exitEnterHouse' name='exit' ></div>
                    Дом успешно куплен<br/>
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

        if (answer === 'error') {
            return (
                <div className='message_back-house-react' onClick={this.closeMenu}>
                    <div className='exitEnterHouse' name='exit'></div>
                    Дверь заперта
                    <br/>
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

    render() {
        const { house, enterMenu } = this.props;
        const { isActionsMenu, isConfirm } = this.state;

        return (
            <Fragment>
                {
                    <div className='house_form-react'>
                        { Object.keys(house).length > 0 ? this.getForm() : this.getLoader() }
                        { house.answerBuy !== null && this.getMessage(house.answerBuy) }
                        { house.answerEnter != null && !house.garage && this.getMessage('error') }
                        { isActionsMenu && this.showActionsMenu(house) }
                        { isConfirm && this.showConfirmBuy() }
                    </div>
                }
                { house.isLoading && this.getLoader() }
            </Fragment>
        );
    }
}

const mapStateToProps = state => ({
    house: state.house,
    enterMenu: state.enterMenu,
    forms: state.forms
});

const mapDispatchToProps = dispatch => ({
    loadInfo: info => dispatch(loadHouseInfo(info)),
    setLoading: flag => dispatch(setLoadingHouse(flag)),
    showHouse: flag => dispatch(showHouse(flag)),
    setAnswer: answer => dispatch(setAnswerBuyHouse(answer)),
    blurForm: flag => dispatch(setHouseFormBlur(flag)),
    closeHouse: () => dispatch(closeHouse()),
    showEnterMenu: place => dispatch(showEnterMenuHouse(place)),
    setAnswerEnter: answer => dispatch(setAnswerEnterHouse(answer)),
});

export default connect(mapStateToProps, mapDispatchToProps)(House);