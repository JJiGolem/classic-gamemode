let whitelist = require('./index.js');

module.exports = {
    '/wlist': {
        args: '',
        description: 'Просмотреть вайтлист',
        access: 6,
        handler: (player, args, out) => {
            let list = whitelist.getAllowed();
            let result = 'WHITELIST: <br/>';
            list.forEach((record) => {
                result += `${record.id}) ${record.socialClub}<br/>`;
            });
            out.info(result, player);
        }
    },
    '/wlistadd': {
        args: '[socialClub]:s',
        description: 'Добавить игрока в вайтлист',
        access: 6,
        handler: async (player, args, out) => {
            let socialClub = args[0];
            let isInList = whitelist.isInWhiteList(socialClub);
            if (isInList) return out.error('Игрок уже в вайтлисте', player);

            let record = await db.Models.WhiteList.create({
                socialClub: socialClub
            });
            whitelist.pushToAllowed(record);
            out.info(`Игрок ${socialClub} добавлен в вайтлист`, player);
        }
    },
    '/wlistremove': {
        args: '[socialClub]:s',
        description: 'Удалить игрока из вайтлиста',
        access: 6,
        handler: async (player, args, out) => {
            let socialClub = args[0];
            let isInList = whitelist.isInWhiteList(socialClub);
            if (!isInList) return out.error('Игрока нет в вайтлисте', player);
            let record = await db.Models.WhiteList.findOne({
                where: {
                    socialClub: socialClub
                }
            });

            if (!record) return out.error('Игрока нет в вайтлисте', player);
            record.destroy();
            whitelist.removeFromAllowed(socialClub);
            out.info(`Игрок ${socialClub} удален из вайтлиста`, player);
        }
    },
    '/wlistparse': {
        args: '',
        description: 'Парсинг старых значений вайтлиста',
        access: 6,
        handler: (player, args, out) => {

            let oldList = [ /// Список разрешенных social club'ов
                "kirswift",
                "Alex_Cortez",
                "Pigeon_Gangsta",
                "deusmemes",
                "strainflorein",
                "Cinzu-ra",
                "Eric.Sweep",
                "Djon_Anderson",
                "1d1ssarik",
                "Stanger__W",
                "Spros_mono",
                "SashaDolgopolov", // dolgopolov
                "Nensi_Pnf", // nensi
                "_Deadly0_", // фракнки гаспаро саша
                "MarcusBallevardo", // чед черри
                "cyrax63", // захар курупт
                "ImMoRTaL981", // slage
                "_k_a_r_a_b_a_s_", // доне, карабас
                "Ramdam1", // andrey
                "Jack_Tekila", //  эдгар
                "ScarlyS2", // roma
                "QayRey", // юля
                "..Exi..",
                "LLlBabPa",
                "Edward_Melano",
                "stefano_adderio", //adderio
                "lenyas",
                "Rimskaya",
                "RussianOfficer34" // mickey 
            ];

            oldList.forEach(async (rec) => {
                if (whitelist.isInWhiteList(rec)) return;
                let record = await db.Models.WhiteList.create({
                    socialClub: rec
                });
                whitelist.pushToAllowed(record);
                out.info(`Игрок ${rec} добавлен в вайтлист`, player);
            });
        }
    },
}



