import React, {Component, Fragment} from 'react';
import { connect } from 'react-redux';

import '../styles/phone.css';
import MainDisplay from "./MainDisplay";
import {addAppDisplay, setAppDisplay} from '../actions/action.apps';
import IncomingCall from './IncomingCall';
import ActiveCall from './ActiveCall';
import { setIncomingCall } from '../actions/action.info';

class Phone extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        // setTimeout(() => {
        //     this.props.setIncomingCall(true, 88988);
        // }, 1000);
    }

    render() {
        const { apps, setApp, info } = this.props;

        return (
            <Fragment>
                <div id="phone-form-react">
                    <img id="phone-background-react" src={require('../../../imgs/phone/new-back.png')}/>

                    <div className="display-phone-react">
                        { apps.map((app, index) => <Fragment key={index}>{ app.form }</Fragment>) }
                        { info.incomingCall && info.incomingCall.state && <IncomingCall number={info.incomingCall.number} /> }
                        { info.activeCall && info.activeCall.state && <ActiveCall number={info.activeCall.number} isMine={info.activeCall.isMine}/> }
                    </div>

                    <div className="panel_home-phone-react">
                        <button tabIndex='-1' id="but_home-phone-react"
                                onClick={() => setApp({name: 'MainDisplay', form: <MainDisplay/>})}
                                disabled={info.isDisabled || info.isCall}
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
    setApp: app => dispatch(setAppDisplay(app)),
    setIncomingCall: (state, number) => dispatch(setIncomingCall(state, number))
});

export default connect(mapStateToProps, mapDispatchToProps)(Phone);