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

        case 'SHOW_HOUSE':
            newState = { ...state };
            newState.isShow = payload;
            return newState;

        case 'SET_LOADING_HOUSE':
            newState = { ...state };
            newState.isLoading = payload;
            return newState;

        case 'ANS_BUY_HOUSE':
            newState = { ...state };
            if (payload.answer == 0) {
                newState.answer = 'У Вас недостаточно денег для покупки';
            }
            else if (payload.answer == 1) {
                newState.answer = 'Дом успешно куплен';
                newState.owner = payload.owner;
            } else {
                newState.answer = payload.answer;
            }

            newState.isLoading = false;
            return newState;

        case 'BLOCK_HOUSE_FORM':
            newState = { ...state };
            newState.isBlock = payload;
            return newState;
    }

    return state;
}