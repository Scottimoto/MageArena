import { Engine, DisplayMode, Promise } from "excalibur";
import { MainScene } from "./mainScene";
import { GameStateService } from './../app/services/gamestate.service';

export class Game extends Engine {
	
	constructor(private gameStateService: GameStateService) {
		super({
			width: 800,
			height: 600,
			displayMode: DisplayMode.FullScreen,
			canvasElementId: "mage-arena-container"
		});
	}

	public start(): Promise<any> {
		this.add("mainScene", new MainScene(this.gameStateService));
		return super.start().then(() => {
			this.goToScene("mainScene");
		});
	}
}