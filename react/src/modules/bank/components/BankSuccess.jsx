/* eslint-disable no-duplicate-case */
/* eslint-disable default-case */
import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {
    payBusinessBank,
    payHouseBank,
    popBank,
    pushBank,
    pushPhoneBank,
    setAnswerBank,
    transferBank,
    pushCashBoxBank,
    popCashBoxBank
} from "../actions/action.bank";
import { setBankPage } from '../actions/action.bankPages';
import BankMenu from './BankMenu';

class BankSuccess extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        const { bank, popBank, pushBank, transferBank, payHouse, payBusiness, pushPhoneBank, pushCashBoxBank, popCashBoxBank } = this.props;

        switch (bank.type) {
            case 'pop':
                popBank(bank.args.money);
                break;

            case 'push':
                pushBank(bank.args.money);
                break;

            case 'transfer':
                transferBank(bank.args.money);
                break;

            case 'phone':
                pushPhoneBank(bank.args.money);
                break;

            case 'house':
                payHouse(bank.args.name, bank.args.days, bank.args.money);
                break;

            case 'biz':
                payBusiness(bank.args.id, bank.args.days, bank.args.money);
                break;

            case 'cashbox_push':
                pushCashBoxBank(bank.args.id, bank.args.money);
                break;
                
            case 'cashbox_pop':
                popCashBoxBank(bank.args.id, bank.args.money);
                break;
        }
    }

    exit() {
        const { setAnswer, setPage } = this.props;

        setAnswer({ answer: null, type: null });
        setPage(<BankMenu />);
    }

    render() {
        return (
            <Fragment>
                <div className='answer_form-bank-react' onClick={this.exit.bind(this)}>
                    <div className='exitHouse' name='exit'></div>
                    <div className='answer_ico-bank-react'>
                        <svg id="Group_52" data-name="Group 52" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 129.122 129.122" fill='white'>
                            <path id="Path_97" data-name="Path 97" d="M64.561,0a64.561,64.561,0,1,0,64.561,64.561A64.634,64.634,0,0,0,64.561,0Zm0,124.156a59.595,59.595,0,1,1,59.595-59.595A59.664,59.664,0,0,1,64.561,124.156Z"/>
                            <path id="Path_98" data-name="Path 98" d="M77.187,15.835,39.024,58.768,16.033,40.376a2.483,2.483,0,0,0-3.1,3.879L37.763,64.119a2.485,2.485,0,0,0,3.409-.291l39.73-44.7a2.484,2.484,0,0,0-3.715-3.3Z" transform="translate(17.797 22.246)"/>
                        </svg>
                    </div>
                    <div className='answer_text-bank-react'>
                        Удачно <br/>
                        <span style={{ fontSize: '0.4em' }}>Операция прошла успешно</span>
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
    setAnswer: answer => dispatch(setAnswerBank(answer)),
    pushBank: money => dispatch(pushBank(money)),
    transferBank: money => dispatch(transferBank(money)),
    popBank: money => dispatch(popBank(money)),
    payHouse: (name, days, money) => dispatch(payHouseBank(name, days, money)),
    payBusiness: (name, days, money) => dispatch(payBusinessBank(name, days, money)),
    pushPhoneBank: money => dispatch(pushPhoneBank(money)),
    pushCashBoxBank: (id, money) => dispatch(pushCashBoxBank(id, money)),
    popCashBoxBank: (id, money) => dispatch(popCashBoxBank(id, money)),
    setPage: page => dispatch(setBankPage(page))
});

export default connect(mapStateToProps, mapDispatchToProps)(BankSuccess);