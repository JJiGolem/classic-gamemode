/* eslint-disable no-undef */
/* eslint-disable no-fallthrough */
/* eslint-disable default-case */
const initialState = {
    // name: 'Ilya Maxin',
    // isDriver: false,
    // isHave: true,
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
    //
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
    //         // order: {
    //         //     productCount,
    //         //     productPrice,
    //         // }
    //     }
    // ]
};

export default function info(state = initialState, action) {

    const { type, payload } = action;
    var newState;

    switch (type) {
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
                ]
            };

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
            newState = { ...state };
            newState.callStatus = payload;
            return newState;

        case 'SET_CALL':
            newState = { ...state };
            newState.isCall = payload;
            return newState;

        case 'START_MY_CALL':
            newState = { ...state };
            newState.isMyCall = payload;
            return newState;

        case 'CHANGE_STATE_HOUSE':
            newState = { ...state };
            newState.houses[0].isOpened = !newState.houses[0].isOpened;
            return newState;

        case 'SET_SELL_HOUSE':
            newState = {  ...state };
            newState.houses[0].isSell = payload;
            return  newState;

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
            let houseIndex = newStateSell.houses.findIndex(house => house.name === payload);

            if (houseIndex !== -1) {
                newStateSell.houses.splice(houseIndex, 1);
            }

            return newStateSell;

        case 'SET_SELL_BUSINESS':
            newState = {  ...state };
            newState.biz[0].isSell = payload;
            return  newState;

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
            newState.biz[0].resources += payload;

            if ((newState.biz[0].order.productsCount - payload) > 0) {
                newState.biz[0].order.productsCount -= payload;
                newState.biz[0].order.productsPrice = parseInt((1 - payload/newState.biz[0].order.productsCount) * newState.biz[0].order.productsPrice)
            } else {
                newState.biz[0].order = null;
            }

            return newState;

        case 'SELL_BUSINESS':
            const newStateSellBiz = { ...state };
            let bizIndex = newStateSellBiz.biz.findIndex(biz => biz.id === payload);

            if (bizIndex !== -1) {
                newStateSellBiz.biz.splice(bizIndex, 1);
            }

            return newStateSellBiz;

        case 'ADD_APP_TO_PHONE':
            const newStateAdd = {...state};

            if(payload.appName === 'house') {
                newStateAdd.houses.push(payload.info);
            } else if(payload.appName === 'biz') {
                newStateAdd.biz.push(payload.info);
            } else if (payload.appName === 'taxi') {
                newStateAdd.isDriver = true;
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
            newState.biz[0].cashBox = money;

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
            return {
                ...state,
                houses: [
                    ...state.houses,
                    state.houses[0] = {
                        ...state.houses[0],
                        buyStatus: payload
                    }
                ]
            }

        case 'BUY_IMPROVEMENT_HOUSE':
            newState = { ...state };
            let improvIndex = newState.houses[0].improvements.findIndex(imp => imp.type == payload);

            if (improvIndex !== -1) {
                newState.houses[0].improvements[improvIndex].isBuyed = true;
                newState.houses[0].buyStatus = null;
                newState.houses[0].isSell = false;
            }

            return newState;
    }

    return state;
}