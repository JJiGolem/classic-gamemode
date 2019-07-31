import React, {Component, Fragment} from 'react';
import { connect } from 'react-redux';

import Chat from './modules/chat';
import Phone from "./modules/phone";
import House from './modules/house';
import Business from "./modules/business";
import Bank from './modules/bank';
import EnterMenu from "./modules/house/components/EnterMenu";

class MainContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { forms, enterMenu } = this.props;

        return (
            <Fragment>
                <Chat />
                { <div style={{ display: !forms.phone && 'none'}}><Phone /></div>}
                { (forms.house) && <House /> }
                { enterMenu.isShow && <EnterMenu /> }
                { forms.business && <Business /> }
                { forms.bank && <Bank /> }
            </Fragment>
        );
    }
}

const mapStateToProps = state => ({
    forms: state.forms,
    enterMenu: state.enterMenu
});

export default connect(mapStateToProps, null)(MainContainer);