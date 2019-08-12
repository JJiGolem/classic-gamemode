Math.clamp = function(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

// var mp = {
//     trigger(name)  {
//         console.log(`mp.trigger: ${JSON.stringify(arguments)}`);
//     },
// };

function getPaddingNumber(str, max = 5) {
    const string = str.toString();
    return string.length < max ? getPaddingNumber(`0${string}`, max) : string;
}

function prettyMoney(val) {
    val += '';
    return val.replace(/(\d)(?=(\d{3})+(\D|$))/g, '$1 ');
}

function setCursor(enable) {
    mp.invoke('focus', enable);
}

function cloneObj(inObj) {
    let outObj = JSON.parse(JSON.stringify(inObj));
    for (let key in inObj) {
        if (typeof (inObj[key]) == 'function') {
            outObj[key] = inObj[key];
        }
    }
    return outObj;
}
