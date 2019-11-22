import React, {Component, Fragment} from 'react';
import HeadAppPhone from "./HeadAppPhone";
import {setCall, setCallStatus, setActiveCall} from "../actions/action.info";
import {addAppDisplay, closeAppDisplay, setAppDisplay} from "../actions/action.apps";
import {connect} from "react-redux";
import DialogPage from "./DialogPage";
import EmergencyCall from './EmergencyCall';
import {addDialog} from "../actions/action.dialogs";

class DialingNumber extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inputNumber: ''
        };

        this.startCall = this.startCall.bind(this);
        this.startDialog = this.startDialog.bind(this);
    }

    handleChangeNumber(e) {
        const { inputNumber } = this.state;

        if (inputNumber.length < 7) {
            this.setState({ inputNumber: inputNumber + e.target.textContent })
        }
    }

    deleteDigitNumber() {
        const { inputNumber } = this.state;

        this.setState({ inputNumber: inputNumber.toString().slice(0, -1) })
    }

    startCall() {
        const { addApp, setCall, info, setActiveCall, setCallStatus } = this.props;
        const { inputNumber } = this.state;

        let outputNumber;

        if (inputNumber) {
            let contact = info.contacts.find(cont => cont.number === inputNumber);

            if (inputNumber == '911') {
                return addApp({ name: 'EmergencyCall', form: <EmergencyCall /> });
            }

            if (contact) {
                outputNumber = contact.name;
            } else {
                outputNumber = inputNumber;
            }

            setCall(true);
            setCallStatus(null);
            setActiveCall(true, outputNumber, true);

            // eslint-disable-next-line no-undef
            mp.trigger('phone.call.start', inputNumber);
        }
    }

    startDialog() {
        const { inputNumber } = this.state;
        const { addApp, dialogs, addDialog } = this.props;

        if (inputNumber) {
            let dialogIndex = dialogs.list.findIndex(d => d.number === inputNumber);

            if (inputNumber == '911') {
                return addApp({ name: 'EmergencyCall', form: <EmergencyCall /> })
            }

            if (dialogIndex === -1) {
                let dialog = { name: '', number: inputNumber };
                addDialog('', inputNumber);
                addApp({ name: 'DialogPage', form: <DialogPage dialog={dialog} /> });
            } else {
                let dialog = dialogs.list[dialogIndex];
                addApp({ name: 'DialogPage', form: <DialogPage dialog={dialog} /> });
            }
        }
    }

    render() {
        const { inputNumber } = this.state;

        return (
            <Fragment>
                <div className="back_page-phone-react">
                    <HeadAppPhone title='Клавиши' />
                    <div className='input_number-phone-react'>
                        { inputNumber }
                    </div>
                    <div className='table_digits-phone-react'>
                        <div className='digit-phone-react' onClick={(e) => this.handleChangeNumber(e)}>1</div>
                        <div className='digit-phone-react' onClick={(e) => this.handleChangeNumber(e)}>2</div>
                        <div className='digit-phone-react' onClick={(e) => this.handleChangeNumber(e)}>3</div>
                        <div className='digit-phone-react' onClick={(e) => this.handleChangeNumber(e)}>4</div>
                        <div className='digit-phone-react' onClick={(e) => this.handleChangeNumber(e)}>5</div>
                        <div className='digit-phone-react' onClick={(e) => this.handleChangeNumber(e)}>6</div>
                        <div className='digit-phone-react' onClick={(e) => this.handleChangeNumber(e)}>7</div>
                        <div className='digit-phone-react' onClick={(e) => this.handleChangeNumber(e)}>8</div>
                        <div className='digit-phone-react' onClick={(e) => this.handleChangeNumber(e)}>9</div>
                        <div className='digit-phone-react' onClick={(e) => this.handleChangeNumber(e)}>0</div>
                    </div>
                    {
                        inputNumber &&
                        <div className='backspace-phone-react' onClick={() => this.deleteDigitNumber()}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 51.324 33.13" fill='#343c47'>
                                <g id="backspace" transform="translate(0 -5.09)">
                                    <path id="Path_23" data-name="Path 23" d="M12.343,5.09,0,21.655,12.343,38.22H51.324V5.09ZM49,36.271H13.632L2.74,21.655,13.632,7.039H49Z" transform="translate(0 0)"/>
                                    <path id="Path_24" data-name="Path 24" d="M18.887,29.927,26.18,23l7.293,6.929,1.414-1.343-7.293-6.929,7.293-6.929-1.414-1.343L26.18,20.312l-7.293-6.929-1.414,1.343,7.293,6.929-7.293,6.929Z" transform="translate(4.664)"/>
                                </g>
                            </svg>
                        </div>
                    }
                    <div className='panel_call_mess_contact-phone-react' style={{ marginTop: '-5%' }}>
                        <div className='button_panel_contact-phone-react' style={{ height: '40%', background: '#31e15f' }} onClick={this.startCall}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="60%" viewBox="0 0 45.327 45.748" style={{ marginTop: '7%' }}>
                                <path data-name="2J" d="M36.868,45.748c-2.248,0-6.229-1.263-10.649-3.379-3.88-1.854-9.34-6.414-14.606-12.2S2.607,18.844,1.6,15.338C.33,12.028-.2,9.428.068,7.818.15,7.319.322,6.281,6.527.9l.082-.06A4.4,4.4,0,0,1,9.132,0,3.545,3.545,0,0,1,11.5.9c1.423,1.217,4.575,5.987,5.507,7.42.2.329,1.931,3.277.635,5.47-.6,1-1.7,3.194-2.306,4.41a54.382,54.382,0,0,0,11.645,12.14l3.954-2.14a5.894,5.894,0,0,1,2.262-.432,6.485,6.485,0,0,1,2.212.392l.337.17,8.03,5.45a4.574,4.574,0,0,1,1.544,2.911,3.675,3.675,0,0,1-1.008,2.75c-.306.339-.7.817-1.087,1.28-2.166,2.589-3.807,4.455-5.2,4.881A4.009,4.009,0,0,1,36.868,45.748ZM9.082,3.005a1.26,1.26,0,0,0-.652.223,50.407,50.407,0,0,0-5.421,5.24c-.04.551.019,2.227,1.417,5.86l.045.13c1.873,6.726,15.441,21.57,23.044,25.21,5.113,2.446,8.264,3.1,9.321,3.1a1.267,1.267,0,0,0,.308-.029c.725-.287,2.845-2.824,3.75-3.908l.027-.033.1-.118c.411-.493.765-.918,1.058-1.242.263-.3.255-.465.252-.529a1.494,1.494,0,0,0-.454-.8l-7.64-5.179a3.584,3.584,0,0,0-1.046-.157,3.238,3.238,0,0,0-.984.147l-5.44,2.959L26,33.338a56.145,56.145,0,0,1-13.666-14.22l-.448-.709.37-.76.1-.206c1.272-2.561,2.18-4.3,2.7-5.184.228-.391-.132-1.579-.594-2.34a53.2,53.2,0,0,0-4.918-6.74A.694.694,0,0,0,9.082,3.005Z" transform="translate(0 0)" fill="#fff"/>
                            </svg>
                        </div>
                        <div className='button_panel_contact-phone-react' style={{ height: '40%', background: '#e1c631' }} onClick={this.startDialog}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="60%" viewBox="0 0 39.5 37.09" style={{ marginTop: '7%' }}>
                                <path id="_1H" data-name="1H" d="M7.249,37.09a1.431,1.431,0,0,1-.636-.139A1.515,1.515,0,0,1,5.75,35.59V27.97H3.5A3.4,3.4,0,0,1,0,24.69V3.28A3.4,3.4,0,0,1,3.5,0H36a3.4,3.4,0,0,1,3.5,3.28V24.69A3.4,3.4,0,0,1,36,27.97H18.791L8.207,36.75A1.469,1.469,0,0,1,7.249,37.09ZM3.5,3c-.311,0-.5.194-.5.28V24.69c0,.085.189.28.5.28H7.25a1.5,1.5,0,0,1,1.5,1.5V32.4l8.542-7.09.028-.015.029-.015a.44.44,0,0,1,.135-.09.719.719,0,0,1,.121-.07l.139-.06c.023,0,.046-.012.068-.019a.723.723,0,0,1,.071-.02l.069-.015.069-.015a.851.851,0,0,1,.158-.01.164.164,0,0,1,.071-.011H36c.311,0,.5-.194.5-.28V3.28c0-.086-.189-.28-.5-.28Z" transform="translate(0 0)" fill="#fff"/>
                            </svg>
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }
}

const mapStateToProps = state => ({
    info: state.info,
    dialogs: state.dialogs
});

const mapDispatchToProps = dispatch => ({
    setCallStatus: status => dispatch(setCallStatus(status)),
    setCall: flag => dispatch(setCall(flag)),
    setApp: app => dispatch(setAppDisplay(app)),
    addApp: app => dispatch(addAppDisplay(app)),
    closeApp: () => dispatch(closeAppDisplay()),
    addDialog: (name, number) => dispatch(addDialog(name, number)),
    setActiveCall: (state, number, isMine) => dispatch(setActiveCall(state, number, isMine))
});

export default connect(mapStateToProps, mapDispatchToProps)(DialingNumber);