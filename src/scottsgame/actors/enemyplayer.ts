import { Actor, Color } from 'excalibur';

export class EnemyPlayer extends Actor {
	public playerid: string;
	constructor(playerid: string, x: number, y: number, color: Color) {
		super(x, y, 40, 40, color);
		this.playerid;
	}
}