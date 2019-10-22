import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {closeAppDisplay, setAppDisplay} from "../../actions/action.apps";
import {sellHouse, disableHomePhone, setSellInfoHouse, setSellStatusHouse} from "../../actions/action.info";
import MainDisplay from "../MainDisplay";
import HeaderHouseApp from "./HeaderHouseApp";

class Success extends Component {
    constructor(props) {
        super(props);
        this.state = {};

        this.back = this.back.bind(this);
    }

    componentDidMount() {
        const { house, sellHouse, disableHome } = this.props;

        disableHome(false);
        sellHouse(house.name);
    }

    back() {
        const { house, setApp } = this.props;

        setApp({ name: 'MainDisplay', form: <MainDisplay /> });
    }

    render() {

        const { name, area } = this.props;

        return (
            <Fragment>
                <div className='back_page-phone-react'>

                    <HeaderHouseApp house={{name, area}}/>

                    <div style={{textAlign: 'center', marginTop: '50%'}}>
                        <svg id="Group_104" data-name="Group 104" xmlns="http://www.w3.org/2000/svg" width="40%" height="40%" viewBox="0 0 100.956 100.956">
                            <path id="Path_165" data-name="Path 165" d="M50.478,0a50.478,50.478,0,1,0,50.478,50.478A50.535,50.535,0,0,0,50.478,0Zm0,97.073a46.6,46.6,0,1,1,46.6-46.6A46.649,46.649,0,0,1,50.478,97.073Z" fill="#74a607"/>
                            <path id="Path_166" data-name="Path 166" d="M62.967,15.653,33.129,49.221,15.153,34.84a1.941,1.941,0,0,0-2.425,3.033L32.143,53.4a1.943,1.943,0,0,0,2.666-.227L65.872,18.231a1.942,1.942,0,0,0-2.9-2.578Z" transform="translate(11.297 14.121)" fill="#74a607"/>
                        </svg>
                        <div>Дом продан</div>
                    </div>

                    <div className='house_buttons-phone-react' style={{ bottom: '6%', position: 'absolute' }}>
                        <div className='house_button-phone-react' onClick={this.back}>
                            <span className='ico_button_house-phone-react'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="80%" height="80%" viewBox="0 0 16.223 17.142">
                                    <g id="Group_107" data-name="Group 107" transform="translate(-1.501 0)">
                                        <path id="Path_173" data-name="Path 173" d="M30.191,19.1a.306.306,0,0,0,0-.234.312.312,0,0,0-.066-.1L26.452,15.09a.306.306,0,1,0-.433.433l3.151,3.151H19.807a.306.306,0,0,0,0,.612H29.17l-3.151,3.151a.306.306,0,1,0,.433.433L30.125,19.2A.308.308,0,0,0,30.191,19.1Z" transform="translate(-12.49 -10.408)" fill="#ffe000"/>
                                        <path id="Path_174" data-name="Path 174" d="M12.215,10.1a.306.306,0,0,0-.306.306V16.53h-9.8V.612h9.8V6.734a.306.306,0,1,0,.612,0V.306A.306.306,0,0,0,12.215,0H1.807A.306.306,0,0,0,1.5.306v16.53a.306.306,0,0,0,.306.306H12.215a.306.306,0,0,0,.306-.306V10.408A.306.306,0,0,0,12.215,10.1Z" fill="#ffe000"/>
                                    </g>
                                </svg>
                            </span>
                            <div className='text_button_house-phone-react'>В главное меню</div>
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }
}

const mapStateToProps = state => ({
    ...state,
});

const mapDispatchToProps = dispatch => ({
    setApp: app => dispatch(setAppDisplay(app)),
    disableHome: state => dispatch(disableHomePhone(state)),
    setSellStatus: status => dispatch(setSellStatusHouse(status)),
    setSellInfo: info => dispatch(setSellInfoHouse(info)),
    sellHouse: name => dispatch(sellHouse(name))
});

export default connect(mapStateToProps, mapDispatchToProps)(Success);