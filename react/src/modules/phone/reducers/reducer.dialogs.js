const inittialState = [
    {
        name: 'Данила',
        number: '134432',
        PhoneMessages: [
            {
                text: 'ты как',
                isMine: false
            },
            {
                text: '?',
                isMine: false
            },
            {
                text: 'пиздец меня разъебало вчера',
                isMine: true
            },
            {
                text: 'ну ясен хуй епт',
                isMine: false
            },
            {
                text: 'унесло так унесло',
                isMine: true
            },
            {
                text: 'я думал вообще откинусь ))000 ладно хоть не блевал',
                isMine: true
            },
            {
                text: 'ввхвхвхdgshhssssssskkdawawd',
                isMine: true
            },
        ]
    },
    {
        name: null,
        number: '1212333',
        PhoneMessages: [
            {
                text: 'ты как',
                isMine: false
            },
            {
                text: '?',
                isMine: false
            },
            {
                text: 'пиздец меня разъебало вчера',
                isMine: true
            },
            {
                text: 'ну ясен хуй епт',
                isMine: false
            },
            {
                text: 'унесло так унесло',
                isMine: true
            },
            {
                text: 'я думал вообще откинусь ))000 ладно хоть не блевал',
                isMine: true
            },
            {
                text: '121в',
                isMine: true
            },
        ]
    },
    {
        name: 'Влад',
        number: '0982',
        PhoneMessages: [
            {
                text: 'ты как',
                isMine: false
            },
            {
                text: '?',
                isMine: false
            },
            {
                text: 'пиздец меня разъебало вчера',
                isMine: true
            },
            {
                text: 'ну ясен хуй епт',
                isMine: false
            },
            {
                text: 'унесло так унесло',
                isMine: true
            },
            {
                text: 'я думал вообще откинусь ))000 ладно хоть не блевал',
                isMine: true
            },
            {
                text: 'в',
                isMine: true
            },
        ]
    },
];

export default function dialogs(state = inittialState, action) {
    const { type, payload } = action;
    const DIALOG_SIZE = 100;

    switch(type) {
        case 'LOAD_DIALOGS':
            return payload;

        case 'ADD_DIALOG':
            const newDial = [ ...state ];
            newDial.push({
                name: payload.name,
                number: payload.number,
                PhoneMessages: []
            });
            return newDial;

        case 'RENAME_DIALOG':
            let newRenameState = [ ...state ];
            let renameDialogIndex = newRenameState.findIndex(dialog => dialog.number === payload.number);

            if (renameDialogIndex !== -1) {
                newRenameState[renameDialogIndex].name = payload.newName;
            }

            return newRenameState;

        case 'ADD_MESSAGE_TO_PHONE':
            let ind = state.findIndex(con => con.number === payload.number);
            const newState = [ ...state ];

            if(ind !== -1) {
                if(state[ind].PhoneMessages.length < DIALOG_SIZE) {
                    newState[ind].PhoneMessages.push({text: payload.text, isMine: payload.isMine});
                    return newState;
                } else {
                    newState[ind].PhoneMessages.splice(0, 1);
                    newState[ind].PhoneMessages.push({text: payload.text, isMine: payload.isMine});
                    return newState;
                }
            } else {
                newState.push({
                    name: '',
                    number: payload.number,
                    PhoneMessages: [
                        {
                            text: payload.text,
                            isMine: payload.isMine
                        }
                    ]
                })
            }
            return newState;
    }

    return state;
}