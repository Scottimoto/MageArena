import { Actor, Color, CollisionType } from 'excalibur';
import { DamageableActor } from "./damageableActor"

export class EnemyPlayer extends DamageableActor {
	public playerid: string;

	constructor(playerid: string, x: number, y: number, color: Color) {
		const size: number = 40;
		super(x, y, size, size, color, 1000, "enemyPlayer");
		this.collisionType = CollisionType.Fixed;
		this.playerid = playerid;
	}
}