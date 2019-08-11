import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {addBankPage, closeBankPage} from "../actions/action.bankPages";
import BankError from "./BankError";
import BankSuccess from "./BankSuccess";

class AnsOperationBank extends Component {
    constructor(props) {
        super(props);
        this.state = {};

        this.getAnswer = this.getAnswer.bind(this);
    }

    getAnswer() {
        const { bank } = this.props;

        if (bank.answer == 0) {
            return <BankError />
        } else if (bank.answer == 1) {
            return <BankSuccess func={bank.func} args={bank.args}/>
        }
    }

    render() {
        const { bank } = this.props;

        return (
            <Fragment>
                {this.getAnswer() }
            </Fragment>
        );
    }
}

const mapStateToProps = state => ({
    bank: state.bank
});

const mapDispatchToProps = dispatch => ({
    closePage: () => dispatch(closeBankPage()),
    addPage: page => dispatch(addBankPage(page)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AnsOperationBank);