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

export const setAnswerBuyHouse = answer => ({
    type: 'ANS_BUY_HOUSE',
    payload: answer
});

export const setAnswerEnterHouse = answer => ({
    type: 'ANS_ENTER_HOUSE',
    payload: answer
});

export const setHouseFormBlur = flag => ({
   type: 'BLUR_HOUSE_FORM',
   payload: flag
});

export const showEnterMenuHouse = place => ({
   type: 'SHOW_ENTER_MENU_HOUSE',
   payload: place
});

export const closeEnterMenuHouse = () => ({
    type: 'CLOSE_ENTER_MENU_HOUSE'
});
