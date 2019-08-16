const initialState = {};

export default function taxiClient(state = initialState, action) {
    const {type, payload} = action;

    switch (type) {
        case 'LOAD_LOCATION_TAXI_CLIENT':
            return {
              ...state,
              location: payload
            };

        case 'CLEAR_LOCATION_TAXI_CLIENT':
            return {
                ...state,
                location: null
            };

        case 'ANS_TAXI_CLIENT':
            const newState = { ...state };
            newState.isSearch = false;
            newState.answer = payload;
            return newState;

        case 'CREATE_ORDER_TAXI_CLIENT':
            return {
                ...state,
                isSearch: true
            };

        case 'CANCEL_ORDER_TAXI_CLIENT':
            return {
                ...state,
                isSearch: false,
                answer: null
            };
    }

    return state;
}