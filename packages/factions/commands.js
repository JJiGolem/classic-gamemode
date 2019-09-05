let factions = require('./index');
let notifs = require('../notifications');

module.exports = {
    "/flist": {
        description: "Посмотреть список организаций.",
        access: 6,
        args: "",
        handler: (player, args, out) => {
            var text = "ID) Имя [бп] [макс. бп] [мед] [макс. мед] | блип | цвет_блипа<br/>";
            for (var i = 0; i < factions.factions.length; i++) {
                var faction = factions.factions[i];
                text += `${faction.id}) ${faction.name} [${faction.ammo}] [${faction.maxAmmo}] [${faction.medicines}] [${faction.maxMedicines}] | ${faction.blip} | ${faction.blipColor}<br/>`;
            }
            out.log(text, player);
        }
    },
    "/ftp": {
        description: "Телепортироваться к организации.",
        access: 5,
        args: "[ид_организации]:n",
        handler: (player, args, out) => {
            var marker = factions.getMarker(args[0]);
            if (!marker) return out.error(`Организация #${args[0]} не найдена`, player);
            var pos = marker.position;
            pos.z++;
            player.position = pos;
            out.info(`Вы телепортировались к организации #${args[0]}`, player);
        }
    },
    "/fsetname": {
        description: "Сменить имя организации.",
        access: 6,
        args: "[ид_организации]:n [имя]",
        handler: (player, args, out) => {
            var faction = factions.getFaction(args[0]);
            if (!faction) return out.error(`Организация #${args[0]} не найдена`, player);

            args.splice(0, 1);
            var name = args.join(" ").trim();
            out.info(`${player.name} сменил имя у организации #${faction.id} (${faction.name} => ${name})`);
            faction.name = name;
            faction.save();
        }
    },
    "/fsetleader": {
        description: "Сменить лидера организации.",
        access: 6,
        args: "[ид_организации]:n [имя] [фамилия]",
        handler: async (player, args, out) => {
            var faction = factions.getFaction(args[0]);
            if (!faction) return out.error(`Организация #${args[0]} не найдена`, player);

            var fullName = `${args[1]} ${args[2]}`;
            var rec = mp.players.getByName(fullName);
            var character = (rec) ? rec.character : await db.Models.Character.findOne({
                attributes: ['id', 'faction', 'factionRank'],
                where: {
                    name: fullName
                }
            });;
            if (!character) return out.error(`Персонаж ${fullName} не найден`, player);

            out.info(`${player.name} добавил лидера организации #${faction.id} (#${character.id})`);
            factions.setLeader(faction, character);
        }
    },
    "/fuval": {
        description: "Уволить игрока из организации.",
        access: 6,
        args: "[ид_игрока]:n",
        handler: async (player, args, out) => {
            var rec = mp.players.at(args[0]);
            if (!rec) return out.error(`Игрок #${args[0]} не найден`, player);

            if (!rec.character.factionId) return out.error(`${rec.name} не состоит в организации`, player);
            var faction = factions.getFaction(rec.character.factionId);
            if (!faction) return out.error(`Организация #${rec.character.factionId} не найдена`, player);

            out.info(`${player.name} уволил ${rec.name} из организации #${faction.id}`);
            factions.deleteMember(rec);
        }
    },
    "/fadd": {
        description: "Добавить игрока в организацию.",
        access: 6,
        args: "[ид_игрока]:n [ид_организации]:n",
        handler: async (player, args, out) => {
            var rec = mp.players.at(args[0]);
            if (!rec) return out.error(`Игрок #${args[0]} не найден`, player);

            var faction = factions.getFaction(args[1]);
            if (!faction) return out.error(`Организация #${args[1]} не найдена`, player);


            out.info(`${player.name} добавил ${rec.name} в организацию #${faction.id}`);
            factions.addMember(faction, rec);
        }
    },
    "/fgiverank": {
        description: "Изменить ранг игрока в организацию.",
        access: 6,
        args: "[ид_игрока]:n [ранг]:n",
        handler: async (player, args, out) => {
            var rec = mp.players.at(args[0]);
            if (!rec) return out.error(`Игрок #${args[0]} не найден`, player);

            if (!rec.character.factionId) return out.error(`${rec.name} не состоит в организации`, player);

            var rank = factions.getRank(rec.character.factionId, args[1]);
            if (!rank) return out.error(`Ранг #${args[1]} не найден`, player);

            out.info(`${player.name} изменил ранг ${rec.name} (${rec.character.factionRank} => ${rank.rank})`);
            factions.setRank(rec.character, rank);
        }
    },
    "/fsetammo": {
        description: "Изменить количество боеприпасов на складе организации.",
        access: 6,
        args: "[ид_организации]:n [боеприпасы]:n",
        handler: (player, args, out) => {
            var faction = factions.getFaction(args[0]);
            if (!faction) return out.error(`Организация #${args[0]} не найдена`, player);

            out.info(`${player.name} изменил количество боеприпасов у организации #${args[0]} (${faction.ammo} => ${args[1]})`);
            faction.ammo = args[1];
            faction.save();
        }
    },
    "/fsetmaxammo": {
        description: "Изменить вместимость боеприпасов на складе организации.",
        access: 6,
        args: "[ид_организации]:n [вместимость]:n",
        handler: (player, args, out) => {
            var faction = factions.getFaction(args[0]);
            if (!faction) return out.error(`Организация #${args[0]} не найдена`, player);

            out.info(`${player.name} изменил вместимость боеприпасов на складе у организации #${args[0]} (${faction.maxAmmo} => ${args[1]})`);
            faction.maxAmmo = args[1];
            faction.save();
        }
    },
    "/fsetmeds": {
        description: "Изменить количество медикаментов на складе организации.",
        access: 6,
        args: "[ид_организации]:n [медикаменты]:n",
        handler: (player, args, out) => {
            var faction = factions.getFaction(args[0]);
            if (!faction) return out.error(`Организация #${args[0]} не найдена`, player);

            out.info(`${player.name} изменил количество медикаментов у организации #${args[0]} (${faction.medicines} => ${args[1]})`);
            faction.medicines = args[1];
            faction.save();
        }
    },
    "/fsetmaxmeds": {
        description: "Изменить вместимость медикаментов на складе организации.",
        access: 6,
        args: "[ид_организации]:n [вместимость]:n",
        handler: (player, args, out) => {
            var faction = factions.getFaction(args[0]);
            if (!faction) return out.error(`Организация #${args[0]} не найдена`, player);

            out.info(`${player.name} изменил вместимость медикаментов на складе у организации #${args[0]} (${faction.maxMedicines} => ${args[1]})`);
            faction.maxMedicines = args[1];
            faction.save();
        }
    },
    "/fsetblip": {
        description: "Изменить блип на карте у организации.",
        access: 5,
        args: "[ид_организации]:n [тип_блипа]:n [цвет_блипа]:n",
        handler: (player, args, out) => {
            var faction = factions.getFaction(args[0]);
            if (!faction) return out.error(`Организация #${args[0]} не найдена`, player);

            out.info(`${player.name} изменил блип у организации #${args[0]} (${faction.blip}-${faction.blipColor} => ${args[0]}-${args[1]})`);
            factions.setBlip(faction, args[1], args[2]);
        }
    },
    "/fsetpos": {
        description: "Изменить позицию организации. Позиция берется от игрока.",
        access: 6,
        args: "[ид_организации]:n",
        handler: (player, args, out) => {
            var faction = factions.getFaction(args[0]);
            if (!faction) return out.error(`Организация #${args[0]} не найдена`, player);

            var pos = player.position;
            faction.x = pos.x;
            faction.y = pos.y;
            faction.z = pos.z;
            faction.h = player.heading;
            faction.save();
            pos.z -= 1;

            var marker = factions.getMarker(faction.id);
            marker.position = pos;
            var blip = factions.getBlip(faction.id);
            blip.position = pos;

            out.info(`${player.name} изменил позицию у организации #${faction.id}`);
        }
    },
    "/fsetwarehousepos": {
        description: "Изменить позицию склада организации. Позиция берется от игрока.",
        access: 6,
        args: "[ид_организации]:n",
        handler: (player, args, out) => {
            var faction = factions.getFaction(args[0]);
            if (!faction) return out.error(`Организация #${args[0]} не найдена`, player);

            var pos = player.position;
            faction.wX = pos.x;
            faction.wY = pos.y;
            faction.wZ = pos.z;
            faction.save();
            pos.z -= 1;

            var warehouse = factions.getWarehouse(faction.id);
            warehouse.colshape.destroy();
            warehouse.position = pos;

            var colshape = mp.colshapes.newSphere(pos.x, pos.y, pos.z, 1.5);
            colshape.onEnter = (player) => {
                var boxType = "";
                if (player.hasAttachment("ammoBox")) {
                    boxType = "ammo";
                } else if (player.hasAttachment("medicinesBox")) {
                    boxType = "medicines";
                } else return;

                if (!factions.canFillWarehouse(player, boxType, faction))
                    return notifs.error(player, `Нет прав для пополнения`, `Склад ${faction.name}`);

                player.call("factions.insideFactionWarehouse", [true, boxType]);
                player.insideFactionWarehouse = faction;
            };
            colshape.onExit = (player) => {
                player.call("factions.insideFactionWarehouse", [false]);
                delete player.insideFactionWarehouse;
            };
            warehouse.colshape = colshape;


            out.info(`${player.name} изменил позицию склада у организации #${faction.id}`);
        }
    },
    "/fsetstoragepos": {
        description: "Изменить позицию выдачи предметов организации. Позиция берется от игрока.",
        access: 6,
        args: "[ид_организации]:n",
        handler: (player, args, out) => {
            var faction = factions.getFaction(args[0]);
            if (!faction) return out.error(`Организация #${args[0]} не найдена`, player);

            var pos = player.position;
            faction.sX = pos.x;
            faction.sY = pos.y;
            faction.sZ = pos.z;
            faction.save();
            pos.z -= 1;

            var storage = factions.getStorage(faction.id);
            storage.colshape.destroy();
            storage.position = pos;

            var colshape = mp.colshapes.newSphere(pos.x, pos.y, pos.z, 1.5);
            colshape.onEnter = (player) => {
                if (player.character.factionId != faction.id) return notifs.error(player, `Отказано в доступе`, faction.name);
                player.call("factions.storage.showMenu", [faction.id]);
                player.insideFactionWarehouse = faction.id;
            };
            colshape.onExit = (player) => {
                player.call("selectMenu.hide");
                delete player.insideFactionWarehouse;
            };
            storage.colshape = colshape;

            out.info(`${player.name} изменил позицию выдачи предметов у организации #${faction.id}`);
        }
    },
    "/franks": {
        description: "Получить список рангов организации.",
        access: 6,
        args: "[ид_организации]:n",
        handler: (player, args, out) => {
            var faction = factions.getFaction(args[0]);
            if (!faction) return out.error(`Организация #${args[0]} не найдена`, player);

            var text = `Организация ${faction.name}:<br/>`;
            for (var i = 0; i < faction.ranks.length; i++) {
                var rank = faction.ranks[i];
                text += `${i + 1}) ${rank.name} - $${rank.pay}<br/>`;
            }

            out.log(text, player);
        }
    },
    "/fsetrankname": {
        description: "Изменить название ранга.",
        access: 6,
        args: "[ид_организации]:n [номер_ранга]:n [название]",
        handler: (player, args, out) => {
            var faction = factions.getFaction(args[0]);
            if (!faction) return out.error(`Организация #${args[0]} не найдена`, player);

            var rank = faction.ranks[args[1] - 1];

            args.splice(0, 2);
            var name = args.join(" ").trim();
            out.info(`${player.name} изменил название ранга ${rank.rank} у организации #${faction.id} (${rank.name} => ${name})`);
            rank.name = name;
            rank.save();
        }
    },
    "/fsetrankpay": {
        description: "Изменить зарплату ранга.",
        access: 6,
        args: "[ид_организации]:n [номер_ранга]:n [сумма]:n",
        handler: (player, args, out) => {
            var faction = factions.getFaction(args[0]);
            if (!faction) return out.error(`Организация #${args[0]} не найдена`, player);

            var rank = faction.ranks[args[1] - 1];

            out.info(`${player.name} изменил зарплату ранга ${rank.pay} у организации #${faction.id} (${rank.pay} => ${args[2]})`);
            rank.pay = args[2];
            rank.save();
        }
    },
}
