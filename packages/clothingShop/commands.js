module.exports = {
    '/loadcshops': {
        args: '',
        description: 'Загрузка магазов одежды',
        access: 6,
        handler: (player, args) => {
            let data = [
                
            ]

            data.forEach(async (current) => {
                let type;
                switch (current.subclass) {
                    case 'binco':
                        type = 0;
                        break;
                    case 'discount':
                        type = 1;
                        break;
                    case 'suburban':
                        type = 2;
                        break;
                    case 'ponsonbys':
                        type = 3;
                        break;
                }


                await db.Models.ClothingShop.create({
                    class: current.class + 1,
                    bType: type,
                    x: current.pos[0],
                    y: current.pos[1],
                    z: current.pos[2],
                    placeX: current.clothes[0][5][0],
                    placeY: current.clothes[0][5][1],
                    placeZ: current.clothes[0][5][2],
                    placeH: current.clothes[0][6],
                    cameraX: current.clothes[0][7][0],
                    cameraY: current.clothes[0][7][1],
                    cameraZ: current.clothes[0][7][2],
                });
            });
        }
    }
}