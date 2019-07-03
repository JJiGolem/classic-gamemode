import React from 'react';
import Menu from './Menu.jsx';
import Loader from '../LoaderBank.jsx';
import { money, account } from '../../source/bank.js';

export default class PayTransfer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: undefined
        }
    }

    clickNext(event) {
        const { bank } = this.props;
        event.preventDefault();
        let num = this.refNum.value;
        let sum = this.refSum.value;
        let reg = /[\d]/;
        if(sum) {
            if(num) {
                let h = true;
                for(let i = 0; i < sum.length; i++) {
                    if(!reg.test(sum[i])) {
                        h = false;
                    }
                }
                if(h) {
                    let g = true;
                    for(let i = 0; i < num.length; i++) {
                        if(!reg.test(num[i])) {
                            g = false;
                        }
                    }
                    if(g) {
                        sum = Number(sum);
                        num = Number(num);
                        if(sum <= bank.money && sum != 0) {
                            money[0] = sum;
                            account[0] = num;
                            this.props.addForm(<Loader position='42% 35%' size='small' />);
                            mp.trigger('transferBankAsk.client', num)
                            this.refSum.value = ''
                            this.refNum.value = ''
                            this.setState({error: ''});
                        } else {
                            this.setState({error: 'Недостаточно денег на счете'});
                            this.refSum.style.borderColor = 'red'
                            return;
                        }
                    } else {
                        this.setState({error: 'Некорректное значение'});
                        this.refNum.style.borderColor = 'red'
                        return;
                    }
                } else {
                    this.setState({error: 'Некорректное значение'});
                    this.refSum.style.borderColor = 'red'
                    return;
                }
            } else {
                this.setState({error: 'Поле не заполнено'});
                this.refNum.style.borderColor = 'red'
                return;
            }
        } else {
            this.setState({error: 'Поле не заполнено'});
            this.refSum.style.borderColor = 'red'
            return;
        }
    }

    back(event) {
        event.preventDefault();
        this.props.setPage(<Menu />)
    }

    focusInput(event) {
        event.target.style.borderRight = '1.5px solid #3d3d3d'
    }

    render() {
        return (
            <div className='pageBank'>
                <div className='titlePageBank'>Переводы на другие счета</div>
                <div className='blockPayBank' style={{marginTop: '20px'}}>
                    <div>Номер счета</div>
                    <div className='inputPayBankBlock'>
                        <input 
                            type='text' 
                            ref={(input) => {this.refNum = input}} 
                            className='inputTransferBank'
                        >
                        </input>
                    </div>
                    <div>Сумма перевода</div>
                    <div className='inputPayBankBlock'>
                        <input 
                            type='text' 
                            ref={(input) => {this.refSum = input}} 
                            className='inputTransferBank'>
                        </input>
                    </div>
                    <div>
                        <button onClick={this.clickNext.bind(this)} id='buttonBackBank' style={{background: '#00932B', color: 'white'}}>Перевести</button>
                        <button onClick={this.back.bind(this)} id='buttonBackBank'>Назад</button>
                    </div>
                    <div style={{width: '100%', textAlign: 'center', color: 'red', marginTop: '10px'}}>
                        {this.state.error}
                    </div>
                </div>
            </div>
        )
    }
}