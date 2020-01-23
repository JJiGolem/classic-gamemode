mp.events.add({
    "bar.show": (data) => {
        if (mp.game.ui.isPauseMenuActive()) return;
        if (mp.busy.includes()) return;

        mp.busy.add('bar.menu', false);
        mp.callCEFV(`selectMenu.showByName('bar')`);
        mp.callCEFV(`selectMenu.menus['bar'].init(${JSON.stringify(data)})`);
    },
    "bar.close": () => {
        mp.busy.remove('bar.menu');
        mp.callCEFV(`selectMenu.show = false`)
    }
});
