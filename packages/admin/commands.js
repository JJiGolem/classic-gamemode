/// Базовые админские команды, описание их структуры находится в модуле test
var vehicles = call("vehicles");

module.exports = {
    "/msg": {
        access: 4,
        description: "Сообщение в общий чат",
        args: "[сообщение]",
        handler: (player, args) => {
            mp.players.forEach((target) => {
                target.call('chat.message.push', [`!{#ebc71b}${player.name}[${player.id}]: ${args.join(' ')}`]);
            });
        }
    },
    "/goto": {
        access: 3,
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
                mp.players.forEach((current) => { //TODO проверка на адм, сделать функцию для уведомления всех админов
                    current.call('chat.message.push', [`!{#edffc2}[A] ${player.name} телепортировался к ${target.name}`]);
                });
            }
            catch (err) {
                player.call('chat.message.push', [`!{#ffffff}Игрок отключился`]);
            }
        }
    },
    "/gethere": {
        access: 4,
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
                mp.players.forEach((current) => { //TODO проверка на адм
                    current.call('chat.message.push', [`!{#edffc2}[A] ${player.name} телепортировал к себе ${target.name}`]);
                });
                target.call('chat.message.push', [`!{#ffffff}${player.name} телепортировал вас к себе`]);
            }
            catch (err) {
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
                mp.players.forEach((current) => { //TODO проверка на адм
                    current.call('chat.message.push', [`!{#edffc2}[A] ${player.name} изменил здоровье игроку ${target.name}`]);
                });
            }
            catch (err) {
                player.call('chat.message.push', [`!{#ffffff}Игрок отключился`]);
            }
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
    "/update": {
        access: 6,
        description: "Обновить мод до выбранной ветки",
        args: "[название ветки]",
        handler: (player, args) => {

            var exec = require("exec");
            exec(`cd ${__dirname} && git clean -d -f && git stash && git checkout ${args[0]} && git pull`, (error, stdout, stderr) => {
                if (error) console.log(stderr);
                console.log(stdout);

                mp.players.forEach((current) => {
                    current.call('chat.message.push', [`!{#edffc2}${player.name} запустил обновление сервера`]);
                });
            });
        }
    },
    "/veh": {
        access: 4,
        description: "Заспавнить транспорт",
        args: "[название т/c] [ID цвета #1] [ID цвета #2]",
        handler: (player, args) => {
            if (vehicles != null) {
                let veh = {
                    model: args[0],
                    x: player.position.x,
                    y: player.position.y + 2,
                    z: player.position.z,
                    spawnHeading: player.heading,
                    color1: parseInt(args[1]),
                    color2: parseInt(args[2]),
                    license: 0,
                    key: "admin",
                    owner: 0,
                    fuel: 50
                }
                veh = vehicles.spawnVehicle(veh);
                //player.putIntoVehicle(veh, -1);
            }
        }
    },
    "/pos": {
        access: 5,
        description: "Получить текущие координаты",
        args: "",
        handler: (player, args) => {
            player.call('chat.message.push', [`!{#ffffff} ${player.position.x} ${player.position.y} ${player.position.z}`]);
            console.log(`${player.position.x} ${player.position.y} ${player.position.z}`);
        }
    },
    "/tpos": {
        access: 3,
        description: "Телепорт по координате",
        args: "[x] [y] [z]",
        handler: (player, args) => {
            player.spawn(new mp.Vector3(parseFloat(args[0]), parseFloat(args[1]), parseFloat(args[2])));
        }
    }
}