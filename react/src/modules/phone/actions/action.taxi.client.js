export const loadLocationTaxiClient = (area, street) => ({
    type: 'LOAD_LOCATION_TAXI_CLIENT',
    payload: { area, street }
});

export const createOrderTaxiClient = () => ({
    type: 'CREATE_ORDER_TAXI_CLIENT'
});

export const cancelOrderTaxiClient = () => ({
   type: 'CANCEL_ORDER_TAXI_CLIENT'
});

export const ansTaxiClient = answer => ({
   type: 'ANS_TAXI_CLIENT',
   payload: answer
});

export const clearLocationTaxiClient = () => ({
    type: 'CLEAR_LOCATION_TAXI_CLIENT'
});