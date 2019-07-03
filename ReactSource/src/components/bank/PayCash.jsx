import React from 'react';
import Menu from './Menu.jsx';
import Loader from '../LoaderBank.jsx';
import { money, index } from '../../source/bank.js';

export default class PayCash extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: undefined
        }
    }

    clickNextPush(event) {
        event.preventDefault();
        const { bank, info } = this.props;
        let num = this.refPush.value;
        let reg = /[\d]/;
        if(num) {
            let h = true;
            for(let i = 0; i < num.length; i++) {
                if(!reg.test(num[i])) {
                    h = false;
                }
            }
            if(h) {
                num = Number(num);
                if(num <= bank.money && num != 0) {
                    money[0] = num;
                    index[0] = info.biz[0].name
                    this.props.addForm(<Loader position='42% 35%' size='small' />);
                    mp.trigger('pushCashBox.client', info.biz[0].name, num)
                    this.refPush.value = ''
                    this.setState({error: ''});
                } else {
                    this.setState({error: 'Недостаточно денег на счете'});
                    this.refPush.style.borderColor = 'red'
                    return;
                }
            } else {
                this.setState({error: 'Некорректное значение'});
                this.refPush.style.borderColor = 'red'
                return;
            }
        } else {
            this.setState({error: 'Поле не заполнено'});
            this.refPush.style.borderColor = 'red'
            return;
        }
    }

    clickNextPop(event) {
        event.preventDefault();
        const { info } = this.props;
        let num = this.refPop.value;
        let reg = /[\d]/;
        if(num) {
            let h = true;
            for(let i = 0; i < num.length; i++) {
                if(!reg.test(num[i])) {
                    h = false;
                }
            }
            if(h) {
                num = Number(num);
                console.log(num)
                if(num <= info.biz[0].cashBox && num != 0) {
                    money[0] = num;
                    index[0] = info.biz[0].name
                    this.props.addForm(<Loader position='42% 35%' size='small' />);
                    mp.trigger('popCashBox.client', info.biz[0].name, num)
                    this.refPop.value = ''
                    this.setState({error: ''});
                } else {
                    this.setState({error: 'Недостаточно денег в кассе'});
                    this.refPop.style.borderColor = 'red'
                    return;
                }
            } else {
                this.setState({error: 'Некорректное значение'});
                this.refPop.style.borderColor = 'red'
                return;
            }
        } else {
            this.setState({error: 'Поле не заполнено'});
            this.refPop.style.borderColor = 'red'
            return;
        }  
    }

    back(event) {
        event.preventDefault();
        this.props.setPage(<Menu />)
    }

    getForm() {
        if(this.props.info.biz.length !== 0) {
            return (
                <div>
                    <div style={{fontWeight: 'bold', fontSize: '22px', marginTop: '20px'}}>Состояние кассы: 
                    <span style={{color: '#00932B', fontSize: '24px'}}> ${this.props.info.biz[0].cashBox.toLocaleString('ru-RU')}</span>
                </div>
                <div className='blockPayBank' style={{marginTop: '20px'}}>
                    <div className='panelCashBoxBank'>
                        <div className='textCashBoxBank'>Пополнение кассы</div>
                        <div className='plitCashBoxBank'>
                            <div className='inputPayBankBlock'>
                                <div style={{textAlign: 'left', marginLeft: '20px'}}>Сумма пополнения:</div>
                                <input type='text' ref={(input) => {this.refPush = input}} className='inputPayBank'></input>
                                <button onClick={this.clickNextPush.bind(this)} id='buttonPayBank'>OK</button>
                            </div>
                        </div>
                    </div>

                    <div className='panelCashBoxBank'>
                        <div className='textCashBoxBank'>Снятие из кассы</div>
                        <div className='plitCashBoxBank'>
                            <div className='inputPayBankBlock'>
                                Сумма снятия:
                                <input type='text' ref={(input) => {this.refPop = input}} className='inputPayBank'></input>
                                <button onClick={this.clickNextPop.bind(this)} id='buttonPayBank'>OK</button>
                            </div>
                        </div>
                    </div>
                    <div>
                        <button onClick={this.back.bind(this)} id='buttonBackBank'>Назад</button>
                    </div>
                    <div style={{width: '100%', textAlign: 'center', color: 'red', marginTop: '10px'}}>
                        {this.state.error}
                    </div>
                </div>
                </div>
            )
        } else {
            return (
                <div>
                    <div className='houseBizBank' style={{height: '250px', marginTop: '20px'}}>
                        <div style={{width: '100%', textAlign: 'center'}}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="127.688" height="111.486" viewBox="0 0 127.688 111.486" style={{marginTop: '20px'}}>
                                <g id="Group_54" data-name="Group 54" transform="translate(0 0)">
                                    <path id="Path_101" data-name="Path 101" d="M274.16,263.75H256.81a8.618,8.618,0,0,0-8.61,8.61v13.306a8.618,8.618,0,0,0,8.61,8.61h17.35a8.618,8.618,0,0,0,8.61-8.61V272.36A8.618,8.618,0,0,0,274.16,263.75Zm2.348,21.916a2.355,2.355,0,0,1-2.348,2.348H256.81a2.355,2.355,0,0,1-2.348-2.348V272.36a2.355,2.355,0,0,1,2.348-2.348h17.35a2.355,2.355,0,0,1,2.348,2.348Z" transform="translate(-183.443 -203.037)"/>
                                    <path id="Path_102" data-name="Path 102" d="M127.688,67.577a2.906,2.906,0,0,0-.417-1.539l-18.994-33.4a3.148,3.148,0,0,0-2.713-1.592H22.1a3.094,3.094,0,0,0-2.713,1.592L.417,66.038A3.165,3.165,0,0,0,0,67.577a18.315,18.315,0,0,0,10.958,16.75V139.4a3.14,3.14,0,0,0,3.131,3.131h99.484A3.14,3.14,0,0,0,116.7,139.4V84.719a1.378,1.378,0,0,0-.026-.339A18.366,18.366,0,0,0,127.688,67.577ZM23.925,37.338h79.811l14.846,26.117H9.106ZM90.874,69.69a12.033,12.033,0,0,1-23.69,0Zm-30.343,0a12.049,12.049,0,0,1-23.716,0Zm-54.06,0H30.187a12.049,12.049,0,0,1-23.716,0ZM52.6,136.274h-18V102.486a4.46,4.46,0,0,1,4.462-4.462h9.106a4.46,4.46,0,0,1,4.462,4.462v33.787Zm57.843,0H58.861V102.486A10.74,10.74,0,0,0,48.137,91.763H39.032a10.74,10.74,0,0,0-10.723,10.723V136.3H17.22V85.867c.365.026.731.026,1.1.026A18.292,18.292,0,0,0,33.5,77.8a18.3,18.3,0,0,0,30.37,0,18.249,18.249,0,0,0,30.317,0,18.292,18.292,0,0,0,15.185,8.088c.365,0,.7-.026,1.07-.026v50.407Zm-1.07-56.643a12.027,12.027,0,0,1-11.845-9.914h23.716A12.1,12.1,0,0,1,109.372,79.631Z" transform="translate(0 -31.05)"/>
                                </g>
                            </svg>
                        </div>
                        <div style={{fontSize: '22px', fontWeight: 'bold', textAlign: 'center', marginTop: '15px'}}>У Вас нет бизнеса</div>
                    </div>
                    <div>
                        <button onClick={this.back.bind(this)} id='buttonBackBank'>Назад</button>
                    </div>
                </div>
            )
        }
    }

    render() {
        return (
            <div className='pageBank'>
                <div className='titlePageBank'>Касса бизнеса</div>
                {this.getForm()}
            </div>
        )
    }
}