export const addInfoToPhone = info => ({
    type: 'LOAD_INFO_TO_PHONE',
    payload: info
});

export const disableHomePhone = state => ({
    type: 'DISABLE_HOME_PHONE',
    payload: state
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

export const setIncomingCall = (state, number) => ({
    type: 'INCOMING_CALL',
    payload: { state, number }
});

export const setActiveCall = (state, number, isMine) => ({
    type: 'ACTIVE_CALL',
    payload: { state, number, isMine }
});

export const setCallStatus = (status) => ({
    type: 'SET_CALL_STATUS',
    payload: status
});

export const setCall = (flag) => ({
    type: 'SET_CALL',
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

export const setSellStatusBusiness = status => ({
    type: 'SET_SELL_STATUS_BUSINESS',
    payload: status
});

export const setSellInfoBusiness = info => ({
    type: 'SET_SELL_INFO_BUSINESS',
    payload: info
});

export const createOrderBusiness = (productsCount, productsPrice) => ({
    type: 'CREATE_ORDER_BUSINESS',
    payload: { productsCount, productsPrice }
});

export const cancelOrderBusiness = () => ({
    type: 'CANCEL_ORDER_BUSINESS'
});

export const setOrderStatusBusiness = status => ({
   type: 'SET_ORDER_STATUS_BUSINESS',
   payload: status
});

export const createOrderBusinessFaction = (productsCount, productsPrice) => ({
    type: 'CREATE_ORDER_BUSINESS_FACTION',
    payload: { productsCount, productsPrice }
});

export const cancelOrderBusinessFaction = () => ({
    type: 'CANCEL_ORDER_BUSINESS_FACTION'
});

export const setOrderStatusBusinessFaction = status => ({
   type: 'SET_ORDER_STATUS_BUSINESS_FACTION',
   payload: status
});

export const sellBusiness = id => ({
    type: 'SELL_BUSINESS',
    payload: id
});

export const buyImprovementHouse = type => ({
    type: 'BUY_IMPROVEMENT_HOUSE',
    payload: type
});

export const setBuyStatusHouse = status => ({
    type: 'BUY_IMPROVEMENT_HOUSE_ANS',
    payload: status
});

export const buyImprovementBusiness = type => ({
    type: 'BUY_IMPROVEMENT_BUSINESS',
    payload: type
});

export const setBuyStatusBusiness = status => ({
    type: 'BUY_IMPROVEMENT_BUSINESS_ANS',
    payload: status
});

export const buyImprovementBusinessFaction = type => ({
    type: 'BUY_IMPROVEMENT_BUSINESS_FACTION',
    payload: type
});

export const setBuyStatusBusinessFaction = status => ({
    type: 'BUY_IMPROVEMENT_BUSINESS_FACTION_ANS',
    payload: status
});
