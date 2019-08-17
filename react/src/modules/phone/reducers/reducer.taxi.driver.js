const initialState = {};

export default function taxiDriver(state = initialState, action) {
    const {type, payload} = action;

    switch (type) {
        case 'LOAD_INFO_TAXI_DRIVER':
            return {
                ...state,
                name: payload.name,
                orders: payload.orders
            };

        case 'ADD_ORDER_TAXI_DRIVER':
            return {
                ...state,
                orders: [
                    ...state.orders,
                    payload
                ],
                isSorted: false
            };

        case 'SORT_ORDERS_BY_DISTANCE_TAXI_DRIVER':
            const newStateSort = { ...state };
            newStateSort.orders.sort((a, b) => a.distance.toString().localeCompare(b.distance.toString()));
            newStateSort.isSorted = true;

            return newStateSort;

        case 'TAKE_ORDER_TAXI_DRIVER':
            const newStateTake = { ...state };
            newStateTake.activeOrder = newStateTake.orders.find(order => order.id === payload);
            return newStateTake;

        case 'CANCEL_ORDER_TAXI_DRIVER':
            const newStateCancel = { ...state };
            newStateCancel.activeOrder = null;
            let cancelIndex = newStateCancel.orders.findIndex(order => order.id === payload);
            if (cancelIndex !== -1) {
                newStateCancel.orders.splice(cancelIndex, 1);
            }

            return newStateCancel;

        case 'DELETE_ORDER_TAXI_DRIVER':
            const newStateDelete = { ...state };
            let deleteIndex = newStateDelete.orders.findIndex(order => order.id === payload);
            if (deleteIndex !== -1) {
                newStateDelete.orders.splice(deleteIndex, 1);
            }

            return newStateDelete;

        case 'SET_DESTINATION_TAXI_DRIVER':
            return {
                ...state,
                activeOrder: {
                    ...state.activeOrder,
                    isWay: true,
                    area: payload.area,
                    street: payload.street,
                    price: payload.price
                }
            }
    }

    return state;
}