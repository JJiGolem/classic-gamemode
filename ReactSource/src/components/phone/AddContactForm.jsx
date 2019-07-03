import React from 'react';
import {connect} from 'react-redux';
import { addApp, setApp, closeApp, addContact } from '../../actions/phone.js';
import Contact from './Contact.jsx';
import Contacts from './Contacts.jsx';

class AddContactForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: undefined,
            color: 'black'
        }
    }

    componentDidUpdate() {
        const { error, color } = this.state;
        if(error) {
            this.refError.style.background = '#fff4f4';
            color !== '#f44343' && this.setState({color: '#f44343'})
        }
    }

    addContact(event) {
        const { setApp, addContact, info } = this.props;
        event.preventDefault();
        let name = this.refName.value;
        let number = this.refNum.value
        var regName = /[\w\sА-яЁё]/;
        var regNum = /[0-9]/

        if(name) {
            if(number) {
                let h = true;
                for(let i = 0; i < name.length; i++) {
                    if(!regName.test(name[i])) {
                        h = false;
                    }
                }
                if(h) {
                    let g = true;
                    for(let i = 0; i < number.length; i++) {
                        if(!regNum.test(number[i])) {
                            g = false;
                        }
                    }
                    if(g) {
                        if(!info.contacts.some(num => number == num.number)) {
                            addContact({name, number})
                            mp.trigger('addContact.client', name, number)
                            setApp(<Contact contact={info.contacts[info.contacts.length - 1]} />)
                        } else {
                            this.setState({error: 'Такой контакт уже есть'})
                            return;
                        }
                    } else {
                        this.setState({error: 'Неверный формат номера'})
                        return;
                    }
                } else {
                    this.setState({error: 'Неверный формат имени'})
                    return;
                }
            } else {
                this.setState({error: 'Номер не заполнен'});
                return;
            }
        } else {
            this.setState({error: 'Имя не заполнено'});
            return;
        }
    }

    back(event) {
        event.preventDefault();
        this.props.setApp(<Contacts />)
    }

    render() {
        return (
            <div style={{backgroundColor: 'white', height: '364px', fontSize: '14px'}}>
                <div className='headContacts'>
                    <button onClick={this.back.bind(this)} id='idBackContacts'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18.812" height="35.125" viewBox="0 0 18.812 35.125" style={{transform: 'scale(0.4)', marginTop: '-2px'}}>
                            <path id="_6A" data-name="6A" d="M17.311,35.125a1.5,1.5,0,0,0,1.069-2.553L3.6,17.562,18.38,2.552a1.5,1.5,0,1,0-2.137-2.1L.431,16.51a1.5,1.5,0,0,0,0,2.1L16.243,34.677a1.5,1.5,0,0,0,1.068.448" transform="translate(0 0)" fill="#fff"/>
                        </svg>
                        <span style={{paddingTop: '2px'}}>Назад</span>
                    </button>
                </div>

                <div className='contactIcon' style={{width: '100px', height: '100px', margin: '0px 0 0px 60px', transform: 'scale(.7)'}}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="38" height="36.19" viewBox="0 0 38 36.19" style={{transform: 'scale(2.5)', margin: '50px 29px'}}>
                            <path id="_4F" data-name="4F" d="M17.877,37.19A32.219,32.219,0,0,1,4.442,34.554c-3.589-1.7-5.565-3.96-5.565-6.364s1.976-4.664,5.565-6.364A32.219,32.219,0,0,1,17.877,19.19a32.219,32.219,0,0,1,13.435,2.636c3.588,1.7,5.565,3.96,5.565,6.364s-1.976,4.664-5.565,6.364A32.219,32.219,0,0,1,17.877,37.19Zm.29-19.537A8.892,8.892,0,0,1,9.23,8.826a8.939,8.939,0,0,1,17.876,0A8.893,8.893,0,0,1,18.167,17.653Z" transform="translate(1.123 0)" fill="#cacaca"/>                    
                        </svg>
                    </div>

                <div className='numberPanelInput' style={{marginTop: '-10px', fontSize: '12px', width: '85%', padding: '13px 10px 5px 10px', color: this.state.color}} ref={(error) => {this.refError = error}}>
                    {this.state.error ? this.state.error : 'Заполните поля ниже'}
                </div>
                <div className='renameField' style={{height: '140px'}}>
                    <input placeholder='Введите имя' id='inputRenameContact' ref={(input) => {this.refName = input;}} style={{marginBottom: '20px'}} maxLength='15'></input>
                    <input placeholder='Введите номер' id='inputRenameContact' ref={(input) => {this.refNum = input;}} maxLength='8'></input>
                    <button id='butEndCall' onClick={this.addContact.bind(this)} style={{bottom: '-15px', background: '#E1C631', color: 'white'}}>Добавить</button>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    ...state,
    info: state.phoneInfo
})

const mapDispathToProps = dispatch => ({
    addApp: app => dispatch(addApp(app)),
    setApp: app => dispatch(setApp(app)),
    closeApp: () => dispatch(closeApp()),
    addContact: contact => dispatch(addContact(contact))
})

export default connect(mapStateToProps, mapDispathToProps)(AddContactForm)