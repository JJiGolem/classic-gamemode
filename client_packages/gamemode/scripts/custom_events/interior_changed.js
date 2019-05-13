class InteriorChangedHandler {
	constructor() {
		this.currentInterior = 0;
		this.localPlayer = mp.players.local;
	}

	tick() {
		const newInterior = mp.helpers.interior.getCurrent();

		if (newInterior === this.currentInterior) {
			return;
		}

		mp.events.call("custom_event:interiorChanged", newInterior, this.currentInterior);
		this.currentInterior = newInterior;
	}
}

const handler = new InteriorChangedHandler();

exports = handler;
