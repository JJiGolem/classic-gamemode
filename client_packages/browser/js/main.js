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
