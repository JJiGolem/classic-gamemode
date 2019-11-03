import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {addAppDisplay, closeAppDisplay} from "../actions/action.apps";
import {addDialog} from "../actions/action.dialogs";
import HeadAppPhone from "./HeadAppPhone";
import DialogPage from "./DialogPage";

class CreateDialogPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inputNumber: ''
        };

        this.handleInputNumber = this.handleInputNumber.bind(this);
        this.startDialog = this.startDialog.bind(this);
    }

    handleInputNumber(e) {
        this.setState({ inputNumber: e.target.value });
    }

    getContact(contact, index) {
        return (
            <div className='contact_field-phone-react' key={index} id={`contact${index}`}
                 onClick={(e) => this.startDialog(e, contact.number)}>
                <span >{ contact.name }</span>
                <span style={{ float: 'right' }}>{ contact.number }</span>
            </div>
        )
    }

    startDialog(e, number) {
        const { addApp, dialogs, addDialog, info } = this.props;
        e.preventDefault();

        let dialogIndex = dialogs.list.findIndex(d => d.number === number);
        let contact = info.contacts.find(c => c.number === number);

        if (contact) {
            if (dialogIndex === -1) {
                let dialog = { name: contact.name, number: number };
                addDialog(contact.name, number);
                addApp({ name: 'DialogPage', form: <DialogPage dialog={dialog} /> });
            } else {
                let dialog = dialogs.list[dialogIndex];
                addApp({ name: 'DialogPage', form: <DialogPage dialog={dialog} /> });
            }
        } else {
            let dialog = { name: null, number: number };
            addDialog(null, number);
            addApp({ name: 'DialogPage', form: <DialogPage dialog={dialog} /> });
        }
    }

    getMessage(contacts) {
        const { inputNumber } = this.state;

        return (
            <Fragment>
                {contacts.length === 0 && <div style={{ textAlign: 'center' }}>Список контактов пуст</div> }
                {inputNumber && !isNaN(inputNumber) && !contacts.some(con => con.number === inputNumber) &&
                <div style={{ textAlign: 'center', marginTop: '5%' }}>
                    Нажмите, чтобы начать диалог с абонентом
                    <div className='create_dialog-phone-react'>
                        <span>{ inputNumber }</span>
                        <button onClick={(e) => this.startDialog(e, inputNumber)}>
                            Начать
                        </button>
                    </div>
                </div>}
            </Fragment>
        )
    }

    render() {
        const { info } = this.props;
        const { inputNumber } = this.state;

        var contacts = info.contacts;

        if (inputNumber) {
            contacts = contacts.filter(cont => cont.number.toString().toLowerCase().startsWith(inputNumber)
                || cont.name.toString().toLowerCase().startsWith(inputNumber))
        }

        return (
            <Fragment>
                <div className='back_page-phone-react'>
                    <HeadAppPhone title='Создать диалог' />
                    <div className='search-phone-react' style={{ marginTop: '25%' }}>
                        <input
                            className="search_input-phone-react"
                            placeholder='Номер или имя'
                            onChange={this.handleInputNumber}
                            value={inputNumber}
                            maxLength={10}
                        />
                    </div>
                    <div className='contacts_list-phone-react'>
                        {
                            contacts && contacts.length !== 0 &&
                            contacts.map((contact, index) => this.getContact(contact, index))
                        }
                        {
                            this.getMessage(contacts)
                        }
                    </div>
                </div>
            </Fragment>
        );
    }
}

const mapStateToProps = state => ({
    dialogs: state.dialogs,
    info: state.info
});

const mapDispatchToProps = dispatch => ({
    addDialog: (name, number) => dispatch(addDialog(name, number)),
    addApp: app => dispatch(addAppDisplay(app)),
    closeApp: () => dispatch(closeAppDisplay()),
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateDialogPage);