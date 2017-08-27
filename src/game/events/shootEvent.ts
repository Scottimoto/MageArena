import { GameEvent } from 'excalibur';

export class ShootEvent extends GameEvent<any> {
	constructor(
		target: any,
		public startX: number, 
		public startY: number, 
		public angle: number) {
			
		super();
		this.target = target;
	}
}