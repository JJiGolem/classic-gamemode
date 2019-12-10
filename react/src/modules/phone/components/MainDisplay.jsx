import React, {Component, Fragment} from 'react';
import { connect } from 'react-redux';
import moment from 'moment-timezone';

import {addAppDisplay, setAppDisplay} from '../actions/action.apps';
import { setCallStatus, setCall } from "../actions/action.info";
import Contacts from "./Contacts";
import Dialogs from "./Dialogs";
import DialingNumber from "./DialingNumber";
import BusinessFactionApp from './faction_biz_app/BusinessApp';
import HouseApp from "./house_app/HouseApp";
import BusinessApp from "./business_app/BusinessApp";
import TaxiClient from "./taxi_app/taxi_client/TaxiClient";
import TaxiDriver from "./taxi_app/taxi_driver/TaxiDriver";
import WeazelNews from './weazel_news/WeazelNews';

const days = [
    'Воскресенье',
    'Понедельник',
    'Вторник',
    'Среда',
    'Четверг',
    'Пятница',
    'Суббота'
];

const months = [
    'января',
    'февраля',
    'марта',
    'апреля',
    'мая',
    'июня',
    'июля',
    'августа',
    'сентября',
    'октября',
    'ноября',
    'декабря',
];

class MainDisplay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            time: moment()
        };
    }

    componentDidMount() {

        // setTimeout(() => {
        //    this.props.addApp({name: 'IncomingCall', form: <IncomingCall number='7737331' />});
        // }, 1000);

        setInterval(() => {
            this.setState({time: moment()})
        }, 1000)
    }

    render() {

        const { time } = this.state;
        const { addApp, info, dialogs } = this.props;
        const date = new Date();

        let countNotReadMessages = 0;

        try {
            if (dialogs) {
                for (let i = 0; i < dialogs.list.length; i++) {
                    if (dialogs.list[i].PhoneMessages && dialogs.list[i].PhoneMessages.some(message => !message.isRead)) {
                        countNotReadMessages++;
                    }
                }
            }
        } catch (err) {
            // eslint-disable-next-line no-undef
            // mp.trigger('logger.debug', err.message, 'react');
        }

        return (
            <Fragment>
                <div className="clock-phone-react">
                    <div>{time.tz('Europe/Moscow').format('HH:mm')}</div>
                    <div style={{ fontSize: '.4em' }}>
                        {days[date.getDay()]}, {date.getDate()} {months[date.getMonth()]}
                    </div>
                </div>

                <div className="list_apps-phone-react">
                    <div className="menu_panel_app-phone-react" onClick={() => addApp({name: 'TaxiClient', form: <TaxiClient />})}>
                        <svg id="taxi_app" xmlns="http://www.w3.org/2000/svg" width="110%" height="110%" viewBox="0 0 88 88">
                            <rect id="Rectangle_2" data-name="Rectangle 2" width="88" height="86" rx="20" fill="#fbd825"/>
                            <path id="Path_6" data-name="Path 6" d="M142,559.89a3.89,3.89,0,0,1,3.89-3.89h8.994v9.025a3.89,3.89,0,0,1-3.89,3.89h-5.1a3.89,3.89,0,0,1-3.89-3.89Z" transform="translate(-130.952 -511.87)" fill="#fff"/>
                            <path id="Path_7" data-name="Path 7" d="M307.6,393.89a3.89,3.89,0,0,1,3.89-3.89h5.1a3.89,3.89,0,0,1,3.89,3.89v9.025H307.6Z" transform="translate(-283.186 -359.045)" fill="#fff"/>
                            <path id="Path_8" data-name="Path 8" d="M473.2,556h12.884v9.025a3.89,3.89,0,0,1-3.89,3.89h-5.1a3.89,3.89,0,0,1-3.89-3.89Z" transform="translate(-435.642 -511.87)" fill="#fff"/>
                            <path id="Path_9" data-name="Path 9" d="M638.8,393.89a3.89,3.89,0,0,1,3.89-3.89h5.1a3.89,3.89,0,0,1,3.89,3.89v9.025H638.8Z" transform="translate(-588.098 -359.045)" fill="#fff"/>
                            <path id="Path_10" data-name="Path 10" d="M804.4,556h8.994a3.89,3.89,0,0,1,3.89,3.89v5.135a3.89,3.89,0,0,1-3.89,3.89h-5.1a3.89,3.89,0,0,1-3.89-3.89Z" transform="translate(-740.332 -511.87)" fill="#fff"/>
                        </svg>
                        <div>Такси</div>
                    </div>

                    {
                        info.isDriver &&
                        <div className="menu_panel_app-phone-react" onClick={() => addApp({name: 'TaxiDriver', form: <TaxiDriver />})}>
                            <svg id="taxi_app_taxist" xmlns="http://www.w3.org/2000/svg" width="110%" height="110%" viewBox="0 0 88 88">
                                <rect id="Rectangle_1" data-name="Rectangle 1" width="88" height="86" rx="20" fill="#141414"/>
                                <path id="Path_1" data-name="Path 1" d="M142,560.014A4.014,4.014,0,0,1,146.014,556h9.281v9.313a4.014,4.014,0,0,1-4.014,4.014h-5.266A4.014,4.014,0,0,1,142,565.313Z" transform="translate(-130.6 -512.112)" fill="#fff"/>
                                <path id="Path_2" data-name="Path 2" d="M307.6,394.014A4.014,4.014,0,0,1,311.614,390h5.266a4.014,4.014,0,0,1,4.014,4.014v9.313H307.6Z" transform="translate(-283.319 -359.215)" fill="#fff"/>
                                <path id="Path_3" data-name="Path 3" d="M473.2,556h13.295v9.313a4.014,4.014,0,0,1-4.014,4.014h-5.266a4.014,4.014,0,0,1-4.014-4.014Z" transform="translate(-435.847 -512.112)" fill="#fff"/>
                                <path id="Path_4" data-name="Path 4" d="M638.8,394.014A4.014,4.014,0,0,1,642.814,390h5.266a4.014,4.014,0,0,1,4.014,4.014v9.313H638.8Z" transform="translate(-588.375 -359.215)" fill="#fff"/>
                                <path id="Path_5" data-name="Path 5" d="M804.4,556h9.281a4.014,4.014,0,0,1,4.014,4.014v5.3a4.014,4.014,0,0,1-4.014,4.014h-5.267a4.014,4.014,0,0,1-4.014-4.014Z" transform="translate(-741.095 -512.112)" fill="#fff"/>
                            </svg>                      
                            <div>Такси</div>
                        </div>
                    }

                    {
                        info.houses && info.houses.length > 0 &&
                        <div className="menu_panel_app-phone-react" onClick={() => addApp({name: 'HouseApp', form: <HouseApp />})}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="110%" height="110%" viewBox="0 0 88 88">
                                <g id="house" transform="translate(-1604 -378)">
                                    <rect id="Rectangle_4" data-name="Rectangle 4" width="88" height="88" rx="20" transform="translate(1604 378)" fill="#29410f"/>
                                    <g id="Group_5" data-name="Group 5" transform="translate(1619.71 373.351)">
                                        <path id="Path_21" data-name="Path 21" d="M123.717,300.251a1.63,1.63,0,0,0-1.655,1.656v22.619H110.328V315.29a1.635,1.635,0,0,0-1.6-1.624h-8.484a1.673,1.673,0,0,0-1.685,1.624v9.236H86.86V302.658a1.625,1.625,0,0,0-3.249,0v23.524a1.608,1.608,0,0,0,1.594,1.6h15.044a1.608,1.608,0,0,0,1.594-1.6v-9.236h5.235v9.236a1.622,1.622,0,0,0,1.655,1.6h14.983a1.608,1.608,0,0,0,1.594-1.6V301.907A1.617,1.617,0,0,0,123.717,300.251Z" transform="translate(-75.767 -255.5)" fill="#fff"/>
                                        <path id="Path_22" data-name="Path 22" d="M56.945,46.041,43.888,32.928V23.987a1.654,1.654,0,0,0-1.685-1.65,1.616,1.616,0,0,0-1.595,1.65v5.661L29.837,18.814a1.582,1.582,0,0,0-1.113-.514,1.635,1.635,0,0,0-1.173.514L.5,45.861a1.549,1.549,0,0,0,0,2.285,1.55,1.55,0,0,0,2.286,0L28.724,22.273,54.6,48.39a1.6,1.6,0,0,0,1.173.424,1.817,1.817,0,0,0,1.173-.424A1.707,1.707,0,0,0,56.945,46.041Z" transform="translate(0)" fill="#fff"/>
                                    </g>
                                </g>
                            </svg>

                            <div>Дом</div>
                        </div>
                    }

                    {
                        info.biz && info.biz.length > 0 &&
                        <div className="menu_panel_app-phone-react"
                             onClick={() => addApp({name: 'BusinessApp', form: <BusinessApp/>})}>
                             <svg xmlns="http://www.w3.org/2000/svg" width="110%" height="110%" viewBox="0 0 88 88">
                                <g id="Group_1" data-name="Group 1" transform="translate(-1604 -378)">
                                    <rect id="Rectangle_4" data-name="Rectangle 4" width="88" height="84" rx="20" transform="translate(1604 378)" fill="#0f2641"/>
                                    <path id="portfolio" d="M48.091,6.047H34.925V4.535A4.452,4.452,0,0,0,30.571,0H18.961a4.452,4.452,0,0,0-4.354,4.535V6.047H1.451A1.486,1.486,0,0,0,0,7.559v33.26a4.452,4.452,0,0,0,4.354,4.535H45.179a4.452,4.452,0,0,0,4.354-4.535V7.585a1.411,1.411,0,0,0-.38-1.077,1.467,1.467,0,0,0-1.062-.46ZM17.511,4.535a1.484,1.484,0,0,1,1.451-1.511H30.571a1.484,1.484,0,0,1,1.451,1.511V6.047H17.511ZM46.064,9.07l-4.5,14.085a1.455,1.455,0,0,1-1.378,1.034H32.022V22.677a1.482,1.482,0,0,0-1.451-1.514H18.961a1.482,1.482,0,0,0-1.451,1.511v1.511H9.348a1.455,1.455,0,0,1-1.378-1.034L3.465,9.071ZM29.119,24.189v3.024H20.413V24.189ZM46.63,40.819a1.484,1.484,0,0,1-1.451,1.511H4.354A1.484,1.484,0,0,1,2.9,40.819V16.875l2.316,7.237a4.365,4.365,0,0,0,4.129,3.1h8.163v1.511a1.482,1.482,0,0,0,1.451,1.511H30.571a1.482,1.482,0,0,0,1.451-1.511V27.213h8.163a4.365,4.365,0,0,0,4.129-3.1l2.316-7.236Zm0,0" transform="translate(1622.817 399.548)" fill="#e7b900"/>
                                </g>
                            </svg>                           
                            <div>Бизнес</div>
                        </div>
                    }

                    {
                        info.factionBiz &&
                        <div className="menu_panel_app-phone-react"
                             onClick={() => addApp({name: 'BusinessFactionApp', form: <BusinessFactionApp/>})}>
                             <svg xmlns="http://www.w3.org/2000/svg" width="110%" height="110%" viewBox="0 0 88 88">
                                <g id="Group_1" data-name="Group 1" transform="translate(-1604 -378)">
                                    <rect id="Rectangle_4" data-name="Rectangle 4" width="88" height="84" rx="20" transform="translate(1604 378)" fill="#3d1111"/>
                                    <path id="portfolio" d="M48.091,6.047H34.925V4.535A4.452,4.452,0,0,0,30.571,0H18.961a4.452,4.452,0,0,0-4.354,4.535V6.047H1.451A1.486,1.486,0,0,0,0,7.559v33.26a4.452,4.452,0,0,0,4.354,4.535H45.179a4.452,4.452,0,0,0,4.354-4.535V7.585a1.411,1.411,0,0,0-.38-1.077,1.467,1.467,0,0,0-1.062-.46ZM17.511,4.535a1.484,1.484,0,0,1,1.451-1.511H30.571a1.484,1.484,0,0,1,1.451,1.511V6.047H17.511ZM46.064,9.07l-4.5,14.085a1.455,1.455,0,0,1-1.378,1.034H32.022V22.677a1.482,1.482,0,0,0-1.451-1.514H18.961a1.482,1.482,0,0,0-1.451,1.511v1.511H9.348a1.455,1.455,0,0,1-1.378-1.034L3.465,9.071ZM29.119,24.189v3.024H20.413V24.189ZM46.63,40.819a1.484,1.484,0,0,1-1.451,1.511H4.354A1.484,1.484,0,0,1,2.9,40.819V16.875l2.316,7.237a4.365,4.365,0,0,0,4.129,3.1h8.163v1.511a1.482,1.482,0,0,0,1.451,1.511H30.571a1.482,1.482,0,0,0,1.451-1.511V27.213h8.163a4.365,4.365,0,0,0,4.129-3.1l2.316-7.236Zm0,0" transform="translate(1622.817 399.548)" fill="#e7b900"/>
                                </g>
                            </svg>                           
                            <div>Бизнес</div>
                        </div>
                    }

                    <div className="menu_panel_app-phone-react" onClick={() => addApp({name: 'WeazelNews', form: <WeazelNews />})}>
                        <svg width="110%" height="110%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="100" height="100" fill="#BC0C0C" rx="20"/>
                            <path fillRule="evenodd" clipRule="evenodd" d="M81 56H19V75.6029H81V56ZM35.9249 71.5471V60.191H33.3086V67.0858L27.6183 60.191H25.4272V71.5471H28.0434V64.6523L33.7501 71.5471H35.9249ZM47.4956 71.5471V69.4381H41.2656V66.81H46.5799V64.7659H41.2656V62.3H47.2831V60.191H38.633V71.5471H47.4956ZM62.9992 71.5471L66.7437 60.191H64.2092L61.5439 68.2376L58.9276 60.191H56.4748L53.7768 68.1727L51.1933 60.191H48.4462L52.2071 71.5471H55.0359L57.6358 63.8574L60.154 71.5471H62.9992ZM69.3507 71.3849C70.201 71.6228 71.0786 71.7418 71.9834 71.7418C73.0299 71.7418 73.9183 71.585 74.6487 71.2713C75.3791 70.9577 75.9241 70.5359 76.2839 70.0059C76.6545 69.4652 76.8398 68.8703 76.8398 68.2214C76.8398 67.4643 76.6381 66.8641 76.2348 66.4206C75.8424 65.9772 75.3682 65.6527 74.8122 65.4472C74.2562 65.2417 73.5422 65.0363 72.6701 64.8308C71.8307 64.6469 71.2039 64.463 70.7897 64.2792C70.3864 64.0845 70.1847 63.7925 70.1847 63.4031C70.1847 63.0138 70.3591 62.7001 70.7079 62.4622C71.0677 62.2243 71.6182 62.1053 72.3595 62.1053C73.4169 62.1053 74.4743 62.4027 75.5317 62.9976L76.3493 61.0021C75.826 60.6777 75.2155 60.4289 74.5179 60.2559C73.8202 60.0828 73.1062 59.9963 72.3758 59.9963C71.3293 59.9963 70.4409 60.1531 69.7105 60.4668C68.991 60.7804 68.4514 61.2076 68.0917 61.7484C67.7319 62.2783 67.5521 62.8732 67.5521 63.5329C67.5521 64.29 67.7483 64.8957 68.1407 65.3499C68.5441 65.8041 69.0237 66.134 69.5797 66.3395C70.1356 66.545 70.8497 66.7505 71.7217 66.956C72.2886 67.0858 72.7355 67.2047 73.0626 67.3129C73.4005 67.421 73.673 67.5671 73.8802 67.7509C74.0982 67.924 74.2072 68.1457 74.2072 68.4161C74.2072 68.7838 74.0273 69.0812 73.6676 69.3083C73.3078 69.5246 72.7519 69.6328 71.9997 69.6328C71.3239 69.6328 70.648 69.5246 69.9721 69.3083C69.2962 69.092 68.713 68.8054 68.2225 68.4485L67.3231 70.4277C67.8355 70.8171 68.5114 71.1361 69.3507 71.3849Z" fill="white"/>
                            <path d="M60.6355 25L52.1149 53H45.6407L39.9107 34.04L33.9947 53H27.5578L19 25H25.2509L31.1297 44.68L37.269 25H42.8502L48.8034 44.84L54.8683 25H60.6355Z" fill="white"/>
                            <path d="M81 47.72V53H58.2289V48.8L72.5166 30.28H58.5265V25H80.4419V29.2L66.1913 47.72H81Z" fill="white"/>
                        </svg>
                        <div>News</div>
                    </div>

                </div>

                <div className="menu_panel-display-react">
                    <div className="menu_panel_app-phone-react"
                         onClick={() => addApp({name: 'DialingNumber',
                             form: <DialingNumber />
                             })
                         }
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 44 44">
                            <g id="Group_3" transform="translate(-178 -85)">
                                <rect width="44" height="44" rx="13" transform="translate(178 85)" fill="#31e15f"/>
                                <path d="M21.6,25.795a18,18,0,0,1-6.24-1.906c-2.273-1.045-5.473-3.617-8.559-6.878S1.528,10.625.939,8.648a8.947,8.947,0,0,1-.9-4.24c.048-.281.149-.867,3.785-3.9L3.873.472A2.647,2.647,0,0,1,5.351,0,2.125,2.125,0,0,1,6.738.506,30.884,30.884,0,0,1,9.966,4.69c.118.185,1.132,1.848.372,3.084-.349.566-1,1.8-1.351,2.487a31.181,31.181,0,0,0,6.824,6.845L18.128,15.9a3.57,3.57,0,0,1,1.326-.244,3.934,3.934,0,0,1,1.3.221l.2.1,4.705,3.073a2.561,2.561,0,0,1,.9,1.641,2.024,2.024,0,0,1-.591,1.55c-.179.191-.412.461-.637.722-1.27,1.46-2.231,2.512-3.045,2.752A2.436,2.436,0,0,1,21.6,25.795ZM5.322,1.695a.757.757,0,0,0-.382.126A29.048,29.048,0,0,0,1.763,4.775a8.236,8.236,0,0,0,.83,3.3l.026.074c1.1,3.793,9.048,12.162,13.5,14.215a16.447,16.447,0,0,0,5.462,1.747.771.771,0,0,0,.18-.016,13.26,13.26,0,0,0,2.2-2.2l.016-.018.057-.066c.241-.278.448-.518.62-.7.154-.168.149-.262.148-.3a.835.835,0,0,0-.266-.452l-4.477-2.92a2.177,2.177,0,0,0-.613-.089,1.966,1.966,0,0,0-.577.083L15.683,19.1l-.446-.3a32.156,32.156,0,0,1-8.008-8.018l-.263-.4.217-.429.06-.116c.745-1.444,1.277-2.427,1.581-2.923.134-.22-.077-.89-.348-1.319a30.09,30.09,0,0,0-2.882-3.8A.416.416,0,0,0,5.322,1.695Z" transform="translate(187.102 93.765)" fill="#fff"/>
                            </g>
                        </svg>
                    </div>
                    <div className="menu_panel_app-phone-react"
                         onClick={() => addApp({name: 'Dialogs', form: <Dialogs />})}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 44 44">
                            <g id="Group_4" transform="translate(-138 -3)">
                                <rect data-name="Rectangle 2" width="44" height="44" rx="13" transform="translate(138 3)" fill="#e1c631"/>
                                <path data-name="1H" d="M5.1,26.079a1.006,1.006,0,0,1-.447-.1,1.065,1.065,0,0,1-.606-.957V19.666H2.461A2.39,2.39,0,0,1,0,17.36V2.306A2.39,2.39,0,0,1,2.461,0H25.312a2.39,2.39,0,0,1,2.461,2.306V17.36a2.39,2.39,0,0,1-2.461,2.307h-12.1L5.771,25.839A1.033,1.033,0,0,1,5.1,26.079ZM2.461,2.109c-.219,0-.352.137-.352.2V17.36c0,.06.133.2.352.2H5.1a1.056,1.056,0,0,1,1.054,1.055v4.17L12.158,17.8l.02-.01.021-.011a.309.309,0,0,1,.095-.063.505.505,0,0,1,.085-.049l.1-.042c.016,0,.032-.009.048-.014a.509.509,0,0,1,.05-.014l.049-.01.049-.01a.6.6,0,0,1,.111-.007.115.115,0,0,1,.05-.008h12.48c.219,0,.352-.137.352-.2V2.306c0-.06-.133-.2-.352-.2Z" transform="translate(146.418 13.601)" fill="#fff"/>
                            </g>
                        </svg>
                        {countNotReadMessages !== 0 && <span className='dialogs_notif-phone-react' >{ countNotReadMessages }</span>}
                    </div>
                    <div className="menu_panel_app-phone-react"
                         onClick={() => addApp({name: 'Contacts', form: <Contacts />})}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 44 44">
                            <g data-name="Group 5" transform="translate(-513 -4)">
                                <rect data-name="Rectangle 3" width="44" height="44" rx="13" transform="translate(513 4)" fill="#343c47"/>
                                <path data-name="5F" d="M20.412,23.972H.933A.934.934,0,0,1,0,23.04V17.78a5.957,5.957,0,0,1,1.705-4.2,4.332,4.332,0,0,1,3.029-1.3l.129,0h.006c.464,0,1.921-.007,3.7-.019l2.78-.013h.006l2.635-.012A4.34,4.34,0,0,1,15.426,10.5a3.524,3.524,0,0,1,2.018-.644h.068l1.533-.006h.047l1.172-.006c2.079-.012,4.8-.025,6.2-.025a4.084,4.084,0,0,1,4.062,4.259v4.345a.934.934,0,0,1-.933.933H21.345V23.04A.934.934,0,0,1,20.412,23.972ZM4.73,14.147a2.48,2.48,0,0,0-1.719.768A4.066,4.066,0,0,0,1.865,17.78v4.327H19.479V17.451a3.1,3.1,0,0,0-3.095-3.345c-1.822,0-5.341.014-7.8.025-.747.005-1.457.007-2.027.008H6.341c-.726,0-1.249,0-1.5.009C4.8,14.147,4.759,14.147,4.73,14.147Zm14.355-2.435c-.548,0-1.309.007-1.59.007a1.787,1.787,0,0,0-1.254.523h.144a4.992,4.992,0,0,1,4.96,5.21v.037H28.66V14.075a2.235,2.235,0,0,0-2.2-2.394c-1.4,0-4.119.012-6.191.025l-.77,0-.381,0Zm-8.412-.6a5.555,5.555,0,1,1,5.556-5.558A5.564,5.564,0,0,1,10.672,11.11Zm0-9.245a3.69,3.69,0,1,0,3.691,3.687A3.693,3.693,0,0,0,10.672,1.865ZM22.023,9.356A4.526,4.526,0,1,1,26.55,4.83,4.531,4.531,0,0,1,22.023,9.356Zm0-7.187A2.661,2.661,0,1,0,24.685,4.83,2.664,2.664,0,0,0,22.023,2.17Z" transform="translate(519.274 13.997)" fill="#fff"/>
                            </g>
                        </svg>
                    </div>
                </div>
            </Fragment>
        );
    }
}

const mapStateToProps = state => ({
    apps: state.apps,
    info: state.info,
    dialogs: state.dialogs
});

const mapDispatchToProps = dispatch => ({
    addApp: app => dispatch(addAppDisplay(app)),
    setApp: app => dispatch(setAppDisplay(app)),
    setCallStatus: status => dispatch(setCallStatus(status)),
    setCall: flag => dispatch(setCall(flag)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MainDisplay);