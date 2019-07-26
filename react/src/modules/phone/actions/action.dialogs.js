export const addMessageToPhone = (text, date, number, isMine, isRead) => ({
    type: 'ADD_MESSAGE_TO_PHONE',
    payload: { text, date, number, isMine, isRead }
});

export const addDialog = (name, number) => ({
    type: 'ADD_DIALOG',
    payload: {name, number}
});

export const renameDialog = (number, newName) => ({
    type: 'RENAME_DIALOG',
    payload: { number, newName }
});

export const deleteDialog = number => ({
    type: 'DELETE_DIALOG',
    payload: number
});

export const sortDialogsByDate = () => ({
    type: 'SORT_DIALOGS_BY_DATE'
});

export const readDialogMessages = number => ({
    type: 'READ_DIALOG_MESSAGES',
    payload: number
});