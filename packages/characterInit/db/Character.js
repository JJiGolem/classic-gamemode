"use strict";
const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const model = sequelize.define("Character", {
        id: {
            type: DataTypes.INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },
        accountId: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        job: {
            type: DataTypes.INTEGER(11),
            defaultValue: null,
            allowNull: true
        },
        factionId: {
            type: DataTypes.INTEGER(11),
            defaultValue: null,
            allowNull: true
        },
        factionRank: {
            type: DataTypes.INTEGER(11),
            defaultValue: null,
            allowNull: true
        },
        cash: {
            type: DataTypes.INTEGER(11),
            defaultValue: 0,
            allowNull: false
        },
        bank: {
            type: DataTypes.INTEGER(11),
            defaultValue: 0,
            allowNull: false
        },
        pay: {
            type: DataTypes.INTEGER(11),
            defaultValue: 0,
            allowNull: false
        },
        x: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        y: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        z: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        h: {
            type: DataTypes.FLOAT,
            defaultValue: 0,
            allowNull: false
        },
        status: {
            type: DataTypes.INTEGER(11),
            defaultValue: 0,
            allowNull: false
        },
        admin: {
            type: DataTypes.INTEGER(11),
            defaultValue: 0,
            allowNull: false
        },
        warnDate: {
            type: DataTypes.DATE,
            defaultValue: null,
        },
        warnNumber: {
            type: DataTypes.INTEGER(11),
            defaultValue: 0,
            allowNull: false
        },
        minutes: {
            type: DataTypes.INTEGER(11),
            defaultValue: 0,
            allowNull: false,
            set(val) {
                var oldVal = this.getDataValue('minutes');
                if (val <= oldVal) return;
                this.setDataValue('minutes', val);
            }
        },
        creationDate: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.NOW,
            allowNull: false
        },
        carLicense: {
            type: DataTypes.TINYINT(1),
            defaultValue: 0,
            allowNull: false
        },
        passengerLicense: {
            type: DataTypes.TINYINT(1),
            defaultValue: 0,
            allowNull: false
        },
        bikeLicense: {
            type: DataTypes.TINYINT(1),
            defaultValue: 0,
            allowNull: false
        },
        truckLicense: {
            type: DataTypes.TINYINT(1),
            defaultValue: 0,
            allowNull: false
        },
        airLicense: {
            type: DataTypes.TINYINT(1),
            defaultValue: 0,
            allowNull: false
        },
        boatLicense: {
            type: DataTypes.TINYINT(1),
            defaultValue: 0,
            allowNull: false
        },
        gunLicenseDate: {
            type: DataTypes.DATE,
            defaultValue: null
        },
        medCardDate: {
            type: DataTypes.DATE,
            defaultValue: null
        },
        gender: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        father: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        mother: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        similarity: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        skin: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        hair: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        hairColor: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        hairHighlightColor: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        eyebrowColor: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        beardColor: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        eyeColor: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        blushColor: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        lipstickColor: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        chestHairColor: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        health: {
            type: DataTypes.INTEGER(11),
            defaultValue: 100,
            allowNull: false,
            set(val) {
                val = Math.clamp(val, 0, 100);
                this.setDataValue('health', val);
            },
        },
        satiety: {
            type: DataTypes.FLOAT(11),
            defaultValue: 100,
            allowNull: false,
            set(val) {
                val = Math.clamp(val, 0, 100);
                this.setDataValue('satiety', val);
            },
        },
        thirst: {
            type: DataTypes.FLOAT(11),
            defaultValue: 100,
            allowNull: false,
            set(val) {
                val = Math.clamp(val, 0, 100);
                this.setDataValue('thirst', val);
            },
        },
        narcotism: {
            type: DataTypes.INTEGER(11),
            defaultValue: 0,
            allowNull: false,
        },
        nicotine: {
            type: DataTypes.INTEGER(11),
            defaultValue: 0,
            allowNull: false,
        },
        craft: {
            type: DataTypes.INTEGER(11),
            defaultValue: 0,
            allowNull: false,
        },
        law: {
            type: DataTypes.INTEGER(11),
            defaultValue: 0,
            allowNull: false,
            set(val) {
                val = Math.clamp(val, -100, 100);
                this.setDataValue('law', val);
            },
        },
        crimes: {
            type: DataTypes.INTEGER(11),
            defaultValue: 0,
            allowNull: false,
        },
        wanted: {
            type: DataTypes.INTEGER(11),
            defaultValue: 0,
            allowNull: false,
            set(val) {
                val = Math.clamp(val, 0, 5);
                this.setDataValue('wanted', val);
            },
        },
        wantedCause: {
            type: DataTypes.STRING,
            defaultValue: null,
            set(val) {
                if (!val) val = "-";

                this.setDataValue("wantedCause", val);
            }
        },
        arrestTime: {
            type: DataTypes.INTEGER(11),
            defaultValue: 0,
            allowNull: false,
            set(val) {
                if (val < 0) val = 0;
                this.setDataValue('arrestTime', val);
            }
        },
        arrestType: {
            type: DataTypes.TINYINT(1),
            defaultValue: 0,
            allowNull: false
        },
        muteTime: {
            type: DataTypes.INTEGER(11),
            defaultValue: 0,
            allowNull: false,
            set(val) {
                if (val < 0) val = 0;
                this.setDataValue('muteTime', val);
            }
        },
        inviterId: {
            type: DataTypes.INTEGER(11),
            defaultValue: null,
            allowNull: true,
        },
        inviteCompleted: {
            type: DataTypes.TINYINT(1),
            defaultValue: 0,
            allowNull: false,
        }
    }, {
        timestamps: false
    });

    model.associate = (models) => {
        model.belongsTo(models.Account, {
            foreignKey: "accountId"
        });
        model.hasMany(models.Feature, {
            foreignKey: "characterId"
        });
        model.hasMany(models.Appearance, {
            foreignKey: "characterId"
        });
        model.belongsTo(models.Job, {
            foreignKey: "job",
            onDelete: "RESTRICT",
            onUpdate: "RESTRICT",
        });
        model.belongsTo(models.Faction, {
            foreignKey: "factionId",
            onDelete: "RESTRICT",
            onUpdate: "RESTRICT",
        });
        model.belongsTo(models.FactionRank, {
            foreignKey: "factionRank",
            onDelete: "RESTRICT",
            onUpdate: "RESTRICT"
        });
        model.hasOne(models.Phone, {
            foreignKey: "characterId",
        });
        model.hasOne(models.House, {
            foreignKey: "characterId",
        });
        model.hasOne(models.Promocode, {
            foreignKey: "characterId",
        });
        model.hasOne(models.CharacterSettings, {
            as: "settings",
            foreignKey: "characterId",
        });
        model.hasOne(models.Character, {
            foreignKey: "inviterId",
        });
        model.hasMany(models.Fine, {
            foreignKey: "recId"
        });
        model.hasMany(models.CharacterInventory, {
            foreignKey: "playerId"
        });
        model.hasMany(models.FactionInventory, {
            as: "items",
            foreignKey: "playerId"
        });
        model.hasMany(models.CharacterTattoo, {
            foreignKey: "characterId"
        });
    };
    return model;
};
