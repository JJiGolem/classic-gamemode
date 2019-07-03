import React from 'react';
import {connect} from 'react-redux';
import { setApp, addApp, closeApp } from '../../actions/phone.js';
import Contact from './Contact.jsx';
import AddContactForm from './AddContactForm.jsx';
import MainDisplay from './MainDisplay.jsx';
import ActiveCall from './ActiveCall.jsx';

class Contacts extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            selectCont: undefined,
            search: undefined
        }
    }

    componentWillMount() {
        const { info } = this.props;
        info.contacts && info.contacts.sort((a, b) => a.name.localeCompare(b.name))
    }

    componentDidUpdate(prevState, prevProps) {
        const { info } = this.props;
        info.contacts && info.contacts.sort((a, b) => a.name.localeCompare(b.name))
    }

    handleChangeInput(event) {
        event.preventDefault();
        this.setState({search: String(event.target.value).toLowerCase()})
    }

    selectContact(event) {
        const { info, addApp, setApp } = this.props;
        event.preventDefault();
        var id = event.target.id;
        var ind = info.contacts.findIndex(cont => cont.number == id)
        addApp(<Contact contact={info.contacts[ind]} />);
    }

    callContact(event) {
        event.preventDefault();
        this.props.addApp(<ActiveCall number={event.target.id} status='Исходящий вызов' />)
    }

    getContact(contact) {
        return(
            <div className='contactPhone' onClick={this.selectContact.bind(this)} id={contact.number}>
                <div className='contactName' id={contact.number}><span id={contact.number} >{contact.name}</span></div>
                <svg xmlns="http://www.w3.org/2000/svg" id={contact.number} onClick={this.callContact.bind(this)} width="45.327" height="45.748" viewBox="0 0 45.327 45.748" style={{transform: 'scale(0.3)', marginBottom: '10px'}}>
                    <path id={contact.number} data-name="2J" d="M36.868,45.748c-2.248,0-6.229-1.263-10.649-3.379-3.88-1.854-9.34-6.414-14.606-12.2S2.607,18.844,1.6,15.338C.33,12.028-.2,9.428.068,7.818.15,7.319.322,6.281,6.527.9l.082-.06A4.4,4.4,0,0,1,9.132,0,3.545,3.545,0,0,1,11.5.9c1.423,1.217,4.575,5.987,5.507,7.42.2.329,1.931,3.277.635,5.47-.6,1-1.7,3.194-2.306,4.41a54.382,54.382,0,0,0,11.645,12.14l3.954-2.14a5.894,5.894,0,0,1,2.262-.432,6.485,6.485,0,0,1,2.212.392l.337.17,8.03,5.45a4.574,4.574,0,0,1,1.544,2.911,3.675,3.675,0,0,1-1.008,2.75c-.306.339-.7.817-1.087,1.28-2.166,2.589-3.807,4.455-5.2,4.881A4.009,4.009,0,0,1,36.868,45.748ZM9.082,3.005a1.26,1.26,0,0,0-.652.223,50.407,50.407,0,0,0-5.421,5.24c-.04.551.019,2.227,1.417,5.86l.045.13c1.873,6.726,15.441,21.57,23.044,25.21,5.113,2.446,8.264,3.1,9.321,3.1a1.267,1.267,0,0,0,.308-.029c.725-.287,2.845-2.824,3.75-3.908l.027-.033.1-.118c.411-.493.765-.918,1.058-1.242.263-.3.255-.465.252-.529a1.494,1.494,0,0,0-.454-.8l-7.64-5.179a3.584,3.584,0,0,0-1.046-.157,3.238,3.238,0,0,0-.984.147l-5.44,2.959L26,33.338a56.145,56.145,0,0,1-13.666-14.22l-.448-.709.37-.76.1-.206c1.272-2.561,2.18-4.3,2.7-5.184.228-.391-.132-1.579-.594-2.34a53.2,53.2,0,0,0-4.918-6.74A.694.694,0,0,0,9.082,3.005Z" transform="translate(0 0)" fill="#000"/>
                </svg>
            </div>
        )
    }

    addContact(event) {
        event.preventDefault();
        this.props.addApp(<AddContactForm />)
    }

    back(event) {
        event.preventDefault();
        this.props.setApp(<MainDisplay />)
    }

    getContacts() {
        const { info } = this.props;
        if(!this.state.search && info.contacts.length !== 0) {
            return(
                info.contacts && info.contacts.map((contact, index) => (
                    <li key={index*100}>
                        {this.getContact(contact, index)}
                    </li>
                ))
            )
        } else {
            let filtered = info.contacts.filter(contact => String(contact.name).toLowerCase().includes(this.state.search))
            return (
                filtered && filtered.map(cont => (
                    <li>
                        {this.getContact(cont)}
                    </li>
                ))
            )
        }
    }

    render() {
        return(
            <div style={{backgroundColor: 'white', height: '364px'}}>
                <div className='headContacts'>
                    <button onClick={this.back.bind(this)} id='idBackContacts'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18.812" height="35.125" viewBox="0 0 18.812 35.125" style={{transform: 'scale(0.4)', marginTop: '-2px'}}>
                            <path id="_6A" data-name="6A" d="M17.311,35.125a1.5,1.5,0,0,0,1.069-2.553L3.6,17.562,18.38,2.552a1.5,1.5,0,1,0-2.137-2.1L.431,16.51a1.5,1.5,0,0,0,0,2.1L16.243,34.677a1.5,1.5,0,0,0,1.068.448" transform="translate(0 0)" fill="#fff"/>
                        </svg>
                        <span style={{paddingTop: '2px'}}>Назад</span>
                    </button>
                    <svg xmlns="http://www.w3.org/2000/svg" onClick={this.addContact.bind(this)} width="37.824" height="37.824" viewBox="0 0 37.824 37.824" style={{transform: 'scale(.6)', position: 'absolute', right: '20px', top: '7px', cursor: 'pointer'}}>
                        <path id="_5A" data-name="5A" d="M20.412,20.412H36.325a1.5,1.5,0,0,0,0-3H20.412V1.5a1.5,1.5,0,0,0-3,0V17.412H1.5a1.5,1.5,0,1,0,0,3H17.412V36.325a1.5,1.5,0,0,0,3,0V20.412" transform="translate(0 0)" fill="#fff"/>
                    </svg>
                </div>
                <input type='text' onChange={this.handleChangeInput.bind(this)} placeholder='Поиск' className='inputContacts'></input>
                <ul style={{listStyle:'none', marginLeft: '-40px', paddingTop: '10px', height: '254px', overflow: 'auto'}}>
                    {this.getContacts()}
                </ul>
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
    addApp: app => dispatch(addApp(app))
})

export default connect(mapStateToProps, mapDispathToProps)(Contacts)