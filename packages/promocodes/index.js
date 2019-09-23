"use strict"

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
        var characters = await db.Models.Character.findAll({
            attributes: ["promocode"],
            where: {
                promocode: codes
            }
        });
        characters.forEach(character => {
            var i = codes.indexOf(character.promocode);
            if (i != -1) codes.splice(i, 1);
        });

        return codes;
    },
};
