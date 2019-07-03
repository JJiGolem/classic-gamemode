import React from 'react';
import {connect} from 'react-redux';
import { setApp, addApp, deleteApp, openCloseHouse } from '../../../actions/phone.js';
import HouseApp from './HouseApp.jsx';
import MainDisplay from '../MainDisplay.jsx';
import Improvements from './Improvements.jsx';
import Sell from './Sell.jsx';
import SellState from './SellState.jsx';

class HouseMenager extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isOpened: this.props.house.isOpened,
            openColor: '#313539',
            impColor: '#313539',
            sellColor: '#313539',
            stateColor: '#313539',
        }
        this.mouseOut = this.mouseOut.bind(this)
        this.mouseOver = this.mouseOver.bind(this)
    }

    mouseOut(event) {
        event.preventDefault();
        let id = event.target.id;

        switch(id) {
            case 'open':
                this.setState({openColor: '#313539'})
                break;
            case 'imp':
                this.setState({impColor: '#313539'})
                break;
            case 'sell':
                this.setState({sellColor: '#313539'})
                break;
            case 'state':
                this.setState({stateColor: '#313539'})
                break;
        }
    }

    mouseOver(event) {
        event.preventDefault();
        let id = event.target.id;

        switch(id) {
            case 'open':
                this.setState({openColor: 'white'})
                break;
            case 'imp':
                this.setState({impColor: 'white'})
                break;
            case 'sell':
                this.setState({sellColor: 'white'})
                break;
            case 'state':
                this.setState({stateColor: 'white'})
                break;
        }
    }

    back(event) {
        event.preventDefault();
        this.props.setApp(<HouseApp />);
    }

    closeMenager(event) {
        event.preventDefault();
        this.props.setApp(<MainDisplay />)
    }
    
    changeOpenHouse(event) {
        const { house, openCloseHouse } = this.props;
        event.preventDefault();
        if(house.isOpened) {
            openCloseHouse(house.name, false);
            mp.trigger('lockHouse.client', house.name, true)
        } else {
            openCloseHouse(house.name, true);
            mp.trigger('lockHouse.client', house.name, false)
        }
    }

    confirm(event) {
        event.preventDefault();
        let name_id = String(this.refUser.value);
        let price = String(this.refPrice.value);
        let numPrice = Number(price);
        let reg = /[\d]/

        if(name_id) {
            if(price) {
                if(numPrice > this.props.house.price) {
                    let g = true;
                    for(let i = 0; i < price.length; i++) {
                        if(!reg.test(price[i])) {
                            g = false;
                        }
                    }
                    if(g) {
                        let h = true;
                        for(let i = 0; i < name_id.length; i++) {
                            if(!reg.test(name_id[i])) {
                                h = false;
                            }
                        }
                        if(h) {
                            this.setState({isConfirm: true, type: 'user', error: undefined})
                        } else {
                            
                        }
                    } else {
                        this.setState({error: 'Неверный формат цены'});
                        return;
                    }
                } else {
                    this.setState({error: 'Цена должна быть не ниже государственной'});
                    return;
                }
            } else {
                this.setState({error: 'Цена не указана'});
                return;
            }
        } else {
            this.setState({error: 'Игрок не указан'});
            return;
        }
    }

    toImprovements(event) {
        event.preventDefault();
        this.props.addApp(<Improvements />)
    }

    sellHouse(event) {
        event.preventDefault();
        this.props.addApp(<Sell />);
    }

    selStateHouse(event) {
        event.preventDefault();
        this.props.addApp(<SellState />);
    }

    improvementsHouse(event) {
        event.preventDefault();
        this.props.addApp(<Improvements />);
    }

    getContent() {
        const { house } = this.props;
        return(
            <div style={{backgroundColor: 'white', height: '365px'}} ref={(form) => {this.refForm = form}}>
                <div className='headHousePhone'>
                    <span className='headSpanHouseApp'>Дом {house.name}</span><br></br>
                    <span style={{color: 'yellow'}}>{house.area}</span>
                </div>

                <div style={{width: '100%', textAlign: 'center', fontWeight: 'bold', fontSize: '14px', margin: '5px 0 5px 0'}}>Управление домом</div>
                
                <div className='tableButtonsHouseApp'>
                    <div 
                        className='buttonHouseMenager' 
                        style={{marginRight: '10px'}} 
                        onClick={this.changeOpenHouse.bind(this)}
                        onMouseOver={this.mouseOver}
                        onMouseOut={this.mouseOut}
                        id="open"
                    >
                        <div className='icoHouseMenager' id="open">
                            <svg xmlns="http://www.w3.org/2000/svg" id="open" width="42.449" height="42.449" viewBox="0 0 42.449 42.449" fill={this.state.openColor}>
                                <g id="open" data-name="Group 57" transform="translate(0)">
                                    <path id="open" data-name="Path 126" d="M348.967,57.375a4.717,4.717,0,1,0,4.717,4.717A4.632,4.632,0,0,0,348.967,57.375Zm0,7.861a3.144,3.144,0,1,1,3.144-3.144A3.154,3.154,0,0,1,348.967,65.236Z" transform="translate(-315.95 -52.658)"/>
                                    <path id="open" data-name="Path 127" d="M29.086,0A13.352,13.352,0,0,0,15.722,13.364a16.468,16.468,0,0,0,.786,4.717L0,34.588v7.861H7.861V37.733h4.717V33.016h4.717l7.075-7.075a14.822,14.822,0,0,0,4.717.786A13.364,13.364,0,0,0,29.086,0ZM16.508,31.444h-5.5v4.717H6.289v4.717H1.572v-5.5L17.294,19.652a13.262,13.262,0,0,0,5.5,5.5Zm12.578-6.289A11.877,11.877,0,0,1,17.294,13.364a11.792,11.792,0,0,1,23.583,0A11.877,11.877,0,0,1,29.086,25.155Z"/>
                                </g>
                            </svg>
                        </div>
                        <div className='textHouseMenager' id="open">
                            {house.isOpened
                                ? <span id="open" style={{color: '#F90040'}}>Закрыть</span>
                                : <span id="open" style={{color: '#74A607'}}>Открыть</span>
                            }
                        </div>
                    </div>

                    <div 
                        className='buttonHouseMenager'
                        onMouseOver={this.mouseOver}
                        onMouseOut={this.mouseOut}
                        onClick={this.improvementsHouse.bind(this)}
                        id="imp"
                    >
                        <div className='icoHouseMenager' id="imp">
                            <svg xmlns="http://www.w3.org/2000/svg" id="imp" width="33.238" height="42.685" viewBox="0 0 33.238 42.685" fill={this.state.impColor}>
                                <g id="imp" data-name="Group 67" transform="translate(0 0)">
                                    <path id="imp" data-name="Path 128" d="M32.871,8.642,16.828.094a.8.8,0,0,0-.759,0L.469,8.647a.8.8,0,0,0-.414.7V20.514A23.121,23.121,0,0,0,13.913,41.675l2.165.944a.8.8,0,0,0,.636,0l2.44-1.054a23.076,23.076,0,0,0,14.14-21.273V9.347a.8.8,0,0,0-.423-.705ZM31.7,20.292A21.482,21.482,0,0,1,18.528,40.1l-.005,0-2.125.917-1.846-.805a21.522,21.522,0,0,1-12.9-19.7V9.82L16.457,1.706,31.7,9.826Zm0,0" transform="translate(-0.055 0)"/>
                                    <path id="imp" data-name="Path 129" d="M81.248,149.373a.8.8,0,0,0-1.215,1.037l4.219,4.941a.8.8,0,0,0,1.111.1l9.826-7.994a.8.8,0,1,0-1.008-1.239l-9.221,7.5Zm0,0" transform="translate(-70.738 -129.376)"/>
                                </g>
                            </svg>
                        </div>
                        <div id="imp" className='textHouseMenager'>Улучшить</div>
                    </div>

                    <div 
                        className='buttonHouseMenager' 
                        style={{marginRight: '10px'}}
                        onMouseOver={this.mouseOver}
                        onMouseOut={this.mouseOut}
                        onClick={this.sellHouse.bind(this)}
                        id="sell"
                    >
                        <div className='icoHouseMenager' id="sell">
                            <svg xmlns="http://www.w3.org/2000/svg" id="sell" width="46.038" height="33.727" viewBox="0 0 46.038 33.727" fill={this.state.sellColor}>
                                <path id="sell" data-name="Path 130" d="M45.611,68.533a.768.768,0,0,0-.806.079L32.331,78.15a1.537,1.537,0,0,0-.382,2l-1.968.537-2.872-1.223a.762.762,0,0,0-.156-.048c-2.755-.526-4.184-.019-4.922.547H14.188a1.54,1.54,0,0,0-.482-1.813L1.233,68.612A.767.767,0,0,0,0,69.221V87.636a.766.766,0,0,0,.387.666l4.749,2.713a1.521,1.521,0,0,0,.758.2,1.54,1.54,0,0,0,1.05-.418l.89.711A2.284,2.284,0,0,0,9.445,95.2c.065.006.13.008.194.008a2.288,2.288,0,0,0,.352-.03,2.664,2.664,0,0,0,.619,1.487h0a2.668,2.668,0,0,0,1.828.94c.076.007.151.01.227.01l.034,0a2.261,2.261,0,0,0,.528,1.358,2.3,2.3,0,0,0,1.754.811,2.262,2.262,0,0,0,.786-.143,2.265,2.265,0,0,0,2,1.648c.065.006.13.008.194.008a2.23,2.23,0,0,0,1.445-.52l1.2-.93,2.833,1.893a2.673,2.673,0,0,0,1.48.447,2.73,2.73,0,0,0,.538-.053A2.673,2.673,0,0,0,27.6,99.769a2.646,2.646,0,0,0,3.41-2.328,2.671,2.671,0,0,0,3.472-2.978,2.643,2.643,0,0,0,1.893-1.15,2.691,2.691,0,0,0,.355-2.192l1.513-1.513.618.926a1.537,1.537,0,0,0,2.039.482L45.651,88.3a.767.767,0,0,0,.387-.666V69.221A.767.767,0,0,0,45.611,68.533ZM1.535,87.191V70.774L10.1,77.324,3.075,88.071ZM5.9,89.684l-1.488-.85,6.914-10.575,1.451,1.109Zm4.222,3.808a.722.722,0,0,1-.547.175.752.752,0,0,1-.45-1.3l1.919-1.484a.744.744,0,0,1,.484-.178l.063,0a.752.752,0,0,1,.45,1.3Zm2.447,2.581a1.151,1.151,0,0,1-.675-2L14.307,92.2a1.151,1.151,0,0,1,1.891.973,1.134,1.134,0,0,1-.359.744l-.658.513L13.4,95.8A1.138,1.138,0,0,1,12.565,96.072Zm3.919,1.189,0,0-1.024.8a.75.75,0,0,1-1.058-.088h0a.742.742,0,0,1-.175-.547.731.731,0,0,1,.239-.492l1.794-1.4.529-.409c.006,0,.01-.011.016-.016l.542-.423a.743.743,0,0,1,.483-.178.628.628,0,0,1,.064,0,.752.752,0,0,1,.447,1.3l-1.795,1.4Zm3.881.834-1.919,1.484a.713.713,0,0,1-.547.175.752.752,0,0,1-.45-1.3l.035-.027,1.884-1.457a.752.752,0,0,1,1,1.125ZM35.1,92.463a1.159,1.159,0,0,1-1.582.33l-.006,0-5.039-3.483a.767.767,0,1,0-.872,1.262l4.876,3.371,0,0a1.145,1.145,0,0,1-.411,2.078,1.131,1.131,0,0,1-.854-.163l-5.043-3.48a.768.768,0,0,0-.872,1.263l3.683,2.541h0a1.22,1.22,0,0,1,.331,1.648,1.147,1.147,0,0,1-1.577.333L26.381,97.2h0L25,96.218a.767.767,0,0,0-.889,1.251l1.423,1.009a2.193,2.193,0,0,1,.2.178,1.154,1.154,0,0,1-1.43,1.8L21.77,98.768A2.272,2.272,0,0,0,20.1,95.275a2.264,2.264,0,0,0-2.086-2.291,2.191,2.191,0,0,0-.3,0A2.665,2.665,0,0,0,13.7,90.761a2.282,2.282,0,0,0-3.625-1.07l-1.048.81-1.2-.955L13.2,81.5h6.735a2.208,2.208,0,0,0-.716,2.053,2.186,2.186,0,0,0,1.823,1.787,7.53,7.53,0,0,0,4.171-.6l1.956,1.245a.766.766,0,0,0,.138.062l7.48,4.818a1.253,1.253,0,0,1,.364.387c0,.009.008.017.013.026A1.161,1.161,0,0,1,35.1,92.463Zm.785-2.665a2.7,2.7,0,0,0-.258-.22l-7.588-4.888a.729.729,0,0,0-.108-.042l-2.257-1.436a.768.768,0,0,0-.794-.019,6.076,6.076,0,0,1-3.588.632.646.646,0,0,1-.563-.541.692.692,0,0,1,.36-.742,8.842,8.842,0,0,0,1.61-1.078.516.516,0,0,0,.128-.162.6.6,0,0,1,.081-.083c.225-.193,1.152-.776,3.676-.309L29.624,82.2a.751.751,0,0,0,.5.034l2.712-.739,4.539,6.807Zm4.255-.114L33.263,79.369l1.452-1.11,6.914,10.575ZM44.5,87.191l-1.54.88L35.937,77.324,44.5,70.774V87.191Z" transform="translate(0 -68.454)"/>
                            </svg>
                        </div>
                        <div id="sell" className='textHouseMenager'>Продать<br></br><span id="sell" style={{fontSize: '11px'}}>на руки</span></div>
                    </div>

                    <div 
                        className='buttonHouseMenager'
                        onMouseOver={this.mouseOver}
                        onMouseOut={this.mouseOut}
                        onClick={this.selStateHouse.bind(this)}
                        id="state"
                    >
                        <div id="state" className='icoHouseMenager'>
                            <svg id="state" xmlns="http://www.w3.org/2000/svg" width="33.899" height="33.727" viewBox="0 0 33.899 33.727" fill={this.state.stateColor}>
                                <g id="state" data-name="Group 68" transform="translate(0 0)">
                                    <path id="state" data-name="Path 132" d="M224.13,88.309a2.26,2.26,0,1,0,2.26,2.26A2.262,2.262,0,0,0,224.13,88.309Zm0,3.39a1.13,1.13,0,1,1,1.13-1.13A1.13,1.13,0,0,1,224.13,91.7Z" transform="translate(-207.18 -82.548)"/>
                                    <path id="state" data-name="Path 133" d="M32.2,31.633v-.565a1.694,1.694,0,0,0-1.13-1.586v-.674a1.692,1.692,0,0,0-1.13-1.591V18.535a1.692,1.692,0,0,0,1.13-1.591v-1l1.03-2.059,1.63-1.63a.564.564,0,0,0-.105-.882l-16.384-10a.564.564,0,0,0-.588,0l-16.384,10a.564.564,0,0,0-.105.882l1.63,1.63,1.03,2.059v1a1.692,1.692,0,0,0,1.13,1.591v8.683a1.692,1.692,0,0,0-1.13,1.591v.674A1.694,1.694,0,0,0,1.7,31.068v.565A1.7,1.7,0,0,0,0,33.328v1.13a.565.565,0,0,0,.565.565H33.334a.565.565,0,0,0,.565-.565h0v-1.13A1.7,1.7,0,0,0,32.2,31.633Zm-2.26-14.69a.565.565,0,0,1-.565.565H25.99a.565.565,0,0,1-.565-.565v-.565h4.52v.565ZM14.125,27.218V18.535a1.692,1.692,0,0,0,1.13-1.591v-.565h3.39v.565a1.692,1.692,0,0,0,1.13,1.591v8.683a1.692,1.692,0,0,0-1.13,1.591v.565h-3.39v-.565A1.692,1.692,0,0,0,14.125,27.218Zm-9.6-9.709a.565.565,0,0,1-.565-.565v-.565h4.52v.565a.565.565,0,0,1-.565.565Zm2.825,1.13v8.475H5.085V18.639Zm1.13-.1A1.686,1.686,0,0,0,9.04,18.2a1.686,1.686,0,0,0,.565.337v8.683a1.686,1.686,0,0,0-.565.337,1.687,1.687,0,0,0-.565-.337Zm1.13,10.274a.566.566,0,0,1,.565-.565h3.39a.565.565,0,0,1,.565.565v.565H9.605Zm1.13-1.695V18.639h2.26v8.475Zm2.825-9.6H10.17a.565.565,0,0,1-.565-.565v-.565h4.52v.565A.566.566,0,0,1,13.56,17.509Zm6.215,11.3a.565.565,0,0,1,.565-.565h3.39a.565.565,0,0,1,.565.565v.565h-4.52Zm1.13-1.695V18.639h2.26v8.475Zm2.825-9.6H20.34a.565.565,0,0,1-.565-.565v-.565h4.52v.565A.566.566,0,0,1,23.73,17.509Zm.565,1.026a1.686,1.686,0,0,0,.565-.337,1.686,1.686,0,0,0,.565.337v8.683a1.686,1.686,0,0,0-.565.337,1.687,1.687,0,0,0-.565-.337Zm1.13,10.274a.566.566,0,0,1,.565-.565h3.39a.565.565,0,0,1,.565.565v.565h-4.52v-.565Zm1.13-1.695V18.639h2.26v8.475ZM2.344,12.839l-.872-.872L16.95,2.523l15.477,9.445-.872.872L17.246,4.033a.564.564,0,0,0-.593,0Zm27.3.15H4.256L16.95,5.178Zm-25.9,2.26-.565-1.13H30.725l-.565,1.13Zm.216,13.56a.565.565,0,0,1,.565-.565H7.91a.565.565,0,0,1,.565.565v.565H3.955Zm28.814,5.085H1.13v-.565a.565.565,0,0,1,.565-.565H13.56a.565.565,0,0,0,0-1.13H2.825v-.565a.577.577,0,0,1,.587-.565H30.487a.577.577,0,0,1,.587.565v.565H20.34a.565.565,0,1,0,0,1.13H32.2a.565.565,0,0,1,.565.565Z" transform="translate(0 -1.296)"/>
                                </g>
                            </svg>
                        </div>
                        <div id="state" className='textHouseMenager'>Продать<br></br><span id="state" style={{fontSize: '11px'}}>государству</span></div>
                    </div>
                </div>

                <button id='idButHouseApp' onClick={this.back.bind(this)} style={{marginTop: '5px'}}>
                    <div style={{display: 'inline-block', width: '10%'}}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="7.885" height="17.142" viewBox="0 0 7.885 17.142" style={{marginLeft: '5px'}}>
                            <path id="Path_175" data-name="Path 175" d="M33.027,0a1.6,1.6,0,0,1,1.722,1.678,2.254,2.254,0,0,1-2.3,2.152,1.537,1.537,0,0,1-1.692-1.705A2.2,2.2,0,0,1,33.027,0ZM29.493,17.142c-.906,0-1.571-.559-.936-3.02L29.6,9.759c.181-.7.211-.978,0-.978a6.847,6.847,0,0,0-2.144.958L27,8.983c2.2-1.873,4.742-2.971,5.829-2.971.906,0,1.057,1.09.6,2.768l-1.191,4.587c-.212.811-.121,1.09.09,1.09a4.669,4.669,0,0,0,2.039-1.036l.514.7A9.427,9.427,0,0,1,29.493,17.142Z" transform="translate(-27)" fill="#ffe000"/>
                        </svg>
                    </div>
                    <div style={{display: 'inline-block', width: '90%', textAlign: 'center'}}>
                        Информация
                    </div>     
                </button>
                <button id='idButHouseApp' onClick={this.closeMenager.bind(this)} style={{marginTop: '5px'}}>
                    <div style={{display: 'inline-block', width: '10%'}}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16.37" height="16.369" viewBox="0 0 16.37 16.369" style={{marginLeft: '5px'}}>
                            <path id="Path_172" data-name="Path 172" d="M9.632,8.186,16.07,1.748A1.024,1.024,0,1,0,14.622.3L8.185,6.738,1.747.3A1.024,1.024,0,1,0,.3,1.748L6.737,8.186.3,14.623A1.023,1.023,0,1,0,1.747,16.07L8.185,9.633l6.437,6.437a1.024,1.024,0,0,0,1.448-1.448Z" transform="translate(0 -0.001)" fill="#f90040"/>
                        </svg>
                    </div>
                    <div style={{display: 'inline-block', width: '90%', textAlign: 'center'}}>
                        Закрыть меню
                    </div>
                </button>
            </div>
        )
    }

    render() {   
        return(
            <div>
                {this.getContent()}
            </div>
        )
    }
}

const mapStateToProps = state => ({
    ...state,
    house: state.phoneInfo.houses[0]
})

const mapDispathToProps = dispatch => ({
    setApp: app => dispatch(setApp(app)),
    deleteApp: app => dispatch(deleteApp(app)),
    addApp: app => dispatch(addApp(app)),
    openCloseHouse: (index, flag) => dispatch(openCloseHouse(index, flag))
})

export default connect(mapStateToProps, mapDispathToProps)(HouseMenager)