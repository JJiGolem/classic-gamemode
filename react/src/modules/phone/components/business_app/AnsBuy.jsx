import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {addAppDisplay, closeAppDisplay} from "../../actions/action.apps";
import Success from "./SuccessBuy";
import Error from "./Error";
import Header from './Header';

class AnsBuy extends Component {
    constructor(props) {
        super(props);
        this.state = {};

        this.getAnsPage = this.getAnsPage.bind(this);
    }

    getAnsPage(status) {
        const { addApp, closeApp } = this.props;

        if (status == 0) {
            closeApp();
            addApp({ name: 'Error', form: <Error status='Ошибка'/> });
        }
        else if (status == 1) {
            closeApp();
            addApp({ name: 'SuccessBuy', form: <Success type={this.props.type}/> });
        }
        else if (status == 2) {
            closeApp();
            addApp({ name: 'Error', form: <Error status='У вас недостаточно денег'/> });
        }
    }

    render() {
        const { info, business } = this.props;

        return (
            <div className='back_page-phone-react'>
                <Header business={business}/>
                {
                    info.biz[0].buyStatus != null
                    ? <Fragment>{this.getAnsPage(info.biz[0].buyStatus)}</Fragment>
                    :  <div className="loader01" style={{ margin: '10% 5%' }}></div>
                }
            </div>
        );
    }
}

const mapStateToProps = state => ({
    info: state.info,
    business: state.info.biz[0]
});

const mapDispatchToProps = dispatch => ({
    addApp: app => dispatch(addAppDisplay(app)),
    closeApp: () => dispatch(closeAppDisplay()),
});

export default connect(mapStateToProps, mapDispatchToProps)(AnsBuy);