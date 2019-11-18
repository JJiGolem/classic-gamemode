export default (myEventEmmiter, dispatch) => {
    myEventEmmiter.on('biz.menu', () => {
        dispatch({
            type: 'SHOW_BUSINESS',
            payload: true
        });
    });

    myEventEmmiter.on('biz.load', (info) => {
        dispatch({
            type: 'LOAD_INFO_BUSINESS',
            payload: info
        })
    });

    myEventEmmiter.on('biz.menu.close', () => {
        dispatch({
            type: 'CLOSE_BUSINESS'
        });
    });

    myEventEmmiter.on('biz.buy.ans', (ans, owner, actions) => {
        dispatch({
            type: 'ANS_BUY_BUSINESS',
            payload: {
                answer: ans,
                owner: owner,
                actions: actions
            }
        });
    });

    myEventEmmiter.on('biz.faction', (faction) => {
        dispatch({
            type: 'SET_FACTION_BUSINESS',
            payload: faction
        });
    });
}