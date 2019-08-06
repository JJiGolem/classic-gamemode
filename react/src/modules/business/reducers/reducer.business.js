const initialState = {
    name: 228,
    area: 'Санта-Моника',
    class: 'Люкс',
    numRooms: 4,
    garage: false,
    carPlaces: 2,
    price: 45000,
    rent: 350,
};

export default function business(state = initialState, action) {
    const { type, payload } = action;
    var newState;

    switch (type) {
        case 'LOAD_INFO_BUSINESS':
            return payload;

        case 'SET_LOADING_BUSINESS':
            newState = { ...state };
            newState.isLoading = payload;
            return newState;

        case 'ANS_BUY_BUSINESS':
            newState = { ...state };
            newState.answer = payload.answer;
            if (payload.answer === 1) {
                newState.owner = payload.owner;
            }
            newState.isLoading = false;
            return newState;

        case 'BLOCK_BUSINESS_FORM':
            newState = { ...state };
            newState.isBlock = payload;
            return newState;
    }

    return state;
}