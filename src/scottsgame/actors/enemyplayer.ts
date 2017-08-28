import { Actor, Color, Vector } from 'excalibur';

export class EnemyPlayer extends Actor {
	public playerid: string;
	constructor(playerid: string, x: number, y: number, color: Color) {
		super(x, y, 40, 40, color);
		this.playerid = playerid;
		// this.vel.setTo(0, 0);
	}

	public serverSync(x: number, y: number, velocity: Vector) {
		this.x = x;
		this.y = y;
		this.vel = velocity;
	}
}