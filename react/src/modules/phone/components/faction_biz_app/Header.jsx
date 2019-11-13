import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { business } = this.props;

        return (
            <div className='head_app-phone-react' style={{ height: '15%', textAlign: 'center' }}>
                <div style={{ marginTop: '5%', fontSize: '1.3em' }}>{ business.name }</div>
                <div style={{ color: '#e1c631', fontSize: '.9em', marginTop: '1%' }}>{ business.area }</div>
            </div>
        );
    }
}

export default Header