import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import Header from "./Header";
import {addAppDisplay, closeAppDisplay} from "../../actions/action.apps";
import AnsOrder from "./AnsOrder";
import {setOrderStatusBusiness} from "../../actions/action.info";
import Success from "./Success";

class CreateOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            productCount: '',
            productPrice: '',
            errorCount: '',
            errorPrice: ''
        };

        this.getContent = this.getContent.bind(this);
        this.handleChangeInput = this.handleChangeInput.bind(this);
        this.createOrder = this.createOrder.bind(this);
        this.validatePrice = this.validatePrice.bind(this);
    }

    validateCount(count) {
        if (count) {
            if (!isNaN(count)) {
                this.setState({ errorCount: '' });
                return true;
            } else {
                this.setState({ errorCount: 'Некорректное значение', productCount: '' });
                return false;
            }
        } else {
            this.setState({ errorCount: 'Поле не заполнено', productCount: '' });
            return false;
        }
    }

    validatePrice(price) {
        const { business } = this.props;

        if (price) {
            if (!isNaN(price) && parseFloat(price) <= business.resourcePriceMax && parseFloat(price) >= business.resourcePriceMin) {
                this.setState({ errorPrice: '' });
                return true;
            } else {
                this.setState({ errorPrice: 'Некорректное значение', productPrice: '' });
                return false;
            }
        } else {
            this.setState({ errorPrice: 'Поле не заполнено', productPrice: '' });
            return false;
        }
    }

    validateForm() {
        const { productCount, productPrice } = this.state;

        let h = true;

        if (!this.validateCount(productCount)) {
            h = false;
        }

        if (!this.validatePrice(productPrice)) {
            h = false;
        }

        return h;
    }

    handleChangeInput(e) {
        this.setState({ [e.target.id]: e.target.value });
    }

    createOrder() {
        const { addApp, setOrderStatus, apps, business } = this.props;
        const { productCount, productPrice } = this.state;

        if (this.validateForm() && !apps.some(app => app.name === 'AnsOrder')) {
            addApp({ name: 'AnsOrder', form: <AnsOrder
                    productsCount={parseInt(productCount)} productsPrice={productPrice}
                /> });

            // eslint-disable-next-line no-undef
            mp.trigger('biz.order.add', business.id, productCount, productPrice);

            // setTimeout(() => {
            //     setOrderStatus(1);
            // }, 1000)
        }
    }

    getContent(business) {
        const { closeApp } = this.props;
        const { productCount, productPrice, errorCount, errorPrice } = this.state;

        return (
            <Fragment>
                <div style={{ textAlign: 'center', marginTop: '26%' }}>Заказ товаров</div>
                <div className='block_sell_inputs-phone-react' style={{ marginBottom: '0' }}>
                    <div className='block_sell-phone-react'>
                        <label>Количество товаров</label>
                        <input
                            id='productCount'
                            className='input_sell-phone-react'
                            onChange={this.handleChangeInput}
                            value={productCount}
                            placeholder={errorCount}
                            style={{ borderColor: errorCount && '#f44343' }}
                        />
                        {/*<span>{ errorCount }</span>*/}
                    </div>
                    <div className='block_sell-phone-react'>
                        <label>Цена за товар</label>
                        <input
                            id='productPrice'
                            className='input_sell-phone-react'
                            onChange={this.handleChangeInput}
                            placeholder={errorPrice}
                            value={productPrice}
                            style={{ borderColor: errorPrice && '#f44343' }}
                        />
                        {/*<span>{ errorPrice }</span>*/}
                    </div>
                </div>

                <div style={{ textAlign: 'center' }}>
                    <div>Минимальная цена - <span style={{ color: '#47a80f' }}>${business.resourcePriceMin}</span></div>
                    <div>Максимальная цена - <span style={{ color: '#47a80f' }}>${business.resourcePriceMax}</span></div>
                </div>

                <div className='house_buttons-phone-react' style={{ bottom: '6%', position: 'absolute' }}>
                    <div className='house_button-phone-react' onClick={this.createOrder}>
                        <span className='ico_button_house-phone-react'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="80%" height="80%" viewBox="0 0 16.729 12.286" style={{marginLeft: '5px'}}>
                                <path id="Path_176" data-name="Path 176" d="M16.484,68.243a.836.836,0,0,0-1.183,0L5.28,78.264,1.427,74.412A.836.836,0,0,0,.245,75.595l4.444,4.444a.837.837,0,0,0,1.183,0L16.484,69.425A.836.836,0,0,0,16.484,68.243Z" transform="translate(0 -67.997)" fill="#74a607"/>
                            </svg>
                        </span>
                        <div className='text_button_house-phone-react'>Заказать</div>
                    </div>
                    <div className='house_button-phone-react' onClick={() => closeApp()}>
                        <span className='ico_button_house-phone-react'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="80%" height="80%" viewBox="0 0 16.37 16.369" style={{marginTop: '5%'}}>
                                <path id="Path_172" data-name="Path 172" d="M9.632,8.186,16.07,1.748A1.024,1.024,0,1,0,14.622.3L8.185,6.738,1.747.3A1.024,1.024,0,1,0,.3,1.748L6.737,8.186.3,14.623A1.023,1.023,0,1,0,1.747,16.07L8.185,9.633l6.437,6.437a1.024,1.024,0,0,0,1.448-1.448Z" transform="translate(0 -0.001)" fill="#f90040"/>
                            </svg>
                        </span>
                        <div className='text_button_house-phone-react'>Отменить</div>
                    </div>
                </div>
            </Fragment>
        )
    }

    render() {

        const { business } = this.props;

        return (
            <Fragment>
                <div className='back_page-phone-react'>
                    <Header business={business}/>

                    {
                        this.getContent(business)
                    }
                </div>
            </Fragment>
        );
    }
}

const mapStateToProps = state => ({
    info: state.info,
    business: state.info.biz[0],
    apps: state.apps
});

const mapDispatchToProps = dispatch => ({
    closeApp: () => dispatch(closeAppDisplay()),
    addApp: app => dispatch(addAppDisplay(app)),
    setOrderStatus: status => dispatch(setOrderStatusBusiness(status))
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateOrder);