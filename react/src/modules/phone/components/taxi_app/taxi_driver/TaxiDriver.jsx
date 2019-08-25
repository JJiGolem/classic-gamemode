import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import Header from "./Header";
import {addOrderTaxiDriver, loadInfoTaxiDriver} from "../../../actions/action.taxi.driver";
import {closeAppDisplay} from "../../../actions/action.apps";
import ActiveOrder from "./ActiveOrder";
import OrderList from "./OrderList";

class TaxiDriver extends Component {
    constructor(props) {
        super(props);
        this.state = {};

        this.getForm = this.getForm.bind(this);
    }

    componentDidMount() {
        const { taxi } = this.props;

        // setTimeout(() => {
        //     this.props.loadInfo({
        //         name: 'Dun Hill',
        //         orders: [
        //             {
        //                 id: 0,
        //                 distance: 4.2
        //             },
        //             {
        //                 id: 1,
        //                 distance: 0.5
        //             },
        //         ]
        //     })
        // }, )
        // //
        // setTimeout(() => {
        //     this.props.addOrder({id: 4, distance: 3.1});
        // }, 2000)

        if (Object.keys(taxi).length === 0) {
            // eslint-disable-next-line no-undef
            mp.trigger('taxi.driver.app.open');
        }
    }

    getLoader() {
        return (
            <div className="loader01" style={{
                margin: '10% 5%',
                borderColor: '#FBD825',
                borderRightColor: 'transparent'
            }}
            >
            </div>
        )
    }

    getForm() {
        const { taxi } = this.props;

        return (
            <Fragment>
                <Header name={taxi.name} />
                { taxi.activeOrder != null ? <ActiveOrder /> : <OrderList /> }
            </Fragment>
        )
    }

    render() {
        const { taxi, closeApp } = this.props;

        return (
            <div className='back_page-phone-react'>
                <div className='back_taxi_img_driver-phone-react'></div>
                <div className='back_taxi_driver-phone-react'>
                    { Object.keys(taxi).length > 0 ? this.getForm() : this.getLoader() }
                    <div className='button_close_taxi-phone-react' onClick={() => closeApp()}>
                        Закрыть приложение
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    taxi: state.taxiDriver
});

const mapDispatchToProps = dispatch => ({
    loadInfo: info => dispatch(loadInfoTaxiDriver(info)),
    closeApp: () => dispatch(closeAppDisplay()),
    addOrder: order => dispatch(addOrderTaxiDriver(order))
});

export default connect(mapStateToProps, mapDispatchToProps)(TaxiDriver);