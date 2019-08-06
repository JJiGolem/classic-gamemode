const initialState = {};

export default function bank(state = initialState, action) {
    const { type, payload } = action;
    const { cash, money, phoneMoney } = state;

    switch (type) {
        case 'LOAD_BANK_INFO':
            return payload;

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
            return {
                ...state,
                money: money - payload.money
            };
    }

    return state;
}