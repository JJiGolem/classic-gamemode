/* eslint-disable no-undef */
import React, {Component, Fragment} from 'react';
import { closeAppDisplay } from "../actions/action.apps";
import {connect} from "react-redux";

import HeadAppPhone from "./HeadAppPhone";
import warning from '../../../imgs/phone/warning.svg';

class EmergencyCall extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { closeApp } = this.props;

        return (
            <Fragment>
                <div className="back_page-phone-react">
                    <HeadAppPhone title='Экстренный вызов' />

                    <div style={{ textAlign: 'center', marginTop: '40%' }}>
                        <img style={{ width: '40%' }} src={warning} />
                        <div style={{ marginTop: '10%' }}>Выберите службу для вызова из списка</div>
                    </div>

                    <div className='house_buttons-phone-react' style={{ bottom: '4%', position: 'absolute' }}>
                        <div className='house_button-phone-react' onClick={() => {
                            mp.trigger('phone');
                            closeApp();
                        }}>
                            <div>PD</div>
                        </div>
                        <div className='house_button-phone-react' onClick={() => {
                            mp.trigger('phone');
                            closeApp();
                        }}>
                            <div>EMS</div>
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }
}

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
    closeApp: () => dispatch(closeAppDisplay())
});

export default connect(mapStateToProps, mapDispatchToProps)(EmergencyCall);