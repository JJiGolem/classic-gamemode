/* eslint-disable no-undef */
import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import { closeAppDisplay, addAppDisplay } from "../../actions/action.apps";
import HeaderHouseApp from "./HeaderHouseApp";
import AnsBuy from "./AnsBuy";
import { disableHomePhone } from '../../actions/action.info';

class Improvements extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeIndex: 0,
            startIndex: 0
        };

        this.getImprovements = this.getImprovements.bind(this);
    }

    getImprovements() {
        const { house, addApp, disableHome } = this.props;
        const { activeIndex, startIndex } = this.state;

        return (
            <div className="house_improvements_list-react">
                {
                    house.improvements.map((improvement, index) => (
                        index >= startIndex && index < startIndex + 3 &&
                        <div className={index == activeIndex ? "house_improvement_block_active-react" : "house_improvement_block-react"} 
                            onClick={() => {
                                if (index == activeIndex && !improvement.isBuyed) {
                                    mp.trigger('house.improvements.buy', improvement.type);
                                    disableHome(true);
                                    addApp({ name: 'AnsBuy', form: <AnsBuy type={improvement.type}/> });
                                } else {
                                    this.setState({ activeIndex: index });
                                }
                            }}
                        >
                            <span className="house_improvement_name-react" style={{ fontSize: '120%' }}>{ improvement.name }</span><br/>
                            { improvement.isBuyed 
                                ? <span style={{ color: '#47a80f' }}>Улучшение куплено</span>
                                : <span style={{ color: '#47a80f' }}>Купить за ${ improvement.price }</span>
                            }
                        </div>
                    ))
                }
            </div>
        )
    }

    getContent() {
        const { house, closeApp, addApp } = this.props;
        const { activeIndex, startIndex } = this.state;

        return (
            <Fragment>
                <div style={{ textAlign: 'center', marginTop: '26%' }}>Улучшения дома</div>

                { house.improvements.length > 0
                    ? this.getImprovements()
                    : <div style={{ textAlign: 'center', marginTop: '20%', fontSize: '140%' }}>Доступных улучшений нет</div>
                }

                {
                    house.improvements.length > 0 &&
                    <div className="house_improvements_navigate-react">
                        <button 
                        style={{ 
                            color: activeIndex == 0 && 'gray',
                            background: activeIndex == 0 && 'transparent'
                        }}
                            onClick={() => {
                                if (activeIndex > 0) {
                                    if (activeIndex == startIndex) {
                                        this.setState({ startIndex: startIndex - 1 })
                                    }

                                    this.setState({ activeIndex: activeIndex - 1 });
                                }
                        }}>▲</button>
                        <span>{ activeIndex + 1 }/{house.improvements.length}</span>
                        <button 
                            style={{ 
                                color: activeIndex == house.improvements.length - 1 && 'gray',
                                background: activeIndex == house.improvements.length - 1 && 'transparent'
                            }}
                            onClick={() => {
                                if (activeIndex < house.improvements.length - 1) {
                                    if (activeIndex == startIndex + 2) {
                                        this.setState({ startIndex: startIndex + 1 })
                                    }

                                    this.setState({ activeIndex: activeIndex + 1 });
                                }
                        }}>▼</button>
                    </div>
                }

                <div className='house_buttons-phone-react' style={{ bottom: '1%', position: 'absolute' }}>
                    <div className='house_button-phone-react' onClick={() => closeApp()}>
                        <span className='ico_button_house-phone-react'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="80%" height="80%" viewBox="0 0 16.37 16.369" style={{marginTop: '5%'}}>
                                <path id="Path_172" data-name="Path 172" d="M9.632,8.186,16.07,1.748A1.024,1.024,0,1,0,14.622.3L8.185,6.738,1.747.3A1.024,1.024,0,1,0,.3,1.748L6.737,8.186.3,14.623A1.023,1.023,0,1,0,1.747,16.07L8.185,9.633l6.437,6.437a1.024,1.024,0,0,0,1.448-1.448Z" transform="translate(0 -0.001)" fill="#f90040"/>
                            </svg>
                        </span>
                        <div className='text_button_house-phone-react'>Назад</div>
                    </div>
                </div>
            </Fragment>
        )
    }

    render() {

        const { house } = this.props;

        return (
            <Fragment>
                <div className='back_page-phone-react'>
                    <HeaderHouseApp house={house}/>

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
    disableHome: state => dispatch(disableHomePhone(state)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Improvements);