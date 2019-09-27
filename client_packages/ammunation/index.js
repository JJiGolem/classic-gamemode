mp.events.add({
    "ammunation.enter": (data) => {
        mp.events.call('selectMenu.show', 'ammunationMain');
    },
    "ammunation.exit": () => {
        mp.events.call(`selectMenu.hide`);
    },
});