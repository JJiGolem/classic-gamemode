import React from 'react';
import {connect} from 'react-redux';
import { setApp, addApp } from '../../../actions/phone.js';
import HouseMenager from './HouseMenager.jsx';
import MainDisplay from '../MainDisplay.jsx';

class HouseApp extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    toMenager(event) {
        event.preventDefault();
        this.props.addApp(<HouseMenager />)
    }

    back(event) {
        event.preventDefault();
        this.props.setApp(<MainDisplay />)
    }

    getItems(item) {
        const { house } = this.props;

        switch(item) {
            case 'house':
                if(house.isOpened) {
                    return(
                        <span style={{color: '#74A607', marginLeft: '2px'}}>открыт</span>
                    )
                } else {
                    return(
                        <span style={{color: '#F90040', marginLeft: '2px'}}>закрыт</span>
                    )
                }
            case 'class':
                return(
                    <span style={{marginLeft: '2px'}}>{house.class}</span>
                )
            case 'area':
                return(
                    <span style={{color: 'yellow'}}>{house.area}</span>
                )
            case 'numR':
                return(
                    <span style={{marginLeft: '2px'}}>{house.numRooms}</span>
                )
            case 'gar':
                if(house.garage) {
                    return(
                        <span style={{color: '#74A607', marginLeft: '2px'}}>есть</span>
                    )
                } else {
                    return(
                        <span style={{color: '#F90040', marginLeft: '2px'}}>нет</span>
                    )
                }
            case 'numG':
                return(
                    <span style={{marginLeft: '5px'}}>{house.carPlaces}</span>
                )
            case 'rent':
                return(
                    <span style={{marginLeft: '2px'}}>${house.rent} в сутки</span>
                )
            case 'pay':
                return(
                    <span style={{marginLeft: '2px'}}>{house.days}/30</span>
                )
        }
    }


    render() {
        const { house } = this.props;
        return(
            <div style={{backgroundColor: 'white', height: '364px'}}>
                <div className='headHousePhone'>
                    <span className='headSpanHouseApp'>Дом {house.name}</span><br></br>
                    <span>{this.getItems('area')}</span>
                </div>
                <div className='infoHouseApp'>Информация</div>
                <ul className='listInfoPhone'>
                    <li className='elListPhone'>Класс:{this.getItems('class')}</li>
                    <li className='elListPhone'>Количество комнат:{this.getItems('numR')}</li>
                    <li className='elListPhone'>Гараж:{this.getItems('gar')}</li>
                    <li className='elListPhone'>Парковочных мест:{this.getItems('numG')}</li>
                    <li className='elListPhone'>Состояние:{this.getItems('house')}</li>
                    <li className='elListPhone'>Аренда:{this.getItems('rent')}</li>
                    <li className='elListPhone'>Оплачено:{this.getItems('pay')}</li>
                </ul>

                <button id='idButHouseApp' onClick={this.toMenager.bind(this)}>
                    <div style={{display: 'inline-block', width: '10%'}}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="22.882" height="20.398" viewBox="0 0 22.882 20.398" >
                            <g id="Group_106" data-name="Group 106" transform="translate(0.001 -27.797)">
                                <path id="Path_170" data-name="Path 170" d="M73.694,232.543a.6.6,0,0,0-.595.595V242.6H68.343v-5.166a2.973,2.973,0,0,0-5.946,0V242.6H57.641v-9.464a.595.595,0,1,0-1.189,0V243.2a.6.6,0,0,0,.595.595h5.945a.594.594,0,0,0,.592-.548.447.447,0,0,0,0-.046v-5.76a1.784,1.784,0,1,1,3.568,0v5.76a.434.434,0,0,0,0,.046.594.594,0,0,0,.592.549h5.945a.6.6,0,0,0,.595-.595V233.138A.6.6,0,0,0,73.694,232.543Z" transform="translate(-53.93 -195.595)" fill="#ffe000"/>
                                <path id="Path_171" data-name="Path 171" d="M22.638,35.854,11.792,27.912a.594.594,0,0,0-.7,0L.243,35.854a.595.595,0,1,0,.7.959l10.5-7.685,10.5,7.684a.595.595,0,0,0,.7-.959Z" transform="translate(0)" fill="#ffe000"/>
                            </g>
                        </svg>
                    </div>
                    <div style={{display: 'inline-block', width: '90%', textAlign: 'center'}}>
                        Управление домом
                    </div>
                </button>
                <button id='idButHouseApp' onClick={this.back.bind(this)}>
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
}

const mapStateToProps = state => ({
    ...state,
    house: state.phoneInfo.houses[0]
})

const mapDispathToProps = dispatch => ({
    setApp: app => dispatch(setApp(app)),
    addApp: app => dispatch(addApp(app))
})

export default connect(mapStateToProps, mapDispathToProps)(HouseApp)