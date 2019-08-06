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

export const setSell = flag => ({
    type: 'SET_SELL',
    payload: flag
});

export const setSellStatus = status => ({
    type: 'SET_SELL_STATUS',
    payload: status
});

export const setSellInfo = info => ({
    type: 'SET_SELL_INFO',
    payload: info
});

export const sellHouse = name => ({
   type: 'SELL_HOUSE',
   payload: name
});
