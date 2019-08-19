mp.events.add('taxi.driver.app.open', () => {
    mp.chat.debug('driver open');
    mp.callCEFR('taxi.driver.load', [{ name: 'Имя водителя', orders: [{id: 1, distance: 4.2}]}]);
});