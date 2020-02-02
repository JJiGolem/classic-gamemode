"use strict";
let browser = mp.browsers.new("package://browser/index.html");

mp.callCEFR = function (eventName, args) {
    let argumentsString = '';

    args.forEach(arg => {
        switch(typeof arg) {
            case 'string': {
                argumentsString += `, \`${arg}\``;
                break;
            }
            case 'number': {
                argumentsString += `, ${arg}`;
                break;
            }
            case 'boolean': {
                argumentsString += `, ${arg}`;
                break;
            }
            case 'object': {
                argumentsString += `, ${JSON.stringify(arg)}`;
                break;
            }
        }
    });
    browser.execute(`mp.events.call(\`${eventName}\`${argumentsString});`);
}

mp.callCEFV = function (text) {
    browser.execute(text);
}

mp.callCEFVN = function (object) {
    for (let objectKey in object) {
        browser.execute(`${objectKey} = ${JSON.stringify(object[objectKey])}`);
    }
}

mp.events.add({
    "callCEFR": mp.callCEFR
});
