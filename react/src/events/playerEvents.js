import React from 'react';
import myEventEmmiter from '../helpers/events.js';
import IncomingCall from "../modules/phone/components/IncomingCall";

export const PlayerEvents = (dispatch, getState) => {

    // ------------ ЧАТ --------------------
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

    // ------------ ЧАТ - КОНЕЦ --------------------

    // ------------ ТЕЛЕФОН (ОБЩЕЕ) -----------------

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

    myEventEmmiter.on('news.price', (symbolPrice) => {
        dispatch({
            type: 'SET_SYMBOL_PRICE_NEWS',
            payload: symbolPrice
        });
    });

    myEventEmmiter.on('phone.message.list', (dialogs) => {
        dispatch({
            type: 'LOAD_DIALOGS',
            payload: dialogs
        });
    });

    myEventEmmiter.on('phone.message.load', (messages, number) => {
        dispatch({
            type: 'LOAD_MESSAGES_TO_DIALOG',
            payload: { messages, number }
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

    myEventEmmiter.on('phone.contact.mine.update', (oldNumber, newNumber) => {
        dispatch({
            type: 'UPDATE_MY_NUMBER',
            payload: { oldNumber, newNumber }
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

    myEventEmmiter.on('phone.app.add', (appName, info) => {
        dispatch({
            type: 'ADD_APP_TO_PHONE',
            payload: { appName, info }
        });
    });

    myEventEmmiter.on('phone.app.remove', (appName) => {
        dispatch({
            type: 'DELETE_APP_TO_PHONE',
            payload: appName
        });
    });

    // ------------ ТЕЛЕФОН (ОБЩЕЕ) - КОНЕЦ -----------------

    // ------------ ТЕЛЕФОН (ДОМ) -----------------

    myEventEmmiter.on('house.sell.toGov.ans', (ans) => {
        dispatch({
            type: 'SET_SELL_STATUS_HOUSE',
            payload: ans
        });
    });

    myEventEmmiter.on('house.sell.ans', (ans) => {
        dispatch({
            type: 'SET_SELL_STATUS_HOUSE',
            payload: ans
        });
    });

    myEventEmmiter.on('house.sell.check.ans', (nick, price) => {
        dispatch({
            type: 'SET_SELL_INFO_HOUSE',
            payload: { nick, price }
        });
    });

    // ------------ ТЕЛЕФОН (ДОМ) - КОНЕЦ -----------------

    // ------------ ТЕЛЕФОН (БИЗНЕС) -----------------

    myEventEmmiter.on('biz.sell.toGov.ans', (ans) => {
        dispatch({
            type: 'SET_SELL_STATUS_BUSINESS',
            payload: ans
        });
    });

    myEventEmmiter.on('biz.sell.ans', (ans) => {
        dispatch({
            type: 'SET_SELL_STATUS_BUSINESS',
            payload: ans
        });
    });

    myEventEmmiter.on('biz.sell.check.ans', (nick, price) => {
        dispatch({
            type: 'SET_SELL_INFO_BUSINESS',
            payload: { nick, price }
        });
    });

    myEventEmmiter.on('biz.order.ans', (ans) => {
        dispatch({
            type: 'SET_ORDER_STATUS_BUSINESS',
            payload: ans
        });
    });

    myEventEmmiter.on('biz.order.complete', (resources) => {
        dispatch({
            type: 'ORDER_COMPLETE_BUSINESS',
            payload: resources
        });
    });

    myEventEmmiter.on('biz.order.take', (flag) => {
        dispatch({
            type: 'TAKE_ORDER_BUSINESS',
            payload: flag
        });
    });

    myEventEmmiter.on('biz.statistics.update', (date, money) => {
        dispatch({
            type: 'UPDATE_STATISTICS_BUSINESS',
            payload: { date, money }
        });
    });

    // ------------ ТЕЛЕФОН (БИЗНЕС) - КОНЕЦ -----------------

    // ------------ ТЕЛЕФОН (ТАКСИ) -----------------

    myEventEmmiter.on('taxi.client.location', (area, street) => {
        dispatch({
            type: 'LOAD_LOCATION_TAXI_CLIENT',
            payload: { area, street }
        });
    });

    myEventEmmiter.on('taxi.client.order.ans', (order) => {
        dispatch({
            type: 'ANS_ORDER_TAXI_CLIENT',
            payload: order
        });
    });

    myEventEmmiter.on('taxi.client.order.ready', () => {
        dispatch({
            type: 'DRIVER_READY_TAXI_CLIENT'
        });
    });

    myEventEmmiter.on('taxi.client.order.inTaxi', () => {
        dispatch({
            type: 'PLAYER_IN_TAXI_CLIENT'
        });
    });

    myEventEmmiter.on('taxi.client.order.destination', (area, street, price) => {
        dispatch({
            type: 'SET_DESTINATION_TAXI_CLIENT',
            payload: { area, street, price }
        });
    });

    myEventEmmiter.on('taxi.client.order.cancel', () => {
        dispatch({
            type: 'CANCEL_ORDER_TAXI_CLIENT'
        });
    });

    myEventEmmiter.on('taxi.client.order.error', () => {
        dispatch({
            type: 'ERROR_ORDER_TAXI_CLIENT'
        });
    });

    myEventEmmiter.on('taxi.driver.load', (info) => {
        dispatch({
            type: 'LOAD_INFO_TAXI_DRIVER',
            payload: info
        });
    });

    myEventEmmiter.on('taxi.driver.order.add', (order) => {
        dispatch({
            type: 'ADD_ORDER_TAXI_DRIVER',
            payload: order
        });
    });

    myEventEmmiter.on('taxi.driver.order.delete', (orderId) => {
        dispatch({
            type: 'DELETE_ORDER_TAXI_DRIVER',
            payload: orderId
        });
    });

    myEventEmmiter.on('taxi.driver.order.cancel', () => {
        dispatch({
            type: 'CANCEL_ORDER_TAXI_DRIVER'
        });
    });

    myEventEmmiter.on('taxi.driver.order.error', () => {
        dispatch({
            type: 'ERROR_ORDER_TAXI_DRIVER'
        });
    });

    myEventEmmiter.on('taxi.driver.order.way', (area, street, price) => {
        dispatch({
            type: 'SET_DESTINATION_TAXI_DRIVER',
            payload: { area, street, price }
        });
    });


    // ------------ ТЕЛЕФОН (ТАКСИ) - КОНЕЦ -----------------

    // ------------ ДОМА -----------------
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
                owner: owner
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

    // ------------ ДОМА - КОНЕЦ -----------------

    // ------------ БИЗНЕСЫ -----------------

    myEventEmmiter.on('biz.menu', () => {
        dispatch({
            type: 'SHOW_BUSINESS',
            payload: true
        });
    });

    myEventEmmiter.on('biz.load', (info) => {
        dispatch({
            type: 'LOAD_INFO_BUSINESS',
            payload: info
        })
    });

    myEventEmmiter.on('biz.menu.close', () => {
        dispatch({
            type: 'CLOSE_BUSINESS'
        });
    });

    myEventEmmiter.on('biz.buy.ans', (ans, owner, actions) => {
        dispatch({
            type: 'ANS_BUY_BUSINESS',
            payload: {
                answer: ans,
                owner: owner,
                actions: actions
            }
        });
    });

    // ------------ БИЗНЕСЫ - КОНЕЦ -----------------

    myEventEmmiter.on('players.show', (flag) => {
        dispatch({
            type: 'SHOW_PLAYERS',
            payload: flag
        });
    });

    myEventEmmiter.on('players.add', (player) => {
        dispatch({
            type: 'ADD_PLAYER',
            payload: player
        });
    });

    myEventEmmiter.on('players.remove', (id) => {
        dispatch({
            type: 'REMOVE_PLAYER',
            payload: id
        });
    });

    myEventEmmiter.on('bank.show', (bankInfo) => {
        dispatch({
            type: 'SHOW_BANK',
            payload: bankInfo
        });
    });

    myEventEmmiter.on('bank.close', () => {
        dispatch({
            type: 'CLOSE_BANK'
        });
    });

    myEventEmmiter.on('bank.push.ans', (result) => {
        dispatch({
            type: 'SET_ANSWER_BANK',
            payload: {
                type: 'push',
                answer: result
            }
        });
    });

    myEventEmmiter.on('bank.pop.ans', (result) => {
        dispatch({
            type: 'SET_ANSWER_BANK',
            payload: {
                type: 'pop',
                answer: result
            }
        });
    });

    myEventEmmiter.on('bank.phone.push.ans', (result) => {
        dispatch({
            type: 'SET_ANSWER_BANK',
            payload: {
                type: 'phone',
                answer: result
            }
        });
    });

    myEventEmmiter.on('bank.house.push.ans', (result) => {
        dispatch({
            type: 'SET_ANSWER_BANK',
            payload: {
                type: 'house',
                answer: result
            }
        });
    });

    myEventEmmiter.on('bank.biz.push.ans', (result) => {
        dispatch({
            type: 'SET_ANSWER_BANK',
            payload: {
                type: 'biz',
                answer: result
            }
        });
    });

    myEventEmmiter.on('bank.biz.cashbox.push.ans', (result) => {
        dispatch({
            type: 'SET_ANSWER_BANK',
            payload: {
                type: 'cashbox_push',
                answer: result
            }
        });
    });

    myEventEmmiter.on('bank.biz.cashbox.pop.ans', (result) => {
        dispatch({
            type: 'SET_ANSWER_BANK',
            payload: {
                type: 'cashbox_pop',
                answer: result
            }
        });
    });

    myEventEmmiter.on('bank.transfer.ask.ans', (nick) => {
        dispatch({
            type: 'SET_ASK_ANSWER_BANK',
            payload: nick
        });
    });

    myEventEmmiter.on('bank.transfer.ans', (result) => {
        dispatch({
            type: 'SET_ANSWER_BANK',
            payload: {
                type: 'transfer',
                answer: result
            }
        });
    });
};




