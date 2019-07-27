const initialState = {
    name: 'Ilya Maxin',
    isHave: true,
    contacts: [
        {
            name: 'Влад Кузнецов',
            number: '773631'
        },
        {
            name: 'Данила',
            number: '134432'
        },
        {
            name: 'Диман',
            number: '123'
        },
        {
            name: 'Вика',
            number: '55555'
        }
    ],
    houses: [
        {
            name: 228,
            area: 'Санта-Моника',
            class: 'Люкс',
            numRooms: 4,
            garage: true,
            carPlaces: 2,
            rent: 350,
            price: 45000,
            isOpened: true,
            days: 4,
            improvements: [
                {
                    name: 'Сигнализация',
                    price: 300,
                    isBuyed: true,
                },
                {
                    name: 'Шкаф',
                    price: 150,
                    isBuyed: false,
                }
            ]
        }
    ]
};

export default function info(state = initialState, action) {

    const { type, payload } = action;
    var newState;

    switch (type) {

        case 'LOAD_INFO_TO_PHONE':
            return payload;

        case 'ADD_CONTACT':
            return {
                ...state,
                contacts: [
                    ...state.contacts,
                    payload
                ]
            };

        case 'DELETE_CONTACT':
            newState = { ...state };
            let deletedIndex = newState.contacts.findIndex(con => con.number === payload);
            deletedIndex !== -1 && newState.contacts.splice(deletedIndex, 1);
            return newState;

        case 'RENAME_CONTACT':
            let indexContact = state.contacts.findIndex(con => con.number === payload.number);
            state.contacts[indexContact].name = payload.newName;
            return state;

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

        case 'SET_SELL':
            newState = {  ...state };
            newState.houses[0].isSell = payload;
            return  newState;

        case 'SET_SELL_STATUS':
            newState = { ...state };
            newState.houses[0].sellStatus = payload;
            return newState;

        case 'SET_SELL_INFO':
            newState = { ...state };
            newState.houses[0].ansSell = payload;
            return newState;

        case 'SELL_HOUSE':
            newState = { ...state };
            let houseIndex = newState.houses.findIndex(house => house.name === payload);

            if (houseIndex !== -1) {
                newState.houses.splice(houseIndex, 1);
            }

            return newState;
    }

    return state;
}