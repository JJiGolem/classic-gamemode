exports = {
	requestAnimDict: (dictName) => {
		if (mp.game.streaming.hasAnimDictLoaded(dictName)) {
			return true;
		}

		mp.game.streaming.requestAnimDict(dictName);

		while (!mp.game.streaming.hasAnimDictLoaded(dictName)) {
			mp.game.wait(0);
		}

		return true;
	}
}
