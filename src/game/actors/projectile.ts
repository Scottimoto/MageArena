import { Engine, Actor, Color, Vector } from 'excalibur';

export class Projectile extends Actor {
	private startTime: number;
	private readonly angle: number;

	private readonly speed: number;
	private readonly range: number;
	
	constructor(startX: number, startY: number, angle: number) {
		const size: number = 10;

		super(startX, startY, size, size, Color.Black);

		this.angle = angle;
		this.speed = 1000;
		this.range = 800;
	}

	public onInitialize(engine: Engine) {
		this.vel = Vector.fromAngle(this.angle).normalize().scale(this.speed);
		this.startTime = Date.now();
	}

	public update(engine: Engine, delta: number) {
		if (Date.now() - this.startTime > this.range) {
			this.kill();
		}
		super.update(engine, delta);
	}
}
