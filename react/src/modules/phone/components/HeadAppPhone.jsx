import React, {Component, Fragment} from 'react';
import { connect } from 'react-redux';

import { closeAppDisplay } from "../actions/action.apps";

class HeadAppPhone extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {

        const { closeApp, appName } = this.props;

        return (
            <Fragment>
                <div className="head_app-phone-react">
                    <span style={{ float: 'left', margin: '5% 0 0 10%' }}
                          onClick={() => closeApp()}>
                        {'< '}Назад
                    </span>
                    <span style={{ float: 'right', margin: '5% 10% 0 0' }}>{ this.props.title }</span>
                </div>
            </Fragment>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    closeApp: () => dispatch(closeAppDisplay())
});

export default connect(null, mapDispatchToProps)(HeadAppPhone);