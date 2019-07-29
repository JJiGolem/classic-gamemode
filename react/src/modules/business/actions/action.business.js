export const showBusiness = flag => ({
    type: 'SHOW_BUSINESS',
    payload: flag
});

export const loadBusinessInfo = info => ({
    type: 'LOAD_INFO_BUSINESS',
    payload: info
});

export const setLoadingBusiness = flag => ({
    type: 'SET_LOADING_BUSINESS',
    payload: flag
});

export const setAnswerBusiness = answer => ({
    type: 'ANS_BUY_BUSINESS',
    payload: answer
});

export const setBusinessFormBlock = flag => ({
    type: 'BLOCK_BUSINESS_FORM',
    payload: flag
});