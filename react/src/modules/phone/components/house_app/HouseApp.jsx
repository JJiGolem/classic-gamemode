import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {addAppDisplay, closeAppDisplay, deleteApp} from "../../actions/action.apps";
import HouseManager from "./HouseManager";
import HeaderHouseApp from "./HeaderHouseApp";

class HouseApp extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    // componentDidMount() {
    //     setTimeout(() => {
    //         this.props.deleteApp('house');
    //     }, 2000);
    // }

    render() {

        const { house, closeApp, addApp } = this.props;

        return (
            <Fragment>
                <div className="back_page-phone-react">
                    <HeaderHouseApp house={house}/>

                    <div className="house_info-phone-react">
                        <div style={{ marginLeft: '5%' }}>Информация</div>
                        <div className='table_info-phone-react'>
                            <div>Класс: <span>{ house.class }</span></div>
                            <div>Количество комнат: <span>{ house.numRooms }</span></div>
                            <div>Гараж: { house.garage
                                ? <span style={{ color: '#47a80f' }}>есть</span>
                                : <span style={{ color: 'red' }}>нет</span> }
                            </div>
                            <div>Парковочных мест: <span>{ house.carPlaces }</span></div>
                            <div>Состояние: { house.isOpened
                                ? <span style={{ color: '#47a80f' }}>открыт</span>
                                : <span style={{ color: 'red' }}>закрыт</span> }</div>
                            <div>Аренда: <span>${ house.rent } в сутки</span></div>
                            <div>Оплачено: <span>{ house.days }/30</span></div>
                        </div>
                    </div>

                    <div className='house_buttons-phone-react' style={{ bottom: '4%', position: 'absolute' }}>
                        <div className='house_button-phone-react' onClick={() => addApp({name: 'HouseManager', form: <HouseManager />})}>
                            <span className='ico_button_house-phone-react'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 22.882 20.398" >
                                    <g id="Group_106" data-name="Group 106" transform="translate(0.001 -27.797)">
                                        <path id="Path_170" data-name="Path 170" d="M73.694,232.543a.6.6,0,0,0-.595.595V242.6H68.343v-5.166a2.973,2.973,0,0,0-5.946,0V242.6H57.641v-9.464a.595.595,0,1,0-1.189,0V243.2a.6.6,0,0,0,.595.595h5.945a.594.594,0,0,0,.592-.548.447.447,0,0,0,0-.046v-5.76a1.784,1.784,0,1,1,3.568,0v5.76a.434.434,0,0,0,0,.046.594.594,0,0,0,.592.549h5.945a.6.6,0,0,0,.595-.595V233.138A.6.6,0,0,0,73.694,232.543Z" transform="translate(-53.93 -195.595)" fill="#ffe000"/>
                                        <path id="Path_171" data-name="Path 171" d="M22.638,35.854,11.792,27.912a.594.594,0,0,0-.7,0L.243,35.854a.595.595,0,1,0,.7.959l10.5-7.685,10.5,7.684a.595.595,0,0,0,.7-.959Z" transform="translate(0)" fill="#ffe000"/>
                                    </g>
                                </svg>
                            </span>
                            <div className='text_button_house-phone-react'>Управление домом</div>
                        </div>
                        <div className='house_button-phone-react' onClick={closeApp}>
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
    ...state,
    house: state.info.houses[0]
});

const mapDispatchToProps = dispatch => ({
    closeApp: () => dispatch(closeAppDisplay()),
    addApp: app => dispatch(addAppDisplay(app)),
    deleteApp: appName => dispatch(deleteApp(appName))
});

export default connect(mapStateToProps, mapDispatchToProps)(HouseApp);