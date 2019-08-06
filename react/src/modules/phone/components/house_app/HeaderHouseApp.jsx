import React, {Component, Fragment} from 'react';

class HeaderHouseApp extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { house } = this.props;

        return (
            <div className='head_app-phone-react' style={{ height: '15%', textAlign: 'center' }}>
                <div style={{ marginTop: '5%', fontSize: '1.3em' }}>Дом { house.name }</div>
                <div style={{ color: '#e1c631', fontSize: '.9em', marginTop: '1%' }}>{ house.area }</div>
            </div>
        );
    }
}

export default HeaderHouseApp;