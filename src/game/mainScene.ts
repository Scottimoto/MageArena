import { Scene, Actor } from "excalibur";
import { Player } from "./actors/player";
import { Monster } from "./actors/monster";
import { Projectile } from "./actors/projectile";
import { ShootEvent } from "./events/shootEvent";

export class MainScene extends Scene {
	constructor() {
		super();
	}

	public onInitialize(): void {
		const player = new Player();
		this.add(player);
		player.on("shoot", (event: ShootEvent) => {
			this.add(new Projectile(event.startX, event.startY, event.angle));
		});
		this.add(new Monster(-200, 0));
	}
}