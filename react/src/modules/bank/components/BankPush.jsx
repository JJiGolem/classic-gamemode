import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {closeBankPage} from "../actions/action.bankPages";
import {pushBank} from "../actions/action.bank";

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
        const { pushBank, closePage } = this.props;

        if (this.validateForm()) {
            pushBank(parseInt(pushMoney));
            closePage();
        }
    }

    render() {
        const { closePage } = this.props;
        const { pushMoney, error } = this.state;

        return (
            <Fragment>
                <div className='page_title-bank-react'>
                    Ппоплонение банковского счета
                </div>

                <div className='push_block-bank-react'>
                    <div>Введите сумму пополнения</div>
                    <div>
                        <input
                            className='input-bank-react'
                            value={pushMoney}
                            style={{ borderColor: error && 'red' }}
                            onChange={this.handleChange}
                        />
                        <div className='button_input-bank-react' onClick={this.pushMoney}>OK</div>
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
    pushBank: money => dispatch(pushBank(money))
});

export default connect(mapStateToProps, mapDispatchToProps)(BankPush);