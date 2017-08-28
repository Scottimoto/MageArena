import { Engine, Color, CollisionType } from 'excalibur';
import { DamageableActor } from "./damageableActor"

export class Monster extends DamageableActor {
	constructor(x: number, y: number, health: number) {
		const size: number = 20;
		
		super(x, y, size, size, Color.Green, health, "monster");
		this.collisionType = CollisionType.Fixed;
	}
}
