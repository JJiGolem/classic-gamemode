export const addInfoToPhone = info => ({
    type: 'LOAD_INFO_TO_PHONE',
    payload: info
});

export const addContact = (contact) => ({
    type: 'ADD_CONTACT',
    payload: contact
});

export const sortContacts = () => ({
  type: 'SORT_CONTACTS'
});

export const deleteContact = (number) => ({
    type: 'DELETE_CONTACT',
    payload: number
});

export const setCallStatus = (status) => ({
    type: 'SET_CALL_STATUS',
    payload: status
});

export const setCall = (flag) => ({
    type: 'SET_CALL',
    payload: flag
});

export const startMyCall = (flag) => ({
    type: 'START_MY_CALL',
    payload: flag
});

export const renameContact = (number, newName) => ({
    type: 'RENAME_CONTACT',
    payload: {
        number, newName
    }
});

export const changeStateHouse = () => ({
    type: 'CHANGE_STATE_HOUSE'
});

export const setSellHouse = flag => ({
    type: 'SET_SELL_HOUSE',
    payload: flag
});

export const setSellStatusHouse = status => ({
    type: 'SET_SELL_STATUS_HOUSE',
    payload: status
});

export const setSellInfoHouse = info => ({
    type: 'SET_SELL_INFO_HOUSE',
    payload: info
});

export const sellHouse = name => ({
   type: 'SELL_HOUSE',
   payload: name
});

export const setSellBusiness = flag => ({
    type: 'SET_SELL_BUSINESS',
    payload: flag
});

export const setSellStatusBusiness = status => ({
    type: 'SET_SELL_STATUS_BUSINESS',
    payload: status
});

export const setSellInfoBusiness = info => ({
    type: 'SET_SELL_INFO_BUSINESS',
    payload: info
});

export const createOrderBusiness = (productCount, productPrice) => ({
    type: 'CREATE_ORDER_BUSINESS',
    payload: { productCount, productPrice }
});

export const cancelOrderBusiness = () => ({
    type: 'CANCEL_ORDER_BUSINESS'
});

export const setOrderStatusBusiness = status => ({
   type: 'SET_ORDER_STATUS_BUSINESS',
   payload: status
});

export const sellBusiness = name => ({
    type: 'SELL_BUSINESS',
    payload: name
});
