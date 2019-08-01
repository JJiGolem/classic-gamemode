import React from 'react';
import myEventEmmiter from '../helpers/events.js';
import IncomingCall from "../modules/phone/components/IncomingCall";

export const PlayerEvents = (dispatch, getState) => {

    myEventEmmiter.on('closeForm', () => {
        dispatch({
            type: 'CLOSE_FORM'
        })
    });

    myEventEmmiter.on('pushChatMessage', (message) => {
        dispatch({
            type: 'ADD_MESSAGE_TO_CHAT',
            payload: message
        });
    });

    myEventEmmiter.on('showChat', (param) => {
        dispatch({
            type: 'SHOW_CHAT',
            payload: param
        });
    });

    myEventEmmiter.on('setFocusChat', (param) => {
        dispatch({
            type: 'SET_FOCUS_CHAT',
            payload: param
        });
    });

    myEventEmmiter.on('setTimeChat', (flag) => {
        dispatch({
            type: 'SET_TIME_CHAT',
            payload: flag
        });
    });

    myEventEmmiter.on('setOpacityChat', (opacity) => {
        dispatch({
            type: 'SET_OPACITY_CHAT',
            payload: opacity
        });
    });

    myEventEmmiter.on('setTagsChat', (tags) => {
        dispatch({
            type: 'SET_TAGS_CHAT',
            payload: tags
        });
    });

    myEventEmmiter.on('phone.show', (flag) => {
        dispatch({
            type: 'SHOW_PHONE',
            payload: flag
        });
    });

    myEventEmmiter.on('phone.load', (info) => {
        dispatch({
            type: 'LOAD_INFO_TO_PHONE',
            payload: info
        });
    });

    myEventEmmiter.on('phone.message.list', (dialogs) => {
        dispatch({
            type: 'LOAD_DIALOGS',
            payload: dialogs
        });
    });

    myEventEmmiter.on('phone.message.set', (message, number) => {
        dispatch({
            type: 'ADD_MESSAGE_TO_PHONE',
            payload: {
                number: number,
                text: message,
                isMine: false,
                isRead: false
            }
        });
    });

    myEventEmmiter.on('govSellHouseAns', (ans) => {
        dispatch({
            type: 'SET_SELL_STATUS',
            payload: ans
        });
    });

    myEventEmmiter.on('sellHouseAns', (ans) => {
        dispatch({
            type: 'SET_SELL_STATUS',
            payload: ans
        });
    });

    myEventEmmiter.on('sellHouseInfo', (nick, price) => {
        dispatch({
            type: 'SET_SELL_INFO',
            payload: { nick, price }
        });
    });
    myEventEmmiter.on('phone.call.in', (number) => {
        dispatch({
            type: 'ADD_APP',
            payload: { name: 'IncomingCall', form: <IncomingCall number={number} /> }
        });
    });

    myEventEmmiter.on('phone.call.end', () => {
        dispatch({
            type: 'SET_CALL_STATUS',
            payload: 5
        });
    });

    myEventEmmiter.on('phone.call.ans', (ans) => {
        dispatch({
            type: 'SET_CALL_STATUS',
            payload: ans
        });
    });

    myEventEmmiter.on('house.menu', () => {
        dispatch({
            type: 'SHOW_HOUSE',
            payload: true
        });
    });

    myEventEmmiter.on('house.load', (info) => {
        dispatch({
            type: 'LOAD_INFO_HOUSE',
            payload: info
        })
    });

    myEventEmmiter.on('house.menu.close', () => {
        dispatch({
            type: 'CLOSE_HOUSE'
        });
    });

    myEventEmmiter.on('house.menu.enter', (place) => {
        dispatch({
            type: 'SHOW_ENTER_MENU_HOUSE',
            payload: place
        });
    });

    myEventEmmiter.on('house.menu.enter.close', () => {
        dispatch({
            type: 'CLOSE_ENTER_MENU_HOUSE'
        });
    });

    myEventEmmiter.on('house.buy.ans', (ans, owner) => {
        dispatch({
            type: 'ANS_BUY_HOUSE',
            payload: {
                answer: ans,
                owner
            }
        });
    });

    myEventEmmiter.on('house.enter.ans.err', () => {
        dispatch({
            type: 'ANS_ENTER_HOUSE',
            payload: {
                answer: 'error',
            }
        });
    });
};




