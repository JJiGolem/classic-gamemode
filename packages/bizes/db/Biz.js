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
    };

    return model;
};