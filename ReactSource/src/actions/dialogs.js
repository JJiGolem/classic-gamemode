export const addMessage = (text, number, isMine) => ({
    type: 'ADD_MESSAGE',
    payload: {text, number, isMine}
})

export const addDialog = (name, number) => ({
    type: 'ADD_DIALOG',
    payload: {name, number}
})