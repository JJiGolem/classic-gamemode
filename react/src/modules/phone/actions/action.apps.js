export const addAppDisplay = app => ({
    type: 'ADD_APP',
    payload: app
});

export const setAppDisplay = app => ({
    type: 'SET_APP',
    payload: app
});

export const closeAppDisplay = () => ({
    type: 'CLOSE_APP'
});

export const deleteApp = appName => ({
    type: 'DELETE_APP',
    payload: appName
});