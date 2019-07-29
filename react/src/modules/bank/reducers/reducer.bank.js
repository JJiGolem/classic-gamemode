const initialState = {};

export default function bank(state = initialState, action) {
    const { type, payload } = action;
    const { cash, money } = state;

    switch (type) {
        case 'LOAD_BANK_INFO':
            return payload;

        case 'PUSH_BANK':
            return {
                ...state,
                cash: cash - payload,
                money: money + payload
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
    }

    return state;
}