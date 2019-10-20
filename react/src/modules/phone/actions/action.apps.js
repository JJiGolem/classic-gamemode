export const addAppDisplay = app => ({
    type: 'ADD_APP',
    payload: app
});

export const setAppDisplay = app => ({
    type: 'SET_APP',
    payload: app
});

export const setAppsDisplay = apps => ({
    type: 'SET_APPS',
    payload: apps
});

export const closeAppDisplay = () => ({
    type: 'CLOSE_APP'
});

export const deleteApp = appName => ({
    type: 'DELETE_APP_TO_PHONE',
    payload: appName
});