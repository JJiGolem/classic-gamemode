import React, {Component, Fragment} from 'react';
import { connect } from 'react-redux';

import '../styles/phone.css';
import MainDisplay from "./MainDisplay";
import {addAppDisplay, setAppDisplay} from '../actions/action.apps';

class Phone extends Component {
    constructor(props) {
        super(props);
        this.state = {};

        this.disabledHome = this.disabledHome.bind(this);
    }

    disabledHome() {
        const { info } = this.props;

        if (info.isCall) {
            return true;
        }

        if (info.houses.length > 0) {
            if (info.houses.some(house => house.isSell === true)) {
                return true;
            }
        }

        if (info.biz.length > 0) {
            if (info.biz.some(biz => biz.isSell === true)) {
                return true;
            }
        }

        return false;
    }

    render() {

        const { apps, setApp, info } = this.props;

        return (
            <Fragment>
                <div id="phone-form-react">
                    <img id="phone-background-react" src={require('../../../imgs/phone/new-back.png')}/>

                    <div className="display-phone-react">
                        { apps.map(app => app.form) }
                    </div>

                    <div className="panel_home-phone-react">
                        <button id="but_home-phone-react"
                                onClick={() => setApp({name: 'MainDisplay', form: <MainDisplay/>})}
                                disabled={info.isCall || (info.houses.length > 0 && info.houses.some(h => h.isSell))}
                        >
                        </button>
                    </div>
                </div>
            </Fragment>
        );
    }
}

const mapStateToProps = state => ({
    apps: state.apps,
    info: state.info
});

const mapDispatchToProps = dispatch => ({
    setApp: app => dispatch(setAppDisplay(app))
});

export default connect(mapStateToProps, mapDispatchToProps)(Phone);