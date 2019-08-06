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

        case 'CLOSE_APP':
            const newState = [ ...state ];
            if (newState.length > 1) {
                newState.splice(newState.length - 1, 1);
            }
            return newState;
    }

    return state;
}