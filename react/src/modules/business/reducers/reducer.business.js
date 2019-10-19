/* eslint-disable default-case */
const initialState = {
    // id: 3,
    // name: 'Ponsonbys',
    // type: 'Магазин одежды',
    // cashBox: 732101,
    // area: 'Палето Бэй',
    // rent: 50,
    // price: 112000,
    // actions: ['finance']
};

export default function business(state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case 'LOAD_INFO_BUSINESS':
            return payload;

        case 'SET_LOADING_BUSINESS':
            return {
                ...state,
                isLoading: payload
            }

        case 'ANS_BUY_BUSINESS':
            const newStateBuy = { ...state };
            newStateBuy.answerBuy = payload.answer;
            if (payload.answer == 1) {
                newStateBuy.owner = payload.owner;
                newStateBuy.actions = payload.actions;
            }
            newStateBuy.isLoading = false;
            return newStateBuy;

        case 'BLUR_BUSINESS_FORM':
            return {
                ...state,
                isBlur: payload
            }

        case 'CLOSE_BUSINESS':
            return {};
    }

    return state;
}