export const addMessageToPhone = (text, number, isMine) => ({
    type: 'ADD_MESSAGE_TO_PHONE',
    payload: { text, number, isMine }
});

export const addDialog = (name, number) => ({
    type: 'ADD_DIALOG',
    payload: {name, number}
});

export const renameDialog = (number, newName) => ({
    type: 'RENAME_DIALOG',
    payload: { number, newName }
});