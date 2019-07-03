import React from 'react';
import {connect} from 'react-redux';
import { setApp, addApp } from '../../../actions/phone.js';
import HouseMenager from './HouseMenager.jsx';

class Sell extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            error: undefined,
            isSell: false
        }
    }

    back(event) {
        event.preventDefault();
        this.props.setApp(<HouseMenager />);
    }

    sell(event) {
        event.preventDefault();
        this.setState({isSell: true})
        mp.trigger('govSellHouse.client', this.props.house.name);
    }

    getContent() {
        const { house } = this.props;
        return(
            <div style={{backgroundColor: 'white', height: '365px'}} ref={(form) => {this.refForm = form}}>
                <div className='headHousePhone'>
                    <span className='headSpanHouseApp'>Дом {house.name}</span><br></br>
                    <span style={{color: 'yellow'}}>{house.area}</span>
                </div>

                <div style={{width: '100%', textAlign: 'center', fontWeight: 'bold', fontSize: '14px', margin: '5px 0 5px 0'}}>Продажа государству</div>
                
                <div className='blockSellHouseApp'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="78.244" height="77.847" viewBox="0 0 78.244 77.847">
                        <g id="Group_68" data-name="Group 68" transform="translate(0 0)">
                            <path id="Path_132" data-name="Path 132" d="M227.086,88.309a5.216,5.216,0,1,0,5.216,5.216A5.222,5.222,0,0,0,227.086,88.309Zm0,7.824a2.608,2.608,0,1,1,2.608-2.608A2.608,2.608,0,0,1,227.086,96.133Z" transform="translate(-187.965 -75.012)" fill="#313539"/>
                            <path id="Path_133" data-name="Path 133" d="M74.331,71.319v-1.3a3.91,3.91,0,0,0-2.608-3.661V64.8a3.906,3.906,0,0,0-2.608-3.672V41.086a3.906,3.906,0,0,0,2.608-3.672v-2.3L74.1,30.361,77.861,26.6a1.3,1.3,0,0,0-.243-2.035L39.8,1.487a1.3,1.3,0,0,0-1.357,0L.626,24.564A1.3,1.3,0,0,0,.383,26.6l3.762,3.762,2.376,4.753v2.3a3.906,3.906,0,0,0,2.608,3.672V61.127A3.906,3.906,0,0,0,6.521,64.8v1.555a3.91,3.91,0,0,0-2.608,3.661v1.3A3.916,3.916,0,0,0,0,75.231v2.608a1.3,1.3,0,0,0,1.3,1.3H76.939a1.3,1.3,0,0,0,1.3-1.3h0V75.231A3.916,3.916,0,0,0,74.331,71.319ZM69.115,37.414a1.305,1.305,0,0,1-1.3,1.3H59.987a1.305,1.305,0,0,1-1.3-1.3v-1.3H69.115v1.3ZM32.6,61.127V41.086a3.906,3.906,0,0,0,2.608-3.672v-1.3h7.824v1.3a3.906,3.906,0,0,0,2.608,3.672V61.127A3.906,3.906,0,0,0,43.034,64.8v1.3H35.21V64.8A3.906,3.906,0,0,0,32.6,61.127ZM10.433,38.718a1.305,1.305,0,0,1-1.3-1.3v-1.3H19.561v1.3a1.305,1.305,0,0,1-1.3,1.3Zm6.52,2.608V60.886H11.737V41.326Zm2.608-.24a3.892,3.892,0,0,0,1.3-.777,3.89,3.89,0,0,0,1.3.777V61.127a3.892,3.892,0,0,0-1.3.777,3.893,3.893,0,0,0-1.3-.777ZM22.169,64.8a1.305,1.305,0,0,1,1.3-1.3H31.3a1.305,1.305,0,0,1,1.3,1.3v1.3H22.169Zm2.608-3.912V41.326h5.216V60.886ZM31.3,38.718H23.473a1.305,1.305,0,0,1-1.3-1.3v-1.3H32.6v1.3A1.306,1.306,0,0,1,31.3,38.718ZM45.642,64.8a1.305,1.305,0,0,1,1.3-1.3h7.824a1.305,1.305,0,0,1,1.3,1.3v1.3H45.642Zm2.608-3.912V41.326h5.216V60.886Zm6.52-22.169H46.946a1.305,1.305,0,0,1-1.3-1.3v-1.3H56.075v1.3A1.306,1.306,0,0,1,54.771,38.718Zm1.3,2.368a3.892,3.892,0,0,0,1.3-.777,3.89,3.89,0,0,0,1.3.777V61.127a3.892,3.892,0,0,0-1.3.777,3.893,3.893,0,0,0-1.3-.777ZM58.683,64.8a1.305,1.305,0,0,1,1.3-1.3h7.824a1.305,1.305,0,0,1,1.3,1.3v1.3H58.682V64.8Zm2.608-3.912V41.326h5.216V60.886ZM5.41,27.939,3.4,25.927l35.724-21.8,35.724,21.8-2.012,2.012L39.806,7.614a1.3,1.3,0,0,0-1.368,0Zm63.009.346H9.824l29.3-18.029ZM8.631,33.5l-1.3-2.608h63.59l-1.3,2.608Zm.5,31.3a1.305,1.305,0,0,1,1.3-1.3h7.824a1.305,1.305,0,0,1,1.3,1.3v1.3H9.129ZM75.635,76.535H2.609v-1.3a1.305,1.305,0,0,1,1.3-1.3H31.3a1.3,1.3,0,0,0,0-2.608H6.521v-1.3a1.331,1.331,0,0,1,1.355-1.3H70.368a1.332,1.332,0,0,1,1.355,1.3v1.3H46.946a1.3,1.3,0,0,0,0,2.608H74.331a1.305,1.305,0,0,1,1.3,1.3Z" transform="translate(0 -1.296)" fill="#313539"/>
                        </g>
                    </svg>
                    <div style={{textAlign: 'center', color: '#74a607', fontWeight: 'bold', marginTop: 10, fontSize: '16px'}}>${house.price * 0.6}</div>
                    <div style={{textAlign: 'center', fontSize: '12px'}}>(60% от гос.стоимости)</div>
               </div>

               <button id='idButHouseApp' onClick={this.sell.bind(this)}>
                    <div style={{display: 'inline-block', width: '10%'}}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16.729" height="12.286" viewBox="0 0 16.729 12.286" style={{marginLeft: '5px'}}>
                            <path id="Path_176" data-name="Path 176" d="M16.484,68.243a.836.836,0,0,0-1.183,0L5.28,78.264,1.427,74.412A.836.836,0,0,0,.245,75.595l4.444,4.444a.837.837,0,0,0,1.183,0L16.484,69.425A.836.836,0,0,0,16.484,68.243Z" transform="translate(0 -67.997)" fill="#74a607"/>
                        </svg>
                    </div>
                    <div style={{display: 'inline-block', width: '90%', textAlign: 'center'}}>
                        Подтвердить
                    </div>
                </button>
                <button id='idButHouseApp' onClick={this.back.bind(this)} style={{marginTop: '10px'}}>
                    <div style={{display: 'inline-block', width: '10%'}}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16.37" height="16.369" viewBox="0 0 16.37 16.369" style={{marginLeft: '5px'}}>
                            <path id="Path_172" data-name="Path 172" d="M9.632,8.186,16.07,1.748A1.024,1.024,0,1,0,14.622.3L8.185,6.738,1.747.3A1.024,1.024,0,1,0,.3,1.748L6.737,8.186.3,14.623A1.023,1.023,0,1,0,1.747,16.07L8.185,9.633l6.437,6.437a1.024,1.024,0,0,0,1.448-1.448Z" transform="translate(0 -0.001)" fill="#f90040"/>
                        </svg>
                    </div>
                    <div style={{display: 'inline-block', width: '90%', textAlign: 'center'}}>
                        Отменить
                    </div>
                </button>
            </div>
        )
    }

    render() {   
        return(
            <div>
                {
                    !this.state.isSell 
                    ? this.getContent() 
                    : <div style={{backgroundColor: 'white', height: '365px', paddingTop: '150px'}}>
                        <div style={{textAlign: 'center', fontSize: '16px', fontWeight: 'bold'}}>Ожидание...</div>
                    </div>
                }
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
    addApp: app => dispatch(addApp(app)),
})

export default connect(mapStateToProps, mapDispathToProps)(Sell)