import { Actor, Color } from 'excalibur';

export class Monster extends Actor {
	constructor(x: number, y: number) {
		const size: number = 20;
		
		super(x, y, size, size, Color.Green);
	}
}
