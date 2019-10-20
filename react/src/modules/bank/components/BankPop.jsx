/* eslint-disable no-undef */
import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {closeBankPage} from "../actions/action.bankPages";
import {setArgsBank, setLoadingBank} from "../actions/action.bank";

class BankPop extends Component {
    constructor(props) {
        super(props);
        this.state = {
            popMoney: '',
            error: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.popMoney = this.popMoney.bind(this);
    }

    handleChange(e) {
        this.setState({ popMoney: e.target.value });
    }

    validateForm() {
        const { popMoney } = this.state;
        const { bank } = this.props;

        if (popMoney) {
            if (!isNaN(popMoney) && parseInt(popMoney) > 0) {
                if (bank.money >= parseInt(popMoney)) {
                    this.setState({ error: '' });
                    return true;
                } else {
                    this.setState({ error: 'Недостаточно средств на счете' });
                    return false;
                }
            } else {
                this.setState({ error: 'Некорректные данные' });
                return false;
            }
        } else {
            this.setState({ error: 'Поле не заполнено' });
            return false;
        }
    }

    popMoney() {
        const { popMoney } = this.state;
        const { setArgs, setLoading } = this.props;

        if (this.validateForm()) {
            setArgs({ money: parseInt(popMoney) });
            setLoading(true);
            mp.trigger('bank.pop', parseInt(popMoney));
        }
    }

    render() {
        const { closePage } = this.props;
        const { popMoney, error } = this.state;

        return (
            <Fragment>
                <div className='page_title-bank-react'>
                    Снятие средств со счета
                </div>

                <div className='push_block-bank-react' style={{ marginTop: '10%' }}>
                    <div>Введите сумму снятия</div>
                    <div>
                        <input
                            className='input-bank-react'
                            value={popMoney}
                            style={{ borderColor: error && 'red' }}
                            onChange={this.handleChange}
                        />
                        <input className='button_input-bank-react' value='ОК' onClick={this.popMoney} type='submit'/>
                        
                    </div>

                    <div className='buttons_panel-bank-react'>
                        <button className='button_panel-bank-react' onClick={closePage}>
                            Назад
                        </button>
                    </div>

                    <div style={{ color: 'red', marginTop: '5%' }}>{ error }</div>
                </div>
            </Fragment>
        );
    }
}

const mapStateToProps = state => ({
    bank: state.bank
});

const mapDispatchToProps = dispatch => ({
    closePage: () => dispatch(closeBankPage()),
    setArgs: args => dispatch(setArgsBank(args)),
    setLoading: flag => dispatch(setLoadingBank(flag)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BankPop);