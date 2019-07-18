var carshow = require('./index.js');
module.exports = {
    "/buy": { 
        handler: (player, args) => {
           mp.events.call('carshow.car.buy', player, args[0]);
        }
    }
}