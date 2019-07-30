const initialState = {
    phone: false,
    house: false,
    business: false,
    bank: false
};

export default function forms(state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case 'SHOW_PHONE':
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

        case 'SHOW_BANK':
            return {
                ...state,
                bank: payload
            };
    }

    return state;
}