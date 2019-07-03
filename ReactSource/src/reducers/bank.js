const initialState = {
    // cash: 225,
    // money: 124,
    // phoneMoney: 300,
    // number: 33940
}

export default function bankReducer(state = initialState, action) {
    const { type, payload } = action;
    const { cash, money, phoneMoney } = state;

    switch (type) {
        case 'ADD_BANK_INFO':
            return payload;

        case 'PUSH_BANK':
            return {
                ...state,
                cash: cash - payload,
                money: money + payload
            }
        
        case 'POP_BANK':
            return {
                ...state,
                cash: cash + payload,
                money: money - payload
            }

        case 'TRANSFER_BANK':
            return {
                ...state,
                money: money - payload
            }
        
        case 'PUSH_PHONE_BANK':
            return {
                ...state,
                phoneMoney: phoneMoney + payload,
                money: money - payload
            }
            
        case 'EXTEND_HOUSE':
        case 'EXTEND_BIZ':
            return {
                ...state,
                money: money - payload.money
            }

        case 'PUSH_CASHBOX':
            return {
                ...state,
                money: money - payload.money
            }
        case 'POP_CASHBOX':
            return {
                ...state,
                money: money + payload.money
            }

        default:
            break;
    }

    return state;
}