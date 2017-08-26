import { Engine, DisplayMode, Promise } from "excalibur";
import { MainScene } from "./mainScene";

export class Game extends Engine {
	constructor() {
		super({
			width: 800,
			height: 600,
			displayMode: DisplayMode.FullScreen,
			canvasElementId: "mage-arena-container"
		});
	}

	public start(): Promise<any> {
		this.add("mainScene", new MainScene());
		return super.start().then(() => {
			this.goToScene("mainScene");
		});
	}
}