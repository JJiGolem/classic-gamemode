import React from 'react';
import {connect} from 'react-redux';
import { setApp } from '../../actions/phone.js';

import { info } from '../../source/phone.js';

class MainDisplay extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    click(event) {
        event.preventDefault();
    }

    getItems(item) {
        switch(item) {
            case 'house':
                if(info.houses[0].open) {
                    return(
                        <span style={{color: 'green', marginLeft: '5px'}}>Открыт</span>
                    )
                } else {
                    return(
                        <span style={{color: 'red', marginLeft: '5px'}}>Закрыт</span>
                    )
                }
            case 'class':
                return(
                    <span style={{color: 'white', marginLeft: '5px'}}>{info.houses[0].class}</span>
                )
            case 'numR':
                return(
                    <span style={{color: 'white', marginLeft: '5px'}}>{info.houses[0].numRooms}</span>
                )
            case 'gar':
                if(info.houses[0].garage) {
                    return(
                        <span style={{color: 'green', marginLeft: '5px'}}>есть</span>
                    )
                } else {
                    return(
                        <span style={{color: 'red', marginLeft: '5px'}}>нет</span>
                    )
                }
            case 'numG':
                return(
                    <span style={{color: 'white', marginLeft: '5px'}}>{info.houses[0].carPlaces}</span>
                )
            case 'rent':
                return(
                    <span style={{color: 'white', marginLeft: '5px'}}><span style={{color: 'green'}}>{info.houses[0].rent}$</span> в неделю</span>
                )
            case 'pay':
                return(
                    <span style={{color: 'white', marginLeft: '5px'}}>{info.houses[0].days}/30 дней</span>
                )
        }
    }


    render() {
        return(
            <div className='displayPhone' style={{backgroundColor: '#484848'}}>
                <div className='headHouse' style={{borderRadius: 0, textAlign: 'center', paddingTop: '8px'}}>
                    <span className='headSpanHouseApp'>Дом №{info.houses[0].name}</span>
                </div>

                {/* <div style={{textAlign: 'center', marginTop: '10px', borderBottom: '1px solid gray'}}>
                    <span style={{fontSize: '22px', color: 'white'}}>Информация</span>
                </div> */}

                <ul className='listInfo' style={{fontSize: '15px', marginTop: '20px'}}>
                    <li className='elList'>Класс: {this.getItems('class')}</li>
                    <li className='elList'>Количество комнат: {this.getItems('numR')}</li>
                    <li className='elList'>Гараж: {this.getItems('gar')}</li>
                    <li className='elList'>Мест в гараже: {this.getItems('numG')}</li>
                    <li className='elList'>Аренда: {this.getItems('rent')}</li>
                    <li className='elList'>Дом: {this.getItems('house')}</li>
                    <li className='elList'>Оплачено: {this.getItems('pay')}</li>
                </ul>

                <button id='idButHouseApp' onClick={this.click.bind(this)}>Управление домом</button>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    ...state
})

const mapDispathToProps = dispatch => ({
    setApp: app => dispatch(setApp(app))
})

export default connect(mapStateToProps, mapDispathToProps)(MainDisplay)