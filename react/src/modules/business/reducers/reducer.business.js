const initialState = {
    // id: 3,
    // name: 'Ponsonbys',
    // type: 'Магазин одежды',
    // cashBox: 732101,
    // area: 'Палето Бэй',
    // rent: 50,
    // price: 112000,
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
            const newStateBuy = { ...state };
            newStateBuy.answerBuy = payload.answer;
            if (payload.answer == 1) {
                newStateBuy.owner = payload.owner
            }
            newStateBuy.isLoading = false;
            return newStateBuy;

        case 'BLUR_BUSINESS_FORM':
            newState = { ...state };
            newState.isBlur = payload;
            return newState;

        case 'CLOSE_BUSINESS':
            return {};
    }

    return state;
}