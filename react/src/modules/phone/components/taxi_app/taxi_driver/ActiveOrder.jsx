import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {cancelOrderTaxiDriver} from "../../../actions/action.taxi.driver";

class ActiveOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    cancelOrder() {
        const { taxi, cancelOrderTaxi } = this.props;

        cancelOrderTaxi(taxi.activeOrder.id);

        // eslint-disable-next-line no-undef
        mp.trigger('taxi.driver.app.order.cancel', taxi.activeOrder.id);
    }

    render() {
        const { taxi } = this.props;

        return (
            <Fragment>
                <div style={{ fontSize: '200%', textAlign: 'center' }}>Заказ #{taxi.activeOrder.id}</div>
                <div
                    className='search_button_taxi-phone-react'
                    onClick={this.cancelOrder.bind(this)}
                    style={{ color: 'red' }}
                >
                    Отменить заказ
                </div>
            </Fragment>
        );
    }
}

const mapStateToProps = state => ({
    taxi: state.taxiDriver
});

const mapDispatchToProps = dispatch => ({
    cancelOrderTaxi: orderId => dispatch(cancelOrderTaxiDriver(orderId))
});

export default connect(mapStateToProps, mapDispatchToProps)(ActiveOrder);