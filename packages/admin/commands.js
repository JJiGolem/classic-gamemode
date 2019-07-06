/// Базовые админские команды, описание их структуры находится в модуле test
module.exports = {
    "/msg": {
        access: 4,
        description: "Сообщение в общий чат",
        args: "[сообщение]",
        handler: (player, args) => {
            mp.players.forEach((target) => {
                target.chat.push(`!{#ebc71b}Администратор ${player.name}[${player.id}]: ${args.join(' ')}`);
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
                player.chat.push(`!{#ffffff} Игрок не найден`);
                return;
            }
            try {
                player.position = new mp.Vector3(target.position.x + 2, target.position.y, target.position.z);
                mp.players.forEach((current) => { //TODO проверка на адм
                    current.chat.push(`!{#edffc2}[A] ${player.name} телепортировался к ${target.name}`);
                });
            }
            catch (err) {
                player.chat.push(`!{#ffffff}Игрок отключился`);
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
                player.chat.push(`!{#ffffff}Игрок не найден`);
                return;
            }
            try {
                target.position = new mp.Vector3(player.position.x + 2, player.position.y, player.position.z);
                mp.players.forEach((current) => { //TODO проверка на адм
                    current.chat.push(`!{#edffc2}[A] ${player.name} телепортировал к себе ${target.name}`);
                });
                target.chat.push(`!{#ffffff}${player.name} телепортировал вас к себе`);
            }
            catch (err) {
                player.chat.push(`!{#ffffff}Игрок отключился`);
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
                player.chat.push(`!{#ffffff}Игрок не найден`);
                return;
            }
            try {
                target.health = parseInt(args[1], 10);
                mp.players.forEach((current) => { //TODO проверка на адм
                    current.chat.push(`!{#edffc2}[A] ${player.name} изменил здоровье игроку ${target.name}`);
                });
            }
            catch (err) {
                player.chat.push(`!{#ffffff}Игрок отключился`);
            }
        }
    },
    "/restart": {
        access: 4,
        description: "Рестарт сервера (Linux)",
        args: "",
        handler: (player, args) => {
            mp.players.forEach((current) => {
                current.chat.push(`!{#edffc2}${player.name} запустил рестарт сервера через ${20000 / 1000} сек.`);
            });
            setTimeout(() => {
                process.exit();
            }, 20000);
        }
    },
    "/update": {
        access: 4,
        description: "Обновить мод до выбранной ветки",
        args: "[название ветки]",
        handler: (player, args) => {

            var exec = require("exec");
            exec(`cd ${__dirname} && git clean -d -f && git stash && git checkout ${args[0]} && git pull`, (error, stdout, stderr) => {
                if (error) console.log(stderr);
                console.log(stdout);

                mp.players.forEach((current) => {
                    current.chat.push(`!{#edffc2}${player.name} запустил обновление сервера`);
                });
            });
        }
    },
    "/veh": { // TEMP
        access: 4,
        description: "Заспавнить транспорт",
        args: "[название т/c] [ID цвета #1] [ID цвета #2]",
        handler: (player, args) => {
            let vehicle = mp.vehicles.new(mp.joaat(args[0]), new mp.Vector3(player.position.x, player.position.y, player.position.z),
                {
                    numberPlate: "CLASSIC",
                    color: [[0, args[1], 0], [0, args[2], 0]]
                });
            player.putIntoVehicle(vehicle, -1);
        }
    }
}