const initialState = {
    isShow: false,
    place: null
};

export default function enterMenu(state = initialState, action) {
    const { type, payload } = action;
    var newState;

    switch (type) {
        case 'SHOW_ENTER_MENU_HOUSE':
            newState = { ...state };
            newState.isShow = true;
            newState.place = payload;
            return newState;

        case 'CLOSE_ENTER_MENU_HOUSE':
            newState = { ...state };
            newState.isShow = false;
            newState.place = null;
            return newState;

        case 'CLOSE_HOUSE':
            newState = { ...state };
            newState.isShow = false;
            return newState;
    }

    return state;
}