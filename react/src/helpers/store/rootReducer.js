import { combineReducers } from 'redux';

import forms from './forms';
import chat from '../../modules/chat/reducers/reducer.chat';
import apps from '../../modules/phone/reducers/reducer.apps';
import info from '../../modules/phone/reducers/reducer.info';
import dialogs from '../../modules/phone/reducers/reducer.dialogs';
import house from '../../modules/house/reducers/reducer.house';

export default combineReducers({
    forms,
    chat,
    apps,
    info,
    dialogs,
    house
});