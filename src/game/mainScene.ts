import { Engine, Scene, Actor } from "excalibur";
import { Player } from "./actors/player";
import { Monster } from "./actors/monster";
import { Projectile } from "./actors/projectile";
import { ShootEvent } from "./events/shootEvent";

export class MainScene extends Scene {
	private lastMonsterSpawnTime: number;
	private monsterSpawnInterval: number;
	
	constructor() {
		super();
		this.lastMonsterSpawnTime = 0;
		this.monsterSpawnInterval = 2000;
	}

	public onInitialize(): void {
		const player = new Player();
		this.add(player);
		player.on("shoot", (event: ShootEvent) => {
			this.add(new Projectile(event.startX, event.startY, event.angle));
		});
	}

	public update(engine: Engine, delta: number): void {
		const currentTime = Date.now();
		if (currentTime - this.lastMonsterSpawnTime > this.monsterSpawnInterval) {
			this.spawnMonster();
			this.lastMonsterSpawnTime = currentTime;
		}

		super.update(engine, delta);
	}

	private spawnMonster(): void {
		let x: number;
		let y: number;
		if (Math.random() > 0.5) {
			x = this.getRandomInFirstOrLastPercent(20, this.engine.getDrawWidth()) - this.engine.getDrawWidth() / 2;
			y = Math.random() * this.engine.getDrawHeight()  - this.engine.getDrawHeight() / 2;
		} else {
			x = Math.random() * this.engine.getDrawWidth()  - this.engine.getDrawWidth() / 2;
			y = this.getRandomInFirstOrLastPercent(20, this.engine.getDrawHeight())  - this.engine.getDrawHeight() / 2;
		}

		this.add(new Monster(x, y));
		console.log(`spawned monster at ${x}, ${y}`);
	}

	private getRandomInFirstOrLastPercent(percent: number, range: number): number {
		const multiplier = percent / 100;
		const random: number = Math.random();
		let result: number;
		if (random < 0.5) {
			result = 2 * random * range * multiplier;
		} else {
			result = (1 - multiplier) * range + 2 * (random - 0.5) * range * multiplier;
		}
		return result;
	}
}