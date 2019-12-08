/* eslint-disable no-undef */
/* eslint-disable no-fallthrough */
/* eslint-disable default-case */
import $ from 'jquery';

const initialState = {
    // name: 'Ilya Maxin',
    // isDriver: true,
    // isHave: true,
    // isLoad: true,
    // symbolPriceNews: 3,
    // contacts: [
    //     {
    //         name: 'Влад Кузнецов',
    //         number: '773631'
    //     },
    //     {
    //         name: 'Данила',
    //         number: '134432'
    //     },
    //     {
    //         name: 'Диман',
    //         number: '123'
    //     },
    //     {
    //         name: 'Вика',
    //         number: '55555'
    //     }
    // ],
    // houses: [
    //     {
    //         name: 228,
    //         area: 'Санта-Моника',
    //         class: 'Люкс',
    //         numRooms: 4,
    //         garage: true,
    //         carPlaces: 2,
    //         rent: 350,
    //         price: 45000,
    //         isOpened: true,
    //         days: 4,
    //         improvements: [
    //             {
    //                 name: 'Сигнализация',
    
    //                 price: 300,
    //                 isBuyed: true,
    //             },
    //             {
    //                 name: 'Шкаф',
    //                 price: 150,
    //                 isBuyed: false,
    //             }
    //         ]
    //     }
    // ],
    // biz: [
    //     {
    //         id: 3,
    //         name: 'Ponsonbys',
    //         type: 'Магазин одежды',
    //         cashBox: 732101,
    //         area: 'Палето Бэй',
    //         days: 5,
    //         rent: 50,
    //         resourcesMax: 2000,
    //         resources: 228,
    //         resourcePriceMin: 10,
    //         resourcePriceMax: 50,
    //         price: 112000,
    //         improvements: [],
    //         statistics: [
    //             {
    //                 date: new Date(2019, 6, 10),
    //                 money: 339
    //             },
    //             {
    //                 date: new Date(2019, 6, 11),
    //                 money: 333
    //             },
    //             {
    //                 date: new Date(2019, 6, 12),
    //                 money: 111
    //             },
    //             {
    //                 date: new Date(2019, 6, 13),
    //                 money: 234
    //             },
    //             {
    //                 date: new Date(2019, 6, 14),
    //                 money: 6756
    //             },
    //             {
    //                 date: new Date(2019, 6, 15),
    //                 money: 32
    //             },
    //             {
    //                 date: new Date(2019, 6, 16),
    //                 money: 12
    //             },
    //             {
    //                 date: new Date(2019, 6, 17),
    //                 money: 445
    //             },
    //             {
    //                 date: new Date(2019, 6, 18),
    //                 money: 7876
    //             },
    //             {
    //                 date: new Date(2019, 6, 19),
    //                 money: 435567
    //             },
    //         ]
    //     }
    // ],
    // factionBiz: {
    //     id: 3,
    //     name: 'QQQQQ',
    //     type: 'Магазин жопы',
    //     cashBox: 732101,
    //     area: 'Палето Бэй',
    //     resourcesMax: 2000,
    //     resources: 228,
    //     resourcePriceMin: 10,
    //     resourcePriceMax: 50,
    //     improvements: [],
    //     statistics: []
    // }
};

let phoneIsShow = false;
let phoneIsShow2 = false;

export default function info(state = initialState, action) {

    const { type, payload } = action;
    var newState;

    switch (type) {
        case 'SHOW_PHONE':
            phoneIsShow = payload;

            if (!payload && state.incomingCall.state) {
                // eslint-disable-next-line no-undef
                mp.trigger('phone.call.in.ans', 0);
                phoneIsShow2 = false;

                return {
                    ...state,
                    incomingCall: null
                }
            } else if (payload) {
                phoneIsShow2 = false;
            }

            return state;

        case 'LOAD_INFO_TO_PHONE':
            return {
                ...state,
                ...payload,
                contacts: [
                    ...payload.contacts,
                    {
                        name: 'Мой номер',
                        number: payload.number
                    }
                ],
                isLoad: true
            };

        case 'DISABLE_HOME_PHONE':
            return {
                ...state,
                isDisabled: payload
            }

        case 'SET_SYMBOL_PRICE_NEWS':
            return {
                ...state,
                symbolPriceNews: payload
            }

        case 'ADD_CONTACT':
            return {
                ...state,
                contacts: [
                    ...state.contacts,
                    payload
                ]
            };

        case 'UPDATE_MY_NUMBER':
            newState = { ...state };
            let myNumberIndex = newState.contacts.findIndex(con => con.number == payload.oldNumber && con.name == 'Мой номер');

            if (myNumberIndex !== -1) {
                let deletedContacts = newState.contacts.filter(con => con.number == payload.newNumber);

                if (deletedContacts.length > 0) {
                    deletedContacts.forEach(con => {
                        let delInd = newState.contacts.findIndex(contact => contact.number == con.number);

                        if (delInd !== -1) {
                            newState.contacts.splice(delInd, 1);
                        }
                    })
                }
                newState.contacts[myNumberIndex].number = payload.newNumber;
                newState.number = payload.newNumber;
            }

            return newState;

        case 'DELETE_CONTACT':
            newState = { ...state };
            let deletedIndex = newState.contacts.findIndex(con => con.number === payload);
            deletedIndex !== -1 && newState.contacts.splice(deletedIndex, 1);
            return newState;

        case 'RENAME_CONTACT':
            let indexContact = state.contacts.findIndex(con => con.number === payload.number);
            state.contacts[indexContact].name = payload.newName;
            return state;

        case 'SORT_CONTACTS':
            newState = { ...state };
            newState.contacts.sort((a, b) => a.name.localeCompare(b.name));
            return newState;

        case 'SET_CALL_STATUS':
            if (state.incomingCall && state.incomingCall.state && phoneIsShow2) {
                $('#phone-form-react').animate({ bottom: '-50%' }, 100, function() {
                    $('#phone-form-react').css({ "display": "none" });
                });
                phoneIsShow2 = false;
            }

            return {
                ...state,
                incomingCall: {
                    ...state.incomingCall,
                    state: false
                },
                activeCall: {
                    ...state.activeCall,
                    callStatus: payload
                }
            }
        case 'SET_CALL':
            return {
                ...state,
                isCall: payload
            }

        case 'INCOMING_CALL':
            if (!phoneIsShow && payload.state) {
                $('#phone-form-react').animate({ bottom: '-20%' }, 100);
                $('#phone-form-react').css({ "display": "block" });
                phoneIsShow2 = true;
            }
            return {
                ...state,
                incomingCall: payload
            }

        case 'ACTIVE_CALL':
            return {
                ...state,
                activeCall: {
                    ...state.activeCall,
                    ...payload
                }
            }

        case 'CHANGE_STATE_HOUSE':
            newState = { ...state };
            newState.houses[0].isOpened = !newState.houses[0].isOpened;
            return newState;

        case 'SET_SELL_STATUS_HOUSE':
            newState = { ...state };
            newState.houses[0].sellStatus = payload;
            return newState;

        case 'SET_SELL_INFO_HOUSE':
            newState = { ...state };
            newState.houses[0].ansSell = payload;
            return newState;

        case 'SELL_HOUSE':
            const newStateSell = { ...state };
            newStateSell.houses.length = 0;

            return newStateSell;

        case 'SET_SELL_STATUS_BUSINESS':
            newState = { ...state };
            newState.biz[0].sellStatus = payload;
            return newState;

        case 'SET_SELL_INFO_BUSINESS':
            newState = { ...state };
            newState.biz[0].ansSell = payload;
            return newState;
            
        case 'CREATE_ORDER_BUSINESS':
            newState = { ...state };
            newState.biz[0].order = payload;
            newState.biz[0].cashBox -= payload.productsPrice;
            newState.biz[0].orderStatus = null;
            return newState;

        case 'CANCEL_ORDER_BUSINESS':
            newState = { ...state };
            if (newState.biz[0].order !== null) {
                newState.biz[0].order = null;
            }
            return newState;

        case 'SET_ORDER_STATUS_BUSINESS':
            newState = { ...state };
            newState.biz[0].orderStatus = payload;
            return newState;

        case 'TAKE_ORDER_BUSINESS':
            newState = { ...state };
            newState.biz[0].order.isTake = payload;
            return newState;

        case 'ORDER_COMPLETE_BUSINESS':
            newState = { ...state };
            newState.biz[0].resources += payload.count;

            if ((newState.biz[0].order.productsCount - payload.count) > 0) {
                newState.biz[0].order.productsCount -= payload.count;
                newState.biz[0].order.productsPrice -= payload.sum
            } else {
                newState.biz[0].order = null;
            }

            return newState;

        case 'UPDATE_PRODUCTS_BUSINESS':
            newState = { ...state };
            newState.biz[0].resources = payload;
            return newState;

        case 'SELL_BUSINESS':
            const newStateSellBiz = { ...state };
            let bizIndex = newStateSellBiz.biz.findIndex(biz => biz.id === payload);

            if (bizIndex !== -1) {
                newStateSellBiz.biz.splice(bizIndex, 1);
            }

            return newStateSellBiz;

        case 'CREATE_ORDER_BUSINESS_FACTION':
            newState = { ...state };
            newState.factionBiz.order = payload;
            newState.factionBiz.cashBox -= payload.productsPrice;
            newState.factionBiz.orderStatus = null;
            return newState;

        case 'CANCEL_ORDER_BUSINESS_FACTION':
            newState = { ...state };
            if (newState.factionBiz.order !== null) {
                newState.factionBiz.order = null;
            }
            return newState;

        case 'SET_ORDER_STATUS_BUSINESS_FACTION':
            newState = { ...state };
            newState.factionBiz.orderStatus = payload;
            return newState;

        case 'TAKE_ORDER_BUSINESS_FACTION':
            newState = { ...state };
            newState.factionBiz.order.isTake = payload;
            return newState;

        case 'ORDER_COMPLETE_BUSINESS_FACTION':
                newState = { ...state };
                newState.factionBiz.resources += payload.count;
    
                if ((newState.factionBiz.order.productsCount - payload.count) > 0) {
                    newState.factionBiz.order.productsCount -= payload.count;
                    newState.factionBiz.order.productsPrice -= payload.sum
                } else {
                    newState.factionBiz.order = null;
                }
    
                return newState;

        case 'ADD_APP_TO_PHONE':
            const newStateAdd = {...state};

            if(payload.appName === 'house') {
                if (newStateAdd.houses) {
                    newStateAdd.houses.push(payload.info);
                } else {
                    newStateAdd.houses = [payload.info];
                }
            } else if(payload.appName === 'biz') {
                if (newStateAdd.biz) {
                    newStateAdd.biz.push(payload.info);
                } else {
                    newStateAdd.biz = [payload.info];
                }
            } else if (payload.appName === 'taxi') {
                newStateAdd.isDriver = true;
            } else if (payload.appName === 'factionBiz') {
                newStateAdd.factionBiz = payload.info
            }

            return newStateAdd;

        case 'DELETE_APP_TO_PHONE':
            const newStateRemove = {...state};

            if(payload === 'house') {
                newStateRemove.houses.length = 0;
            } else if(payload === 'biz') {
                newStateRemove.biz.length = 0;
            } else if (payload === 'taxi') {
                newStateRemove.isDriver = false;
            } else if (payload === 'factionBiz') {
                newStateRemove.factionBiz = null;
            }

            return newStateRemove;

        case 'PAY_HOUSE_BANK':
            newState = { ...state };
            let indPayHouse = newState.houses.findIndex(house => house.name === payload.name);

            if (indPayHouse !== -1) {
                newState.houses[indPayHouse].days += payload.days;
            }

            return newState;

        case 'PAY_BUSINESS_BANK':
            newState = { ...state };
            let indPayBusiness = newState.biz.findIndex(biz => biz.id === payload.id);

            if (indPayBusiness !== -1) {
                newState.biz[indPayBusiness].days += payload.days;
            }

            return newState;

        case 'PUSH_CASHBOX_BANK':
            newState = { ...state };
            let indPushCash = newState.biz.findIndex(biz => biz.id === payload.id);

            if (indPushCash !== -1) {
                newState.biz[indPushCash].cashBox += payload.money;
            }

            return newState;

        case 'POP_CASHBOX_BANK':
            newState = { ...state };
            let indPopCash = newState.biz.findIndex(biz => biz.id === payload.id);

            if (indPopCash !== -1) {
                newState.biz[indPopCash].cashBox -= payload.money;
            }

            return newState;

        case 'UPDATE_CASHBOX_BUSINESS':
            newState = { ...state };
            newState.biz[0].cashBox = payload;

            return newState;

        case 'UPDATE_STATISTICS_BUSINESS':
            newState = { ...state };
            let dayIndex = newState.biz[0].statistics.findIndex(day => day.date == payload.date);
            if (dayIndex !== -1) {
                newState.biz[0].statistics[dayIndex].money = payload.money;
            } else {
                if (newState.biz[0].statistics.length === 30) {
                    newState.biz[0].statistics.pop();
                }
                newState.biz[0].statistics.unshift(payload);
            }

            return newState;

        case 'BUY_IMPROVEMENT_HOUSE_ANS':
            newState = { ...state };

            newState.houses[0].buyStatus = payload;

            return newState;

        case 'BUY_IMPROVEMENT_HOUSE':
            newState = { ...state };
            let improvIndex = newState.houses[0].improvements.findIndex(imp => imp.type == payload);

            if (improvIndex !== -1) {
                newState.houses[0].improvements[improvIndex].isBuyed = true;
                newState.houses[0].buyStatus = null;
            }

            return newState;

        case 'BUY_IMPROVEMENT_BUSINESS_ANS':
            newState = { ...state };

            newState.biz[0].buyStatus = payload;

            return newState;

        case 'BUY_IMPROVEMENT_BUSINESS':
            newState = { ...state };
            let improvIndexBiz = newState.biz[0].improvements.findIndex(imp => imp.type == payload);

            if (improvIndexBiz !== -1) {
                newState.biz[0].improvements[improvIndexBiz].isBuyed = true;
                newState.biz[0].buyStatus = null;
            }

            return newState;

        case 'BUY_IMPROVEMENT_BUSINESS_FACTION_ANS':
            newState = { ...state };

            newState.bizFaction.buyStatus = payload;

            return newState;

        case 'BUY_IMPROVEMENT_BUSINESS_FACTION':
            newState = { ...state };
            let improvBizFactionIndex = newState.bizFaction.improvements.findIndex(imp => imp.type == payload);

            if (improvBizFactionIndex !== -1) {
                newState.bizFaction.improvements[improvBizFactionIndex].isBuyed = true;
                newState.bizFaction.buyStatus = null;
            }

            return newState;
    }

    return state;
}