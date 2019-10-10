/* eslint-disable default-case */
const initialState = {
    isLoading: true,
};

export default function bank(state = initialState, action) {
    const { type, payload } = action;
    const { cash, money, phoneMoney } = state;

    switch (type) {
        case 'SHOW_BANK':
        case 'LOAD_BANK_INFO':
            return payload;

        case 'CLOSE_BANK':
            return {};

        case 'SET_LOADING_BANK':
            return {
                ...state,
                isLoading: payload
            };

        case 'PUSH_BANK':
            return {
                ...state,
                cash: cash - payload,
                money: money + payload
            };

        case 'PUSH_PHONE_BANK':
            return {
                ...state,
                money: money - payload,
                phoneMoney: phoneMoney + payload
            };

        case 'POP_BANK':
            return {
                ...state,
                cash: cash + payload,
                money: money - payload
            };

        case 'TRANSFER_BANK':
            return {
                ...state,
                money: money - payload
            };

        case 'PAY_HOUSE_BANK':
        case 'PAY_BUSINESS_BANK':
        case 'PUSH_CASHBOX_BANK':
            return {
                ...state,
                money: money - payload.money
            };

        case 'SET_ANSWER_BANK':
            return  {
                ...state,
                answer: payload.answer,
                type: payload.type,
                isLoading: false
            };

        case 'SET_ARGS_BANK':
            return {
                ...state,
                args: payload
            };

        case 'SET_ASK_ANSWER_BANK':
            return {
                ...state,
                isLoading: false,
                askAnswer: payload
            };

        case 'POP_CASHBOX_BANK':
            return {
                ...state,
                money: money + payload.money
            }
    }

    return state;
}