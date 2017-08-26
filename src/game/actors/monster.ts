import { Actor, Color } from 'excalibur';

export class Monster extends Actor {
	constructor(x: number, y: number) {
		super(x, y, 20, 20, Color.Green);
	}
}