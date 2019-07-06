"use strict";
mp.notify = {};

mp.notify.success = (text, header) => {
    mp.events.call("notifications.push.success", text, header);
}

mp.notify.warning = (text, header) => {
    mp.events.call("notifications.push.warning", text, header);
}

mp.notify.error = (text, header) => {
    mp.events.call("notifications.push.error", text, header);
}

mp.notify.info = (text, header) => {
    mp.events.call("notifications.push.info", text, header);
}


mp.events.add("notifications.push.success", (text, header) => {
    mp.callCEFV(`notifications.push('success', '${text}', '${header}')`);
});

mp.events.add("notifications.push.warning", (text, header) => {
    mp.callCEFV(`notifications.push('warning', '${text}', '${header}')`);
});

mp.events.add("notifications.push.error", (text, header) => {
    mp.callCEFV(`notifications.push('error', '${text}', '${header}')`);
});

mp.events.add("notifications.push.info", (text, header) => {
    mp.callCEFV(`notifications.push('info', '${text}', '${header}')`);
});