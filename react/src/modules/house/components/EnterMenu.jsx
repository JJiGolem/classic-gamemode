/* eslint-disable default-case */
import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {closeEnterMenuHouse, setAnswerEnterHouse, setHouseFormBlur, setLoadingHouse} from "../actions/action.house";

class EnterMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            enterHouseColor: '#e1c631',
            enterGarageColor: '#e1c631',
            enterStreetColor: '#e1c631',
        };

        this.getForm = this.getForm.bind(this);
        this.getButton = this.getButton.bind(this);
        this.getAnswer = this.getAnswer.bind(this);
    }

    exit() {
        const { closeMenu, house, forms } = this.props;

        if (!house.isLoading) {
            closeMenu();

            if (!forms.house) {
                // eslint-disable-next-line no-undef
                mp.trigger('house.menu.enter.close')
            }
        }
    }

    getLoader() {
        return (
            <div className='block_loader-house-react'>
                <div className='loader-house'></div>
            </div>
        )
    }

    getButton(name) {
        const { setLoading, setAnswer } = this.props;

        switch (name) {
            case 'house':
                return (
                    <div className='button-house-react' onClick={() => {
                        setLoading(true);

                        // eslint-disable-next-line no-undef
                        mp.trigger('house.enter', 1)
                    }}
                         onMouseOver={() => this.setState({ enterHouseColor: 'black' })}
                         onMouseOut={() => this.setState({ enterHouseColor: '#e1c631' })}
                    >
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="30%" height="30%" viewBox="0 0 323.815 494.238" fill={this.state.enterHouseColor}>
                                <path id="Path_30" data-name="Path 30" d="M199.725,0V36.025H85.211v421.66l114.514.094v36.459L408.81,456.683l.216-418.867ZM234.4,230.574c7.022,0,12.715,7.408,12.715,16.545s-5.692,16.545-12.715,16.545-12.715-7.406-12.715-16.545S227.382,230.574,234.4,230.574ZM119.211,423.713V70.025h80.514V423.778Z" transform="translate(-85.211)"/>
                            </svg>
                        </div>
                        Войти в дом
                    </div>
                )

            case 'garage':
                return (
                    <div className='button-house-react' onClick={() => {
                        setLoading(true);

                        // eslint-disable-next-line no-undef
                        mp.trigger('house.enter', 2)
                    }}
                         onMouseOver={() => this.setState({ enterGarageColor: 'black' })}
                         onMouseOut={() => this.setState({ enterGarageColor: '#e1c631' })}
                    >
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="51.8%" height="30%" viewBox="0 0 250.988 224.46" fill={this.state.enterGarageColor}>
                                <g id="Group_12" data-name="Group 12" transform="translate(0 -13.264)">
                                    <path id="Path_31" data-name="Path 31" d="M201.345,135.041a11.312,11.312,0,0,0-3,.418l-5.693,1.567-7.285-17.744c-3.352-8.166-13.261-14.811-22.088-14.811H87.589c-8.827,0-18.736,6.645-22.088,14.811L58.229,137l-5.586-1.538a11.325,11.325,0,0,0-3-.418c-5.385,0-9.294,4.113-9.294,9.781v.209a12.013,12.013,0,0,0,9.755,11.781,90.5,90.5,0,0,0-5.464,28.155v36.854a12.015,12.015,0,0,0,12,12h6.914a12.015,12.015,0,0,0,12-12v-7.693h99.762v7.693a12.015,12.015,0,0,0,12,12h6.914a12.015,12.015,0,0,0,12-12V184.967a90.493,90.493,0,0,0-5.458-28.138,12.013,12.013,0,0,0,9.866-11.8v-.209C210.639,139.155,206.73,135.041,201.345,135.041Zm-135.4,14.276,11.57-28.188a15.517,15.517,0,0,1,13.245-8.881h69.352a15.517,15.517,0,0,1,13.245,8.881l11.572,28.188c2.005,4.885-.675,8.881-5.954,8.881H71.9C66.619,158.2,63.939,154.2,65.944,149.317Zm29,42.321a4.814,4.814,0,0,1-4.8,4.8H67.1a4.814,4.814,0,0,1-4.8-4.8v-9.809a4.814,4.814,0,0,1,4.8-4.8H90.15a4.814,4.814,0,0,1,4.8,4.8v9.809Zm93.383,0a4.814,4.814,0,0,1-4.8,4.8H160.481a4.814,4.814,0,0,1-4.8-4.8v-9.809a4.814,4.814,0,0,1,4.8-4.8h23.051a4.814,4.814,0,0,1,4.8,4.8Z"/>
                                    <path id="Path_32" data-name="Path 32" d="M228.488,13.264H22.5A22.526,22.526,0,0,0,0,35.764V225.223a12.5,12.5,0,0,0,25,0V92.82H225.988v132.4a12.5,12.5,0,0,0,25,0V35.764A22.526,22.526,0,0,0,228.488,13.264ZM25,64.083H225.988v4.369H25Zm0-10V50.576H225.988v3.507ZM25,82.82V78.452H225.988V82.82H25Z"/>
                                </g>
                            </svg>
                        </div>
                        Войти в гараж
                    </div>
                )

            case 'street':
                return (
                    <div className='button-house-react' onClick={() => {
                        setLoading(true);

                        // eslint-disable-next-line no-undef
                        mp.trigger('house.enter', 0)
                    }}
                         onMouseOver={() => this.setState({ enterStreetColor: 'black' })}
                         onMouseOut={() => this.setState({ enterStreetColor: '#e1c631' })}
                    >
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" style={{ transform: 'scale(.7)' }} width="91%" height="30%" viewBox="0 0 314 162.785" fill={this.state.enterStreetColor}>
                                <g id="Group_14" data-name="Group 14" transform="translate(0 -75.607)">
                                    <path id="Path_36" data-name="Path 36" d="M304,75.607H10a10,10,0,0,0-10,10V228.392a10,10,0,0,0,10,10H304a10,10,0,0,0,10-10V85.607A10,10,0,0,0,304,75.607ZM294,218.393H20V95.607H294Z"/>
                                    <path id="Path_37" data-name="Path 37" d="M55.995,196.333H93.833a10,10,0,1,0,0-20H66v-8H88.329a10,10,0,0,0,0-20H66v-8H93.833a10,10,0,1,0,0-20H55.995a10,10,0,0,0-10,10v56A10,10,0,0,0,55.995,196.333Z"/>
                                    <path id="Path_38" data-name="Path 38" d="M117.234,194.619a10,10,0,0,0,13.885-2.687L141.752,176.2l10.633,15.737a10,10,0,0,0,16.573-11.2l-15.136-22.4,15.136-22.4a10,10,0,0,0-16.573-11.2l-10.633,15.737-10.633-15.737a10,10,0,0,0-16.573,11.2l15.136,22.4-15.136,22.4A10,10,0,0,0,117.234,194.619Z"/>
                                    <path id="Path_39" data-name="Path 39" d="M189.671,196.333a10,10,0,0,0,10-10v-56a10,10,0,1,0-20,0v56A10,10,0,0,0,189.671,196.333Z"/>
                                    <path id="Path_40" data-name="Path 40" d="M216.671,137.667h11.334v48.667a10,10,0,1,0,20,0V137.667h10a10,10,0,0,0,0-20H216.671a10,10,0,1,0,0,20Z"/>
                                </g>
                            </svg>
                        </div>
                        Выйти на улицу
                    </div>
                )
        }
    }

    getButtons(place) {
        switch (place) {
            case 0:
                return (
                    <Fragment>
                        { this.getButton('house') }
                        { this.getButton('garage') }
                    </Fragment>
                );

            case 1:
                return (
                    <Fragment>
                        { this.getButton('garage') }
                        { this.getButton('street') }
                    </Fragment>
                );

            case 2:
                return (
                    <Fragment>
                        { this.getButton('house') }
                        { this.getButton('street') }
                    </Fragment>
                );
        }
    }

    getForm() {
        const { house, enterMenu } = this.props;

       if (house.answerEnter) {
           return (
               this.getAnswer()
           )
       } else {
           return (
               this.getButtons(enterMenu.place)
           )
       }
    }

    getAnswer() {
        const { setAnswer } = this.props;

        return (
            <div onClick={() => {
                setAnswer({ answer: null })
            }}
                 style={{ color: 'white', marginTop: '5%' }}
            >
                Дверь заперта<br/>
                <div>
                    <svg style={{ display: 'block', margin: '5% 45%' }} id="Group_10" data-name="Group 10" xmlns="http://www.w3.org/2000/svg" width="10%" height="10%" viewBox="0 0 233.069 233.069">
                        <path id="Path_26" data-name="Path 26" d="M116.535,0A116.535,116.535,0,1,0,233.069,116.535,116.666,116.666,0,0,0,116.535,0Zm0,224.1A107.57,107.57,0,1,1,224.1,116.535,107.7,107.7,0,0,1,116.535,224.1Z" fill="#e1c631"/>
                        <path id="Path_27" data-name="Path 27" d="M104.33,17.314a4.477,4.477,0,0,0-6.338,0l-37.17,37.17-37.17-37.17a4.481,4.481,0,1,0-6.338,6.338l37.17,37.17-37.17,37.17a4.481,4.481,0,1,0,6.338,6.338l37.17-37.17,37.17,37.17a4.481,4.481,0,0,0,6.338-6.338L67.16,60.822l37.17-37.17A4.477,4.477,0,0,0,104.33,17.314Z" transform="translate(55.713 55.713)" fill="#e1c631"/>
                    </svg>
                </div>
                Нажмите на это сообщение для продолжения
            </div>
        )
    }

    render() {
        const { enterMenu, house } = this.props;

        return (
            <div className='enter_menu-house-react'>
                <div className='exitEnterHouse' name='exit' onClick={this.exit.bind(this)}></div>
                { house.isLoading
                    ? this.getLoader()
                    : this.getForm()
                }
            </div>
        );
    }
}

const mapStateToProps = state => ({
    house: state.house,
    enterMenu: state.enterMenu,
    forms: state.forms
});

const mapDispatchToProps = dispatch => ({
    blurForm: flag => dispatch(setHouseFormBlur(flag)),
    setLoading: flag => dispatch(setLoadingHouse(flag)),
    setAnswer: answer => dispatch(setAnswerEnterHouse(answer)),
    closeMenu: () => dispatch(closeEnterMenuHouse())
});

export default connect(mapStateToProps, mapDispatchToProps)(EnterMenu);