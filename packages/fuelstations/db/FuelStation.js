module.exports = (sequelize, DataTypes) => {

    const model = sequelize.define("FuelStation", {
        id: {
            type: DataTypes.INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        bizId: {
            type: DataTypes.INTEGER(11),
            defaultValue: 0,
            allowNull: false
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
        fuelPrice: {
            type: DataTypes.INTEGER(11),
            defaultValue: 3,
            allowNull: false
        },
    }, { timestamps: false });


    return model;
};
