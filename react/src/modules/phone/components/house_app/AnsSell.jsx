import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {addAppDisplay, closeAppDisplay} from "../../actions/action.apps";
import Success from "./Success";
import Error from "./Error";

class AnsSell extends Component {
    constructor(props) {
        super(props);
        this.state = {};

        this.getAnsPage = this.getAnsPage.bind(this);
    }

    getAnsPage(status) {
        const { addApp, closeApp } = this.props;

        if (status == 0) {
            closeApp();
            closeApp();
            addApp({ name: 'Error', form: <Error status='Ошибка'/> });
        }
        else if (status == 1) {
            closeApp();
            closeApp();
            addApp({ name: 'Success', form: <Success /> });
        }
        else if (status == 2) {
            closeApp();
            closeApp();
            addApp({ name: 'Error', form: <Error status='Покупатель не принял условия сделки'/> });
        }

        else if (status == 3) {
            closeApp();
            closeApp();
            addApp({ name: 'Error', form: <Error status='Вы находитесь не рядом с домом'/> });
        }
    }

    render() {
        const { info } = this.props;

        return (
            <Fragment>
                {
                    info.houses[0].sellStatus != null
                    && <Fragment>{this.getAnsPage(info.houses[0].sellStatus)}</Fragment>
                }
            </Fragment>
        );
    }
}

const mapStateToProps = state => ({
    info: state.info
});

const mapDispatchToProps = dispatch => ({
    addApp: app => dispatch(addAppDisplay(app)),
    closeApp: () => dispatch(closeAppDisplay()),
});

export default connect(mapStateToProps, mapDispatchToProps)(AnsSell);