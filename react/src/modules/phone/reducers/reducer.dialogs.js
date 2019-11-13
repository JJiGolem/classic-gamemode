/* eslint-disable default-case */
const initialState = {
    isSorted: false,
    list:  [
        // {
        //     name: 'Данила',
        //     number: '134432',
        //     PhoneMessages: [
        //         {
        //             text: 'ты как',
        //             isMine: false,
        //             date: Date.now()
        //         },
        //         {
        //             text: '?',
        //             isMine: false
        //         },
        //         {
        //             text: 'пиздец меня разъебало вчера',
        //             isMine: true
        //         },
        //         {
        //             text: 'ну ясен хуй епт',
        //             isMine: false
        //         },
        //         {
        //             text: 'унесло так унесло',
        //             isMine: true,
        //         },
        //         {
        //             text: 'я думал вообще откинусь ))000 ладно хоть не блевал',
        //             isMine: true
        //         },
        //         {
        //             text: 'ввхвхвхdgshhssssssskkdawawd',
        //             isMine: true
        //         },
        //     ]
        // },
        // {
        //     name: null,
        //     number: '1212333',
        //     PhoneMessages: [
        //         {
        //             text: 'ты как',
        //             isMine: false
        //         },
        //         {
        //             text: '?',
        //             isMine: false
        //         },
        //         {
        //             text: 'пиздец меня разъебало вчера',
        //             isMine: true
        //         },
        //         {
        //             text: 'ну ясен хуй епт',
        //             isMine: false
        //         },
        //         {
        //             text: 'унесло так унесло',
        //             isMine: true
        //         },
        //         {
        //             text: 'я думал вообще откинусь ))000 ладно хоть не блевал',
        //             isMine: true
        //         },
        //         {
        //             text: '121в',
        //             isMine: true
        //         },
        //     ]
        // },
        // {
        //     name: 'Влад',
        //     number: '0982',
        //     PhoneMessages: [
        //         {
        //             text: 'ты как',
        //             isRead: true,
        //             isMine: false
        //         },
        //         {
        //             text: '?',
        //             isRead: true,
        //             isMine: false
        //         },
        //         {
        //             text: 'пиздец меня разъебало вчера',
        //             isRead: true,
        //             isMine: true
        //         },
        //         {
        //             text: 'ну ясен хуй епт',
        //             isRead: true,
        //             isMine: false
        //         },
        //         {
        //             text: 'унесло так унесло',
        //             isRead: true,
        //             isMine: true
        //         },
        //         {
        //             text: 'я думал вообще откинусь ))000 ладно хоть не блевал',
        //             isRead: false,
        //             isMine: false
        //         },
        //         {
        //             text: 'в',
        //             isMine: false,
        //             isRead: false
        //         },
        //     ]
        // },
    ]
};

export default function dialogs(state = initialState, action) {
    const { type, payload } = action;

    switch(type) {
        case 'LOAD_DIALOGS':
            return {
                isSorted: false,
                list: payload
            };

        case 'ADD_DIALOG':
            return {
                ...state,
                list: [
                    ...state.list,
                    {
                        name: payload.name,
                        number: payload.number,
                        PhoneMessages: []
                    }
                ]
            }

        case 'RENAME_DIALOG':
            const newStateRename = { ...state };
            let renameDialogIndex = newStateRename.list.findIndex(dialog => dialog.number === payload.number);

            if (renameDialogIndex !== -1) {
                newStateRename.list[renameDialogIndex].name = payload.newName;
            }

            return newStateRename;

        case 'DELETE_DIALOG':
            const newStateDelete = { ...state };
            let deleteIndex = newStateDelete.list.findIndex(dialog => dialog.number === payload);

            if (deleteIndex !== -1) {
                newStateDelete.list.splice(deleteIndex, 1);
            }

            return newStateDelete;

        case 'ADD_MESSAGE_TO_PHONE':
            const newStateAdd = { ...state };

            let dialogIndex = newStateAdd.list.findIndex(con => con.number === payload.number);

            if(dialogIndex !== -1) {
                newStateAdd.list[dialogIndex].PhoneMessages.push(
                    {
                        text: payload.text,
                        date: Date.now(),
                        isMine: payload.isMine,
                        isRead: payload.isRead
                    });
            } else {
                newStateAdd.list.push({
                    name: '',
                    number: payload.number,
                    PhoneMessages: [
                        {
                            text: payload.text,
                            isMine: payload.isMine,
                            date:Date.now(),
                            isRead: payload.isRead
                        }
                    ]
                })
            }

            newStateAdd.isSorted = false;

            return newStateAdd;

        case 'LOAD_MESSAGES_TO_DIALOG':
            const newStateLoad = { ...state };
            let loadDialogIndex = newStateLoad.list.findIndex(dialog => dialog.number == payload.number);
            
            if (loadDialogIndex !== -1) {
                newStateLoad.list[loadDialogIndex].PhoneMessages = 
                    payload.messages
                    .concat(newStateLoad.list[loadDialogIndex].PhoneMessages);
            }

            return newStateLoad;

        case 'SORT_DIALOGS_BY_DATE':
            const newStateSorted = { ...state };
            newStateSorted.list.sort((a, b) =>
                a.PhoneMessages.length !== 0 && b.PhoneMessages.length !== 0 &&
                new Date(a.PhoneMessages[a.PhoneMessages.length - 1].date).toLocaleString()
                    .localeCompare(new Date(b.PhoneMessages[b.PhoneMessages.length - 1].date).toLocaleString()) * -1
            );

            newStateSorted.isSorted = true;

            return newStateSorted;

        case 'READ_DIALOG_MESSAGES':
            const newStateRead = { ...state };
            let readIndex = newStateRead.list.findIndex(dialog => dialog.number === payload);

            if (readIndex !== -1) {
                newStateRead.list[readIndex].PhoneMessages &&
                newStateRead.list[readIndex].PhoneMessages.forEach(message => message.isRead = true);
            }

            return newStateRead;
    }

    return state;
}