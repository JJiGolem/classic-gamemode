let bus = require('./index');

module.exports = {
    "/bus": {
        description: "Телепорт к автостанции",
        access: 6,
        args: "",
        handler: (player, args) => {
            player.position = new mp.Vector3(432.8280944824219, -645.812255859375, 28.725753784179688);
        }
    },
}