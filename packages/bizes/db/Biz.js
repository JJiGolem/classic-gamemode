module.exports = (sequelize, DataTypes) => {
    const model = sequelize.define("Biz", {
        id: {
            type: DataTypes.INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },
        characterId: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        characterNick: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        factionId: {
            type: DataTypes.INTEGER(11),
            defaultValue: 14,
            allowNull: false
        },
        date: {
            type: DataTypes.DATE,
            allowNull: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        price: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        type: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        cashBox: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        productsCount: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        productsMaxCount: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        productsOrder: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        productsOrderPrice: {
            type: DataTypes.INTEGER(11),
            allowNull: true
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
        }
    }, { timestamps: false });

    model.associate = (models) => {
        model.belongsTo(models.Character, {
            foreignKey: "characterId"
        });
        model.belongsTo(models.Faction, {
            foreignKey: "factionId",
            onDelete: "RESTRICT",
            onUpdate: "RESTRICT",
        });

        model.hasMany(models.BizStatistics, {
            foreignKey: "bizId"
        });
    };

    return model;
};
