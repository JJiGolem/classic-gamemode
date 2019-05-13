const disabledControls = new Map();

mp.events.add("render", () => {
	if (disabledControls.size === 0) {
		return;
	}

	disabledControls.forEach((controls, group) => {
		for (const control of controls) {
			mp.game.controls.disableControlAction(group, control, true);
		}
	});

	
});

function addToMap(control, group) {
	let controlsInGroup = disabledControls.get(group);

	if (!controlsInGroup) {
		disabledControls.set(group, new Set());
		controlsInGroup = disabledControls.get(group);
	}
	
	controlsInGroup.add(control);
}

function removeFromMap(control, group) {
	let controlsInGroup = disabledControls.get(group);

	if (!controlsInGroup) {
		return;
	}

	controlsInGroup.delete(control);
}

exports = {
	add: (control, group = 2) => {
		addToMap(control, group);
	},
	addRange: (controls, group = 2) => {
		if (!Array.isArray(controls)) {
			return;
		}
		
		for (const control of controls) {
			addToMap(control, group);
		}
	},
	remove: (control, group = 2) => {
		removeFromMap(control, group);
	},
	removeRange: (controls, group = 2) => {
		if (!Array.isArray(controls)) {
			return;
		}
		
		for (const control of controls) {
			removeFromMap(control, group);
		}
	},
	removeAll: () => {
		disabledControls.clear();
	},
	removeGroup: (group) => {
		disabledControls.delete(group);
	}
}
