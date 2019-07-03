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

    }

    confirm(event) {
        event.preventDefault();
        let name_id = String(this.refUser.value);
        let price = String(this.refPrice.value);
        let numPrice = Number(price);
        let reg = /[\d]/

        if(name_id) {
            if(price) {
                let g = true;
                    for(let i = 0; i < price.length; i++) {
                        if(!reg.test(price[i])) {
                            g = false;
                        }
                    }
                    if(g) {
                        if(numPrice > this.props.house.price) {
                            let h = true;
                            for(let i = 0; i < name_id.length; i++) {
                                if(!reg.test(name_id[i])) {
                                    h = false;
                                }
                            }
                            if(h) {
                                mp.trigger('sellHouse.client', this.props.house.name, parseInt(name_id), numPrice)
                                this.setState({error: undefined, isSell: true})
                            } else {
                                this.setState({error: 'Неверный формат ID'});
                            }
                        } else {
                            this.setState({error: `Цена должна быть не ниже государственной ($${this.props.house.price})`});
                            return;
                        }
                    } else {
                        this.setState({error: 'Неверный формат цены'});
                        return;
                    }
            } else {
                this.setState({error: 'Цена не указана'});
                return;
            }
        } else {
            this.setState({error: 'Покупатель не указан'});
            return;
        }
    }

    getContent() {
        const { house } = this.props;
        return(
            <div style={{backgroundColor: 'white', height: '365px'}} ref={(form) => {this.refForm = form}}>
                <div className='headHousePhone'>
                    <span className='headSpanHouseApp'>Дом {house.name}</span><br></br>
                    <span style={{color: 'yellow'}}>{house.area}</span>
                </div>

                <div style={{width: '100%', textAlign: 'center', fontWeight: 'bold', fontSize: '14px', margin: '5px 0 5px 0'}}>Продажа на руки</div>
                
               <div className='blockSellHouseApp'>
                   <div className='inputBlockHouseApp'>
                       <div className='textInputHouseApp'>ID покупателя</div>
                       <input className='inputHouseApp' type='text' ref={(input) => {this.refUser = input}}></input>
                   </div>

                   <div className='inputBlockHouseApp'>
                       <div className='textInputHouseApp'>Сумма сделки</div>
                       <input className='inputHouseApp' type='text' ref={(input) => {this.refPrice = input}}></input>
                   </div>
                   <div style={{textAlign: 'center', color: '#F90040', fontSize: '12px'}}>{this.state.error}</div>
               </div>

                <div style={{bottom: '5px', position: 'absolute', width: '100%'}}>
                    <button id='idButHouseApp' onClick={this.confirm.bind(this)}>
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
                        <div style={{textAlign: 'center', fontSize: '16px', fontWeight: 'bold', color: '#313539'}}>Ожидание...</div>
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
    addApp: app => dispatch(addApp(app))
})

export default connect(mapStateToProps, mapDispathToProps)(Sell)