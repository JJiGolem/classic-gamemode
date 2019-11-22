export default (myEventEmmiter, dispatch) => {
    myEventEmmiter.on('house.menu', () => {
        dispatch({
            type: 'SHOW_HOUSE',
            payload: true
        });
    });

    myEventEmmiter.on('house.load', (info) => {
        dispatch({
            type: 'LOAD_INFO_HOUSE',
            payload: info
        })
    });

    myEventEmmiter.on('house.menu.close', () => {
        dispatch({
            type: 'CLOSE_HOUSE'
        });
    });

    myEventEmmiter.on('house.menu.enter', (place) => {
        dispatch({
            type: 'SHOW_ENTER_MENU_HOUSE',
            payload: place
        });
    });

    myEventEmmiter.on('house.menu.enter.close', () => {
        dispatch({
            type: 'CLOSE_ENTER_MENU_HOUSE'
        });
    });

    myEventEmmiter.on('house.buy.ans', (ans, owner) => {
        dispatch({
            type: 'ANS_BUY_HOUSE',
            payload: {
                answer: ans,
                owner: owner
            }
        });
    });

    myEventEmmiter.on('house.enter.ans.err', () => {
        dispatch({
            type: 'ANS_ENTER_HOUSE',
            payload: {
                answer: 'error',
            }
        });
    });
}