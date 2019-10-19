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
                    <div style={{ float: 'left', margin: '6% 0 0 10%', display: 'inline-block', width: '23%' }}
                          onClick={() => closeApp()}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="11%" height="6%" viewBox="0 0 18.812 35.125">
                            <path id="_6A" data-name="6A" d="M17.311,35.125a1.5,1.5,0,0,0,1.069-2.553L3.6,17.562,18.38,2.552a1.5,1.5,0,1,0-2.137-2.1L.431,16.51a1.5,1.5,0,0,0,0,2.1L16.243,34.677a1.5,1.5,0,0,0,1.068.448" transform="translate(0 0)" fill="#fff"/>
                        </svg>
                        Назад
                    </div>
                    <div style={{ float: 'right', margin: '6% 10% 0 0' }}>{ this.props.title }</div>
                </div>
            </Fragment>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    closeApp: () => dispatch(closeAppDisplay())
});

export default connect(null, mapDispatchToProps)(HeadAppPhone);