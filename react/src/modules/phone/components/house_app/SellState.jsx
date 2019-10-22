import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {addAppDisplay, closeAppDisplay} from "../../actions/action.apps";
import AnsSell from "./AnsSell";
import {disableHomePhone, setSellStatusHouse} from "../../actions/action.info";
import HeaderHouseApp from "./HeaderHouseApp";

class SellState extends Component {
    constructor(props) {
        super(props);
        this.state = {};

        this.sellHouse = this.sellHouse.bind(this);
    }

    componentDidMount() {
        this.props.setSellStatus(null);
    }

    sellHouse() {
        const { addApp, disableHome, setSellStatus, house } = this.props;

        // closeApp();
        disableHome(true);
        addApp({ name: 'AnsSell', form: <AnsSell /> });

        // eslint-disable-next-line no-undef
        mp.trigger('house.sell.toGov', house.name);

        // setTimeout(() => {
        //     setSellStatus(1);
        // }, 4000);
    }

    render() {

        const { house, info, closeApp } = this.props;

        return (
            <Fragment>
                <div className='back_page-phone-react' style={{ textAlign: 'center' }}>
                    <HeaderHouseApp house={house}/>

                    <div style={{ textAlign: 'center', marginTop: '26%' }}>Продажа государству</div>
                    <div style={{ marginTop: '10%' }}>
                        <svg id="state" xmlns="http://www.w3.org/2000/svg" width="30%" height="20%" viewBox="0 0 33.899 33.727">
                            <g id="state" data-name="Group 68" transform="translate(0 0)">
                                <path id="state" data-name="Path 132" d="M224.13,88.309a2.26,2.26,0,1,0,2.26,2.26A2.262,2.262,0,0,0,224.13,88.309Zm0,3.39a1.13,1.13,0,1,1,1.13-1.13A1.13,1.13,0,0,1,224.13,91.7Z" transform="translate(-207.18 -82.548)"/>
                                <path id="state" data-name="Path 133" d="M32.2,31.633v-.565a1.694,1.694,0,0,0-1.13-1.586v-.674a1.692,1.692,0,0,0-1.13-1.591V18.535a1.692,1.692,0,0,0,1.13-1.591v-1l1.03-2.059,1.63-1.63a.564.564,0,0,0-.105-.882l-16.384-10a.564.564,0,0,0-.588,0l-16.384,10a.564.564,0,0,0-.105.882l1.63,1.63,1.03,2.059v1a1.692,1.692,0,0,0,1.13,1.591v8.683a1.692,1.692,0,0,0-1.13,1.591v.674A1.694,1.694,0,0,0,1.7,31.068v.565A1.7,1.7,0,0,0,0,33.328v1.13a.565.565,0,0,0,.565.565H33.334a.565.565,0,0,0,.565-.565h0v-1.13A1.7,1.7,0,0,0,32.2,31.633Zm-2.26-14.69a.565.565,0,0,1-.565.565H25.99a.565.565,0,0,1-.565-.565v-.565h4.52v.565ZM14.125,27.218V18.535a1.692,1.692,0,0,0,1.13-1.591v-.565h3.39v.565a1.692,1.692,0,0,0,1.13,1.591v8.683a1.692,1.692,0,0,0-1.13,1.591v.565h-3.39v-.565A1.692,1.692,0,0,0,14.125,27.218Zm-9.6-9.709a.565.565,0,0,1-.565-.565v-.565h4.52v.565a.565.565,0,0,1-.565.565Zm2.825,1.13v8.475H5.085V18.639Zm1.13-.1A1.686,1.686,0,0,0,9.04,18.2a1.686,1.686,0,0,0,.565.337v8.683a1.686,1.686,0,0,0-.565.337,1.687,1.687,0,0,0-.565-.337Zm1.13,10.274a.566.566,0,0,1,.565-.565h3.39a.565.565,0,0,1,.565.565v.565H9.605Zm1.13-1.695V18.639h2.26v8.475Zm2.825-9.6H10.17a.565.565,0,0,1-.565-.565v-.565h4.52v.565A.566.566,0,0,1,13.56,17.509Zm6.215,11.3a.565.565,0,0,1,.565-.565h3.39a.565.565,0,0,1,.565.565v.565h-4.52Zm1.13-1.695V18.639h2.26v8.475Zm2.825-9.6H20.34a.565.565,0,0,1-.565-.565v-.565h4.52v.565A.566.566,0,0,1,23.73,17.509Zm.565,1.026a1.686,1.686,0,0,0,.565-.337,1.686,1.686,0,0,0,.565.337v8.683a1.686,1.686,0,0,0-.565.337,1.687,1.687,0,0,0-.565-.337Zm1.13,10.274a.566.566,0,0,1,.565-.565h3.39a.565.565,0,0,1,.565.565v.565h-4.52v-.565Zm1.13-1.695V18.639h2.26v8.475ZM2.344,12.839l-.872-.872L16.95,2.523l15.477,9.445-.872.872L17.246,4.033a.564.564,0,0,0-.593,0Zm27.3.15H4.256L16.95,5.178Zm-25.9,2.26-.565-1.13H30.725l-.565,1.13Zm.216,13.56a.565.565,0,0,1,.565-.565H7.91a.565.565,0,0,1,.565.565v.565H3.955Zm28.814,5.085H1.13v-.565a.565.565,0,0,1,.565-.565H13.56a.565.565,0,0,0,0-1.13H2.825v-.565a.577.577,0,0,1,.587-.565H30.487a.577.577,0,0,1,.587.565v.565H20.34a.565.565,0,1,0,0,1.13H32.2a.565.565,0,0,1,.565.565Z" transform="translate(0 -1.296)"/>
                            </g>
                        </svg>
                        <div style={{ fontSize: '1.15em', fontWeight: 'bold', marginTop: '10%' }}>Будет начислено</div>
                        <div style={{ color: '#30af25' }}>${ info.houses[0].price * 0.6 }</div>
                        <div>(60% от гос. стоимости)</div>
                    </div>

                    {
                        !info.isDisabled &&
                        <div className='house_buttons-phone-react' style={{ bottom: '6%', position: 'absolute' }}>
                            <div className='house_button-phone-react' onClick={() => this.sellHouse()}>
                                <span className='ico_button_house-phone-react'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="80%" height="80%" viewBox="0 0 16.729 12.286" style={{marginLeft: '5px'}}>
                                        <path id="Path_176" data-name="Path 176" d="M16.484,68.243a.836.836,0,0,0-1.183,0L5.28,78.264,1.427,74.412A.836.836,0,0,0,.245,75.595l4.444,4.444a.837.837,0,0,0,1.183,0L16.484,69.425A.836.836,0,0,0,16.484,68.243Z" transform="translate(0 -67.997)" fill="#74a607"/>
                                    </svg>
                                </span>
                                <div className='text_button_house-phone-react'>Подтвердить</div>
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
    disableHome: state => dispatch(disableHomePhone(state)),
    setSellStatus: status => dispatch(setSellStatusHouse(status)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SellState);