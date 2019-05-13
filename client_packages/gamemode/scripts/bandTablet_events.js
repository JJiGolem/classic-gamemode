exports = (menu) => {
    mp.events.add("tablet.band.setEnable", (enable) => {
        menu.execute(`mp.events.call('bandTablet', { status: ${enable}, event: 'enable' })`);
    });
}