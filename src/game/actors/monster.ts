import { Engine, Actor, Color, CollisionType, CollisionEvent } from 'excalibur';
import { Projectile } from "./projectile";

export class Monster extends Actor {
	private health: number;

	constructor(x: number, y: number, health: number) {
		const size: number = 20;
		
		super(x, y, size, size, Color.Green);
		this.collisionType = CollisionType.Fixed;

		this.health = health;
	}

	public damage(amount: number) {
		this.health -= amount;
		if (this.health <= 0) {
			this.kill();
		}
	}
}
