import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import { setApp, deleteApp } from '../../../actions/phone.js';
import MainDisplay from '../MainDisplay.jsx';

class Success extends Component {

    back(event) {
        event.preventDefault();
        this.props.setApp(<MainDisplay />);
        this.props.deleteApp('house')
    }

    getInfo(type) {
        switch (type) {
            case 'sell':
                return (
                    <Fragment>
                        <div style={{fontSize: '16px', color: '#74a607', textAlign: 'center', marginTop: '10px', fontWeight: 'bold'}}>Дом продан</div>
                        <button id='idButHouseApp' style={{marginTop: '20px'}} onClick={this.back.bind(this)}>
                            <div style={{display: 'inline-block', width: '10%'}}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16.223" height="17.142" viewBox="0 0 16.223 17.142">
                                    <g id="Group_107" data-name="Group 107" transform="translate(-1.501 0)">
                                        <path id="Path_173" data-name="Path 173" d="M30.191,19.1a.306.306,0,0,0,0-.234.312.312,0,0,0-.066-.1L26.452,15.09a.306.306,0,1,0-.433.433l3.151,3.151H19.807a.306.306,0,0,0,0,.612H29.17l-3.151,3.151a.306.306,0,1,0,.433.433L30.125,19.2A.308.308,0,0,0,30.191,19.1Z" transform="translate(-12.49 -10.408)" fill="#ffe000"/>
                                        <path id="Path_174" data-name="Path 174" d="M12.215,10.1a.306.306,0,0,0-.306.306V16.53h-9.8V.612h9.8V6.734a.306.306,0,1,0,.612,0V.306A.306.306,0,0,0,12.215,0H1.807A.306.306,0,0,0,1.5.306v16.53a.306.306,0,0,0,.306.306H12.215a.306.306,0,0,0,.306-.306V10.408A.306.306,0,0,0,12.215,10.1Z" fill="#ffe000"/>
                                    </g>
                                </svg>
                            </div>
                            <div style={{display: 'inline-block', width: '90%', textAlign: 'center'}}>
                                В главное меню
                            </div>
                        </button>
                    </Fragment>
                )
            case 'impr':

            default:
                break;
        }
    }

    render() {

        const { house } = this.props;

        return (
            <div style={{backgroundColor: 'white', height: '365px'}}>
                <div className='headHousePhone'>
                    <span className='headSpanHouseApp'>Дом {house.name}</span><br></br>
                    <span style={{color: 'yellow'}}>{house.area}</span>
                </div>

                <div style={{textAlign: 'center', marginTop: '60px'}}>
                    <svg id="Group_104" data-name="Group 104" xmlns="http://www.w3.org/2000/svg" width="100.956" height="100.956" viewBox="0 0 100.956 100.956">
                        <path id="Path_165" data-name="Path 165" d="M50.478,0a50.478,50.478,0,1,0,50.478,50.478A50.535,50.535,0,0,0,50.478,0Zm0,97.073a46.6,46.6,0,1,1,46.6-46.6A46.649,46.649,0,0,1,50.478,97.073Z" fill="#74a607"/>
                        <path id="Path_166" data-name="Path 166" d="M62.967,15.653,33.129,49.221,15.153,34.84a1.941,1.941,0,0,0-2.425,3.033L32.143,53.4a1.943,1.943,0,0,0,2.666-.227L65.872,18.231a1.942,1.942,0,0,0-2.9-2.578Z" transform="translate(11.297 14.121)" fill="#74a607"/>
                    </svg>
                </div>

                {this.getInfo(this.props.type)}
            </div>
        )
    }
}

const mapStateToProps = state => ({
    house: state.phoneInfo.houses[0]
});

const mapDispatchToProps = dispatch => ({
    setApp: app => dispatch(setApp(app)),
    deleteApp: app => dispatch(deleteApp(app))
})

export default connect(mapStateToProps, mapDispatchToProps)(Success);