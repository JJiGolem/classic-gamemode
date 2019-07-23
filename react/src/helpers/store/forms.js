const initialState = {
    phone: false,
    house: false,
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
    }

    return state;
}