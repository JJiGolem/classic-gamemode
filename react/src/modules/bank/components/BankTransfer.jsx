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

    validateUser() {
        const { user } = this.state;

        if (!user) return this.setState({ errorUser: 'Номер счета не заполнен' });
        if (isNaN(user) || parseInt(user) < 0) return this.setState({ errorUser: 'Некорректный номер счета' });

        this.setState({ errorUser: '' });
        return true;
    }

    validateMoney() {
        const { transferMoney } = this.state;
        const { bank } = this.props;

        if (!transferMoney) return this.setState({ errorMoney: 'Сумма перевода не заполнена'});
        if (isNaN(transferMoney) || parseInt(transferMoney) < 0) return this.setState({ errorMoney: 'Некорректная сумма перевода' });
        if (parseInt(transferMoney) > bank.money) return this.setState({ errorMoney: 'Недостаточно средств на счете'});
        if (parseInt(transferMoney) >= 200000) return this.setState({ errorMoney: 'Сумма перевода не должна превышать $200 000'});

        this.setState({ errorMoney: '' });
        return true;
    }

    transferMoney() {
        const { transferMoney, user } = this.state;
        const { setLoading, addPage } = this.props;

        if (this.validateUser() && this.validateMoney()) {
            addPage(<BankConfirmTransfer money={transferMoney} number={user}/>);
            setLoading(true);

            mp.trigger('bank.transfer.ask', parseInt(user), parseInt(transferMoney));

            // setTimeout(() => {
            //     this.props.setAskAnswer('Dun Hill');
            // }, 2000)
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
    setAskAnswer: nick => dispatch(setAskAnswerBank(nick))
});

export default connect(mapStateToProps, mapDispatchToProps)(BankTransfer);