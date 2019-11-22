import React, {Component, Fragment} from 'react';
import { connect } from 'react-redux';
import {addAppDisplay, closeAppDisplay, setAppDisplay} from "../actions/action.apps";
import {deleteContact, renameContact, sortContacts, setActiveCall } from "../actions/action.info";
import {addDialog, renameDialog} from "../actions/action.dialogs";
import DialogPage from "./DialogPage";

class ContactPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: '',
            name: '',
            isDeleted: false
        };

        this.handleChangeName = this.handleChangeName.bind(this);
        this.renameContact = this.renameContact.bind(this);
        this.deleteContact = this.deleteContact.bind(this);
        this.callContact = this.callContact.bind(this);
        this.dialogContact = this.dialogContact.bind(this);
    }

    componentWillUnmount() {
        this.props.sortContacts();
    }

    handleChangeName(e) {
        this.setState({ name: e.target.value })
    }

    renameContact(e) {
        e.preventDefault();
        const { name } = this.state;
        const { renameContact, contact, dialogs, renameDialog } = this.props;

        if (name) {
            this.setState({ error: '', name: '' });
            renameContact(contact.number, name);
            // eslint-disable-next-line no-undef
            mp.trigger('phone.contact.rename', contact.number, name);
            let dialog = dialogs.list.find(dialog => dialog.number === contact.number);
            if (dialog) {
                renameDialog(dialog.number, name);
            }
        } else {
            this.setState({ error: 'Поле не заполнено' })
        }
    }

    deleteContact(e) {
        const { contact, deleteContact } = this.props;

        this.setState({ isDeleted: true });
        deleteContact(contact.number);
        // eslint-disable-next-line no-undef
        mp.trigger('phone.contact.remove', contact.number);

        this.back();
    }

    callContact() {
        const { setActiveCall, contact } = this.props;

        // eslint-disable-next-line no-undef
        mp.trigger('phone.call.start', contact.number);

        setActiveCall(true, contact.name, true);
    }

    dialogContact() {
        const { addApp, contact, dialogs, addDialog } = this.props;

        let dialog = dialogs.list.find(dialog => dialog.number === contact.number);

        if (dialog) {
            addApp({name: 'DialogPage', form: <DialogPage dialog={dialog} />})
        } else {
            addDialog(contact.name, contact.number);
            addApp({name: 'DialogPage', form: <DialogPage dialog={{
                    name: contact.name,
                    number: contact.number
                }} />})
        }
    }

    back() {
        const { closeApp, addApp } = this.props;

        closeApp();
        //addApp({name: 'Contacts', form: <Contacts />});
    }

    render() {

        const { contact, info } = this.props;
        const { error, isDeleted } = this.state;

        return (
            <Fragment>
                <div className="back_page-phone-react">
                    <div className="head_app-phone-react" style={{ height: '40%' }}>
                        <span style={{ float: 'left', margin: '6% 0 0 10%', display: 'inline-block', width: '21%' }} onClick={this.back.bind(this)}
                        >
                             <svg xmlns="http://www.w3.org/2000/svg" width="11%" height="6%" viewBox="0 0 18.812 35.125">
                                <path id="_6A" data-name="6A" d="M17.311,35.125a1.5,1.5,0,0,0,1.069-2.553L3.6,17.562,18.38,2.552a1.5,1.5,0,1,0-2.137-2.1L.431,16.51a1.5,1.5,0,0,0,0,2.1L16.243,34.677a1.5,1.5,0,0,0,1.068.448" transform="translate(0 0)" fill="#fff"/>
                            </svg>
                            Назад
                        </span>
                        <span style={{ float: 'right', opacity: (isDeleted || contact.number == info.number) ? '0' : '1' }}>
                            <svg style={{float: 'right', margin: '-7% 10% 5% 0' }} xmlns="http://www.w3.org/2000/svg" width="7%" height="7%" viewBox="0 0 33.88 38.88"
                                 onClick={this.deleteContact}
                            >
                                <path id="_10H" data-name="10H" d="M27,38.88H6.75a3.5,3.5,0,0,1-3.5-3.5V8.5H1.5a1.5,1.5,0,1,1,0-3H9.38v-2A3.5,3.5,0,0,1,12.88,0H20.75a3.5,3.5,0,0,1,3.5,3.5v2H32.38a1.5,1.5,0,0,1,0,3H30.5V35.38A3.5,3.5,0,0,1,27,38.88ZM6.25,8.5V35.38a.507.507,0,0,0,.5.5H27a.5.5,0,0,0,.5-.5V8.5ZM12.88,3a.507.507,0,0,0-.5.5v2h8.869v-2a.5.5,0,0,0-.5-.5Zm9.87,29.94a1.5,1.5,0,0,1-1.5-1.5v-18a1.5,1.5,0,0,1,3,0v18A1.5,1.5,0,0,1,22.75,32.94Zm-5.93,0a1.5,1.5,0,0,1-1.5-1.5v-18a1.5,1.5,0,0,1,3,0v18A1.5,1.5,0,0,1,16.82,32.94Zm-5.94,0a1.5,1.5,0,0,1-1.5-1.5v-18a1.5,1.5,0,0,1,3,0v18A1.5,1.5,0,0,1,10.88,32.94Z" transform="translate(0 0)" fill="#fff"/>
                            </svg>
                        </span>
                        <div className='back_icon_contact-phone-react'>
                            <svg className='contact_icon-phone-react' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 38 36.19">
                                <path id="_4F" data-name="4F" d="M17.877,37.19A32.219,32.219,0,0,1,4.442,34.554c-3.589-1.7-5.565-3.96-5.565-6.364s1.976-4.664,5.565-6.364A32.219,32.219,0,0,1,17.877,19.19a32.219,32.219,0,0,1,13.435,2.636c3.588,1.7,5.565,3.96,5.565,6.364s-1.976,4.664-5.565,6.364A32.219,32.219,0,0,1,17.877,37.19Zm.29-19.537A8.892,8.892,0,0,1,9.23,8.826a8.939,8.939,0,0,1,17.876,0A8.893,8.893,0,0,1,18.167,17.653Z" transform="translate(1.123 0)" fill="#cacaca"/>
                            </svg>
                        </div>
                        <div className='contact_name-phone-react'>
                            <span>{ isDeleted ? contact.number : contact.name }</span>
                        </div>
                        <div className='panel_call_mess_contact-phone-react'>
                            {contact.number != info.number && <div className='button_panel_contact-phone-react' style={{ background: '#31e15f' }} onClick={this.callContact}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="55%" viewBox="0 0 45.327 45.748" style={{ marginTop: '7%' }}>
                                    <path data-name="2J" d="M36.868,45.748c-2.248,0-6.229-1.263-10.649-3.379-3.88-1.854-9.34-6.414-14.606-12.2S2.607,18.844,1.6,15.338C.33,12.028-.2,9.428.068,7.818.15,7.319.322,6.281,6.527.9l.082-.06A4.4,4.4,0,0,1,9.132,0,3.545,3.545,0,0,1,11.5.9c1.423,1.217,4.575,5.987,5.507,7.42.2.329,1.931,3.277.635,5.47-.6,1-1.7,3.194-2.306,4.41a54.382,54.382,0,0,0,11.645,12.14l3.954-2.14a5.894,5.894,0,0,1,2.262-.432,6.485,6.485,0,0,1,2.212.392l.337.17,8.03,5.45a4.574,4.574,0,0,1,1.544,2.911,3.675,3.675,0,0,1-1.008,2.75c-.306.339-.7.817-1.087,1.28-2.166,2.589-3.807,4.455-5.2,4.881A4.009,4.009,0,0,1,36.868,45.748ZM9.082,3.005a1.26,1.26,0,0,0-.652.223,50.407,50.407,0,0,0-5.421,5.24c-.04.551.019,2.227,1.417,5.86l.045.13c1.873,6.726,15.441,21.57,23.044,25.21,5.113,2.446,8.264,3.1,9.321,3.1a1.267,1.267,0,0,0,.308-.029c.725-.287,2.845-2.824,3.75-3.908l.027-.033.1-.118c.411-.493.765-.918,1.058-1.242.263-.3.255-.465.252-.529a1.494,1.494,0,0,0-.454-.8l-7.64-5.179a3.584,3.584,0,0,0-1.046-.157,3.238,3.238,0,0,0-.984.147l-5.44,2.959L26,33.338a56.145,56.145,0,0,1-13.666-14.22l-.448-.709.37-.76.1-.206c1.272-2.561,2.18-4.3,2.7-5.184.228-.391-.132-1.579-.594-2.34a53.2,53.2,0,0,0-4.918-6.74A.694.694,0,0,0,9.082,3.005Z" transform="translate(0 0)" fill="#fff"/>
                                </svg>
                            </div>}
                            <div className='button_panel_contact-phone-react' style={{ background: '#e1c631' }} onClick={() => this.dialogContact()}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="55%" viewBox="0 0 39.5 37.09" style={{ marginTop: '7%' }}>
                                    <path id="_1H" data-name="1H" d="M7.249,37.09a1.431,1.431,0,0,1-.636-.139A1.515,1.515,0,0,1,5.75,35.59V27.97H3.5A3.4,3.4,0,0,1,0,24.69V3.28A3.4,3.4,0,0,1,3.5,0H36a3.4,3.4,0,0,1,3.5,3.28V24.69A3.4,3.4,0,0,1,36,27.97H18.791L8.207,36.75A1.469,1.469,0,0,1,7.249,37.09ZM3.5,3c-.311,0-.5.194-.5.28V24.69c0,.085.189.28.5.28H7.25a1.5,1.5,0,0,1,1.5,1.5V32.4l8.542-7.09.028-.015.029-.015a.44.44,0,0,1,.135-.09.719.719,0,0,1,.121-.07l.139-.06c.023,0,.046-.012.068-.019a.723.723,0,0,1,.071-.02l.069-.015.069-.015a.851.851,0,0,1,.158-.01.164.164,0,0,1,.071-.011H36c.311,0,.5-.194.5-.28V3.28c0-.086-.189-.28-.5-.28Z" transform="translate(0 0)" fill="#fff"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                    {
                        !isDeleted &&
                        <div className='contact_page-phone-react'>
                            <div className='contact_number-phone-react'>
                                <span style={{ float: 'left' }}>Номер</span>
                                <span style={{ float: 'right' }}>{ contact.number }</span>
                            </div>

                            {
                                contact.number != info.number &&
                                <div className='contact_rename-phone-react'>
                                    <span style={{ marginLeft: '5%' }}>Переименовать</span>
                                    <input className='input_rename_contact-phone-react'
                                           onChange={this.handleChangeName}
                                           value={this.state.name}
                                    />
                                    <div className='error_span-phone-react'>{ error }</div>
                                    <button className='button_rename_contact-phone-react'
                                            onClick={this.renameContact}
                                    >
                                        Применить
                                    </button>
                                </div>
                            }
                        </div>
                    }
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
    setApp: app => dispatch(setAppDisplay(app)),
    addApp: app => dispatch(addAppDisplay(app)),
    renameContact: (number, newName) => dispatch(renameContact(number, newName)),
    renameDialog: (number, newName) => dispatch(renameDialog(number, newName)),
    deleteContact: number => dispatch(deleteContact(number)),
    addDialog: (name, number) => dispatch(addDialog(name, number)),
    closeApp: () => dispatch(closeAppDisplay()),
    sortContacts: () => dispatch(sortContacts()),
    setActiveCall: (state, number, isMine) => dispatch(setActiveCall(state, number, isMine))
});

export default connect(mapStateToProps, mapDispatchToProps)(ContactPage);