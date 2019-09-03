module.exports = (sequelize, DataTypes) => {

    const model = sequelize.define("EconomicIndicator", {
        type: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        count: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
    }, { timestamps: false });


    return model;
};
