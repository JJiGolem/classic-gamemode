import React, {Component, Fragment} from 'react';
import { connect } from 'react-redux';

import Chat from './modules/chat';
import Phone from "./modules/phone";
import House from './modules/house';

class MainContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { forms } = this.props;

        return (
            <Fragment>
                <Chat />
                { forms.phone && <Phone /> }
                { forms.house && <House /> }
            </Fragment>
        );
    }
}

const mapStateToProps = state => ({
    forms: state.forms
});

export default connect(mapStateToProps, null)(MainContainer);