/* eslint-disable default-case */
const initialState = [
    // {
    //     id: 1,
    //     name: 'Dun Hill',
    //     faction: 'LSPD',
    //     ping: 9
    // },
    // {
    //     id: 2,
    //     name: 'Swifty Swift',
    //     faction: '-',
    //     ping: 5
    // },
    // {
    //     id: 12,
    //     name: 'Deus Memes',
    //     faction: '-',
    //     ping: 9
    // },
    // {
    //     id: 4,
    //     name: 'Sean Muller',
    //     faction: 'LSPD',
    //     ping: 9
    // },
    // {
    //     id: 5,
    //     name: 'Sean Hans',
    //     faction: 'EMS',
    //     ping: 9
    // },
];

export default function players(state = initialState, action) {
    const { type, payload } = action;
    
    switch(type) {
        case 'LOAD_PLAYERS':
            return payload;
        
        case 'ADD_PLAYER':
            return [
                ...state,
                payload
            ];

        case 'REMOVE_PLAYER':
            const newState = [ ...state ];
            let deleteIndex = newState.findIndex(player => player.id == payload);

            if (deleteIndex !== -1) {
                newState.splice(deleteIndex, 1);
            }

            return newState;
    }

    return state;
}