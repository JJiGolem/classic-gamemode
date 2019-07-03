"use strict";
let browser = mp.browsers.new("package://browser/index.html");

mp.callCEFR = function (eventName, args) { 
    let argumentsString = '';

    args.forEach(arg => {
        switch(typeof arg) {
            case 'string': {
                argumentsString += `, '${arg}'`;
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
    browser.execute(`mp.events.call('${eventName}'${argumentsString});`);
}