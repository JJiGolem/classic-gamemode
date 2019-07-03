import React from 'react';
import Menu from './Menu.jsx';
import Loader from '../LoaderBank.jsx';
import { money } from '../../source/bank.js';

export default class PayPhone extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: undefined
        }
    }

    clickNext(event) {
        event.preventDefault();
        const { bank } = this.props;
        let num = this.refNum.value;
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
                    this.props.addForm(<Loader position='42% 35%' size='small' />);
                    mp.trigger('pushPhone.client', num);
                    this.refNum.value = ''
                    this.setState({error: ''});
                } else {
                    this.setState({error: 'Недостаточно денег на счете'});
                    this.refNum.style.borderColor = 'red'
                    return;
                }
            } else {
                this.setState({error: 'Некорректное значение'});
                this.refNum.style.borderColor = 'red'
                return;
            }
        } else {
            this.setState({error: 'Поле не заполнено'});
            this.refNum.style.borderColor = 'red'
            return;
        }
    }

    back(event) {
        event.preventDefault();
        this.props.setPage(<Menu />)
    }

    render() {
        if(this.props.isHave) {
            return (
                <div className='pageBank'>
                    <div className='titlePageBank'>Пополнение счета телефона</div>
                    <div className='blockPayBank'>
                        <div>Введите сумму пополнения</div>
                        <div className='inputPayBankBlock'>
                            <input type='text' ref={(input) => {this.refNum = input}} className='inputPayBank'></input>
                            <button onClick={this.clickNext.bind(this)} id='buttonPayBank'>OK</button>
                        </div>
                        <div style={{fontWeight: 'bold'}}>Текущий баланс: <span style={{color: '#00932B', fontSize: '20px'}}>${this.props.money.toLocaleString('ru-RU')}</span></div>
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
                <div className='pageBank'>
                    <div className='titlePageBank'>У Вас нет телефона</div>
                    <div className='blockPayBank'>
                        <div style={{width: '100%', textAlign: 'center'}}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="57.685" height="99.3" viewBox="0 0 57.685 99.3">
                                <path id="Path_103" data-name="Path 103" d="M58.312,0H14.041A6.726,6.726,0,0,0,7.334,6.707V92.59a6.728,6.728,0,0,0,6.707,6.71H58.312a6.724,6.724,0,0,0,6.707-6.707V6.707A6.726,6.726,0,0,0,58.312,0ZM29.095,4.834H43.258a.813.813,0,0,1,0,1.626H29.095a.813.813,0,0,1,0-1.626Zm7.082,91.112A3.355,3.355,0,1,1,39.53,92.59,3.353,3.353,0,0,1,36.176,95.947Zm24.175-9.059H12V10.636H60.352Z" transform="translate(-7.334)"/>
                            </svg>
                        </div>
                        <div style={{marginTop: '30px'}}>
                            <button onClick={this.back.bind(this)} id='buttonBackBank'>Назад</button>
                        </div>
                    </div>
                </div>
            )
        }
    }
}