module.exports = (sequelize, DataTypes) => {

	const model = sequelize.define("VehicleProperties", {
		model: {
			type: DataTypes.STRING(128),
			primaryKey: true
        },
        name: {
			type: DataTypes.STRING(128),
			allowNull: true
        },
        maxFuel: {
            type: DataTypes.INTEGER(11),
            defaultValue: 50,
			allowNull: false
        },
        defaultConsumption: {
            type: DataTypes.INTEGER(11),
            defaultValue: 1,
			allowNull: false
        },
        license: {
            type: DataTypes.INTEGER(11),
            defaultValue: 1,
			allowNull: false
        }
	}, {timestamps: false});


	return model;
};
