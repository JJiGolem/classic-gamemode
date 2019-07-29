import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';

import '../styles/bank.css';
import {loadBankInfo} from "../actions/action.bank";

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentWillMount() {
        const { loadInfo, info } = this.props;
        //loadInfo({cash: 100});
    }

    getLoader() {
        return (
            <div className='block_loader-house-react'>
                <div className='loader-house' style={{ borderColor: 'green' }}></div>
            </div>
        )
    }

    getForm() {
        return (
            <Fragment>
                { this.getInfoPanel() }
                <div></div>
            </Fragment>
        )
    }

    render() {
        const { bank } = this.props;

        return (
            <div className='main-form-bank'>
                { bank ? this.getForm() : this.getLoader() }
            </div>
        );
    }
}

const mapStateToProps = state => ({
    bank: state.bank
});

const mapDispatchToProps = dispatch => ({
    loadInfo: info => dispatch(loadBankInfo(info))
});

export default connect(mapStateToProps, mapDispatchToProps)(Main);