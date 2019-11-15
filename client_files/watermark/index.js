"use strict";


/*
    created 21.09.19 by Carter Slade
*/

mp.watermark = {
    init(id) {
        mp.callCEFV(`watermark.id = \`${id}\``);
    },
};

mp.events.add({
    "watermark.init": mp.watermark.init,
});
