module.exports = (sequelize, DataTypes) => {
    const model = sequelize.define("TpMarker", {
        id: {
            type: DataTypes.INTEGER(11),
            primaryKey: true,
            autoIncrement: true
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
            allowNull: false
        },
        tpX: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        tpY: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        tpZ: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        tpH: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
    }, {
        timestamps: false
    });

    model.associate = (models) => {
        
    };

    return model;
};
