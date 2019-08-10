export const showBusiness = flag => ({
    type: 'SHOW_BUSINESS',
    payload: flag
});

export const closeBusiness = () => ({
    type: 'CLOSE_BUSINESS'
});

export const loadBusinessInfo = info => ({
    type: 'LOAD_INFO_BUSINESS',
    payload: info
});

export const setLoadingBusiness = flag => ({
    type: 'SET_LOADING_BUSINESS',
    payload: flag
});

export const setAnswerBuyBusiness = answer => ({
    type: 'ANS_BUY_BUSINESS',
    payload: answer
});

export const setBusinessFormBlur = flag => ({
    type: 'BLUR_BUSINESS_FORM',
    payload: flag
});

