import React, {Component, Fragment} from 'react';
import HeadAppPhone from "./HeadAppPhone";
import ContactPage from "./ContactPage";
import ActiveCall from "./ActiveCall";
import {addAppDisplay, closeAppDisplay} from "../actions/action.apps";
import {connect} from "react-redux";
import CreateContactPage from "./CreateContactPage";
import {sortContacts} from "../actions/action.info";

class Contacts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            search: ''
        };

        this.handleSearchInput = this.handleSearchInput.bind(this)
    }

    componentWillMount() {
        const { contacts, sortContacts } = this.props;
        //contacts && contacts.isSorted && sortContacts();
        contacts && contacts.sort((a, b) => a.name.localeCompare(b.name));
    }

    componentDidUpdate() {
        const { contacts, sortContacts } = this.props;
        //contacts && contacts.isSorted && sortContacts();
        contacts && contacts.sort((a, b) => a.name.localeCompare(b.name));
    }

    handleSearchInput(e) {
        this.setState({ search: String(e.target.value).toLowerCase() });
    }

    toContactPage(event, contact) {
        const { addApp, closeApp } = this.props;

        //closeApp();
        addApp({name: 'ContactPage', form: <ContactPage contact={contact}/>})
    }

    getContact(contact, index) {
        return (
            <div className='contact_field-phone-react' key={index} id={`contact${index}`}
                 onClick={(e) => this.toContactPage(e, contact)}>
                <span >{ contact.name }</span>
            </div>
        )
    }

    render() {
        console.log('render');
        const { addApp } = this.props;
        const { search } = this.state;

        var contacts = this.props.contacts;

        if (search) {
            contacts = contacts.filter(contact => contact.name.toString().toLowerCase().startsWith(search))
        }

        return (
            <Fragment>
                <div className="back_page-phone-react">
                    <HeadAppPhone title='Контакты' />
                    <div className='search-phone-react'>
                        <input
                            className="search_input-phone-react"
                            placeholder='Поиск'
                            onChange={this.handleSearchInput}
                        />
                    </div>
                    <div className='contacts_list-phone-react'>
                        {
                            contacts && contacts.length !== 0
                                ? contacts.map((contact, index) => this.getContact(contact, index))
                                : <div style={{ textAlign: 'center' }}>Список контактов пуст</div>
                        }
                    </div>
                    <div className='but_create_contact-phone-react' onClick={() => addApp({name: 'CreateContactPage', form: <CreateContactPage />})}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="45%" height="45%" viewBox="0 0 37.824 37.824" style={{ position: 'absolute', top: '25%', left: '26%'}}>
                            <path id="_5A" data-name="5A" d="M20.412,20.412H36.325a1.5,1.5,0,0,0,0-3H20.412V1.5a1.5,1.5,0,0,0-3,0V17.412H1.5a1.5,1.5,0,1,0,0,3H17.412V36.325a1.5,1.5,0,0,0,3,0V20.412" transform="translate(0 0)" fill="#fff"/>
                        </svg>
                    </div>
                </div>
            </Fragment>
        );
    }
}

const mapStateToProps = state => ({
    contacts: state.info.contacts,
    info: state.info
});

const mapDispatchToProps = dispatch => ({
    addApp: app => dispatch(addAppDisplay(app)),
    closeApp: () => dispatch(closeAppDisplay()),
    sortContacts: () => dispatch(sortContacts())
});

export default connect(mapStateToProps, mapDispatchToProps)(Contacts);