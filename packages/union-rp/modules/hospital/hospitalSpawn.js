const beds = require("./beds");

const patientInfo = new Map();

mp.events.add("playerBrowserReady", (player) => {
	const data = {};

	for (const info of patientInfo) {
		const value = info[1];

		if (!value.inBed) {
			continue;
		}
		

		data[info[0]] = { position: value.position, heading: value.heading };
	}

	player.call("hospital::loadPatients", [JSON.stringify(data)]);
});

mp.events.add("hospital::standUp", (player) => {
	if (!patientInfo.has(player.id)) {
		return;
	}

	player.setVariable("walking", "move_m@injured");

	const info = patientInfo.get(player.id);

	info.bed.isEmpty = true;
	info.inBed = false;

	mp.players.call("hospital::removePatient", [player.id, true]);
});

mp.events.add("hospital::endHospital", (player) => {
	if (!patientInfo.has(player.id)) {
		return;
	}

	const info = patientInfo.get(player.id);

	player.setVariable("walking", info.walking);

	if (info.inBed) {
		info.bed.isEmpty = true;
		mp.players.call("hospital::removePatient", [player.id, true]);
	}

	patientInfo.delete(player.id);
});

function spawnAtHospital(player, phase = 1, health = 1) {
	if (patientInfo.has(player.id)) {
		const info = patientInfo.get(player.id);

		if (info.bed) { 
			info.bed.isEmpty = true; 
		}

		patientInfo.delete(player.id);
	}

	player.dimension = 0;

	if (phase === 1) {
		const bed = getEmptyBed();

		let position = new mp.Vector3(355.13, -1404.67, 32.43);
		let heading = 0;

		if (bed) {
			bed.isEmpty = false;
			position = new mp.Vector3(bed.position.x, bed.position.y, bed.position.z + 1.4);
			heading = bed.heading - 40;

			patientInfo.set(player.id, {
				walking: player.getVariable("walking"),
				bed,
				position,
				heading,
				inBed: true
			});
		}

		player.spawn(position, heading);
		player.health = health;

		mp.players.call("hospital::start", [player.id, JSON.stringify({ position, heading })]);
	} else if (phase === 2) {
		patientInfo.set(player.id, {
			walking: player.getVariable("walking"),
			inBed: false
		});
		
		player.setVariable("walking", "move_m@injured");
		player.call("hospital::enableRegeneration");
	}
}


function getEmptyBed() {
	for (const floorBeds of beds) {
		const emptyBeds = floorBeds.filter((bed) => bed.isEmpty);

		if (emptyBeds.length === 0) {
			continue;
		}

		return emptyBeds[Math.floor(Math.random()*emptyBeds.length)]; // Random empty bed
	}

	return undefined;
}



module.exports = {
	spawnAtHospital,
	isPlayerInHospital: (player) => patientInfo.has(player.id),
	getHospitalPhase: (player) => {
		if (!patientInfo.has(player.id)) {
			return 0;
		}

		const info = patientInfo.get(player.id);

		return info.inBed ? 1 : 2;
	},
	removeHospitalPatient: (player) => {
		if (!patientInfo.has(player.id)) {
			return;
		}
	
		const info = patientInfo.get(player.id);
	
		if (info.bed) {
			info.bed.isEmpty = true;
		}
	
		patientInfo.delete(player.id);
	
		mp.players.call("hospital::removePatient", [player.id]);
	}
}
