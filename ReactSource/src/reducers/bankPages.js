import React from 'react';
import Menu from '../components/bank/Menu.jsx';
import Check from '../components/bank/Check.jsx';

const initialState = [
    <Menu />
]

export default function bankPages(state = initialState, action) {
    const { type, payload } = action;

    switch(type) {
        case 'ADD_PAGE_BANK':
            return [
                ...state,
                payload
            ];
        case 'SET_PAGE_BANK':
            return [
                payload
            ]
        case 'CLOSE_PAGE_BANK':
            const newState = [...state];
            newState.splice(newState.length - 1, 1);
            return newState;
        case 'ANS_ASK_BANK':
            if(payload != '') {
                return [<Check ans={payload} />]
            }
    }

    return state;
}