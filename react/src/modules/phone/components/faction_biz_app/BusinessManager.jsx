import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import Header from "./Header";
import {addAppDisplay, closeAppDisplay, setAppDisplay} from "../../actions/action.apps";
import MainDisplay from "../MainDisplay";
import BusinessApp from "./BusinessApp";
import StockManager from "./StockManager";
import Improvements from './Improvements'; 

class BusinessManager extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    toInfoPage(e) {
        const { addApp, closeApp } = this.props;

        closeApp();
        addApp({name: 'BusinessApp', form: <BusinessApp />});
    }

    render() {
        const { business, addApp, setApp } = this.props;

        return (
            <Fragment>
                <div className='back_page-phone-react'>
                    <Header business={business} />
                    <div style={{ textAlign: 'center', marginTop: '26%' }}>Управление бизнесом</div>

                    <div className='manager_buttons-phone-react' style={{ marginTop: '25%' }}>
                        <div className='manager_button-phone-react' onClick={() => addApp({name: 'StockManager', form: <StockManager />})}>
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="60%" height="60%" viewBox="0 0 285.546 285.544">
                                    <g id="Group_1" data-name="Group 1" transform="translate(0 -0.002)">
                                        <path id="Path_8" data-name="Path 8" d="M257.151,119.464H209.56a4.761,4.761,0,0,0-4.759,4.759v19.036a4.761,4.761,0,0,0,4.759,4.759h47.591a4.758,4.758,0,0,0,4.759-4.759V124.223A4.758,4.758,0,0,0,257.151,119.464ZM252.391,138.5H214.318v-9.518h38.073Z" transform="translate(-90.582 -52.837)"/>
                                        <rect id="Rectangle_2" data-name="Rectangle 2" width="228.437" height="9.518" transform="translate(28.555 123.736)"/>
                                        <rect id="Rectangle_3" data-name="Rectangle 3" width="228.437" height="9.518" transform="translate(28.555 142.773)"/>
                                        <path id="Path_9" data-name="Path 9" d="M368.9,298.664v14.277h-9.518V298.664h-9.518V317.7a4.754,4.754,0,0,0,4.759,4.759h19.036a4.754,4.754,0,0,0,4.759-4.759V298.664Z" transform="translate(-154.743 -132.096)"/>
                                        <path id="Path_10" data-name="Path 10" d="M377.6,290.131H320.493a4.754,4.754,0,0,0-4.759,4.759V352a4.754,4.754,0,0,0,4.759,4.759H377.6A4.754,4.754,0,0,0,382.361,352V294.89A4.754,4.754,0,0,0,377.6,290.131Zm-4.759,57.109H325.252V299.649h47.591Z" transform="translate(-139.647 -128.322)"/>
                                        <path id="Path_11" data-name="Path 11" d="M266.5,401.064v14.277h-9.518V401.064h-9.518V420.1a4.758,4.758,0,0,0,4.759,4.759h19.036a4.754,4.754,0,0,0,4.759-4.759V401.064Z" transform="translate(-109.452 -177.387)"/>
                                        <path id="Path_12" data-name="Path 12" d="M275.2,392.531H218.093a4.758,4.758,0,0,0-4.759,4.759V454.4a4.758,4.758,0,0,0,4.759,4.759H275.2a4.754,4.754,0,0,0,4.759-4.759V397.29A4.754,4.754,0,0,0,275.2,392.531Zm-4.759,57.109H222.852V402.049h47.591Z" transform="translate(-94.356 -173.613)"/>
                                        <path id="Path_13" data-name="Path 13" d="M368.9,401.064v14.277h-9.518V401.064h-9.518V420.1a4.754,4.754,0,0,0,4.759,4.759h19.036a4.754,4.754,0,0,0,4.759-4.759V401.064Z" transform="translate(-154.743 -177.387)"/>
                                        <path id="Path_14" data-name="Path 14" d="M377.6,392.531H320.493a4.754,4.754,0,0,0-4.759,4.759V454.4a4.754,4.754,0,0,0,4.759,4.759H377.6a4.754,4.754,0,0,0,4.759-4.759V397.29A4.754,4.754,0,0,0,377.6,392.531Zm-4.759,57.109H325.252V402.049h47.591Z" transform="translate(-139.647 -173.613)"/>
                                        <path id="Path_15" data-name="Path 15" d="M283.2,81.561,145.181.656a4.758,4.758,0,0,0-4.706-.062L2.461,76.74A4.75,4.75,0,0,0,0,80.9V280.786a4.758,4.758,0,0,0,4.759,4.759h23.8a4.758,4.758,0,0,0,4.759-4.759V114.218H252.232V280.787a4.754,4.754,0,0,0,4.759,4.759h23.8a4.754,4.754,0,0,0,4.759-4.759V85.664A4.749,4.749,0,0,0,283.2,81.561Zm-7.168,194.466H261.75V109.459a4.758,4.758,0,0,0-4.759-4.759H28.555a4.761,4.761,0,0,0-4.759,4.759V276.027H9.518V83.712L142.7,10.231,276.028,88.39V276.027Z"/>
                                    </g>
                                </svg>

                            </div>
                            <div>
                                Склад
                            </div>
                        </div>
                        <div className='manager_button-phone-react' style={{ paddingTop: '2.9%' }} onClick={() => addApp({name: 'Improvements', form: <Improvements />})}>
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="48%" height="48%" id="imp" viewBox="0 0 33.238 42.685">
                                    <g id="imp" data-name="Group 67" transform="translate(0 0)">
                                        <path id="imp" data-name="Path 128" d="M32.871,8.642,16.828.094a.8.8,0,0,0-.759,0L.469,8.647a.8.8,0,0,0-.414.7V20.514A23.121,23.121,0,0,0,13.913,41.675l2.165.944a.8.8,0,0,0,.636,0l2.44-1.054a23.076,23.076,0,0,0,14.14-21.273V9.347a.8.8,0,0,0-.423-.705ZM31.7,20.292A21.482,21.482,0,0,1,18.528,40.1l-.005,0-2.125.917-1.846-.805a21.522,21.522,0,0,1-12.9-19.7V9.82L16.457,1.706,31.7,9.826Zm0,0" transform="translate(-0.055 0)"/>
                                        <path id="imp" data-name="Path 129" d="M81.248,149.373a.8.8,0,0,0-1.215,1.037l4.219,4.941a.8.8,0,0,0,1.111.1l9.826-7.994a.8.8,0,1,0-1.008-1.239l-9.221,7.5Zm0,0" transform="translate(-70.738 -129.376)"/>
                                    </g>
                                </svg>
                            </div>
                            <div>Улучшить</div>
                        </div>
                    </div>

                    <div className='house_buttons-phone-react' style={{ bottom: '3%', position: 'absolute'}}>
                        <div className='house_button-phone-react' onClick={this.toInfoPage.bind(this)}>
                            <span className='ico_button_house-phone-react'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="40%" height="40%" viewBox="0 0 7.885 17.142">
                                    <path id="Path_175" data-name="Path 175" d="M33.027,0a1.6,1.6,0,0,1,1.722,1.678,2.254,2.254,0,0,1-2.3,2.152,1.537,1.537,0,0,1-1.692-1.705A2.2,2.2,0,0,1,33.027,0ZM29.493,17.142c-.906,0-1.571-.559-.936-3.02L29.6,9.759c.181-.7.211-.978,0-.978a6.847,6.847,0,0,0-2.144.958L27,8.983c2.2-1.873,4.742-2.971,5.829-2.971.906,0,1.057,1.09.6,2.768l-1.191,4.587c-.212.811-.121,1.09.09,1.09a4.669,4.669,0,0,0,2.039-1.036l.514.7A9.427,9.427,0,0,1,29.493,17.142Z" transform="translate(-27)" fill="#ffe000"/>
                                </svg>
                            </span>
                            <div className='text_button_house-phone-react'>Информация</div>
                        </div>
                        <div className='house_button-phone-react' onClick={() => setApp({name: 'MainDisplay', form: <MainDisplay />})}>
                            <span className='ico_button_house-phone-react'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="80%" height="80%" viewBox="0 0 16.37 16.369" style={{marginTop: '5%'}}>
                                    <path id="Path_172" data-name="Path 172" d="M9.632,8.186,16.07,1.748A1.024,1.024,0,1,0,14.622.3L8.185,6.738,1.747.3A1.024,1.024,0,1,0,.3,1.748L6.737,8.186.3,14.623A1.023,1.023,0,1,0,1.747,16.07L8.185,9.633l6.437,6.437a1.024,1.024,0,0,0,1.448-1.448Z" transform="translate(0 -0.001)" fill="#f90040"/>
                                </svg>
                            </span>
                            <div className='text_button_house-phone-react'>Закрыть меню</div>
                        </div>
                    </div>

                </div>
            </Fragment>
        );
    }
}

const mapStateToProps = state => ({
    business: state.info.factionBiz
});

const mapDispatchToProps = dispatch => ({
    closeApp: () => dispatch(closeAppDisplay()),
    addApp: app => dispatch(addAppDisplay(app)),
    setApp: app => dispatch(setAppDisplay(app)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BusinessManager);