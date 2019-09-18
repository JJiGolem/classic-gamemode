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
import bankPages from '../../modules/bank/reducers/reducer.bankPages';
import taxiClient from '../../modules/phone/reducers/reducer.taxi.client';
import taxiDriver from '../../modules/phone/reducers/reducer.taxi.driver';
import players from '../../modules/players/reducers/reducer.players';

export default combineReducers({
    forms,
    chat,
    apps,
    info,
    dialogs,
    house,
    enterMenu,
    business,
    bank,
    bankPages,
    taxiClient,
    taxiDriver,
    players
});