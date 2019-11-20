"use strict";
/// Документ по работе с БД, не подключает игнорируемые модули
const Sequelize = require('sequelize');
const fs = require("fs");
global.Op = Sequelize.Op;

module.exports = {
    sequelize: null,
    Models: {},
    /// Подключение к БД
    connect: function(callback) {
        console.log("[DATABASE] db connect...")
        this.sequelize = new Sequelize('classic_db', mp.config.dbUser, mp.config.dbPassword, {
            host: 'localhost',
            dialect: 'mysql',
            logging: false,
            pool: {
                max: 100,
                min: 2,
                // acquire: 30000,
                idle: 10000
            },
        });
        this.loadModels();
        callback();
    },
    /// Загрузка моделей таблиц из папки 'db' в каждом из модулей, кроме игнорируемого
    loadModels: function() {
        console.log("[DATABASE] load models...");
        fs.readdirSync(path.dirname(__dirname)).forEach(dir => {
            if (dir != 'base' && !ignoreModules.includes(dir) && fs.existsSync(path.dirname(__dirname)+ "/" + dir + '/db')) {
                console.log(`[DATABASE] --${dir}`);
                fs.readdirSync(path.dirname(__dirname)+ "/" + dir + '/db').forEach(file => {
                    console.log(`[DATABASE] -----${file}`);
                    let model = this.sequelize.import(path.dirname(__dirname)+ "/" + dir + '/db/' + file);
                    this.Models[model.name] = model;
                });
            }
        });
        for (var name in this.Models) {
            var model = this.Models[name];
            if (model.associate) model.associate(this.Models);
        }
        this.sequelize.sync();
        console.log("[DATABASE] loaded.");
    }
}
