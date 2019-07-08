module.exports = (sequelize, DataTypes) => {

	const model = sequelize.define("Vehicle", {
		id: {
			type: DataTypes.INTEGER(11),
			primaryKey: true,
			autoIncrement: true
        },
        key: {
			type: DataTypes.STRING(128),
			allowNull: false
		},
		owner: {
			type: DataTypes.INTEGER(11),
			allowNull: false
		},
		model: {
			type: DataTypes.STRING(128),
			allowNull: false
		},
		color1: {
			type: DataTypes.INTEGER(11),
			defaultValue: 0,
			allowNull: false
		},
		color2: {
			type: DataTypes.INTEGER(11),
			defaultValue: 0,
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
		},
		h: {
			type: DataTypes.FLOAT,
			allowNull: false
		},
		fuel: {
			type: DataTypes.INTEGER(11),
			defaultValue: 70,
			allowNull: false
		},
		health: {
			type: DataTypes.INTEGER(11),
			defaultValue: 1000,
			allowNull: false
        },
		consumption: {
			type: DataTypes.INTEGER(11),
			defaultValue: 2,
			allowNull: false
		},
		dimension: {
			type: DataTypes.INTEGER(11),
			defaultValue: 0,
			allowNull: false
		},
		license: {
			type: DataTypes.INTEGER(11),
			defaultValue: 1,
			allowNull: false
		},
		mileage: {
			type: DataTypes.FLOAT,
			defaultValue: 0,
			allowNull: false
        }
	}, {timestamps: false});


	return model;
};
