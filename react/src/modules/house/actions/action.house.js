export const showHouse = flag => ({
   type: 'SHOW_HOUSE',
   payload: flag
});

export const closeHouse = () => ({
   type: 'CLOSE_HOUSE'
});

export const loadHouseInfo = info => ({
    type: 'LOAD_INFO_HOUSE',
    payload: info
});

export const setLoadingHouse = flag => ({
    type: 'SET_LOADING_HOUSE',
    payload: flag
});

export const setAnswerHouse = answer => ({
    type: 'ANS_BUY_HOUSE',
    payload: answer
});

export const setHouseFormBlur = flag => ({
   type: 'BLUR_HOUSE_FORM',
   payload: flag
});