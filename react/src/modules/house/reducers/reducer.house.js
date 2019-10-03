/* eslint-disable default-case */
const initialState = {

};

export default function house(state = initialState, action) {
    const { type, payload } = action;
    var newState;

    switch (type) {
        // case 'SHOW_HOUSE':
        //     return {};

        case 'LOAD_INFO_HOUSE':
            return payload;

        case 'SET_LOADING_HOUSE':
            newState = { ...state };
            newState.isLoading = payload;
            return newState;

        case 'ANS_BUY_HOUSE':
            const newStateBuy = { ...state };
            newStateBuy.answerBuy = payload.answer;
            if (payload.answer == 1) {
                newStateBuy.owner = payload.owner
            }
            newStateBuy.isLoading = false;
            return newStateBuy;

        case 'BLUR_HOUSE_FORM':
            newState = { ...state };
            newState.isBlur = payload;
            return newState;

        case 'ANS_ENTER_HOUSE':
            const newStateEnter = { ...state };
            newStateEnter.answerEnter = payload.answer;
            newStateEnter.isLoading = false;
            return newStateEnter;

        case 'CLOSE_ENTER_MENU_HOUSE':
            const newStateCloseEnter = { ...state };
            if (newStateCloseEnter.isBlur) {
                newStateCloseEnter.isBlur = false;
            }
            newStateCloseEnter.answerEnter = null;
            newStateCloseEnter.isLoading = false;
            return newStateCloseEnter;

        case 'CLOSE_HOUSE':
            return {};
    }

    return state;
}