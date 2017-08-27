import { Engine, Actor, Color, CollisionType, CollisionEvent } from 'excalibur';
import { Projectile } from "./projectile";

export class Monster extends Actor {
	private projectilesDamagedBy: number[];
	private health: number;

	constructor(x: number, y: number) {
		const size: number = 20;
		
		super(x, y, size, size, Color.Green);
		this.collisionType = CollisionType.Fixed;

		this.health = 200;
	}

	public onInitialize(engine: Engine) {
		this.on("collision", this.onCollision);
		this.projectilesDamagedBy = [];
		
	}

	private onCollision(e: CollisionEvent): void {
		const projectile = e.other as Projectile;
		if (projectile != null && this.projectilesDamagedBy.indexOf(projectile.id) === -1) {
			this.damage(projectile.damage);
			this.projectilesDamagedBy.push(projectile.id);
		}
	}

	private damage(damage: number) {
		this.health -= damage;
		if (this.health <= 0) {
			this.kill();
		}
	}
}
