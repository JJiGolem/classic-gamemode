/* eslint-disable no-undef */
import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {addBankPage, closeBankPage} from "../actions/action.bankPages";
import {setAskAnswerBank, setLoadingBank, transferBank} from "../actions/action.bank";
import BankConfirmTransfer from "./BankConfirmTransfer";

const inputStyle = {
    border: '1px solid #838383',
    borderRadius: '5px'
};

class BankTransfer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            transferMoney: '',
            user: '',
            errorMoney: '',
            errorUser: ''
        };

        this.handleChangeInput = this.handleChangeInput.bind(this);
        this.transferMoney = this.transferMoney.bind(this);
    }

    handleChangeInput(e) {
        this.setState({ [e.target.id]: e.target.value });
    }

    validateForm() {
        const { user, transferMoney } = this.state;
        const { bank } = this.props;

        if (user) {
            this.setState({ errorUser: '' });

            if (transferMoney) {
                this.setState({ errorMoney: '' });

                if (!isNaN(user) && parseInt(user) > 0) {
                    this.setState({ errorUser: '' });

                    if (!isNaN(transferMoney) && parseInt(transferMoney) > 0) {
                        this.setState({ errorMoney: '' });

                        if (parseInt(transferMoney) <= bank.money) {
                            this.setState({ errorUser: '', errorMoney: '' });
                            return true;
                        } else {
                            this.setState({ errorMoney: 'Недостаточно средств на счете' });
                            return false;
                        }
                    } else {
                        this.setState({ errorMoney: 'Некорректная сумма перевода' });
                        return false;
                    }
                } else {
                    this.setState({ errorUser: 'Некорректный номер счета' });
                    return false;
                }
            } else {
                this.setState({ errorMoney: 'Сумма перевода не заполнена' });
                return false;
            }
        } else {
            this.setState({ errorUser: 'Номер счета не заполнен' });
            return false;
        }
    }

    transferMoney() {
        const { transferMoney, user } = this.state;
        const { setLoading, addPage } = this.props;

        if (this.validateForm()) {
            addPage(<BankConfirmTransfer money={transferMoney} number={user}/>);
            setLoading(true);

            mp.trigger('bank.transfer.ask', parseInt(user), parseInt(transferMoney));

            // setTimeout(() => {
            //     this.props.setAskAnswer({ nick: 'Dun Hill', number: 2662, money: 2600 });
            // }, 1000)
        }
    }

    render() {
        const { closePage, bank } = this.props;
        const { errorMoney, errorUser, transferMoney, user } = this.state;

        return (
            <Fragment>
                <div className='page_title-bank-react'>
                    Переводы на другие счета
                </div>

                <div className='push_block-bank-react'>
                    <div className='input_label-bank-react'>Номер счета</div>
                    <input
                        className='input-bank-react'
                        style={Object.assign({}, inputStyle, { borderColor: errorUser ? 'red' : '#838383' })}
                        id='user'
                        onChange={this.handleChangeInput}
                        value={user}
                    />

                    <div className='input_label-bank-react'>Сумма перевода</div>
                    <input
                        id='transferMoney'
                        className='input-bank-react'
                        style={Object.assign({}, inputStyle, { borderColor: errorMoney ? 'red' : '#838383' })}
                        onChange={this.handleChangeInput}
                        value={transferMoney}
                    />

                    <div className='buttons_panel-bank-react'>
                        <button className='button_panel-bank-react' onClick={closePage}>
                            Отмена
                        </button>
                        <button className='button_panel-bank-react' onClick={this.transferMoney}>
                            Перевести
                        </button>
                    </div>

                    <div style={{ color: 'red', fontSize: '90%', marginTop: '5%' }}>{ errorMoney || errorUser }</div>
                </div>
            </Fragment>
        );
    }
}

const mapStateToProps = state => ({
    bank: state.bank
});

const mapDispatchToProps = dispatch => ({
    transferBank: money => dispatch(transferBank(money)),
    closePage: () => dispatch(closeBankPage()),
    addPage: page => dispatch(addBankPage(page)),
    setLoading: flag => dispatch(setLoadingBank(flag)),
    setAskAnswer: askAnswer => dispatch(setAskAnswerBank(askAnswer))
});

export default connect(mapStateToProps, mapDispatchToProps)(BankTransfer);