const localPlayer = mp.players.local;

const controlsToDisable = [ 22, 24, 25, 37, 44, 157, 158, 159, 160, 161, 162, 163, 164, 165,
	14, 15, 16, 17, 53, 54, 140, 141, 142, 143, 143, 47, 38, 69, 70, 68, 92, 99, 115, 46, 25, 36];
const movementControls = [ 30, 31, 32, 33, 34, 35 ];
const bodyPartsInfo = {
	"full": { offset: new mp.Vector3(0, 0, 0), scale: 2.7 },
	"head": { offset: new mp.Vector3(0, 0, 0.6), scale: 1 },
	"body": { offset: new mp.Vector3(0, 0, 0.2), scale: 1.3 },
	"legs": { offset: new mp.Vector3(0, 0, -0.4), scale: 1.5 },
	"feet": { offset: new mp.Vector3(0, 0, -0.7), scale: 1 }
}

let camera;
let isDressingStarted = false;
let basePosition;
let baseHeading = 0;

mp.events.add("render", () => {
	if (!isDressingStarted) {
		return;
	}

	mp.game.invoke("0x719FF505F097FD20");
	
	const leftPressed = mp.game.controls.isDisabledControlPressed(2, 205);
	const rightPressed = mp.game.controls.isDisabledControlPressed(2, 206);
	
	if (!leftPressed && !rightPressed) {
		return;
	}
	
	let heading = localPlayer.getHeading();
	
	heading += leftPressed ? -1.5 : 1.5;
		
	if (heading > 360) {
		heading = 0;
	} else if (heading < 0) {
		heading = 360;
	}
	
	localPlayer.setHeading(heading);
});

mp.events.add("clothes_shop::dressing_start", (position, heading) => {
	basePosition = new mp.Vector3(position.x, position.y, position.z);
	baseHeading = heading;

	mp.helpers.controlsDisabler.addRange(controlsToDisable);
	mp.helpers.controlsDisabler.addRange(movementControls, 0);
	localPlayer.freezePosition(false);
	localPlayer.position = basePosition;
	localPlayer.setHeading(baseHeading);
	localPlayer.freezePosition(true);
	
	// mp.events.call("focusOnPlayer", position, baseHeading);
	setupCamera();

	mp.events.call("inventory.enable", false);
	mp.events.call("selectMenu.show", "biz_3_clothes");
	mp.helpers.screen.fade(false, 50);
	mp.helpers.instructionButtonsDrawler.init();
	showRotateButtons();

	isDressingStarted = true;
});

mp.events.add("clothes_shop::resetView", (bodyPart = "full", menuInfo = undefined, resetHeading = true) => {
	if (resetHeading) {
		localPlayer.setHeading(baseHeading);
	}

	if (menuInfo) {
		mp.events.call("selectMenu.hide");
	}

	moveCameraToBodyPart(bodyPart, menuInfo);
});

mp.events.add("clothes_shop::stopDressing", stopDressing);
mp.events.add("playerDeath", (player) => {
	if (player.remoteId !== localPlayer.remoteId) {
		return;
	}

	stopDressing();
});

function setupCamera() {
	camera = mp.helpers.camera.new("default");
	camera.position = getPositionByBodyPart("full");
	camera.fov = 47;
	camera.active = true;
	camera.pointAtCoord(basePosition);
	mp.helpers.camera.renderCams(true);
}

function moveCameraToBodyPart(bodyPart, menuInfo = undefined) {
	const position = getPositionByBodyPart(bodyPart);

	camera.moveToPoint(position, undefined, 1000, menuInfo ? () => {
		mp.events.call("selectMenu.show", menuInfo.name, menuInfo.index || 0);
	} : undefined);
}

function stopDressing() {
	isDressingStarted = false;
	mp.events.call("inventory.enable", true);
	localPlayer.freezePosition(false);
	mp.events.call("finishMoveCam");
	mp.helpers.camera.renderCams(false);
	mp.helpers.instructionButtonsDrawler.dispose();
	mp.helpers.controlsDisabler.removeRange(controlsToDisable);
	mp.helpers.controlsDisabler.removeRange(movementControls, 0);

	if (camera) {
		camera.destroy();
	}
}

function showRotateButtons() {
	mp.helpers.instructionButtonsDrawler.setButtons({ altControl: "t_E%t_Q", label: "FE_HLP24" });
	mp.helpers.instructionButtonsDrawler.setActive(true);
}

function getPositionByBodyPart(bodyPart) {
	const bodyPartInfo = bodyPartsInfo[bodyPart];
	const forwardVector = getLocalPlayerForwardVector(bodyPartInfo.scale);

	return basePosition.add(forwardVector).add(bodyPartInfo.offset);
}

function getLocalPlayerForwardVector(scale) {
	const { x, y, z } = localPlayer.getForwardVector();

	return new mp.Vector3(x, y, z).multiply(scale);
}
