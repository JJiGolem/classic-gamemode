import React, {Component, Fragment} from 'react';
import HeadAppPhone from "./HeadAppPhone";
import DialogPage from "./DialogPage";
import {addAppDisplay, closeAppDisplay} from "../actions/action.apps";
import {connect} from "react-redux";

class Dialogs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            search: ''
        };

        this.handleSearchInput = this.handleSearchInput.bind(this)
    }

    handleSearchInput(e) {
        this.setState({ search: String(e.target.value).toLowerCase() });
    }

    getDialog(dialog, index) {

        let lastMessage;

        if (dialog.PhoneMessages.length !== 0) {
            lastMessage = dialog.PhoneMessages[dialog.PhoneMessages.length - 1].text;
        } else {
            lastMessage = 'Пустой диалог';
        }

        return (
            <div className='dialog_field-phone-react' key={index}
                 onClick={() => this.props.addApp({name: 'DialogPage', form: <DialogPage dialog={dialog}/>})}>
                <div className='back_icon_contact-phone-react' style={{ height: '10%', width: '15%', marginLeft: '5%' }}>
                    <svg className='contact_icon-phone-react' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 38 33" style={{ marginTop: '15%' }}>
                        <path id="_4F" data-name="4F" d="M17.877,37.19A32.219,32.219,0,0,1,4.442,34.554c-3.589-1.7-5.565-3.96-5.565-6.364s1.976-4.664,5.565-6.364A32.219,32.219,0,0,1,17.877,19.19a32.219,32.219,0,0,1,13.435,2.636c3.588,1.7,5.565,3.96,5.565,6.364s-1.976,4.664-5.565,6.364A32.219,32.219,0,0,1,17.877,37.19Zm.29-19.537A8.892,8.892,0,0,1,9.23,8.826a8.939,8.939,0,0,1,17.876,0A8.893,8.893,0,0,1,18.167,17.653Z" transform="translate(1.123 0)" fill="#cacaca"/>
                    </svg>
                </div>
                <div style={{ display: 'inline-block', width: '50%', marginLeft: '10%', position: 'absolute', overflowX: 'hidden' }}>
                    <span style={{ fontSize: '1em' }}>{ dialog.name ? dialog.name : dialog.number }</span>
                    <span style={{ fontSize: '0.8em', color: 'gray', display: 'block', marginTop: '3%' }}>{ lastMessage }</span>
                </div>
            </div>
        )
    }

    render() {
        const { search } = this.state;

        var dialogs = this.props.dialogs;

        if (search) {
            dialogs = dialogs.filter(dialog => dialog.name.toLowerCase().startsWith(search) || dialog.number.toLowerCase().startsWith(search))
        }

        return (
            <Fragment>
                <div className="back_page-phone-react">
                    <HeadAppPhone title='Диалоги' />
                    {
                        dialogs && dialogs.length > 0
                        ? <Fragment>
                                <div className='search-phone-react'>
                                    <input
                                        className="search_input-phone-react"
                                        placeholder='Поиск'
                                        onChange={this.handleSearchInput}
                                    />
                                </div>
                                <div className='contacts_list-phone-react'>
                                    {
                                        dialogs && dialogs.length !== 0
                                            ? dialogs.map((dialog, index) => this.getDialog(dialog, index))
                                            : <div>Список диалогов пуст</div>
                                    }
                                </div>
                            </Fragment>
                            : <div style={{ marginTop: '30%', textAlign: 'center' }}>Список диалогов пуст</div>
                    }
                </div>
            </Fragment>
        );
    }
}

const mapStateToProps = state => ({
    dialogs: state.dialogs
});

const mapDispatchToProps = dispatch => ({
    addApp: app => dispatch(addAppDisplay(app)),
    closeApp: () => dispatch(closeAppDisplay()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Dialogs);