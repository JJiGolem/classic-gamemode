import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {closeBankPage} from "../actions/action.bankPages";

class BankPush extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { closePage } = this.props;

        return (
            <Fragment>
                <div className='page_title-bank-react'>
                    Пополнение банковского счета
                </div>

                <div className='push_block-bank-react'>
                    <div>Введите сумму пополнения</div>
                    <div>
                        <input className='input-bank-react'/>
                        <div className='button_input-bank-react'>OK</div>
                    </div>

                    <div className='buttons_panel-bank-react'>
                        <button className='button_panel-bank-react' onClick={closePage}>
                            Назад
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

export default connect(mapStateToProps, mapDispatchToProps)(BankPush);