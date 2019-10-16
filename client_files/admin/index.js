mp.adminLevel = 0;

mp.events.add({
    'admin.set': (level) => {
        mp.adminLevel = level;
    }
});