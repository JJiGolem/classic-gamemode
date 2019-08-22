import React, {Component, Fragment} from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import {addAppDisplay, setAppDisplay} from '../actions/action.apps';
import { setCallStatus, setCall } from "../actions/action.info";
import Contacts from "./Contacts";
import Dialogs from "./Dialogs";
import DialingNumber from "./DialingNumber";
import IncomingCall from "./IncomingCall";
import HouseApp from "./house_app/HouseApp";
import BusinessApp from "./business_app/BusinessApp";
import TaxiClient from "./taxi_app/taxi_client/TaxiClient";
import TaxiDriver from "./taxi_app/taxi_driver/TaxiDriver";

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

        for (let i = 0; i < dialogs.length; i++) {
            if (dialogs[i].PhoneMessages.some(message => !message.isRead)) {
                countNotReadMessages++;
            }
        }

        return (
            <Fragment>
                <div className="clock-phone-react">
                    <div>{time.format('HH:mm')}</div>
                    <div style={{ fontSize: '.4em' }}>
                        {days[date.getDay()]}, {date.getDate()} {months[date.getMonth()]}
                    </div>
                </div>

                <div className="list_apps-phone-react">
                    <div className="menu_panel_app-phone-react" onClick={() => addApp({name: 'TaxiClient', form: <TaxiClient />})}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="110%" height="110%" viewBox="0 0 88.775 81.925">
                            <g id="house" transform="translate(-1604 -378)">
                                <rect id="Rectangle_4" data-name="Rectangle 4" width="88.775" height="81.925" rx="20" transform="translate(1604 378)" fill="#FBD825"/>
                            </g>
                        </svg>

                        <div>Такси</div>
                    </div>

                    {
                        info.isDriver &&
                        <div className="menu_panel_app-phone-react" onClick={() => addApp({name: 'TaxiDriver', form: <TaxiDriver />})}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="110%" height="110%" viewBox="0 0 88.775 81.925">
                                <g id="house" transform="translate(-1604 -378)">
                                    <rect id="Rectangle_4" data-name="Rectangle 4" width="88.775" height="81.925" rx="20" transform="translate(1604 378)" fill="black"/>
                                </g>
                            </svg>

                            <div>Такси</div>
                        </div>
                    }

                    {
                        info.houses.length > 0 &&
                        <div className="menu_panel_app-phone-react" onClick={() => addApp({name: 'HouseApp', form: <HouseApp />})}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="110%" height="110%" viewBox="0 0 88.775 81.925">
                                <g id="house" transform="translate(-1604 -378)">
                                    <rect id="Rectangle_4" data-name="Rectangle 4" width="88.775" height="81.925" rx="20" transform="translate(1604 378)" fill="#29410f"/>
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
                        info.biz.length > 0 &&
                        <div className="menu_panel_app-phone-react"
                             onClick={() => addApp({name: 'BusinessApp', form: <BusinessApp/>})}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="110%" height="110%" viewBox="0 0 88.775 81.925">
                                <g id="biz" transform="translate(-1604 -378)">
                                    <rect id="Rectangle_4" data-name="Rectangle 4" width="88.775" height="81.925" rx="20" transform="translate(1604 378)" fill="#0f2641"/>
                                    <path id="portfolio" d="M48.843,6.258H35.471V4.693A4.569,4.569,0,0,0,31.049,0H19.258a4.569,4.569,0,0,0-4.422,4.693V6.258H1.474A1.525,1.525,0,0,0,0,7.822V42.241a4.569,4.569,0,0,0,4.422,4.693H45.886a4.569,4.569,0,0,0,4.422-4.693V7.849a1.477,1.477,0,0,0-1.465-1.591ZM17.785,4.693a1.523,1.523,0,0,1,1.474-1.564H31.049a1.523,1.523,0,0,1,1.474,1.564V6.258H17.785Zm29,4.693L42.212,23.962a1.482,1.482,0,0,1-1.4,1.07H32.523V23.467A1.521,1.521,0,0,0,31.049,21.9H19.258a1.521,1.521,0,0,0-1.474,1.564v1.564H9.494a1.482,1.482,0,0,1-1.4-1.07L3.519,9.387ZM29.575,25.032v3.129H20.732V25.032ZM47.36,42.241a1.523,1.523,0,0,1-1.474,1.564H4.422a1.523,1.523,0,0,1-1.474-1.564V17.463L5.3,24.952a4.446,4.446,0,0,0,4.194,3.209h8.291v1.564a1.521,1.521,0,0,0,1.474,1.564H31.049a1.521,1.521,0,0,0,1.474-1.564V28.161h8.291a4.446,4.446,0,0,0,4.194-3.209l2.352-7.488Zm0,0" transform="translate(1622.817 395.548)" fill="#e7b900"/>
                                </g>
                            </svg>
                            <div>Бизнес</div>
                        </div>
                    }


                    <div className="menu_panel_app-phone-react">

                    </div>
                    <div className="menu_panel_app-phone-react">

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