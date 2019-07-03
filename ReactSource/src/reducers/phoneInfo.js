const initialState = {
    // name: 'Dun Hill',
    // isHave: true,
    // houses: [
    //     {
    //         name: 228,
    //         area: 'Top',
    //         class: 'Эконом',
    //         numRooms: 3,
    //         garage: true,
    //         carPlaces: 2,
    //         rent: 100,
    //         isOpened: true,
    //         days: 3,
    //         price: 1000,
    //         improvements: [
    //             {
    //                 name: 'Сигнализация',
    //                 price: 300,
    //                 isBuyed: false
    //             },
    //             {
    //                 name: 'Шкаф',
    //                 price: 250,
    //                 isBuyed: true
    //             }
    //         ]
    //     }
    // ],

    // biz: [
    //     {
    //         name: 15,
    //         type: 'Оружейный магазин',
    //         rent: 330,
    //         days: 5,
    //         resources: 10,
    //         money: 184747,
    //         improvements: [
    //             {
    //                 name: 'Расширенный склад',
    //                 price: 10600,
    //                 isBuyed: false
    //             },
    //             {
    //                 name: 'Сигнализация',
    //                 price: 8000,
    //                 isBuyed: false
    //             }
    //         ],
    //         price: 5000,
    //         resourcesMax: 100,
    //         cashBox: 106451
    //     }
    // ],
    
    // contacts: [
    //     {
    //         name: 'Даня',
    //         number: '773663'
    //     },
    //     {
    //         name: 'Вика',
    //         number: '323123'
    //     },
    //     {
    //         name: 'Владос',
    //         number: '1234667'
    //     },
    //     {
    //         name: 'Кирилл',
    //         number: '992873'
    //     },
    //     {
    //         name: 'Пижеон',
    //         number: '1235788'
    //     },
    //     {
    //         name: 'Додо',
    //         number: '224477'
    //     },
    //     {
    //         name: 'Соли',
    //         number: '333333'
    //     },
    // ]
};

export default function phoneInfo(state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case 'ADD_INFO_TO_PHONE':
            return payload;

        case 'ADD_CONTACT':
            const newState = {...state}
            newState.contacts.push(payload);
            return newState;

        case 'RENAME_CONTACT':
            let ind1 = state.contacts.findIndex(con => con.number == payload.number);
            state.contacts[ind1].name = payload.newName
            return state;

        case 'REMOVE_CONTACT':
            const newStateCont = { ...state }
            let ind = newStateCont.contacts.findIndex(con => con.number == payload);
            newStateCont.contacts.splice(ind, 1);
            return newStateCont;

        case 'ADD_APP_TO_PHONE':
            if(payload.appName === 'house') {
                const newState = {...state};
                newState.houses.push(payload.info);
                return newState;
            } else if(payload.appName === 'biz') {
                const newState = {...state};
                newState.biz.push(payload.info);
                return newState;
            }

        case 'DELETE_APP':
            if(payload === 'house') {
                const newState = {...state};
                newState.houses.length = 0;
                return newState;
            } else if(payload === 'biz') {
                const newState = {...state};
                newState.biz.length = 0;
                return newState;
            }

        case 'OPEN_CLOSE_HOUSE':
            const openCloseState = {...state};
            let houseIndexFlag = openCloseState.houses.findIndex(house => house.name == payload.index);
            openCloseState.houses[houseIndexFlag].isOpened = payload.flag;
            return openCloseState;

        case 'BUY_IMPROVEMENT':
            const buyImpState = {...state};
            let indHouseImp = buyImpState.houses.findIndex(house => house.name === payload.index);
            let indImp = buyImpState.houses[indHouseImp].improvements.findIndex(imp => imp.name === payload.name);
            buyImpState.houses[indHouseImp].improvements[indImp].isBuyed = true;
            return buyImpState;

        case 'EXTEND_HOUSE':
            const extendHouseState = { ...state };
            let houseIndex = extendHouseState.houses.findIndex((house => house.name == payload.index));
            extendHouseState.houses[houseIndex].days += payload.days;
            return extendHouseState;

        case 'EXTEND_BIZ':
            const extendBizState = { ...state };
            let bizIndex = extendBizState.biz.findIndex((biz => biz.name == payload.index));
            extendBizState.biz[bizIndex].days += payload.days;
            return extendBizState;

        case 'PUSH_CASHBOX':
            const pushCashState = { ...state };
            let bizIndexPush = pushCashState.biz.findIndex((biz => biz.name == payload.index));
            pushCashState.biz[bizIndexPush].cashBox += payload.money;
            return pushCashState;

        case 'POP_CASHBOX':
            const popCashState = { ...state };
            let bizIndexPop = popCashState.biz.findIndex((biz => biz.name == payload.index));
            popCashState.biz[bizIndexPop].cashBox -= payload.money;
            return popCashState;

        default:
            break;
    }

    return state;
}