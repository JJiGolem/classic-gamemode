"use strict";
const Sequelize = require('sequelize');

let settings = call('settings');

module.exports = (sequelize, DataTypes) => {
    const model = sequelize.define("CharacterSettings", {
        id: {
            type: DataTypes.INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },
        characterId: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        spawn: {
            type: DataTypes.INTEGER(11),
            defaultValue: 0,
            allowNull: false,
            set(val) {
                val = Math.clamp(val, 0, 2);
                this.setDataValue('spawn', val);
            },
        },
        chatTimestamp: {
            type: DataTypes.TINYINT(1),
            defaultValue: 0,
            allowNull: false,
            set(val) {
                val = Math.clamp(val, 0, 1);
                this.setDataValue('chatTimestamp', val);
            },
        },
        chatSize: {
            type: DataTypes.TINYINT(1),
            defaultValue: 1,
            allowNull: false,
            set(val) {
                val = Math.clamp(val, 0, 3);
                this.setDataValue('chatSize', val);
            },
        },
        nicknames: {
            type: DataTypes.TINYINT(1),
            defaultValue: 1,
            allowNull: false,
            set(val) {
                val = Math.clamp(val, 0, 1);
                this.setDataValue('nicknames', val);
            },
        },
        hudKeys: {
            type: DataTypes.TINYINT(1),
            defaultValue: 1,
            allowNull: false,
            set(val) {
                val = Math.clamp(val, 0, 1);
                this.setDataValue('hudKeys', val);
            },
        },
        ghetto: {
            type: DataTypes.TINYINT(1),
            defaultValue: 1,
            allowNull: false,
            set(val) {
                val = Math.clamp(val, 0, 1);
                this.setDataValue('ghetto', val);
            },
        },
        walking: {
            type: DataTypes.INTEGER(11),
            defaultValue: 0,
            allowNull: false,
            set(val) {
                val = Math.clamp(val, 0, settings.walkingCount - 1);
                this.setDataValue('walking', val);
            },
        },
        mood: {
            type: DataTypes.INTEGER(11),
            defaultValue: 0,
            allowNull: false,
            set(val) {
                val = Math.clamp(val, 0, settings.moodCount - 1);
                this.setDataValue('mood', val);
            },
        },
    }, {
        timestamps: false
    });

    model.associate = (models) => {
        model.belongsTo(models.Character, {
            as: "settings",
            foreignKey: "characterId",
        });
    };
    return model;
};
