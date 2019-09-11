"use strict"

const fs = require('fs');
const path = require('path');
const dir = './data';

function writeToFile(data, fileName, callback) {
    fs.writeFile(path.resolve(__dirname, `./data/${fileName}.json`), JSON.stringify(data), (err) => {
        if (err) throw err;
        else {
            console.log(`File ${fileName}.json created`);
            callback();
        }
    });
}

function deleteFile(fileName) {
    fs.unlink(path.resolve(__dirname, `./data/${fileName}`), (err) => {
        if(err) throw err;
        else console.log(`File ${fileName}.json deleted`);
    });
}

function isExists(fileName) {
    return fs.existsSync(path.resolve(__dirname, `./data/${fileName}.json`));
}

module.exports = {
    async saveAll(player) {
        for (let model in db.Models) {
            let data = await db.Models[model].findAll();

            if (data.length !== 0) {
                writeToFile(data, model, () => {
                    player.call('serializer.save.all.ans');
                });
            }
        }
    },
    async saveTable(player, tableName) {
        let data = await db.Models[tableName].findAll();

        if (data.length !== 0) {
            if (!fs.existsSync(path.resolve(__dirname, dir))) {
                fs.mkdirSync(path.resolve(__dirname, dir));
            }   
            writeToFile(data, tableName, () => {
                player.call('serializer.save.table.ans', [tableName]);
            });
        }
    },
    async clearAll(player) {
        for(let model in db.Models) {
            await db.Models[model].destroy({
                where: {},
                truncate: false,
                cascade: false
            });

            deleteFile(`${model}.json`);
        }

        player.call('serializer.clear.all.ans');
    },
    async clearTable(player, tableName) {
        await db.Models[tableName].destroy({
            where: {},
            truncate: false,
            cascade: false
        });

        deleteFile(`${tableName}.json`);

        player.call('serializer.clear.table.ans', [tableName]);
    },
    async loadAll(player) {
        for (let model in db.Models) {
            let data = JSON.parse(fs.readFileSync(path.resolve(__dirname, `./data/${model}.json`), 'utf8'));

            await db.Models[model].destroy({
                where: {},
                truncate: false,
                cascade: false
            });

            data.forEach(row => {
                db.Models[model].create(row);
            });
        }

        console.log('load');
        player.call('serializer.load.all.ans');
    },
    async loadTable(player, tableName) {
        if (isExists(tableName)) {
            let data = JSON.parse(fs.readFileSync(path.resolve(__dirname, `./data/${tableName}.json`), 'utf8'));

            await db.Models[tableName].destroy({
                where: {},
                truncate: false,
                cascade: false
            });

            data.forEach(row => {
                db.Models[tableName].create(row);
            });

            player.call('serializer.load.table.ans', [tableName]);
        } else {
            console.log(`Файл ${tableName} не найден`);
        }
    },
    deleteAllFiles(player) {
        fs.readdir(path.resolve(__dirname, './data'), (err, items) => {
            if (err) throw err;
            else {
                items.forEach(item => deleteFile(item));
            }
        })
    }
}