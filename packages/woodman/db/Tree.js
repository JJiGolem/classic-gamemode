module.exports = (sequelize, DataTypes) => {
    const model = sequelize.define("Tree", {
        id: {
            type: DataTypes.INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(30),
            allowNull: false,
        },
        hash: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
        },
    }, {
        timestamps: false
    });

    model.associate = (models) => {
        
    };

    return model;
};
