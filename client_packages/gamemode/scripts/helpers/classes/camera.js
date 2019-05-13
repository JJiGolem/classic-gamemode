let interpolateInfo = undefined;

class Camera {
	constructor (name) {
		this._camera = mp.cameras.new(name);
		this._interpolateCamera = undefined;
	}

	get active() {
		return this._camera.isActive();
	}

	set active(state) {
		this._camera.setActive(state);
	}

	get fov() {
		return this._camera.getFov();
	}

	set fov(value) {
		this._camera.setFov(value);
	}

	get position() {
		return this._camera.getCoord();
	}

	set position(position) {
		this._camera.setCoord(position.x, position.y, position.z);
	}

	get rotation() {
		return this._camera.getRot(2);
	}

	set rotation(rotation) {
		this._camera.setRot(rotation.x, rotation.y, rotation.z);
	}

	destroy() {
		if (!this._camera) {
			return;
		}
		
		this._camera.destroy();
	}

	isInterpolating() {
		return this._interpolateCamera ? this._interpolateCamera.isInterpolating() : false;
	}

	moveToPoint(position, rotation = undefined, duration = 1000, callBack = undefined, easeLocation = 1, easeRotation = 1) {
		if (interpolateInfo) {
			throw new Error("One of cameras already moving");
		}
		
		this._interpolateCamera = mp.cameras.new("default_inerpolate", position, rotation || this.rotation, this.fov);

		if (!this.active) {
			this.active = true;
		}

		this.stopPointing();

		interpolateInfo = {
			camera: this,
			callback: () => {	
				const currentCamera = this._camera;
	
				this._camera = this._interpolateCamera;
				currentCamera.destroy();
				interpolateInfo = undefined;

				if (callBack) {
					callBack();
				}
			}
		};

		this._interpolateCamera.setActiveWithInterp(this._camera.handle, duration, easeLocation, easeRotation);
	}

	pointAtCoord(position) {
		this._camera.pointAtCoord(position.x, position.y, position.z);
	}

	stopPointing() {
		this._camera.stopPointing();
	}
}

mp.events.add("render", () => {
	if (!interpolateInfo) {
		return;
	}

	if (interpolateInfo.camera.isInterpolating()) {
		return;
	}

	interpolateInfo.callback();
});

exports = {
	"new": (name) => new Camera(name),
	renderCams: (state, ease = false, duration = 1000) => mp.game.cam.renderScriptCams(state, ease, duration, true, false)
}
