import { Scene, Actor, TileMap } from 'excalibur';
import { Player } from "./actors/player";
import { Monster } from "./actors/monster";

export class MainScene extends Scene {
	constructor() {
		super();
	}

	public onInitialize(): void {
		this.add(new Player());
		this.add(new Monster(-200, 0));
	}
}