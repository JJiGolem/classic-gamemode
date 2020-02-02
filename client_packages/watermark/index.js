"use strict";

mp.watermark = {
    init(id) {
        mp.callCEFV(`watermark.id = \`${id}\``);
    },
};

mp.events.add({
    "watermark.init": mp.watermark.init,
});
