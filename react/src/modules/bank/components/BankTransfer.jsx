import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {closeBankPage} from "../actions/action.bankPages";

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
    }

    render() {
        const { closePage } = this.props;

        return (
            <Fragment>
                <div className='page_title-bank-react'>
                    Переводы на другие счета
                </div>

                <div className='push_block-bank-react'>
                    <div className='input_label-bank-react'>Номер счета</div>
                    <input
                        className='input-bank-react'
                        style={inputStyle}
                    />

                    <div className='input_label-bank-react'>Сумма перевода</div>
                    <input
                        className='input-bank-react'
                        style={inputStyle}
                    />

                    <div className='buttons_panel-bank-react'>
                        <button className='button_panel-bank-react' onClick={closePage}>
                            Отмена
                        </button>
                        <button className='button_panel-bank-react' onClick={closePage}>
                            Перевести
                        </button>
                    </div>
                </div>
            </Fragment>
        );
    }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
    closePage: () => dispatch(closeBankPage())
});

export default connect(mapStateToProps, mapDispatchToProps)(BankTransfer);