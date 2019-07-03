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
            if (dir != 'base' && fs.existsSync(path.dirname(__dirname)+ "/" + dir + '/db')) {
                fs.readdirSync(path.dirname(__dirname)+ "/" + dir + '/db').forEach(file => {
                    // let model = this.sequelize.import(path.dirname(__dirname)+ "/" + dir + '/db/' + file);
                    // this.Models[model.name] = model;
                });
            }
        });
        // for (var name in this.Models) {
        //     var model = this.Models[name];
        //     if (model.associate) model.associate(this.Models);
        // }
        // this.sequelize.sync();
    }
}