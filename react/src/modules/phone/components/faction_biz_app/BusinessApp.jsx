import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import Header from "./Header";
import BusinessManager from "./BusinessManager";
import {addAppDisplay, closeAppDisplay} from "../../actions/action.apps";
import Statistics from "./Statistics";

class BusinessApp extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { business, closeApp, addApp } = this.props;

        return (
            <Fragment>
                <div className='back_page-phone-react'>
                    <Header business={business}/>

                    <div className="house_info-phone-react">
                        <div style={{ marginLeft: '5%' }}>Информация</div>
                        <div className='table_info-phone-react'>
                            <div>Тип: <span>{ business.type }</span></div>
                            <div>Склад: <span>{ business.resources }/{ business.resourcesMax }</span></div>
                        </div>
                    </div>

                    <div className='house_buttons-phone-react' style={{ bottom: '4%', position: 'absolute' }}>
                        <div className='house_button-phone-react' onClick={() => addApp({name: 'BusinessManager', form: <BusinessManager />})}>
                            <span className='ico_button_house-phone-react'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 512 450" fill='#e1c631'>
                                  <path id="portfolio" d="M497.094,60c-.031,0-.062,0-.094,0H361V45A45.052,45.052,0,0,0,316,0H196a45.052,45.052,0,0,0-45,45V60H15A15.039,15.039,0,0,0,0,75V405a45.052,45.052,0,0,0,45,45H467a45.052,45.052,0,0,0,45-45V75.257c-.574-9.852-6.633-15.2-14.906-15.254ZM181,45a15.019,15.019,0,0,1,15-15H316a15.019,15.019,0,0,1,15,15V60H181ZM476.188,90,429.606,229.742A14.975,14.975,0,0,1,415.379,240H331V225a15,15,0,0,0-15-15H196a15,15,0,0,0-15,15v15H96.622a14.975,14.975,0,0,1-14.227-10.258L35.813,90ZM301,240v30H211V240ZM482,405a15.019,15.019,0,0,1-15,15H45a15.019,15.019,0,0,1-15-15V167.434l23.934,71.8A44.935,44.935,0,0,0,96.621,270H181v15a15,15,0,0,0,15,15H316a15,15,0,0,0,15-15V270h84.379a44.935,44.935,0,0,0,42.688-30.77L482,167.434Zm0,0" transform="translate(0 0)"/>
                                </svg>
                            </span>
                            <div className='text_button_house-phone-react'>Управление</div>
                        </div>
                        <div className='house_button-phone-react' onClick={() => addApp({name: 'Statistics', form: <Statistics />})}>
                            <span className='ico_button_house-phone-react'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 212.754 212.754">
                                  <g id="Group_3" data-name="Group 3" transform="translate(15 177)">
                                    <path id="Path_19" data-name="Path 19" d="M106.377,0A106.377,106.377,0,1,0,212.754,106.377,106.5,106.5,0,0,0,106.377,0Zm0,198.755a92.378,92.378,0,1,1,92.377-92.378A92.482,92.482,0,0,1,106.377,198.755Z" transform="translate(-15 -177)" fill="#48b817"/>
                                    <path id="Path_20" data-name="Path 20" d="M113.377,100.1V60.352a20.136,20.136,0,0,1,9.82,7.82,7,7,0,1,0,11.692-7.7,34.073,34.073,0,0,0-21.512-14.647V34.706a7,7,0,0,0-14,0v11.1a34.148,34.148,0,0,0,0,66.854V152.4a20.136,20.136,0,0,1-9.82-7.82,7,7,0,1,0-11.692,7.7,34.073,34.073,0,0,0,21.512,14.647v11.119a7,7,0,0,0,14,0v-11.1a34.148,34.148,0,0,0,0-66.854ZM86.209,79.231A20.16,20.16,0,0,1,99.377,60.357V98.105A20.16,20.16,0,0,1,86.209,79.231ZM113.377,152.4V114.649a20.11,20.11,0,0,1,0,37.748Z" transform="translate(-15 -177)" fill="#48b817"/>
                                  </g>
                                </svg>
                            </span>
                            <div className='text_button_house-phone-react'>Статистика</div>
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
    info: state.info,
    business: state.info.factionBiz
});

const mapDispatchToProps = dispatch => ({
    closeApp: () => dispatch(closeAppDisplay()),
    addApp: app => dispatch(addAppDisplay(app)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BusinessApp);