"use strict";
mp.notify = {};

mp.notify.success = (text, header) => {
    if (typeof text == 'object') text = JSON.stringify(text);
    mp.callCEFV(`notifications.push('success', \`${text}\`, \`${header}\`)`);
}

mp.notify.warning = (text, header) => {
    if (typeof text == 'object') text = JSON.stringify(text);
    mp.callCEFV(`notifications.push('warning', \`${text}\`, \`${header}\`)`);
}

mp.notify.error = (text, header) => {
    if (typeof text == 'object') text = JSON.stringify(text);
    mp.callCEFV(`notifications.push('error', \`${text}\`, \`${header}\`)`);
}

mp.notify.info = (text, header) => {
    if (typeof text == 'object') text = JSON.stringify(text);
    mp.callCEFV(`notifications.push('info', \`${text}\`, \`${header}\`)`);
}


mp.events.add({
    "notifications.push.success": mp.notify.success,
    "notifications.push.warning": mp.notify.warning,
    "notifications.push.error": mp.notify.error,
    "notifications.push.info": mp.notify.info,
});
