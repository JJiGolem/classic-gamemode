const initialState = {

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
            if (payload.answer === 1) {
                newState.owner = payload.owner
            }
            newState.isLoading = false;
            return newState;

        case 'BLUR_HOUSE_FORM':
            newState = { ...state };
            newState.isBlur = payload;
            return newState;

        case 'ANS_ENTER_HOUSE':
            newState = { ...state };
            newState.answer = payload.answer;
            newState.isLoading = false;
            return newState;

        case 'CLOSE_HOUSE':
            newState = {};
            return newState;
    }

    return state;
}