/* eslint-disable default-case */
const initialState = {
    isShow: false,
    place: null
};

export default function enterMenu(state = initialState, action) {
    const { type, payload } = action;
    var newState;

    switch (type) {
        case 'SHOW_ENTER_MENU_HOUSE':
            return {
                isShow: true,
                place: payload
            };

        case 'CLOSE_ENTER_MENU_HOUSE':
        case 'CLOSE_HOUSE':
            return {
                isShow: false,
                place: null
            };

        // case 'CLOSE_HOUSE':
        //     newState = { ...state };
        //     newState.isShow = false;
        //     return newState;
    }

    return state;
}