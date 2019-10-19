import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {cancelOrderTaxiDriver, setDestinationTaxiDriver} from "../../../actions/action.taxi.driver";

class ActiveOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    // componentDidMount() {
    //     setTimeout(() => {
    //         this.props.setDestination('Бертон', 'Карсон-Авеню', 16)
    //     }, 3000)
    // }

    cancelOrder() {
        const { taxi, cancelOrderTaxi } = this.props;

        cancelOrderTaxi(taxi.activeOrder.id);

        // eslint-disable-next-line no-undef
        mp.trigger('taxi.driver.app.order.cancel', taxi.activeOrder.id);
    }

    getWayPage() {
        const { taxi } = this.props;

        return (
            <Fragment>
                <div style={{ fontSize: '220%', textAlign: 'center', marginTop: '15%' }}>В пути</div>
                <div style={{ fontSize: '110%', textAlign: 'center', marginTop: '5%' }}>Стоимость поездки</div>
                <div style={{ fontSize: '130%', textAlign: 'center' }}>{taxi.activeOrder.price}$</div>

                <div style={{ fontSize: '140%', textAlign: 'center', marginTop: '5%' }}>{taxi.activeOrder.street}</div>
                <div style={{ fontSize: '120%', textAlign: 'center' }}>{taxi.activeOrder.area}</div>

                <div
                    className='search_button_taxi-phone-react'
                    onClick={this.cancelOrder.bind(this)}
                    style={{ color: 'red', bottom: '25%' }}
                >
                    Отменить заказ
                </div>
            </Fragment>
        )
    }

    getDefaultPage() {
        const { taxi } = this.props;

        return (
            <Fragment>
                <div style={{ fontSize: '200%', textAlign: 'center', marginTop: '25%' }}>Заказ #{taxi.activeOrder.id}</div>

                <div className='pointer_taxi-phone-react' style={{ width: '20%', height: '20%', marginLeft: '40%' }}>
                    <svg width="100%" height="100%" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M26.6741 27.2378C26.3258 27.1953 26.0116 27.4449 25.9711 27.7926C25.9306 28.1403 26.1788 28.455 26.5259 28.4956C33.186 29.2796 36.7333 31.3924 36.7333 32.6167C36.7333 34.3355 29.9871 36.7333 19 36.7333C8.01293 36.7333 1.26667 34.3355 1.26667 32.6167C1.26667 31.3924 4.81397 29.2796 11.4741 28.4956C11.8212 28.455 12.0694 28.1396 12.0289 27.7926C11.9877 27.4449 11.6736 27.1941 11.3259 27.2378C4.65753 28.0231 0 30.2347 0 32.6167C0 35.2919 6.5265 38 19 38C31.4735 38 38 35.2919 38 32.6167C38 30.2347 33.3425 28.0231 26.6741 27.2378Z" fill="#FBD825"/>
                        <path d="M19.112 34.6794L28.828 20.6467C32.4722 15.7884 31.9452 7.80267 27.7 3.55807C25.4061 1.2635 22.3559 0 19.112 0C15.8681 0 12.8179 1.2635 10.524 3.55743C6.27878 7.80203 5.75184 15.7877 9.38148 20.627L19.112 34.6794ZM19.2241 7.6C21.6688 7.6 23.6574 9.5893 23.6574 12.0333C23.6574 14.4774 21.6688 16.4667 19.2241 16.4667C16.7794 16.4667 14.7908 14.4774 14.7908 12.0333C14.7908 9.5893 16.7794 7.6 19.2241 7.6Z" fill="#FBD825"/>
                    </svg>
                </div>

                <div style={{ fontSize: '110%', textAlign: 'center' }}>Точка отмечена на карте</div>

                <div
                    className='search_button_taxi-phone-react'
                    onClick={this.cancelOrder.bind(this)}
                    style={{ color: 'red', bottom: '25%' }}
                >
                    Отменить заказ
                </div>
            </Fragment>
        )
    }

    render() {
        const { taxi } = this.props;

        return (
            <Fragment>
                { taxi.activeOrder.isWay ? this.getWayPage() : this.getDefaultPage() }
            </Fragment>
        );
    }
}

const mapStateToProps = state => ({
    taxi: state.taxiDriver
});

const mapDispatchToProps = dispatch => ({
    cancelOrderTaxi: orderId => dispatch(cancelOrderTaxiDriver(orderId)),
    setDestination: (area, street, price) => dispatch(setDestinationTaxiDriver(area, street, price)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ActiveOrder);