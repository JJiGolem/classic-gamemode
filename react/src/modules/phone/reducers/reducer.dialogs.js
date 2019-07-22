const inittialState = [
    {
        name: 'Данила',
        number: '134432',
        messages: [
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
        name: '',
        number: '1212333',
        messages: [
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
        messages: [
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
                messages: []
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
                if(state[ind].messages.length < DIALOG_SIZE) {
                    newState[ind].messages.push({text: payload.text, isMine: payload.isMine});
                    return newState;
                } else {
                    newState[ind].messages.splice(0, 1);
                    newState[ind].messages.push({text: payload.text, isMine: payload.isMine});
                    return newState;
                }
            } else {
                newState.push({
                    name: '',
                    number: payload.number,
                    messages: [
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