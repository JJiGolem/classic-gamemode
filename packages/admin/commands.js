/// Базовые админские команды, описание их структуры находится в модуле test
var vehicles = call("vehicles");
let notify = call('notifications');
let admin = call('admin');

module.exports = {

    "/a": {
        access: 1,
        description: "Сообщение в админский чат",
        args: "[сообщение]",
        handler: (player, args) => {
            mp.events.call('admin.notify.all', `!{#b5e865}[A] ${player.name}[${player.id}]: ${args.join(' ')}`);
        }
    },
    "/ans": {
        access: 1,
        description: "Ответ игроку",
        args: "[id] [сообщение]",
        handler: (player, args) => {
            let target = mp.players.at(parseInt(args[0]));
            if (!target) return player.call('notifications.push.error', ['Игрок не найден', 'Ошибка']);
            args.shift();
            mp.events.call('admin.notify.all', `!{#f29f53}[A] ${player.name}[${player.id}] > ${target.name}[${target.id}]: ${args.join(' ')}`);
            target.call('chat.message.push', [`!{#f29f53}Ответ от ${player.name}[${player.id}]: ${args.join(' ')}`]);
        }
    },
    "/msg": {
        access: 4,
        description: "Сообщение в общий чат",
        args: "[сообщение]",
        handler: (player, args) => {
            mp.events.call('admin.notify.players', `!{#ebc71b}${player.name}[${player.id}]: ${args.join(' ')}`);
        }
    },
    "/goto": {
        access: 2,
        description: "Телепорт к игроку",
        args: "[ID игрока]",
        handler: (player, args) => {
            if (!args[0]) {
                return;
            }
            let target = mp.players.at(args[0]);
            if (!target) {
                player.call('chat.message.push', [`!{#ffffff} Игрок не найден`]);
                return;
            }
            try {
                player.position = new mp.Vector3(target.position.x + 2, target.position.y, target.position.z);
                player.dimension = target.dimension;
                mp.events.call("admin.notify.all", `!{#edffc2}[A] ${player.name} телепортировался к ${target.name}`);
            } catch (err) {
                player.call('chat.message.push', [`!{#ffffff}Игрок отключился`]);
            }
        }
    },
    "/gethere": {
        access: 3,
        description: "Телепорт игрока к себе",
        args: "[ID игрока]",
        handler: (player, args) => {
            if (!args[0]) {
                return;
            }
            let target = mp.players.at(args[0]);
            if (!target) {
                player.call('chat.message.push', [`!{#ffffff}Игрок не найден`]);
                return;
            }
            try {
                target.position = new mp.Vector3(player.position.x + 2, player.position.y, player.position.z);
                target.dimension = player.dimension;
                mp.events.call("admin.notify.all", `!{#edffc2}[A] ${player.name} телепортировал к себе ${target.name}`);
                target.call('chat.message.push', [`!{#ffffff}${player.name} телепортировал вас к себе`]);
            } catch (err) {
                player.call('chat.message.push', [`!{#ffffff}Игрок отключился`]);
            }
        }
    },
    "/hp": {
        access: 2,
        description: "Выдать здоровье игроку",
        args: "[ID игрока]",
        handler: (player, args) => {
            if (!args[0] || !args[1]) {
                return;
            }
            let target = mp.players.at(args[0]);
            if (!target) {
                player.call('chat.message.push', [`!{#ffffff}Игрок не найден`]);
                return;
            }
            try {
                target.health = parseInt(args[1], 10);
                mp.events.call("admin.notify.all", `!{#edffc2}[A] ${player.name} изменил здоровье игроку ${target.name}`);
            } catch (err) {
                player.call('chat.message.push', [`!{#ffffff}Игрок отключился`]);
            }
        }
    },
    "/kill": {
        access: 4,
        description: "Убить игрока",
        args: "[ид_игрока]:n",
        handler: (player, args, out) => {
            var rec = mp.players.at(args[0]);
            if (!rec) return out.error(`Игрок #${args[0]} не найден`, player);

            rec.health = 0;
        }
    },
    "/restart": {
        access: 6,
        description: "Рестарт сервера (Linux)",
        args: "",
        handler: (player, args) => {
            mp.players.forEach((current) => {
                current.call('chat.message.push', [`!{#edffc2}${player.name} запустил рестарт сервера через ${20000 / 1000} сек.`]);
            });
            setTimeout(() => {
                process.exit();
            }, 20000);
        }
    },
    "/branch": {
        access: 6,
        description: "Обновить мод до выбранной ветки.",
        args: "[название ветки]",
        handler: (player, args, out) => {

            var exec = require("exec");
            exec(`cd ${__dirname} && git clean -d -f && git stash && git checkout ${args[0]} && git pull`, (error, stdout, stderr) => {
                if (error) console.log(stderr);
                console.log(stdout);
                // out.info(`${player.name} запустил обновление сервера`);
            });
        }
    },
    "/update": {
        access: 6,
        description: "Обновить текущую ветку.",
        args: "",
        handler: (player, args, out) => {
            var exec = require("exec");
            exec(`cd ${__dirname} && git clean -d -f && git stash && git pull`, (error, stdout, stderr) => {
                if (error) console.log(stderr);
                console.log(stdout);
                out.info(`${player.name} обновил сборку сервера`);
            });
        }
    },
    "/veh": {
        access: 4,
        description: "Заспавнить транспорт",
        args: "[название т/c] [ID цвета #1] [ID цвета #2]",
        handler: async (player, args) => {
            if (vehicles != null) {
                let veh = {
                    modelName: args[0],
                    x: player.position.x,
                    y: player.position.y + 2,
                    z: player.position.z,
                    h: player.heading,
                    color1: parseInt(args[1]),
                    color2: parseInt(args[2]),
                    license: 0,
                    key: "admin",
                    owner: 0,
                    fuel: 40,
                    mileage: 0,
                    plate: vehicles.generateVehiclePlate(),
                    destroys: 0
                }
                veh = await vehicles.spawnVehicle(veh);
                mp.events.call("admin.notify.all", `!{#e0bc43}[A] ${player.name} создал транспорт ${veh.modelName}`);
            }
        }
    },
    "/mvehs": {
        access: 6,
        description: "Заспавнить N машин [for test]",
        args: "[количество]",
        handler: async (player, args) => {
            if (vehicles != null) {
                for (let i = 0; i < parseInt(args[0]); i++) {
                    let veh = {
                        modelName: 'cheburek',
                        x: 0,
                        y: 0,
                        z: 0,
                        h: 0,
                        color1: parseInt(args[1]),
                        color2: parseInt(args[2]),
                        license: 0,
                        key: "admin",
                        owner: 0,
                        fuel: 40,
                        mileage: 0,
                        plate: vehicles.generateVehiclePlate(),
                        destroys: 0
                    }
                    veh = await vehicles.spawnVehicle(veh);
                }
                mp.events.call("admin.notify.all", `!{#e0bc43}[A] ${player.name} создал ${args[0]} чебуреков`);
            }
        }
    },
    "/pos": {
        access: 1,
        description: "Получить текущие координаты",
        args: "",
        handler: (player, args) => {
            player.call('chat.message.push', [`!{#ffffff} ${player.position.x} ${player.position.y} ${player.position.z}`]);
            console.log(`${player.position.x} ${player.position.y} ${player.position.z}`);
        }
    },
    "/timers": {
        access: 5,
        description: "создать N таймеров",
        args: "[count] [ms]",
        handler: (player, args) => {
            for (let i = 0; i < parseInt(args[0]); i++) {
                setInterval(() => {
                    let i = 1 + 1;
                }, parseInt(args[1]));
            }
        }
    },
    "/vcount": {
        access: 5,
        description: "Вывести кол-во машин на сервере",
        args: "",
        handler: (player, args, out) => {
            let private = mp.vehicles.toArray().filter(x => x.key == 'private');
            let admin = mp.vehicles.toArray().filter(x => x.key == 'admin');
            let faction = mp.vehicles.toArray().filter(x => x.key == 'faction');
            let market = mp.vehicles.toArray().filter(x => x.key == 'market');
            let newbie = mp.vehicles.toArray().filter(x => x.key == 'newbie');
            out.info(`Всего транспорта: ${mp.vehicles.length}`, player);
            out.info(`Личные: ${private.length}`, player);
            out.info(`Админские: ${admin.length}`, player);
            out.info(`Фракционные: ${faction.length}`, player);
            out.info(`Авторынок: ${market.length}`, player);
            out.info(`Для новичков: ${newbie.length}`, player);
        }
    },
    "/tpos": {
        access: 3,
        description: "Телепорт по координате",
        args: "[x] [y] [z]",
        handler: (player, args) => {
            var entity = (player.vehicle) ? player.vehicle : player;
            entity.position = new mp.Vector3(parseFloat(args[0]), parseFloat(args[1]), parseFloat(args[2]));
        }
    },
    "/kick": {
        access: 2,
        description: "Кик игрока",
        args: "[ID] [причина]",
        handler: (player, args) => {
            if (isNaN(parseInt(args[0]))) return; //temp
            let target = mp.players.at(args[0]);
            if (!target || !mp.players.exists(target)) return notify.warning(player, 'Игрок не найден');
            if (!target.character) return notify.warning(player, 'Игрок не найден');
            args.shift();
            let message = args.join(' ');
            mp.events.call('admin.notify.players', `!{#db5e4a}Администратор ${player.name}[${player.id}] кикнул игрока ${target.name}[${target.id}]: ${message}`);
            target.kick("kicked");
        }
    },
    "/skick": {
        access: 4,
        description: "Тихий кик игрока",
        args: "[ID]",
        handler: (player, args) => {
            if (isNaN(parseInt(args[0]))) return; //temp
            let target = mp.players.at(args[0]);
            if (!target || !mp.players.exists(target)) return notify.warning(player, 'Игрок не найден');
            if (!target.character) return notify.warning(player, 'Игрок не найден');
            mp.events.call('admin.notify.all', `!{#9e9e9e}[A] Администратор ${player.name}[${player.id}] кикнул игрока ${target.name}[${target.id}] без лишнего шума`);
            target.kick("kicked");
        }
    },
    "/clothes": {
        access: 3,
        description: "Выдача тестовой одежды",
        args: "[тип] [текстура] [вариация]",
        handler: (player, args) => {
            player.setClothes(parseInt(args[0]), parseInt(args[1]), parseInt(args[2]), 0);
        }
    },
    "/prop": {
        access: 3,
        description: "Выдача тестового пропа",
        args: "[тип] [текстура] [вариация]",
        handler: (player, args) => {
            player.setProp(parseInt(args[0]), parseInt(args[1]), parseInt(args[2]));
        }
    },
    "/tempwear": {
        access: 1,
        description: "Выдача временного набора одежды",
        args: "[ID набора]",
        handler: (player, args) => {
            if (args[0] == 0) {
                // player.setHeadOverlay(1, [9, 0, 0, 0]);
                // player.setHeadOverlay(2, [1, 1, 0, 0]);
                player.setClothes(3, 6, 0, 0);
                player.setClothes(8, 15, 0, 0);
                player.setClothes(11, 141, 5, 0);
                player.setClothes(4, 64, 10, 0);
                player.setClothes(6, 31, 0, 0);
            }
            if (args[0] == 1) {
                // player.setHeadOverlay(1, [9, 1, 0, 0]);
                // player.setHeadOverlay(2, [1, 1, 0, 0]);
                player.setClothes(3, 6, 0, 0);
                player.setClothes(8, 4, 0, 0);
                player.setClothes(11, 72, 0, 0);
                player.setClothes(4, 35, 0, 0);
                player.setClothes(6, 10, 0, 0);
            }
            if (args[0] == 2) {
                player.setClothes(3, 6, 0, 0);
                player.setClothes(8, 15, 0, 0);
                player.setClothes(11, 229, 0, 0);
                player.setClothes(4, 7, 0, 0);
                player.setClothes(6, 27, 0, 0);
            }
            if (args[0] == 3) {
                player.setClothes(3, 6, 0, 0);
                player.setClothes(8, 15, 0, 0);
                player.setClothes(11, 229, 1, 0);
                player.setClothes(4, 7, 0, 0);
                player.setClothes(6, 27, 0, 0);
            }
            if (args[0] == 4) {
                player.setClothes(3, 6, 0, 0);
                player.setClothes(8, 4, 0, 0);
                player.setClothes(11, 77, 0, 0);
                player.setClothes(4, 35, 0, 0);
                player.setClothes(6, 10, 0, 0);
            }
        }
    },
    "/rot": {
        access: 6,
        handler: (player, args) => {
            player.call('chat.message.push', [`!{#ffffff} ${player.heading}`]);
            console.log(`${player.heading}`);
            if (player.vehicle) {
                player.call('chat.message.push', [`!{#ffffff} ${player.vehicle.heading}`]);
                console.log(`veh heading = ${player.vehicle.heading}`);
                console.log(`veh rotation = ${JSON.stringify(player.vehicle.rotation)}`);
            }
        }
    },
    "/hair": {
        access: 6,
        handler: (player, args) => {
            if (args[0] == 0) {
                player.setHeadOverlay(2, [1, 1, 0, 0]);
                player.setClothes(2, 4, 0, 0);
            }
            if (args[0] == 1) {
                player.setHeadOverlay(2, [1, 1, 0, 0]);
                player.setClothes(2, 12, 0, 0);
            }
            if (args[0] == 2) {
                player.setHeadOverlay(2, [1, 1, 0, 0]);
                player.setClothes(2, 0, 0, 0);
            }
        }
    },
    "/pinfo": {
        access: 6,
        description: "Логировать игрока в консоль",
        args: "",
        handler: (player) => {
            console.log(player)
        }
    },
    "/vinfo": {
        access: 6,
        description: "Логировать авто в консоль",
        args: "",
        handler: (player) => {
            console.log(player.vehicle)
        }
    },
    "/getpos": {
        access: 6,
        description: "Логировать координаты игрока в консоль",
        args: "",
        handler: (player) => {
            console.log("player.position:")
            console.log(player.position)
            console.log("player.heading:")
            console.log(player.heading)
        }
    },
    "/setadmin": {
        description: "Назначить игрока администратором",
        access: 5,
        args: "[ID] [Уровень администрирования]",
        handler: (player, args) => {
            let lvl = parseInt(args[1]);
            let id = parseInt(args[0]);

            if (isNaN(lvl) || lvl < 1 || isNaN(id) || id < 0) return;
            let target = mp.players.at(id);
            if (!target) return player.call('notifications.push.error', [`Игрок не найден`, 'Ошибка']);
            if (lvl >= player.character.admin /*|| target.character.admin > player.character.admin*/ ) return player.call('notifications.push.error', [`Недостаточно прав`, 'Ошибка'])
            target.character.admin = lvl;
            target.character.save();
            target.call('chat.message.push', [`!{#ffcf0d} ${player.character.name} назначил вас администратором ${lvl} уровня`]);
        }
    },
    "/deladmin": {
        description: "Снять админку с игрока",
        access: 5,
        args: "[ID]",
        handler: (player, args) => {
            let id = parseInt(args[0]);

            if (isNaN(id) || id < 0) return;
            let target = mp.players.at(id);
            if (!target) return player.call('notifications.push.error', [`Игрок не найден`, 'Ошибка']);
            if (player.character.admin < target.character.admin) return player.call('notifications.push.error', [`Недостаточно прав`, 'Ошибка'])
            target.character.admin = 0;
            target.character.save();
            target.call('chat.message.push', [`!{#ff8819} ${player.character.name} забрал у вас права администратора`]);
        }
    },
    "/admins": {
        description: "Список администраторов",
        access: 1,
        args: "",
        handler: (player, args) => {
            player.call('chat.message.push', [`!{#ecffbf}Список администраторов в сети:`])
            mp.players.forEach((current) => {
                if (!current.character) return;
                if (current.character.admin) {
                    player.call('chat.message.push', [`!{#ecffbf}${current.character.name} (${current.character.admin} уровень)`]);
                }
            });
        }
    },
    "/setd": {
        description: "Смена измерения",
        access: 4,
        args: "[номер]",
        handler: (player, args) => {
            let dim = parseInt(args[0]);
            if (isNaN(dim)) return;
            player.dimension = dim;
            notify.info(player, `Установлено измерение: ${dim}`);
        }
    },
    "/sethp": {
        description: "Изменить кол-во здоровья игроку. Реанимирует, если игрок лежит.",
        access: 3,
        args: "[ид_игрока]:n [здоровье]:n",
        handler: (player, args, out) => {
            var rec = mp.players.at(args[0]);
            if (!rec) return out.error(`Игрок #${args[0]} не найден`, player);
            rec.health = Math.clamp(args[1], 0, 100);
            out.info(`Игроку ${rec.name} установлено ${rec.health} ед. здоровья`, player);
            notify.info(rec, `${player.name} установил вам ${rec.health} ед. здоровья`);
            if (rec.getVariable("knocked")) rec.setVariable("knocked", null);
        }
    },
    "/weapon": {
        description: "Выдать оружие игроку (не в инвентарь).",
        access: 4,
        args: "[ид_игрока]:n [ид_оружия] [патроны]:n",
        handler: (player, args, out) => {
            var rec = mp.players.at(args[0]);
            if (!rec) return out.error(`Игрок #${args[0]} не найден`, player);
            rec.giveWeapon(mp.joaat(args[1]), args[2]);
        }
    },
    "/q": {
        description: "Отключиться от сервера.",
        access: 1,
        args: "",
        handler: (player, args, out) => {
            out.log(`До скорого!`, player);
            player.kick();
        }
    },
    "/cmdlevel": {
        description: "Установить мин. админ уровень для доступа к команде.",
        access: 6,
        args: "[cmd_name] [level]:n",
        handler: (player, args, out) => {
            var cmd = admin.getCommands()[args[0]];
            if (!cmd) return out.error(`Команда ${args[0]} не найдена`, player);
            if (args[1] > player.character.admin) return out.error(`Нельзя установить уровень команды выше своего`, player);
            cmd.access = args[1];
            out.info(`${player.name} установил для команды ${args[0]} уровень доступа ${args[1]}`);
        }
    },
    "/cmd": {
        description: "Вызвать команду от имени другого игрока.",
        access: 6,
        args: "[player_id]:n [cmd]",
        handler: (player, args, out) => {
            var rec = mp.players.at(args.shift());
            if (!rec) return out.error(`Игрок #${args[0]} не найден`, player);

            mp.events.call("terminal.command.handle", rec, args);
        }
    },
    "/godmode": {
        description: "Вкл/выкл бессмертие.",
        access: 6,
        args: "",
        handler: (player, args, out) => {
            player.godmode = !player.godmode;
            player.call(`godmode.set`, [player.godmode]);
            if (player.godmode) return out.log(`Бессмертие включено`, player);
            else return out.log(`Бессмертие выключено`, player);
        }
    },
}
