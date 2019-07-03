import React from 'react';

export const setForm = formName => ({
    type: 'SET_FORM',
    payload: formName
});

export const addForm = formName => ({
    type: 'ADD_FORM',
    payload: formName
});

export const closeForm = () => ({
    type: 'CLOSE_FORM'
});

