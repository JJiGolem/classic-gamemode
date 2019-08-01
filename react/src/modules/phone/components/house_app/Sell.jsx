import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {addAppDisplay, closeAppDisplay, setAppDisplay} from "../../actions/action.apps";
import {setSell, setSellInfo, setSellStatus} from "../../actions/action.info";
import ConfirmSell from "./ConfirmSell";

class Sell extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: '',
            sellPrice: '',
            errorUser: '',
            errorPrice: ''
        };

        this.getContent = this.getContent.bind(this);
        this.handleChangeInput = this.handleChangeInput.bind(this);
        this.sellHouse = this.sellHouse.bind(this);
    }

    handleChangeInput(e) {
        this.setState({ [e.target.id]: e.target.value })
    }

    getLoader() {
        return (
            <div className="loader01" style={{ margin: '10% 5%' }}></div>
        )
    }

    sellHouse() {
        const { setSell, setSellStatus, setSellInfo, addApp, house } = this.props;
        const { userId, price } = this.state;

        if (this.validateForm()) {
            setSell(true);
            addApp({name: 'ConfirmSell', form: <ConfirmSell />});

            // eslint-disable-next-line no-undef
            mp.trigger('house.sell.check', house.name, userId, parseInt(price));

            // setTimeout(() => {
            //     setSellInfo({nick: 'Dunhill', price: this.state.sellPrice})
            // }, 1000)
        }
    }

    validateUser(user) {
        if (user) {
            this.setState({ errorUser: '' });
            return true;
        } else {
            this.setState({ errorUser: 'Поле не заполнено' });
            return false;
        }
    }

    validatePrice(price) {
        const { house } = this.props;

        if (price) {
            if (!isNaN(price)) {
                if (house.price <= price) {
                    this.setState({ errorPrice: '' });
                    return true;
                } else {
                    this.setState({ errorPrice: `Цена должна быть не ниже государственной ($${house.price})` });
                    return false;
                }
            } else {
                this.setState({ errorPrice: 'Неверный формат цены' });
                return false;
            }
        } else {
            this.setState({ errorPrice: 'Поле не заполнено' });
            return false;
        }
    }

    validateForm() {
        const { userId, sellPrice } = this.state;

        let h = true;

        if (!this.validateUser(userId)) {
            h = false;
        }

        if (!this.validatePrice(sellPrice)) {
            h = false;
        }

        return h;
    }

    getContent() {
        const { house, closeApp, addApp } = this.props;
        const { errorUser, errorPrice } = this.state;

        return (
            <Fragment>
                <div style={{ textAlign: 'center', marginTop: '26%' }}>Продажа на руки</div>
                <div className='block_sell_inputs-phone-react'>
                    <div className='block_sell-phone-react'>
                        <label>ID покупателя</label>
                        <input
                            id='userId'
                            className='input_sell-phone-react'
                            onChange={this.handleChangeInput}
                            value={this.state.userId}
                            style={{ borderColor: errorUser && '#f44343' }}
                        />
                        <span>{ errorUser }</span>
                    </div>
                    <div className='block_sell-phone-react'>
                        <label>Сумма сделки</label>
                        <input
                            id='sellPrice'
                            className='input_sell-phone-react'
                            onChange={this.handleChangeInput}
                            value={this.state.sellPrice}
                            style={{ borderColor: errorPrice && '#f44343' }}
                        />
                        <span>{ errorPrice }</span>
                    </div>
                </div>

                <div className='house_buttons-phone-react' style={{ bottom: '6%', position: 'absolute' }}>
                    <div className='house_button-phone-react' onClick={() => this.sellHouse()}>
                        <span className='ico_button_house-phone-react'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="80%" height="80%" viewBox="0 0 16.729 12.286" style={{marginLeft: '5px'}}>
                                <path id="Path_176" data-name="Path 176" d="M16.484,68.243a.836.836,0,0,0-1.183,0L5.28,78.264,1.427,74.412A.836.836,0,0,0,.245,75.595l4.444,4.444a.837.837,0,0,0,1.183,0L16.484,69.425A.836.836,0,0,0,16.484,68.243Z" transform="translate(0 -67.997)" fill="#74a607"/>
                            </svg>
                        </span>
                        Подтвердить
                    </div>
                    <div className='house_button-phone-react' onClick={() => closeApp()}>
                        <span className='ico_button_house-phone-react'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="80%" height="80%" viewBox="0 0 16.37 16.369" style={{marginTop: '5%'}}>
                                <path id="Path_172" data-name="Path 172" d="M9.632,8.186,16.07,1.748A1.024,1.024,0,1,0,14.622.3L8.185,6.738,1.747.3A1.024,1.024,0,1,0,.3,1.748L6.737,8.186.3,14.623A1.023,1.023,0,1,0,1.747,16.07L8.185,9.633l6.437,6.437a1.024,1.024,0,0,0,1.448-1.448Z" transform="translate(0 -0.001)" fill="#f90040"/>
                            </svg>
                        </span>
                        Отменить
                    </div>
                </div>
            </Fragment>
        )
    }

    getHeader(house) {
        return (
            <div className='head_app-phone-react' style={{ height: '15%', textAlign: 'center' }}>
                <div style={{ marginTop: '5%' }}>Дом { house.name }</div>
                <div style={{ color: '#e1c631' }}>{ house.area }</div>
            </div>
        )
    }

    render() {

        const { house } = this.props;

        return (
            <Fragment>
                <div className='back_page-phone-react'>
                    { this.getHeader(house) }
                    {
                        this.getContent(house)
                    }
                </div>
            </Fragment>
        );
    }
}

const mapStateToProps = state => ({
    info: state.info,
    house: state.info.houses[0]
});

const mapDispatchToProps = dispatch => ({
    closeApp: () => dispatch(closeAppDisplay()),
    addApp: app => dispatch(addAppDisplay(app)),
    setApp: app => dispatch(setAppDisplay(app)),
    setSell: flag => dispatch(setSell(flag)),
    setSellStatus: status => dispatch(setSellStatus(status)),
    setSellInfo: info => dispatch(setSellInfo(info)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Sell);