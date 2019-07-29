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

export default function house(state = initialState, action) {
    const { type, payload } = action;
    var newState;

    switch (type) {
        case 'LOAD_INFO_HOUSE':
            return payload;

        case 'SET_LOADING_HOUSE':
            newState = { ...state };
            newState.isLoading = payload;
            return newState;

        case 'ANS_BUY_HOUSE':
            newState = { ...state };
            newState.answer = payload.answer;
            newState.isLoading = false;
            return newState;

        case 'BLOCK_HOUSE_FORM':
            newState = { ...state };
            newState.isBlock = payload;
            return newState;
    }

    return state;
}