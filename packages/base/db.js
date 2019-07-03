const Sequelize = require('sequelize');
const fs = require("fs");

module.exports = {
    sequelize: null,
    Models: {},
    connect: function(callback) {
        console.log("[DATABASE] db connect...")
        this.sequelize = new Sequelize('classic-gamemode', 'root', '', {
            host: 'localhost',
            dialect: 'mysql',
            logging: false,
        });
        this.loadModels();
        callback();
    },
    loadModels: function() {
        console.log("[DATABASE] load models...");
        fs.readdirSync(path.dirname(__dirname)).forEach(dir => {
            if (dir != 'base') {
                fs.readdirSync('../' + dir + '/db').forEach(file => {
                    let model = this.sequelize.import();
                    this.Models[model.name] = model;
                });
            }
        });
        for (var name in this.Models) {
            var model = this.Models[name];
            if (model.associate) model.associate(this.Models);
        }
        this.sequelize.sync();
    }
}