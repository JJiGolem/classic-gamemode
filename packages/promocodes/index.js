"use strict"

let money = call("money");
let notifs = call("notifications");
let utils = call("utils");

module.exports = {
    // Символы, используемые в промокоде
    symbols: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K",
        "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W",
        "X", "Y", "Z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"
    ],
    // Длина промокода
    codeLength: 5,
    // Свободные промокоды
    codes: [],
    // Загружаемое кол-во промокодов за один раз
    codesCount: 100,
    // Кол-во минут на сервере для получения награды за промокод
    completedMinutes: 10 * 60,

    init() {
        this.fillCodes();
    },
    async fillCodes() {
        var codes = [];
        for (var i = 0; i < this.codesCount; i++) {
            var code = this.generatePromocode(codes);
            codes.push(code);
        }
        this.codes = await this.getFreePromocodes(codes);
        console.log(`[PROMOCODES] Свободные промокоды загружены (${this.codes.length})`);
    },
    async getPromocode() {
        if (!this.codes.length) await this.fillCodes();

        return this.codes.shift();
    },
    generatePromocode(codes) {
        var code = "";
        while (true) {
            for (var i = 0; i < this.codeLength; i++) {
                var rand = utils.randomInteger(0, this.symbols.length - 1);
                code += this.symbols[rand];
            }
            if (!codes.includes(code)) break;
        }
        return code;
    },
    async getFreePromocodes(codes) {
        var list = await db.Models.Promocode.findAll({
            attributes: ["promocode"],
            where: {
                promocode: codes
            }
        });
        list.forEach(promocode => {
            var i = codes.indexOf(promocode.promocode);
            if (i != -1) codes.splice(i, 1);
        });

        return codes;
    },
    async activate(player, code) {
        code = code.toUpperCase();
        var header = `Активация промокода`;
        var out = (text) => {
            notifs.error(player, text, header);
        };
        if (player.character.Promocode.promocode == code) return out(`Нельзя активировать свой промокод`);

        // TODO: проверка на подарочные промокоды

        var promocode = await db.Models.Promocode.findOne({
            where: {
                promocode: code
            },
            include: [{
                    attributes: ["accountId"],
                    model: db.Models.Character,
                },
                db.Models.PromocodeReward,
            ]
        });
        if (player.character.inviterId) return out(`Вы уже активировали реферальный промокод`);
        if (!promocode) return out(`Промокод ${code} не найден`);
        if (promocode.Character.accountId == player.account.id) return out(`Нельзя активировать промокод от своего аккаунта`);
        var minutes = parseInt((Date.now() - player.authTime) / 1000 / 60 % 60) + player.character.minutes;
        if (minutes > this.completedMinutes) return out(`Вы уже проиграли более ${this.completedMinutes} минут`);

        var reward = promocode.PromocodeReward;
        money.addMoney(player, reward.playerSum, (res) => {
            if (!res) return out(`Ошибка начисления в банк`);

            player.character.inviterId = promocode.characterId;
            player.character.save();

            promocode.invited++;
            promocode.save();

            mp.events.call("player.promocode.activated", player, promocode);
        });

        notifs.success(player, `Промокод активирован`, header);
    },
};
