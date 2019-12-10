/* eslint-disable no-undef */
import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {setArgsBank, setAskAnswerBank, setLoadingBank, setAnswerBank} from "../actions/action.bank";
import {closeBankPage} from "../actions/action.bankPages";

class BankConfirmTransfer extends Component {
    constructor(props) {
        super(props);
        this.state = {};

        this.transfer = this.transfer.bind(this);
    }

    back() {
        const { closePage, setAskAnswer } = this.props;

        setAskAnswer(null);
        closePage();
    }

    transfer() {
        const { setAnswer, setArgs, setLoading, bank } = this.props;

        setArgs({ money: this.props.money });
        setLoading(true);

        // setTimeout(() => {
        //     setAnswer({ answer: 1, type: 'transfer' })
        // }, 1000)

        mp.trigger('bank.transfer');
    }

    render() {
        const { bank } = this.props;

        return (
            bank.askAnswer ?
            <Fragment>
                <div className='page_title-bank-react'>
                    Подтверждение перевода
                </div>

                <div className='push_block-bank-react'>
                    <div style={{ textAlign: 'left', fontSize: '80%', marginLeft: '-8%' }}>Информация</div>
                    <div className='info_block_confirm-bank-react'>
                        <div>Получатель: { bank.askAnswer }</div>
                        <div>Номер счета: { this.props.number }</div>
                        <div>Сумма перевода: ${ this.props.money }</div>
                    </div>
                    <div className='buttons_panel-bank-react'>
                        <button className='button_panel-bank-react' onClick={this.back.bind(this)}>
                            Назад
                        </button>
                        <button className='button_panel-bank-react' onClick={this.transfer}>
                            Подтвердить
                        </button>
                    </div>
                </div>
            </Fragment>
            : <Fragment>
                <div className='page_title-bank-react'>
                    Подтверждение перевода
                </div>

                <div className='push_block-bank-react'>
                    <div style={{ textAlign: 'left', fontSize: '80%', marginLeft: '-8%' }}>Информация</div>
                    <div className='info_block_confirm-bank-react'>
                        <div>Получатель с таким номером счета не найден</div>
                    </div>
                    <div className='buttons_panel-bank-react'>
                        <button className='button_panel-bank-react' onClick={this.back.bind(this)}>
                            Назад
                        </button>
                    </div>
                </div>
            </Fragment>
        );
    }
}

const mapStateToProps = state => ({
    bank: state.bank
});

const mapDispatchToProps = dispatch => ({
    setAskAnswer: askAnswer => dispatch(setAskAnswerBank(askAnswer)),
    closePage: () => dispatch(closeBankPage()),
    setLoading: flag => dispatch(setLoadingBank(flag)),
    setArgs: args => dispatch(setArgsBank(args)),
    setAnswer: ans => dispatch(setAnswerBank(ans))
});

export default connect(mapStateToProps, mapDispatchToProps)(BankConfirmTransfer);