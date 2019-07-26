import moment from 'moment';
import 'moment/locale/ru';

moment.locale('ru');
const inittialState = [
    {
        name: 'Данила',
        number: '134432',
        PhoneMessages: [
            {
                text: 'ты как',
                isMine: false,
                date: Date.now()
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
                isMine: true,
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
                isRead: true,
                isMine: false
            },
            {
                text: '?',
                isRead: true,
                isMine: false
            },
            {
                text: 'пиздец меня разъебало вчера',
                isRead: true,
                isMine: true
            },
            {
                text: 'ну ясен хуй епт',
                isRead: true,
                isMine: false
            },
            {
                text: 'унесло так унесло',
                isRead: true,
                isMine: true
            },
            {
                text: 'я думал вообще откинусь ))000 ладно хоть не блевал',
                isRead: false,
                isMine: false
            },
            {
                text: 'в',
                isMine: false,
                isRead: false
            },
        ]
    },
];

export default function dialogs(state = inittialState, action) {
    const { type, payload } = action;
    const DIALOG_SIZE = 100;
    var newState;

    switch(type) {
        case 'LOAD_DIALOGS':
            return payload;

        case 'ADD_DIALOG':
            newState = [ ...state ];
            newState.push({
                name: payload.name,
                number: payload.number,
                PhoneMessages: []
            });
            return newState;

        case 'RENAME_DIALOG':
            newState = [ ...state ];
            let renameDialogIndex = newState.findIndex(dialog => dialog.number === payload.number);

            if (renameDialogIndex !== -1) {
                newState[renameDialogIndex].name = payload.newName;
            }

            return newState;

        case 'DELETE_DIALOG':
            newState = [ ...state ];
            let removeIndex = newState.findIndex(dialog => dialog.number === payload);

            if (removeIndex !== -1) {
                newState.splice(removeIndex, 1);
            }

            return newState;

        case 'ADD_MESSAGE_TO_PHONE':
            let ind = state.findIndex(con => con.number === payload.number);
            newState = [ ...state ];

            if(ind !== -1) {
                if(state[ind].PhoneMessages.length < DIALOG_SIZE) {
                    newState[ind].PhoneMessages.push(
                        {
                            text: payload.text,
                            date: payload.date,
                            isMine: payload.isMine,
                            isRead: payload.isRead
                        });
                    return newState;
                } else {
                    newState[ind].PhoneMessages.splice(0, 1);
                    newState[ind].PhoneMessages.push(
                        {
                            text: payload.text,
                            date: payload.date,
                            isMine: payload.isMine,
                            isRead: payload.isRead
                        });
                    return newState;
                }
            } else {
                newState.push({
                    name: '',
                    number: payload.number,
                    PhoneMessages: [
                        {
                            text: payload.text,
                            isMine: payload.isMine,
                            date: payload.date,
                            isRead: payload.isRead
                        }
                    ]
                })
            }

            newState.isSorted = false;

            return newState;

        case 'SORT_DIALOGS_BY_DATE':
            newState = [ ...state ];
            newState.sort((a, b) =>
                a.PhoneMessages.length !== 0 && b.PhoneMessages.length !== 0 &&
                new Date(a.PhoneMessages[a.PhoneMessages.length - 1].date).toLocaleString()
                    .localeCompare(new Date(b.PhoneMessages[b.PhoneMessages.length - 1].date).toLocaleString()) * -1
            );

            newState.isSorted = true;

            return newState;

        case 'READ_DIALOG_MESSAGES':
            newState = [ ...state ];
            let readIndex = newState.findIndex(dialog => dialog.number === payload);

            if (readIndex !== -1) {
                newState[readIndex].PhoneMessages &&
                newState[readIndex].PhoneMessages.forEach(message => message.isRead = true);
            }

            return newState;
    }

    return state;
}