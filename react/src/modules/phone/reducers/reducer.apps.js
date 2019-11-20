/* eslint-disable default-case */
import React from 'react';

import MainDisplay from "../components/MainDisplay";

const initialState = [
    {
        name: 'MainDisplay',
        form: <MainDisplay />
    },
];

export default function apps(state = initialState, action) {

    const { type, payload } = action;

    switch (type) {
        case 'ADD_APP':
            return [
                ...state,
                payload
            ];

        case 'SET_APP':
            return [ payload ];

        case 'SET_APPS':
            return payload;

        case 'CLOSE_APP':
            const newState = [ ...state ];
            if (newState.length > 1) {
                newState.splice(newState.length - 1, 1);
            }
            return newState;

        case 'DELETE_APP_TO_PHONE':
            const newStateDel = [ ...state ];

            let appName;

            if (payload === 'house') {
                appName = 'HouseApp'
            }

            if (payload === 'biz') {
                appName = 'BusinessApp'
            }

            if (payload === 'taxi') {
                appName = 'TaxiDriver'
            }

            let indDel = newStateDel.findIndex(app => app.name === appName);
            if (indDel !== -1) {
                return [ {
                    name: 'MainDisplay',
                    form: <MainDisplay />
                } ]
            } else {
                return  newStateDel;
            }

        case 'ORDER_COMPLETE_BUSINESS':
            const newStateOrder = [ ...state ];

            let orderIndex = newStateOrder.findIndex(app => app.name === 'OrderCancel');

            if (orderIndex !== -1) {
                newStateOrder.splice(orderIndex, 1);
            }

            return newStateOrder;

        case 'SHOW_PHONE':
            if (!payload) {
                const newStateSell = [ ...state ];

                const indexSellApp = newStateSell.findIndex(app => app.name === 'SuccessSell');

                if (indexSellApp !== -1) {
                    return [ { name: 'MainDisplay', form: <MainDisplay /> } ]
                }
            }
    }

    return state;
}