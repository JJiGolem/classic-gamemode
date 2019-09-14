let maskList;
let shop = {
    x: -1336.258056640625,
    y: -1277.6488037109375,
    z: 4.873090744018555,
    fitting: {
        x: -1337.2947998046875,
        y: -1276.2763671875,
        z: 4.894469738006592,
        h: 107.35881805419922
    },
    camera: {
        x: -1338.28515625,
        y: -1276.6783447265625,
        z: 5.6
    }
}

module.exports = {
    init() {
        this.createMaskShop();
        this.loadMasksFromDB();
    },
    createMaskShop() {
        mp.blips.new(362, new mp.Vector3(shop.x, shop.y, shop.z),
        {
            name: "Магазин масок",
            shortRange: true,
            color: 4
        });

        let shape = mp.colshapes.newSphere(shop.x, shop.y, shop.z, 2.5);

        shape.onEnter = (player) => {
            player.call('chat.message.push', ['!{#ffffff}enter masks']);
            player.call('masks.shop.shape', [true]);
            player.call('prompt.show', ['Нажмите <span>E</span> для того, чтобы посмотреть маски']);
        }

        shape.onExit = (player) => {
            player.call('chat.message.push', ['!{#ffffff}exit masks']);
            player.call('masks.shop.shape', [false]);
            player.call('prompt.hide');
        }
    },
    async loadMasksFromDB() {
        maskList = await db.Models.Mask.findAll();
    },
    getMaskList() {
        return maskList;
    },
    getRawMaskList() {
        let list = [];
        maskList.forEach((current) => {
            if (!current.isAvailable) return;
            list.push({
                id: current.id,
                drawable: current.drawable,
                name: current.name,
                price: current.price
            })
        });
        return list;
    },
    getShopData() {
        return shop;
    }
}