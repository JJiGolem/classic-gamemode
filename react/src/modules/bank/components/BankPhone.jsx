import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {closeBankPage} from "../actions/action.bankPages";
import {pushPhoneBank} from "../actions/action.bank";

class BankPhone extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pushPhoneMoney: '',
            error: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.pushPhoneMoney = this.pushPhoneMoney.bind(this);
    }

    handleChange(e) {
        this.setState({ pushPhoneMoney: e.target.value });
    }

    validateForm() {
        const { pushPhoneMoney } = this.state;
        const { bank } = this.props;

        if (pushPhoneMoney) {
            if (!isNaN(pushPhoneMoney) && parseInt(pushPhoneMoney) > 0) {
                if (bank.money >= parseInt(pushPhoneMoney)) {
                    this.setState({ error: '' });
                    return true;
                } else {
                    this.setState({ error: 'Недостаточно денег на счете' });
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

    pushPhoneMoney() {
        const { pushPhoneMoney } = this.state;
        const { pushPhoneBank, closePage } = this.props;

        if (this.validateForm()) {
            pushPhoneBank(parseInt(pushPhoneMoney));
            this.setState({ pushPhoneMoney: '' })
            //closePage();
        }
    }

    render() {
        const { closePage, bank } = this.props;
        const { pushPhoneMoney, error } = this.state;

        return (
            <Fragment>
                <div className='page_title-bank-react'>
                    Ппоплонение счета телефона
                </div>

                <div className='push_block-bank-react'>
                    <div>Введите сумму пополнения</div>
                    <div>
                        <input
                            className='input-bank-react'
                            value={pushPhoneMoney}
                            style={{ borderColor: error && 'red' }}
                            onChange={this.handleChange}
                        />
                        <div className='button_input-bank-react' onClick={this.pushPhoneMoney}>OK</div>
                    </div>

                    <div style={{ fontSize: '130%' }}>Текущий баланс:
                        <span style={{ color: 'green', marginLeft: '2%' }}>${ bank.phoneMoney }</span>
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
    pushPhoneBank: money => dispatch(pushPhoneBank(money))
});

export default connect(mapStateToProps, mapDispatchToProps)(BankPhone);