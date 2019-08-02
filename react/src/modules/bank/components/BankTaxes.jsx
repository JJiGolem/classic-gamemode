import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';

class BankTaxes extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <Fragment></Fragment>
        );
    }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(BankTaxes);