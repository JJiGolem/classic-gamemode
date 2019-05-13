const localPlayer = mp.players.local;
const patientInfo = new Map();
const cameraOffset = new mp.Vector3(0, -0.4, 1.2);
const exitOffset = new mp.Vector3(0, -1.6, 0);

let phase = 0;
let bedData;
let camera;
let progressBar;

mp.events.add("playerDeath", (player) => {
	if (player.remoteId !== localPlayer.remoteId) {
		return;
	}

	mp.helpers.screen.fade(true, 700);
});

mp.events.add("playerSpawn", (player) => {
	if (player.remoteId !== localPlayer.remoteId) {
		return;
	}

	mp.helpers.screen.fade(false, 500);
});

mp.events.add("render", () => {
	if (phase === 1) { // Player in bed
		mp.game.invoke("0x719FF505F097FD20");

		const health = localPlayer.getHealth();

		if (progressBar) {
			progressBar.progress = health / 20;
		}

		if (health >= 20) {
			standUpLocalPlayer();
		}
	} else if (phase === 2) {
		if (localPlayer.getHealth() >= 50) {
			endLocalPlayerHospital();
		}
	}
});

mp.events.add("entityStreamIn", (entity) => {
	if (entity.type !== "player" || !patientInfo.has(entity.remoteId)) {
		return;
	}

	playPatientScenario(entity, patientInfo.get(entity.remoteId));
});

mp.events.add("hospital::loadPatients", (rawData) => {
	const data = JSON.parse(rawData);

	for (const key in data) {
		if (patientInfo.has(key)) {
			patientInfo.delete(key);
		}

		patientInfo.set(key, data[key]);
	}
});

mp.events.add("hospital::start", (patientId, rawData) => {
	const data = JSON.parse(rawData);
	const isCurrentPlayer = patientId === localPlayer.remoteId;

	if (isCurrentPlayer) {
		bedData = data;
		initLocalPlayerPatient();
		mp.helpers.screen.fade(false, 500);
	} else {
		if (patientInfo.has(patientId)) {
			patientInfo.delete(patientId);
		}

		patientInfo.set(patientId, data);

		const patient = mp.players.atRemoteId(patientId);

		if (patient && patient.handle !== 0) {
			playPatientScenario(patient, data);
		}
	}
});

mp.events.add("hospital::removePatient", (patientId, isStandUp = false) => {
	if (isStandUp) {
		const isCurrentPlayer = patientId === localPlayer.remoteId;

		if (isCurrentPlayer) {
			const pos = bedData.position;
			const standUpPos = mp.game.object.getObjectOffsetFromCoords(pos.x, pos.y, pos.z, bedData.heading, exitOffset.x, exitOffset.y, exitOffset.z);

			if (camera) {
				camera.setActive(false);
				camera.destroy();
			}

			camera = undefined;
			mp.game.cam.renderScriptCams(false, false, 3000, true, false);
			localPlayer.clearTasksImmediately();
			localPlayer.position = standUpPos;
			localPlayer.freezePosition(false);
		} else {
			const patient = mp.players.atRemoteId(patientId);

			if (patient && patient.handle !== 0) {
				patient.freezePosition(false);
				patient.clearTasksImmediately();
			}
		}
	}

	if (patientInfo.has(patientId)) {
		patientInfo.delete(patientId);
	}
});

mp.events.add("hospital::enableRegeneration", () => {
	phase = 2;
	mp.game.player.setHealthRechargeMultiplier(getRandom(0.05, 0.08));
});

mp.events.add("custom_event:interiorChanged", (newInterior, oldInterior) => {
	if (phase === 0 || (phase === 1 && oldInterior !== 0)) {
		return;
	}

	if (newInterior === 0) {
		endLocalPlayerHospital();
	}
});

function initLocalPlayerPatient() {
	phase = 1;
	playPatientScenario(localPlayer, bedData);

	const camPos = mp.game.object.getObjectOffsetFromCoords(bedData.position.x, bedData.position.y, bedData.position.z,
		bedData.heading, cameraOffset.x, cameraOffset.y, cameraOffset.z);

	if (camera) {
		camera.destroy();
	}

	camera = mp.cameras.new("default");
	camera.setCoord(camPos.x, camPos.y, camPos.z);
	camera.setRot(290, 0, bedData.heading, 2);
	camera.setFov(47);
	camera.setActive(true);
	mp.game.cam.renderScriptCams(true, false, 3000, true, false);
	mp.game.player.setHealthRechargeMultiplier(getRandom(0.05, 0.08));

	mp.events.call("inventory.enable", false);

	if (progressBar) {
		progressBar.visible = false;
		progressBar = undefined;
	}

	progressBar = new timerBarLib.TimerBar("Восстановление", true);
	progressBar.progress = 0;
}

function standUpLocalPlayer() {
	progressBar.visible = false;
	progressBar = undefined;
	phase = 2;
	mp.events.callRemote("hospital::standUp");
	mp.events.call("inventory.enable", true);
	localPlayer.setProofs(false, false, false, false, false, false, false, false); // Carter: на всякий случай :D
}

function endLocalPlayerHospital() {
	if (progressBar) {
		progressBar.visible = false;
		progressBar = undefined;
	}

	phase = 0;
	mp.game.player.setHealthRechargeMultiplier(0);
	localPlayer.freezePosition(false);
	mp.events.callRemote("hospital::endHospital");
}

function playPatientScenario(patient, data) {
	patient.freezePosition(false);
	patient.position = data.position;
	patient.clearTasksImmediately();

	// TODO (CocaColaBear): Temp solution. Scenarios doesnt sync for player
	if (patient.remoteId === localPlayer.remoteId) {
		patient.taskStartScenarioInPlace("WORLD_HUMAN_SUNBATHE_BACK", -1, false);
	} else {
		const animDict = `amb@world_human_sunbathe@${patient.isMale() ? "male" : "female"}@back@base`;

		mp.helpers.animation.requestAnimDict(animDict);
		patient.taskPlayAnim(animDict, "base", 8.0, 0, -1, 1, 1.0, false, false, false);
	}

	patient.setHeading(data.heading);
	patient.freezePosition(true);
}

function getRandom(min, max) {
	return Math.random() * (max - min) + min;
}

var isLocalPlayerInHospitalBed = () => phase === 1;
