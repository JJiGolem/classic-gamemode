import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {addAppDisplay, closeAppDisplay} from "../../actions/action.apps";
import Success from "./Success";
import Error from "./Error";

class AnsOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {};

        this.getAnsPage = this.getAnsPage.bind(this);
    }

    getAnsPage(status) {
        const { addApp, closeApp, productsCount, productsPrice } = this.props;

        if (status === 0) {
            closeApp();
            addApp({ name: 'Error', form: <Error status='Ошибка'/> });
        }
        else if (status === 1) {
            closeApp();
            closeApp();
            addApp({ name: 'Success', form: <Success status='Заказ успешно сделан' productsCount={productsCount} productsPrice={productsPrice}/> });
        }
        else if (status === 2) {
            closeApp();
            addApp({ name: 'Error', form: <Error status='Недостаточно денег в кассе'/> });
        }

        else if (status === 3) {
            closeApp();
            addApp({ name: 'Error', form: <Error status='Недостаточно места на складе'/> });
        }
    }

    render() {
        const { info } = this.props;

        return (
            <div className='back_page-phone-react'>
                {
                    info.biz[0].orderStatus != null
                        ? <Fragment>{this.getAnsPage(info.biz[0].orderStatus)}</Fragment>
                        : <div className="loader01" style={{ margin: '10% 5%' }}></div>
                }
            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(AnsOrder);