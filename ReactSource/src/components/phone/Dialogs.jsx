import React from 'react';
import {connect} from 'react-redux';
import { setApp, addApp, closeApp } from '../../actions/phone.js';
import Dialog from './Dialog.jsx';
import MainDisplay from './MainDisplay.jsx';
import Call from './Call.jsx';

class Dialogs extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            selectCont: undefined,
            search: undefined
        }
    }

    componentWillMount() {
        const { dialogs } = this.props;
        dialogs && dialogs.sort((a, b) => a.name.localeCompare(b.name))
    }

    componentDidUpdate(prevState, prevProps) {
        const { dialogs } = this.props;
        dialogs && dialogs.sort((a, b) => a.name.localeCompare(b.name))
    }

    handleChangeInput(event) {
        event.preventDefault();
        this.setState({search: String(event.target.value).toLowerCase()})
    }

    selectContact(event) {
        const { addApp, dialogs } = this.props;
        event.preventDefault();
        let id = event.target.id;
        let ind = dialogs.findIndex(element => element.number == id);
        addApp(<Dialog dialog={dialogs[ind]}/>)
    }

    getDialog(dialog) {
        return(
            <div className='dialogPhone' onClick={this.selectContact.bind(this)} id={dialog.number}>
                <div className='contactIcon' id={dialog.number}>
                    <svg xmlns="http://www.w3.org/2000/svg" id={dialog.number} width="38" height="36.19" viewBox="0 0 38 36.19" style={{transform: 'scale(.8)', margin: '8px 0 0 1px'}}>
                        <path id={dialog.number} data-name="4F" d="M17.877,37.19A32.219,32.219,0,0,1,4.442,34.554c-3.589-1.7-5.565-3.96-5.565-6.364s1.976-4.664,5.565-6.364A32.219,32.219,0,0,1,17.877,19.19a32.219,32.219,0,0,1,13.435,2.636c3.588,1.7,5.565,3.96,5.565,6.364s-1.976,4.664-5.565,6.364A32.219,32.219,0,0,1,17.877,37.19Zm.29-19.537A8.892,8.892,0,0,1,9.23,8.826a8.939,8.939,0,0,1,17.876,0A8.893,8.893,0,0,1,18.167,17.653Z" transform="translate(1.123 0)" fill="#cacaca"/>                    
                    </svg>
                </div>
                <div className='dialogName' id={dialog.number}>      
                {dialog.messages.length !== 0 
                    ? <div className='contentDialog' id={dialog.number}>
                        {dialog.name !== '' ? <span id={dialog.number}>{dialog.name}</span> : <span id={dialog.number}>{dialog.number}</span>}
                        <br></br>
                        <span id={dialog.number} style={{fontSize: '12px'}}>{dialog.messages[dialog.messages.length - 1].text}</span>
                      </div>
                      
                    : <div className='contentDialog' id={dialog.number}>
                        {dialog.name !== '' ? <span id={dialog.number}>{dialog.name}</span> : <span id={dialog.number}>{dialog.number}</span>}
                        <br></br>
                        <span id={dialog.number} style={{fontSize: '12px', color: 'gray'}}>Пустой диалог</span>
                      </div>
                }
                </div>
            </div>
        )
    }

    back(event) {
        event.preventDefault();
        this.props.setApp(<MainDisplay />)
    }

    getDialogs() {
        const { dialogs } = this.props;
        if(!this.state.search) {
            return(
                dialogs && dialogs.map((dialog, index) => (
                    <li key={index*100}>
                        {this.getDialog(dialog)}
                    </li>
                ))
            )
        } else {
            let filtered = dialogs.filter(dialog => String(dialog.name).toLowerCase().includes(this.state.search))
            return (
                filtered && filtered.map(dialog => (
                    <li>
                        {this.getDialog(dialog)}
                    </li>
                ))
            )
        }
    }

    addDialog(event) {
        event.preventDefault();
        this.props.addApp(<Call />);
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
                    <svg xmlns="http://www.w3.org/2000/svg" onClick={this.addDialog.bind(this)} width="37.824" height="37.824" viewBox="0 0 37.824 37.824" style={{transform: 'scale(.6)', position: 'absolute', right: '20px', top: '7px', cursor: 'pointer'}}>
                        <path id="_5A" data-name="5A" d="M20.412,20.412H36.325a1.5,1.5,0,0,0,0-3H20.412V1.5a1.5,1.5,0,0,0-3,0V17.412H1.5a1.5,1.5,0,1,0,0,3H17.412V36.325a1.5,1.5,0,0,0,3,0V20.412" transform="translate(0 0)" fill="#fff"/>
                    </svg>
                </div>
                <input type='text' maxLength={15} onChange={this.handleChangeInput.bind(this)} className='inputContacts' placeholder='Поиск'></input>
                <ul style={{listStyle:'none', marginLeft: '-40px', paddingTop: '10px', height: '254px', overflow: 'auto'}}>
                    {this.getDialogs()}
                </ul>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    ...state,
    info: state.phoneInfo,
    dialogs: state.dialogs
})

const mapDispathToProps = dispatch => ({
    setApp: app => dispatch(setApp(app)),
    closeApp: () => dispatch(closeApp()),
    addApp: app => dispatch(addApp(app))
})

export default connect(mapStateToProps, mapDispathToProps)(Dialogs)