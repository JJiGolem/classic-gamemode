import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {addAppDisplay, closeAppDisplay, setAppDisplay} from "../../actions/action.apps";
import Header from "./Header";
import CreateOrder from "./CreateOrder";
import OrderCancel from "./OrderCancel";

class StockManager extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { business, closeApp, addApp } = this.props;

        return (
            <Fragment>
                <div className='back_page-phone-react' style={{ textAlign: 'center' }}>
                    <Header business={business}/>
                    <div style={{ textAlign: 'center', marginTop: '26%' }}>Управление складом</div>
                    <div style={{ textAlign: 'left', margin: '10%', fontSize: '110%' }}>
                        <div>Состояние: { business.resources }/{ business.resourcesMax }</div>
                        <div>Активный заказ:
                            {
                                !business.order
                                ? <span style={{ color: 'red' }}> нет</span>
                                : <span style={{ color: '#30af25' }}>{` ${business.order.productsCount} на $${business.order.productsPrice}`}</span>
                            }
                        </div>
                    </div>

                    {
                        !business.order &&
                        <div className='button_create_order-phone-react' onClick={() => addApp({name: 'CreateOrder', form: <CreateOrder />})}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="50%" height="100%" viewBox="0 0 512.001 304.387">
                                <g id="Group_2" data-name="Group 2" transform="translate(0 -103.806)">
                                    <path id="Path_17" data-name="Path 17" d="M187.693,310.344h-8.606a10.2,10.2,0,1,0,0,20.4h8.606a10.2,10.2,0,0,0,0-20.4Z"/>
                                    <path id="Path_18" data-name="Path 18" d="M506.922,249.331l-29.541-17.153L460.5,160.069a42.05,42.05,0,0,0-41.107-32.6H334.506V114a10.2,10.2,0,0,0-10.2-10.2H10.2A10.2,10.2,0,0,0,0,114V357.116a10.2,10.2,0,0,0,10.2,10.2H42.978a51.081,51.081,0,0,0,100.1,0H349.557a51.081,51.081,0,0,0,100.1,0H501.8a10.2,10.2,0,0,0,10.2-10.2V258.151A10.2,10.2,0,0,0,506.922,249.331ZM93.029,387.8a30.678,30.678,0,1,1,30.678-30.678A30.713,30.713,0,0,1,93.029,387.8Zm221.08-77.452H222.115a10.2,10.2,0,0,0,0,20.4h91.994v16.176H143.081a51.081,51.081,0,0,0-100.1,0H20.4v-52.75H314.109v16.176Zm0-172.672v136.1H20.4V124.205H314.109Zm79.562,10.2H419.4a21.727,21.727,0,0,1,21.244,16.846l14.949,63.872h-61.92V147.872ZM399.608,387.8a30.713,30.713,0,0,1-30.6-28.635,10.283,10.283,0,0,0,0-4.086,30.674,30.674,0,1,1,30.6,32.721ZM491.6,298.512H472.2v-10.8h19.4Zm0-31.2H462a10.2,10.2,0,0,0-10.2,10.2v31.2a10.2,10.2,0,0,0,10.2,10.2h29.6v28.008H449.66a51.081,51.081,0,0,0-100.1,0h-15.05V147.871h38.766v90.918a10.2,10.2,0,0,0,10.2,10.2h82.235L491.6,264.025v3.292Z"/>
                                </g>
                            </svg>
                            <div>Сделать заказ</div>
                        </div>
                    }
                    {
                        (business.order && !business.order.isTake) &&
                        <div className='button_create_order-phone-react' onClick={() => addApp({name: 'OrderCancel', form: <OrderCancel />})}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="50%" height="100%" viewBox="0 0 51.324 33.13">
                                <g id="backspace" transform="translate(0 -5.09)">
                                    <path id="Path_23" data-name="Path 23" d="M12.343,5.09,0,21.655,12.343,38.22H51.324V5.09ZM49,36.271H13.632L2.74,21.655,13.632,7.039H49Z" transform="translate(0 0)"/>
                                    <path id="Path_24" data-name="Path 24" d="M18.887,29.927,26.18,23l7.293,6.929,1.414-1.343-7.293-6.929,7.293-6.929-1.414-1.343L26.18,20.312l-7.293-6.929-1.414,1.343,7.293,6.929-7.293,6.929Z" transform="translate(4.664)"/>
                                </g>
                            </svg>
                            <div>Отменить заказ</div>
                        </div>
                    }

                    <div className='house_buttons-phone-react' style={{ bottom: '3%', position: 'absolute'}}>
                        <div className='house_button-phone-react' onClick={() => {
                            closeApp();
                            closeApp();
                        }}>
                            <span className='ico_button_house-phone-react'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="40%" height="40%" viewBox="0 0 7.885 17.142">
                                    <path id="Path_175" data-name="Path 175" d="M33.027,0a1.6,1.6,0,0,1,1.722,1.678,2.254,2.254,0,0,1-2.3,2.152,1.537,1.537,0,0,1-1.692-1.705A2.2,2.2,0,0,1,33.027,0ZM29.493,17.142c-.906,0-1.571-.559-.936-3.02L29.6,9.759c.181-.7.211-.978,0-.978a6.847,6.847,0,0,0-2.144.958L27,8.983c2.2-1.873,4.742-2.971,5.829-2.971.906,0,1.057,1.09.6,2.768l-1.191,4.587c-.212.811-.121,1.09.09,1.09a4.669,4.669,0,0,0,2.039-1.036l.514.7A9.427,9.427,0,0,1,29.493,17.142Z" transform="translate(-27)" fill="#ffe000"/>
                                </svg>
                            </span>
                            <div className='text_button_house-phone-react'>Информация</div>
                        </div>
                        <div className='house_button-phone-react' onClick={() => closeApp()}>
                            <span className='ico_button_house-phone-react'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="80%" height="80%" viewBox="0 0 16.37 16.369" style={{marginTop: '5%'}}>
                                    <path id="Path_172" data-name="Path 172" d="M9.632,8.186,16.07,1.748A1.024,1.024,0,1,0,14.622.3L8.185,6.738,1.747.3A1.024,1.024,0,1,0,.3,1.748L6.737,8.186.3,14.623A1.023,1.023,0,1,0,1.747,16.07L8.185,9.633l6.437,6.437a1.024,1.024,0,0,0,1.448-1.448Z" transform="translate(0 -0.001)" fill="#f90040"/>
                                </svg>
                            </span>
                            <div className='text_button_house-phone-react'>Назад</div>
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }
}

const mapStateToProps = state => ({
    business: state.info.biz[0],
    info: state.info
});

const mapDispatchToProps = dispatch => ({
    addApp: app => dispatch(addAppDisplay(app)),
    setApp: app => dispatch(setAppDisplay(app)),
    closeApp: () => dispatch(closeAppDisplay()),
});

export default connect(mapStateToProps, mapDispatchToProps)(StockManager);