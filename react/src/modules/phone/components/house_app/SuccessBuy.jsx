import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {closeAppDisplay} from "../../actions/action.apps";
import {disableHomePhone, buyImprovementHouse, setBuyStatusHouse} from "../../actions/action.info";
import MainDisplay from "../MainDisplay";
import HeaderHouseApp from "./HeaderHouseApp";

class SuccessBuy extends Component {
    constructor(props) {
        super(props);
        this.state = {};

        this.back = this.back.bind(this);
    }

    componentDidMount() {
        const { type, buyImprovement, disableHome } = this.props;

        buyImprovement(type);
        disableHome(false);
    }

    back() {
        const { closeApp } = this.props;

        closeApp();
    }

    render() {

        const { house } = this.props;

        return (
            <Fragment>
                <div className='back_page-phone-react'>

                    <HeaderHouseApp house={house}/>

                    <div style={{textAlign: 'center', marginTop: '50%'}}>
                        <svg id="Group_104" data-name="Group 104" xmlns="http://www.w3.org/2000/svg" width="40%" height="40%" viewBox="0 0 100.956 100.956">
                            <path id="Path_165" data-name="Path 165" d="M50.478,0a50.478,50.478,0,1,0,50.478,50.478A50.535,50.535,0,0,0,50.478,0Zm0,97.073a46.6,46.6,0,1,1,46.6-46.6A46.649,46.649,0,0,1,50.478,97.073Z" fill="#74a607"/>
                            <path id="Path_166" data-name="Path 166" d="M62.967,15.653,33.129,49.221,15.153,34.84a1.941,1.941,0,0,0-2.425,3.033L32.143,53.4a1.943,1.943,0,0,0,2.666-.227L65.872,18.231a1.942,1.942,0,0,0-2.9-2.578Z" transform="translate(11.297 14.121)" fill="#74a607"/>
                        </svg>
                        <div>Улучшение куплено</div>
                    </div>

                    <div className='house_buttons-phone-react' style={{ bottom: '6%', position: 'absolute' }}>
                        <div className='house_button-phone-react' onClick={this.back}>
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
    ...state,
    house: state.info.houses[0]
});

const mapDispatchToProps = dispatch => ({
    closeApp: app => dispatch(closeAppDisplay(app)),
    disableHome: state => dispatch(disableHomePhone(state)),
    setBuyStatus: status => dispatch(setBuyStatusHouse(status)),
    buyImprovement: type => dispatch(buyImprovementHouse(type)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SuccessBuy);