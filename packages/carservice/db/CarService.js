module.exports = (sequelize, DataTypes) => {

    const model = sequelize.define("CarService", {
        id: {
            type: DataTypes.INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },
        bizId: {
            type: DataTypes.INTEGER(11),
            defaultValue:  null,
            allowNull: true
        },
        x: {
            type: DataTypes.FLOAT,
            defaultValue: 100,
            allowNull: false
        },
        y: {
            type: DataTypes.FLOAT,
            defaultValue: 100,
            allowNull: false
        },
        z: {
            type: DataTypes.FLOAT,
            defaultValue: 100,
            allowNull: false
        },
        radius: {
            type: DataTypes.FLOAT,
            defaultValue: 10,
            allowNull: false
        },
        priceMultiplier: {
            type: DataTypes.FLOAT,
            defaultValue: 1.0,
            allowNull: false
        },
        salaryMultiplier: {
            type: DataTypes.FLOAT,
            defaultValue: 0.1,
            allowNull: false
        }
    }, { timestamps: false });

    model.associate = (models) => {
        model.belongsTo(models.Biz, {
            foreignKey: "bizId"
        });
    };

    return model;
};
