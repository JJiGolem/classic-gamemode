mp.events.add('parkings.menu.show', () => {
    //mp.callCEFVN({ "selectMenu.menu": defaultMenu });
    //mp.callCEFV(`selectMenu.menu.handler = '${handler}'`)
    //mp.callCEFV(`selectMenu.menu.handler = '${handler}'`)
    mp.callCEFVN({ "selectMenu.show": true });
});

mp.events.add('parkings.menu.close', () => {
    mp.callCEFVN({ "selectMenu.show": false });
});