import React from 'react';
import ConfirmSell from "../components/phone/house/ConfirmSell.jsx";

export const setApp = app => ({
    type: 'SET_APP',
    payload: app
})

export const addApp = app => ({
    type: 'ADD_APP',
    payload: app
})

export const addInfoToPhone = info => ({
    type: 'ADD_INFO_TO_PHONE',
    payload: info
})

export const addContact = (contact) => ({
    type: 'ADD_CONTACT',
    payload: contact
})

export const removeContact = (number) => ({
    type: 'REMOVE_CONTACT',
    payload: number
})

export const renameContact = (number, newName) => ({
    type: 'RENAME_CONTACT',
    payload: {
        number, newName
    }
})

export const closeApp = () => ({
    type: 'CLOSE_APP'
});

export const deleteApp = (appName) => ({
    type: 'DELETE_APP',
    payload: appName
})

export const buyImprovement = (index, name) => ({
    type: 'BUY_IMPROVEMENT',
    payload: {
        index,
        name
    }
})

export const openCloseHouse = (index, flag) => ({
    type: 'OPEN_CLOSE_HOUSE',
    payload: {
        index,
        flag
    }
});

// export const ansSellHouse = (ans) => ({
//     type: 'ANS_APP_HOUSE',
//     payload: {
//         ans,
//         type: 'sell'
//     }
// })

// export const sellHouseInfo = (nick, price) => dispatch => {
//     setTimeout(() => {
//         dispatch({
//             type: 'SET_APP', 
//             payload: <ConfirmSell nick={nick} price={price}/>
//         })
//     }, 1000);
//}