import { Engine, Actor, Color, Vector } from 'excalibur';

export class Projectile extends Actor {
	private readonly speed: number;
	private readonly angle: number;
	
	constructor(startX: number, startY: number, angle: number) {
		const size: number = 10;

		super(startX, startY, size, size, Color.Black);

		this.speed = 1000;
		this.angle = angle;
	}

	public onInitialize(engine: Engine) {
		this.vel = Vector.fromAngle(this.angle).normalize().scale(this.speed);
	}
}
