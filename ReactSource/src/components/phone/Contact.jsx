import React from 'react';
import {connect} from 'react-redux';
import { setApp, addApp, closeApp, removeContact, renameContact } from '../../actions/phone.js';
import { addDialog } from '../../actions/dialogs.js';
import ActiveCall from './ActiveCall.jsx';
import Dialogs from './Dialogs.jsx';
import Dialog from './Dialog.jsx';
import Contacts from './Contacts.jsx';
import {number} from '../../source/phone.js';

class Contact extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isRemove: false,
            name: this.props.contact.name,
            isCall: false
        }
    }

    call(event) {
        event.preventDefault();
        mp.trigger('startCall.client', this.props.contact.number)
        number[0] = this.props.contact.name;
        this.props.addApp(<ActiveCall number={this.props.contact.name} status='Исходящий вызов' />)
    }

    writeMessage(event) {
        const { dialogs, addApp, contact, addDialog } = this.props;
        event.preventDefault();
        let ind = dialogs.findIndex(element => element.number == contact.number);
        if(ind == -1) {
            addDialog(contact.name, contact.number)
            addApp(<Dialogs/>)
        } else {
            addApp(<Dialog dialog={dialogs[ind]} />)
        } 
    }

    remove(event) {
        const { removeContact, contact, dialogs } = this.props;
        event.preventDefault();
        removeContact(contact.number);
        mp.trigger('removeContact.client', contact.number)
        let ind = dialogs.findIndex(element => element.number == contact.number);
        if(ind !== -1) {
            dialogs[ind].name = '';
        } 
        this.setState({isRemove: true});
    }

    rename(event) {
        event.preventDefault();
        const { renameContact, contact } = this.props;
        let newName = this.refInput.value;
        if(newName) {
            renameContact(contact.number,  newName)
            this.setState({name: newName, text: undefined})
            this.refInput.value = '';
        }
    }

    back(event) {
        event.preventDefault();
        this.props.setApp(<Contacts />)
    }

    render() {
        const { contact } = this.props;
        return(
            <div style={{backgroundColor: 'white', height: '365px'}}>
                <div className='headContacts' style={{height: '170px'}}>
                    <button onClick={this.back.bind(this)} id='idBackContacts'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18.812" height="35.125" viewBox="0 0 18.812 35.125" style={{transform: 'scale(0.4)', marginTop: '-2px'}}>
                            <path id="_6A" data-name="6A" d="M17.311,35.125a1.5,1.5,0,0,0,1.069-2.553L3.6,17.562,18.38,2.552a1.5,1.5,0,1,0-2.137-2.1L.431,16.51a1.5,1.5,0,0,0,0,2.1L16.243,34.677a1.5,1.5,0,0,0,1.068.448" transform="translate(0 0)" fill="#fff"/>
                        </svg>
                        <span style={{paddingTop: '2px'}}>Назад</span>
                    </button>

                    {
                        !this.state.isRemove && 
                        <svg xmlns="http://www.w3.org/2000/svg" onClick={this.remove.bind(this)} width="33.88" height="38.88" viewBox="0 0 33.88 38.88" style={{transform: 'scale(.5)', position: 'absolute', right: '20px', top: '7px', cursor: 'pointer'}}>
                            <path id="_10H" data-name="10H" d="M27,38.88H6.75a3.5,3.5,0,0,1-3.5-3.5V8.5H1.5a1.5,1.5,0,1,1,0-3H9.38v-2A3.5,3.5,0,0,1,12.88,0H20.75a3.5,3.5,0,0,1,3.5,3.5v2H32.38a1.5,1.5,0,0,1,0,3H30.5V35.38A3.5,3.5,0,0,1,27,38.88ZM6.25,8.5V35.38a.507.507,0,0,0,.5.5H27a.5.5,0,0,0,.5-.5V8.5ZM12.88,3a.507.507,0,0,0-.5.5v2h8.869v-2a.5.5,0,0,0-.5-.5Zm9.87,29.94a1.5,1.5,0,0,1-1.5-1.5v-18a1.5,1.5,0,0,1,3,0v18A1.5,1.5,0,0,1,22.75,32.94Zm-5.93,0a1.5,1.5,0,0,1-1.5-1.5v-18a1.5,1.5,0,0,1,3,0v18A1.5,1.5,0,0,1,16.82,32.94Zm-5.94,0a1.5,1.5,0,0,1-1.5-1.5v-18a1.5,1.5,0,0,1,3,0v18A1.5,1.5,0,0,1,10.88,32.94Z" transform="translate(0 0)" fill="#fff"/>
                        </svg>
                    }

                    <div className='contactIcon' style={{width: '100px', height: '100px', position: 'absolute', left: '10px', top: '30px', transform: 'scale(.7)'}}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="38" height="36.19" viewBox="0 0 38 36.19" style={{transform: 'scale(2.5)', margin: '50px 29px'}}>
                            <path id="_4F" data-name="4F" d="M17.877,37.19A32.219,32.219,0,0,1,4.442,34.554c-3.589-1.7-5.565-3.96-5.565-6.364s1.976-4.664,5.565-6.364A32.219,32.219,0,0,1,17.877,19.19a32.219,32.219,0,0,1,13.435,2.636c3.588,1.7,5.565,3.96,5.565,6.364s-1.976,4.664-5.565,6.364A32.219,32.219,0,0,1,17.877,37.19Zm.29-19.537A8.892,8.892,0,0,1,9.23,8.826a8.939,8.939,0,0,1,17.876,0A8.893,8.893,0,0,1,18.167,17.653Z" transform="translate(1.123 0)" fill="#cacaca"/>                    
                        </svg>
                    </div>
                    <div style={{width: '80px', fontSize: '18px', marginLeft: '120px', marginTop: '30px', color: '#e1c631', wordWrap: 'break-word'}}>{contact.name}</div>
                </div>
                <button id='butStartCall' onClick={this.call.bind(this)} style={{bottom: '180px'}}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="45.327" height="45.748" viewBox="0 0 45.327 45.748" style={{transform: 'scale(0.4)', marginTop: '-5.5px'}}>
                        <path data-name="2J" d="M36.868,45.748c-2.248,0-6.229-1.263-10.649-3.379-3.88-1.854-9.34-6.414-14.606-12.2S2.607,18.844,1.6,15.338C.33,12.028-.2,9.428.068,7.818.15,7.319.322,6.281,6.527.9l.082-.06A4.4,4.4,0,0,1,9.132,0,3.545,3.545,0,0,1,11.5.9c1.423,1.217,4.575,5.987,5.507,7.42.2.329,1.931,3.277.635,5.47-.6,1-1.7,3.194-2.306,4.41a54.382,54.382,0,0,0,11.645,12.14l3.954-2.14a5.894,5.894,0,0,1,2.262-.432,6.485,6.485,0,0,1,2.212.392l.337.17,8.03,5.45a4.574,4.574,0,0,1,1.544,2.911,3.675,3.675,0,0,1-1.008,2.75c-.306.339-.7.817-1.087,1.28-2.166,2.589-3.807,4.455-5.2,4.881A4.009,4.009,0,0,1,36.868,45.748ZM9.082,3.005a1.26,1.26,0,0,0-.652.223,50.407,50.407,0,0,0-5.421,5.24c-.04.551.019,2.227,1.417,5.86l.045.13c1.873,6.726,15.441,21.57,23.044,25.21,5.113,2.446,8.264,3.1,9.321,3.1a1.267,1.267,0,0,0,.308-.029c.725-.287,2.845-2.824,3.75-3.908l.027-.033.1-.118c.411-.493.765-.918,1.058-1.242.263-.3.255-.465.252-.529a1.494,1.494,0,0,0-.454-.8l-7.64-5.179a3.584,3.584,0,0,0-1.046-.157,3.238,3.238,0,0,0-.984.147l-5.44,2.959L26,33.338a56.145,56.145,0,0,1-13.666-14.22l-.448-.709.37-.76.1-.206c1.272-2.561,2.18-4.3,2.7-5.184.228-.391-.132-1.579-.594-2.34a53.2,53.2,0,0,0-4.918-6.74A.694.694,0,0,0,9.082,3.005Z" transform="translate(0 0)" fill="#fff"/>
                    </svg>
                </button>

                <button id='butEndCall' onClick={this.writeMessage.bind(this)} style={{bottom: '180px', background: '#E1C631'}}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="39.5" height="37.09" viewBox="0 0 39.5 37.09" style={{transform: 'scale(0.45)'}}>
                        <path id="_1H" data-name="1H" d="M7.249,37.09a1.431,1.431,0,0,1-.636-.139A1.515,1.515,0,0,1,5.75,35.59V27.97H3.5A3.4,3.4,0,0,1,0,24.69V3.28A3.4,3.4,0,0,1,3.5,0H36a3.4,3.4,0,0,1,3.5,3.28V24.69A3.4,3.4,0,0,1,36,27.97H18.791L8.207,36.75A1.469,1.469,0,0,1,7.249,37.09ZM3.5,3c-.311,0-.5.194-.5.28V24.69c0,.085.189.28.5.28H7.25a1.5,1.5,0,0,1,1.5,1.5V32.4l8.542-7.09.028-.015.029-.015a.44.44,0,0,1,.135-.09.719.719,0,0,1,.121-.07l.139-.06c.023,0,.046-.012.068-.019a.723.723,0,0,1,.071-.02l.069-.015.069-.015a.851.851,0,0,1,.158-.01.164.164,0,0,1,.071-.011H36c.311,0,.5-.194.5-.28V3.28c0-.086-.189-.28-.5-.28Z" transform="translate(0 0)" fill="#fff"/>
                    </svg>
                </button>
                <div className='numberPanelInput' style={{marginTop: '15px', fontSize: '14px', width: '85%', padding: '8px 10px 5px 10px'}}>
                    <span>Номер</span>
                    <span style={{float: 'right', fontWeight: 'bold'}}>{contact.number}</span>
                </div>
                {!this.state.isRemove && 
                    <div className='renameField'>
                        <span>Переименовать</span>
                        <input placeholder='Введите имя' id='inputRenameContact' ref={(input) => {this.refInput = input;}}></input>
                        <button id='butEndCall' onClick={this.rename.bind(this)} style={{bottom: '-15px', background: '#E1C631', color: 'white'}}>Применить</button>
                    </div>
                }
            </div>
        )
    }
}

const mapStateToProps = state => ({
    ...state,
    info: state.phoneInfo
})

const mapDispathToProps = dispatch => ({
    setApp: app => dispatch(setApp(app)),
    closeApp: () => dispatch(closeApp()),
    addApp: app => dispatch(addApp(app)),
    removeContact: contact => dispatch(removeContact(contact)),
    renameContact: (contact, newName) => dispatch(renameContact(contact, newName)),
    addDialog: (name, number) => dispatch(addDialog(name, number))
})

export default connect(mapStateToProps, mapDispathToProps)(Contact)