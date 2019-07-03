import React from 'react';
import MainDisplay from "../components/phone/MainDisplay.jsx";
import {number, status} from '../source/phone.js'
import ActiveCall from '../components/phone/ActiveCall.jsx';
import Success from '../components/phone/house/Success.jsx';
import Error from '../components/phone/house/Error.jsx';

const initialState = [<MainDisplay />];

export default function phoneApps(state = initialState, action) {
    switch(action.type) {
        case 'SET_APP':
            return [action.payload];

        case 'ADD_APP':
            return [...state, action.payload];
        
        case 'CLOSE_APP':
            const newState = [...state]
            newState.splice(state.length - 1, 1);
            return newState;

        case 'CHANGE_STATUS':
            const newStateS = [...state]
            newStateS.splice(state.length - 1, 1);
            let status;
            switch (action.payload) {
                case 0:
                    status = 'Звонок идет'
                    break;
                case 1:
                    status = 'Нет номера'
                    break;
                case 2:
                    status = 'Абонент занят'
                    break;
                case 3:
                    status = 'Звонок завершен'
                    break;
                default:
                    break;
            }
            return [...newStateS, <ActiveCall status={status} number={number[0]}/>];

        case 'ANS_APP_HOUSE':
            if(action.payload.ans === 1) {
                return [ <Success type={action.payload.type} /> ]
            } else if(action.payload.ans === 2) {
                return [ <Error type={action.payload.type} /> ]
            } else {
                return [ <Error type='error' /> ]
            }
    }

    return state;
}