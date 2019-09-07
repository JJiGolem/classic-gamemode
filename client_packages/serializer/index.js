"use strict"

mp.events.add('serializer.save.all.ans', () => {
    mp.chat.debug('DB saved');
});

mp.events.add('serializer.save.table.ans', (table) => {
    mp.chat.debug(`Table ${table} saved`);
});

mp.events.add('serializer.clear.all.ans', () => {
    mp.chat.debug('DB cleared');
});

mp.events.add('serializer.clear.table.ans', (table) => {
    mp.chat.debug(`Table ${table} cleared`);
});

mp.events.add('serializer.load.all.ans', () => {
    mp.chat.debug('DB loaded from files');
});

mp.events.add('serializer.load.table.ans', (table) => {
    mp.chat.debug(`Table ${table} loaded from files`);
});