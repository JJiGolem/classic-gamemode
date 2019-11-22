/* eslint-disable no-undef */
/* eslint-disable default-case */
import React, {Component, Fragment} from 'react';
import { connect } from 'react-redux';

import Chat from './modules/chat';
import Phone from "./modules/phone";
import House from './modules/house';
import Business from "./modules/business";
import Bank from './modules/bank';
import EnterMenu from "./modules/house/components/EnterMenu";
import Players from './modules/players';
import ErrorBoundary from './Error';

class MainContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { forms, enterMenu, info } = this.props;

        return (
            <Fragment>
                <ErrorBoundary><Chat /></ErrorBoundary>
                { info.isLoad && <ErrorBoundary><div><Phone /></div></ErrorBoundary> }
                { forms.house && <ErrorBoundary><House /></ErrorBoundary> }
                { enterMenu.isShow && <ErrorBoundary><EnterMenu /></ErrorBoundary> }
                { forms.business && <ErrorBoundary><Business /> </ErrorBoundary>}
                { forms.bank && <ErrorBoundary><Bank /></ErrorBoundary> }
                { forms.players && <ErrorBoundary><Players /> </ErrorBoundary>}
            </Fragment>
        );
    }
}

const mapStateToProps = state => ({
    forms: state.forms,
    enterMenu: state.enterMenu,
    info: state.info
});

export default connect(mapStateToProps, null)(MainContainer);