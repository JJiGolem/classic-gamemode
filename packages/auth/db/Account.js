"use strict";
const Sequelize = require('sequelize');

/// Модель аккаунта игрока
module.exports = (sequelize, DataTypes) => {
    const model = sequelize.define("Account", {
        id: {
            type: DataTypes.INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },
        login: {
            type: DataTypes.STRING(40),
            allowNull: false
        },
        socialClub: {
            type: DataTypes.STRING(128),
            allowNull: false
        },
        password: {
            type: DataTypes.STRING(128),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(40),
            allowNull: false
        },
        regIp: {
            type: DataTypes.STRING(40),
            allowNull: false
        },
        lastIp: {
            type: DataTypes.STRING(40),
            allowNull: false
        },
        regDate: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.NOW,
            allowNull: false
        },
        lastDate: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.NOW,
            allowNull: false
        },
        confirmEmail: {
            type: DataTypes.INTEGER(1),
            defaultValue: 0,
            allowNull: false
        },
    }, 
    {
        timestamps: false
    });
    return model;
};