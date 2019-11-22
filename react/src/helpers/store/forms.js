/* eslint-disable default-case */
import $ from 'jquery';

const initialState = {
    // phone: true,
    // house: true,
    // business: true,
    // bank: true,
    // players: true
};

export default function forms(state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case 'SHOW_PHONE':
            if (payload) {
                $('#phone-form-react').animate({ bottom: '7%' }, 100);
                $('#phone-form-react').css({ "display": "block" });
            } else {
                $('#phone-form-react').animate({ bottom: '-50%' }, 100, function() {
                    $('#phone-form-react').css({ "display": "none" })
                });
            }
            return {
                ...state,
                phone: payload
            };

        case 'SHOW_HOUSE':
            return {
                ...state,
                house: payload
            };

        case 'CLOSE_HOUSE':
            return {
              ...state,
              house: false
            };

        case 'SHOW_BUSINESS':
            return {
                ...state,
                business: payload
            };

        case 'CLOSE_BUSINESS':
            return {
                ...state,
                business: false
            };

        case 'SHOW_BANK':
            return {
                ...state,
                bank: true
            };

        case 'CLOSE_BANK':
            return {
                ...state,
                bank: false
            };

        case 'SHOW_PLAYERS':
            return {
                ...state,
                players: payload
            };
    }

    return state;
}