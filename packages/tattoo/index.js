const fs = require('fs');

let parseData = {};

module.exports = {
    init() {

    },
    parseTattoos() {
        fs.readdirSync("packages/tattoo/data/").forEach(file => {
            let collection = file.slice(0, file.length - 5);
            console.log(collection);
            let data = require(`./data/${file}`);
            data.forEach((current) => {
                db.Models.Tattoo.create({
                    collection: collection,
                    name: current.Name,
                    hashNameMale: current.HashNameMale,
                    hashNameFemale: current.HashNameFemale,
                    zoneId: current.ZoneID,
                    price: current.Price
                });
            });
        });

    }
}