import React from 'react';
import {connect} from 'react-redux';
import { setApp, addApp, closeApp } from '../../actions/phone.js';
import Call from './Call.jsx';
import HouseApp from './house/HouseApp.jsx';
import Contacts from './Contacts.jsx';
import moment from 'moment';
import Dialogs from './Dialogs.jsx';

const days = [
    'Воскресенье',
    'Понедельник',
    'Вторник',
    'Среда',
    'Четверг',
    'Пятница',
    'Суббота'
]

const mounth = [
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
]

class MainDisplay extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            time: moment()
        }
    }

    componentDidMount() {
        setInterval(() => {
            this.setState({time: moment()})
        }, 1000)
    }
    
    click(event) {
        event.preventDefault();
        let name = event.target.id;
        console.log(event.target.id)
            switch(name) {
                case 'Call':
                    this.props.addApp(<Call />);
                    break;
                case 'House':
                    this.props.addApp(<HouseApp />);  
                    break;
                case 'Contacts':
                    this.props.addApp(<Contacts />);
                    break;
                case 'Dialogs':
                    this.props.addApp(<Dialogs />);
                    break;
                    
            }
    }

    mouseDown(event) {
        event.preventDefault ? event.preventDefault() : event.returnValue = false
    }

    render() {
        const { info } = this.props;
        var weekDay = new Date();
        return(
            <div ref={(form) => this.refForm = form}>
                <div className='bottomPanel'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 44 44" className='appPhone' 
                        id='Call' 
                        onClick={this.click.bind(this)} 
                        onMouseDown={this.mouseDown.bind(this)}>
                        <g id="Group_3" transform="translate(-178 -85)" id='Call'>
                            <rect id="Call" width="44" height="44" rx="13" transform="translate(178 85)" fill="#31e15f"/>
                            <path id="Call" d="M21.6,25.795a18,18,0,0,1-6.24-1.906c-2.273-1.045-5.473-3.617-8.559-6.878S1.528,10.625.939,8.648a8.947,8.947,0,0,1-.9-4.24c.048-.281.149-.867,3.785-3.9L3.873.472A2.647,2.647,0,0,1,5.351,0,2.125,2.125,0,0,1,6.738.506,30.884,30.884,0,0,1,9.966,4.69c.118.185,1.132,1.848.372,3.084-.349.566-1,1.8-1.351,2.487a31.181,31.181,0,0,0,6.824,6.845L18.128,15.9a3.57,3.57,0,0,1,1.326-.244,3.934,3.934,0,0,1,1.3.221l.2.1,4.705,3.073a2.561,2.561,0,0,1,.9,1.641,2.024,2.024,0,0,1-.591,1.55c-.179.191-.412.461-.637.722-1.27,1.46-2.231,2.512-3.045,2.752A2.436,2.436,0,0,1,21.6,25.795ZM5.322,1.695a.757.757,0,0,0-.382.126A29.048,29.048,0,0,0,1.763,4.775a8.236,8.236,0,0,0,.83,3.3l.026.074c1.1,3.793,9.048,12.162,13.5,14.215a16.447,16.447,0,0,0,5.462,1.747.771.771,0,0,0,.18-.016,13.26,13.26,0,0,0,2.2-2.2l.016-.018.057-.066c.241-.278.448-.518.62-.7.154-.168.149-.262.148-.3a.835.835,0,0,0-.266-.452l-4.477-2.92a2.177,2.177,0,0,0-.613-.089,1.966,1.966,0,0,0-.577.083L15.683,19.1l-.446-.3a32.156,32.156,0,0,1-8.008-8.018l-.263-.4.217-.429.06-.116c.745-1.444,1.277-2.427,1.581-2.923.134-.22-.077-.89-.348-1.319a30.09,30.09,0,0,0-2.882-3.8A.416.416,0,0,0,5.322,1.695Z" transform="translate(187.102 93.765)" fill="#fff"/>
                        </g>
                    </svg>

                    <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 44 44" 
                        className='appPhone'
                        id='Dialogs' 
                        onClick={this.click.bind(this)} 
                        onMouseDown={this.mouseDown.bind(this)}
                    >
                        <g id="Group_4" transform="translate(-138 -3)" id='Dialogs'>
                            <rect id='Dialogs' data-name="Rectangle 2" width="44" height="44" rx="13" transform="translate(138 3)" fill="#e1c631"/>
                            <path id='Dialogs' data-name="1H" d="M5.1,26.079a1.006,1.006,0,0,1-.447-.1,1.065,1.065,0,0,1-.606-.957V19.666H2.461A2.39,2.39,0,0,1,0,17.36V2.306A2.39,2.39,0,0,1,2.461,0H25.312a2.39,2.39,0,0,1,2.461,2.306V17.36a2.39,2.39,0,0,1-2.461,2.307h-12.1L5.771,25.839A1.033,1.033,0,0,1,5.1,26.079ZM2.461,2.109c-.219,0-.352.137-.352.2V17.36c0,.06.133.2.352.2H5.1a1.056,1.056,0,0,1,1.054,1.055v4.17L12.158,17.8l.02-.01.021-.011a.309.309,0,0,1,.095-.063.505.505,0,0,1,.085-.049l.1-.042c.016,0,.032-.009.048-.014a.509.509,0,0,1,.05-.014l.049-.01.049-.01a.6.6,0,0,1,.111-.007.115.115,0,0,1,.05-.008h12.48c.219,0,.352-.137.352-.2V2.306c0-.06-.133-.2-.352-.2Z" transform="translate(146.418 13.601)" fill="#fff"/>
                        </g>
                    </svg>

                    <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 44 44"
                        className='appPhone'
                        id='Contacts' 
                        onClick={this.click.bind(this)} 
                        onMouseDown={this.mouseDown.bind(this)}
                    >
                        <g id="Contacts" data-name="Group 5" transform="translate(-513 -4)">
                            <rect id="Contacts" data-name="Rectangle 3" width="44" height="44" rx="13" transform="translate(513 4)" fill="#343c47"/>
                            <path id="Contacts" data-name="5F" d="M20.412,23.972H.933A.934.934,0,0,1,0,23.04V17.78a5.957,5.957,0,0,1,1.705-4.2,4.332,4.332,0,0,1,3.029-1.3l.129,0h.006c.464,0,1.921-.007,3.7-.019l2.78-.013h.006l2.635-.012A4.34,4.34,0,0,1,15.426,10.5a3.524,3.524,0,0,1,2.018-.644h.068l1.533-.006h.047l1.172-.006c2.079-.012,4.8-.025,6.2-.025a4.084,4.084,0,0,1,4.062,4.259v4.345a.934.934,0,0,1-.933.933H21.345V23.04A.934.934,0,0,1,20.412,23.972ZM4.73,14.147a2.48,2.48,0,0,0-1.719.768A4.066,4.066,0,0,0,1.865,17.78v4.327H19.479V17.451a3.1,3.1,0,0,0-3.095-3.345c-1.822,0-5.341.014-7.8.025-.747.005-1.457.007-2.027.008H6.341c-.726,0-1.249,0-1.5.009C4.8,14.147,4.759,14.147,4.73,14.147Zm14.355-2.435c-.548,0-1.309.007-1.59.007a1.787,1.787,0,0,0-1.254.523h.144a4.992,4.992,0,0,1,4.96,5.21v.037H28.66V14.075a2.235,2.235,0,0,0-2.2-2.394c-1.4,0-4.119.012-6.191.025l-.77,0-.381,0Zm-8.412-.6a5.555,5.555,0,1,1,5.556-5.558A5.564,5.564,0,0,1,10.672,11.11Zm0-9.245a3.69,3.69,0,1,0,3.691,3.687A3.693,3.693,0,0,0,10.672,1.865ZM22.023,9.356A4.526,4.526,0,1,1,26.55,4.83,4.531,4.531,0,0,1,22.023,9.356Zm0-7.187A2.661,2.661,0,1,0,24.685,4.83,2.664,2.664,0,0,0,22.023,2.17Z" transform="translate(519.274 13.997)" fill="#fff"/>
                        </g>
                    </svg>

                </div>
                <div className='clockPhone'>
                    <div>{this.state.time.format('HH:mm')}</div>
                    <div style={{fontSize: '16px', marginTop: '-15px'}}>{days[weekDay.getDay()]}, {weekDay.getDate()} {mounth[weekDay.getMonth()]}</div>
                </div>
                <div className='listApp'>
                    {(info.biz && info.biz.length !== 0) && <div className='appDisplayFieldPhone' >
                        <img className='appDisplayPhone' src={require('../../source_icons/phone/icons/biz.png')}></img>
                        <div className='nameAppPhone' style={{fontSize: '13px'}}>Бизнес</div>
                    </div>}
                    {(info.houses && info.houses.length !== 0)  && <div className='appDisplayFieldPhone' onClick={this.click.bind(this)} id='House'>
                        <img id='House' className='appDisplayPhone' src={require('../../source_icons/phone/icons/house.png')}></img>
                        <div className='nameAppPhone' style={{fontSize: '13px'}}>Дом</div>
                    </div>}
                    <div className='appDisplayFieldPhone'>
                        <img className='appDisplayPhone' src={require('../../source_icons/phone/icons/taxi.png')}></img>
                        <div className='nameAppPhone' style={{fontSize: '13px'}}>Такси</div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    ...state,
    info: state.phoneInfo
})

const mapDispathToProps = dispatch => ({
    setApp: app => dispatch(setApp(app)),
    closeApp: () => dispatch(closeApp()),
    addApp: app => dispatch(addApp(app))
})

export default connect(mapStateToProps, mapDispathToProps)(MainDisplay)