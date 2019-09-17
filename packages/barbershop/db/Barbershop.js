module.exports = (sequelize, DataTypes) => {

	const model = sequelize.define("Barbershop", {
		id: {
			type: DataTypes.INTEGER(11),
            primaryKey: true,
            autoIncrement: true
        },
        bizId: {
			type: DataTypes.INTEGER(11),
            defaultValue: 0,
			allowNull: false
        },
        bType: {
			type: DataTypes.INTEGER(11),
            defaultValue: 0,
			allowNull: false
        },
        x: {
            type: DataTypes.FLOAT(11),
            defaultValue: 100,
			allowNull: false
        },
        y: {
            type: DataTypes.FLOAT(11),
            defaultValue: 100,
			allowNull: false
        },
        z: {
            type: DataTypes.FLOAT(11),
            defaultValue: 100,
			allowNull: false
        },
        placeX: {
            type: DataTypes.FLOAT(11),
            defaultValue: 100,
			allowNull: false
        },
        placeY: {
            type: DataTypes.FLOAT(11),
            defaultValue: 100,
			allowNull: false
        },
        placeZ: {
            type: DataTypes.FLOAT(11),
            defaultValue: 100,
			allowNull: false
        },
        placeH: {
            type: DataTypes.FLOAT(11),
            defaultValue: 100,
			allowNull: false
        },
        cameraX: {
            type: DataTypes.FLOAT(11),
            defaultValue: 100,
			allowNull: false
        },
        cameraY: {
            type: DataTypes.FLOAT(11),
            defaultValue: 100,
			allowNull: false
        },
        cameraZ: {
            type: DataTypes.FLOAT(11),
            defaultValue: 100,
			allowNull: false
        },
	}, {timestamps: false});


	return model;
};
