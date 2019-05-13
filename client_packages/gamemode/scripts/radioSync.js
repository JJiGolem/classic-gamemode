let radioTimerId;

mp.events.add("playerEnterVehicle", () => {
		radioTimerId = setInterval(() => {
			radio_sync();
		}, 1000);
});

mp.events.add("playerLeaveVehicle", () => {
		clearInterval(radioTimerId);
});

function radio_sync() {
		const localPlayer = mp.players.local;
		const vehicle = localPlayer.vehicle;

		if (!vehicle) {
			return;
		}
		
		let radioIndex = vehicle.radio || 0;

		if (vehicle.getPedInSeat(-1) === localPlayer.handle) {
			const currentRadioIndex = mp.game.invoke("0xE8AF77C4C06ADC93");
			
			if (radioIndex !== currentRadioIndex) {
				radioIndex = currentRadioIndex;
				mp.events.callRemote("radio.set", radioIndex);
			}
		} else {
			if (radioIndex === 255) {
				mp.game.audio.setRadioToStationName("OFF");
			} else {
				mp.game.invoke("0xF7F26C6E9CC9EBB8", true);
				mp.game.invoke("0xA619B168B8A8570F ", radioIndex);
			}
		}
};
