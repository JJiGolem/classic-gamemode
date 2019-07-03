import { combineReducers } from 'redux';
import forms from './forms.js';
import phone from './phone.js';
import phoneInfo from './phoneInfo.js';
import dialogs from './dialogs.js';
import bank from './bank.js';
import bankPages from './bankPages.js';
import chat from './chat.js';

export default combineReducers({
    forms,
    phone,
    phoneInfo,
    dialogs,
    bank,
    bankPages,
    chat
});