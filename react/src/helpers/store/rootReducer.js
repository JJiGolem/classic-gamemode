import { combineReducers } from 'redux';

import forms from './forms';
import chat from '../../modules/chat/reducers/reducer.chat';
import apps from '../../modules/phone/reducers/reducer.apps';
import info from '../../modules/phone/reducers/reducer.info';
import dialogs from '../../modules/phone/reducers/reducer.dialogs';
import house from '../../modules/house/reducers/reducer.house';
import enterMenu from '../../modules/house/reducers/reducer.enterMenu';
import business from '../../modules/business/reducers/reducer.business';
import bank from '../../modules/bank/reducers/reducer.bank';

export default combineReducers({
    forms,
    chat,
    apps,
    info,
    dialogs,
    house,
    enterMenu,
    business,
    bank
});