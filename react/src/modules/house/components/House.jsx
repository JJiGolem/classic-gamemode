import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import ReactCSSTransitionGroup from 'react-addons-transition-group';

import '../styles/house.css';

import {setAnswerHouse, setHouseFormBlock, setLoadingHouse, showHouse} from "../actions/action.house";

class House extends Component {
    constructor(props) {
        super(props);
        this.state = {
            colorBuy: '#e1c631',
            colorLook: '#e1c631',
            isEnterMenu: false,
            isActionsMenu: false
        };

        this.getForm = this.getForm.bind(this);
        this.getButtons = this.getButtons.bind(this);
        this.startBuy = this.startBuy.bind(this);
        this.lookHouse = this.lookHouse.bind(this);
    }

    getLoader() {
        return (
            <div className='block_loader-house-react'>
                <div className='loader-house'></div>
            </div>
        )
    }

    startBuy() {
        const { house, setLoading, setAnswer, blockForm } = this.props;

        if (!house.isLoading) {
            setLoading(true);
            //blockForm(true);
            setTimeout(() => {
                setAnswer({answer: 1, owner: 'Dun Hill'});
            }, 1000)
        }
    }

    lookHouse() {

    }

    showEnterMenu(house) {
        return (
            <div className='message_back-house-react'>
                { this.getButton('enterHouse') }
                { house.garage && this.getButton('enterGarage') }
            </div>
        )
    }

    showActionsMenu(house) {

    }

    getButton(name) {
        switch (name) {
            case 'buy':
                return (
                    <div className='button-house-react'
                         onClick={this.startBuy}
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
                    <div className='button-house-react' onClick={() => this.setState({ isEnterMenu: true })}>

                        Войти
                    </div>
                )

            case 'actions':
                return (
                    <div className='button-house-react' onClick={() => this.setState({ isActionsMenu: true })}>

                        Действия
                    </div>
                )

            case 'enterHouse':
                return (
                    <div className='button-house-react' onClick={() => this.setState({ isEnterMenu: false })}>

                        Войти в дом
                    </div>
                )

            case 'enterGarage':
                return (
                    <div className='button-house-react' onClick={() => this.setState({ isEnterMenu: true })}>

                        Войти в гараж
                    </div>
                )
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
        const { showHouse, house } = this.props;

        if (!house.isLoading) {
            showHouse(false);
        }
    }

    getForm() {
        const { house, setLoading } = this.props;

        return (
            <Fragment>
                <div style={{ filter: house.isLoading || house.answer ? 'blur(2px)' : 'blur(0px)' }}>
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
                                <span style={{ color: 'green', marginLeft: '5%' }}>${ house.price }</span>
                            </div>
                        }

                        <div className='info-house-react'>
                            <div>Район: <span>{ house.area }</span></div>
                            <div>Класс: <span>{ house.class }</span></div>
                            <div>Количество комнат: <span>{ house.numRooms }</span></div>
                            <div>Гараж: { house.garage
                                ? <span style={{ color: 'green' }}>есть</span>
                                : <span style={{ color: 'red' }}>нет</span> }
                            </div>
                            <div>Парковочных мест: <span>{ house.carPlaces }</span></div>
                            <div>Аренда:
                                <span style={{ color: 'green' }}> ${ house.rent }</span>
                                <span> в сутки</span>
                            </div>
                            {
                                house.owner &&
                                <div>Владелец: <span>{ house.owner }</span></div>
                            }
                        </div>

                        <div className='buttons-house-react'>
                            { this.getButtons() }
                        </div>
                    </div>
                </div>
            </Fragment>
        )
    }

    getMessage(answer) {
        const { setAnswer } = this.props;

        if (answer === 'У Вас недостаточно денег для покупки') {
            return (
                <div className='message_back-house-react' onClick={() => setAnswer({ answer: null })}>
                    <div className='exitEnterHouse' name='exit'></div>
                    { answer }
                </div>
            )
        }

        if (answer === 'Дом успешно куплен') {
            return (
                <div className='message_back-house-react' onClick={() => setAnswer({ answer: null })}>
                    <div className='exitEnterHouse' name='exit' ></div>
                    { answer }
                </div>
            )
        }
    }

    render() {
        const { house } = this.props;
        const { isEnterMenu, isActionsMenu } = this.state;

        return (
            <Fragment>
                <div className='house_form-react'>
                    { this.getForm() }
                    { house.answer && this.getMessage(house.answer) }
                    { isEnterMenu && this.showEnterMenu(house) }
                    { isActionsMenu && this.showActionsMenu(house) }
                </div>
                { house.isLoading && this.getLoader() }
            </Fragment>
        );
    }
}

const mapStateToProps = state => ({
    house: state.house
});

const mapDispatchToProps = dispatch => ({
    setLoading: flag => dispatch(setLoadingHouse(flag)),
    showHouse: flag => dispatch(showHouse(flag)),
    setAnswer: answer => dispatch(setAnswerHouse(answer)),
    blockForm: flag => dispatch(setHouseFormBlock(flag))
});

export default connect(mapStateToProps, mapDispatchToProps)(House);