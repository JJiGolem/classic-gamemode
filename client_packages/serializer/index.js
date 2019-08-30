"use strict"

mp.events.add('serializer.save', () => {
    mp.chat.debug('Save DB');
})