exports = {
	fade: (state, duration) => {
		if (state) {
			mp.game.cam.doScreenFadeOut(duration);
		} else {
			mp.game.cam.doScreenFadeIn(duration);
		}
	}
}
