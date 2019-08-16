import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {sortOrdersByDistance, takeOrderTaxiDriver} from "../../../actions/action.taxi.driver";

class OrderList extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentWillMount() {
        const { taxi, sortOrders } = this.props;

        taxi.orders && sortOrders()
    }

    componentDidUpdate() {
        const { taxi, sortOrders } = this.props;

        taxi.orders && !taxi.isSorted && sortOrders()
    }

    takeOrderInWork(id) {
        this.props.takeOrder(id);

        // eslint-disable-next-line no-undef
        mp.trigger('taxi.driver.app.order.take', id);
    }

    render() {
        const { taxi } = this.props;

        return (
            <Fragment>
                <div style={{ marginLeft: '5%', fontSize: '120%', marginTop: '5%' }}>Заказов: { taxi.orders.length }</div>
                <div className='order_list_taxi-phone-react'>
                    { taxi.orders.map((order, index) => (
                        <div key={index} onClick={() => this.takeOrderInWork(order.id)} className='order_taxi-phone-react' style={{ marginTop: index === 0 && '0' }}>
                            <span style={{ fontSize: '1.2em' }}>Принять</span>
                            <span style={{ fontSize: '.9em', float: 'right', marginTop: '2%', marginRight: '2%' }}>до клиента { order.distance } км</span>
                        </div>
                    )) }
                </div>
            </Fragment>
        );
    }
}

const mapStateToProps = state => ({
    taxi: state.taxiDriver
});

const mapDispatchToProps = dispatch => ({
    takeOrder: orderId => dispatch(takeOrderTaxiDriver(orderId)),
    sortOrders: () => dispatch(sortOrdersByDistance())
});

export default connect(mapStateToProps, mapDispatchToProps)(OrderList);