/* eslint-disable no-undef */
import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {closeBankPage} from "../actions/action.bankPages";
import {pushBank, setAnswerBank, setArgsBank, setFuncBank, setLoadingBank} from "../actions/action.bank";

class BankPush extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pushMoney: '',
            error: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.pushMoney = this.pushMoney.bind(this);
    }

    handleChange(e) {
        this.setState({ pushMoney: e.target.value });
    }

    validateForm() {
        const { pushMoney } = this.state;
        const { bank } = this.props;

        if (pushMoney) {
            if (!isNaN(pushMoney) && parseInt(pushMoney) > 0) {
                if (bank.cash >= parseInt(pushMoney)) {
                    this.setState({ error: '' });
                    return true;
                } else {
                    this.setState({ error: 'Недостаточно наличных' });
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

    pushMoney() {
        const { pushMoney } = this.state;
        const { setArgs, setAnswer, setLoading } = this.props;

        if (this.validateForm()) {
            setLoading(true);
            setArgs({ money: parseInt(pushMoney) });
            mp.trigger('bank.push', parseInt(pushMoney));
        }
    }

    render() {
        const { closePage } = this.props;
        const { pushMoney, error } = this.state;

        return (
            <Fragment>
                <div className='page_title-bank-react'>
                    Пополнение банковского счета
                </div>

                <div className='push_block-bank-react' style={{ marginTop: '10%' }}>
                    <div>Введите сумму пополнения</div>
                    <div>
                        <input
                            className='input-bank-react'
                            value={pushMoney}
                            style={{ borderColor: error && 'red' }}
                            onChange={this.handleChange}
                        />
                        <input className='button_input-bank-react' value='ОК' onClick={this.pushMoney} type='submit'/>
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
    pushBank: money => dispatch(pushBank(money)),
    setLoading: flag => dispatch(setLoadingBank(flag)),
    setAnswer: answer => dispatch(setAnswerBank(answer)),
    setArgs: args => dispatch(setArgsBank(args))
});

export default connect(mapStateToProps, mapDispatchToProps)(BankPush);