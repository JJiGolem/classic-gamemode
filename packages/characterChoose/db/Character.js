"use strict";
const Sequelize = require('sequelize');

/// Модель персоонажа аккаунта
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
    }, 
    {
        timestamps: false
    });

    model.associate = (models) => {
        model.belongsTo(models.Account, {
            foreignKey: "accountId"
        });
    };
    return model;
};