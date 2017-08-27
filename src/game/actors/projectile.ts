import { Engine, Actor, Color, Vector, CollisionType, CollisionEvent } from "excalibur";
import { Monster } from "./monster";

export class Projectile extends Actor {
	private startTime: number;
	private readonly angle: number;
	private actorsDamaged: number[];

	private readonly speed: number;
	private readonly range: number;
	
	public readonly damage: number;
	
	constructor(startX: number, startY: number, angle: number, damage) {
		const size: number = 10;

		super(startX, startY, size, size, Color.Black);

		this.collisionType = CollisionType.Passive;
		this.angle = angle;
		this.speed = 1000;
		this.range = 800;
		this.damage = 50;
	}

	public onInitialize(engine: Engine) {
		this.on("collision", this.onCollision);
		this.vel = Vector.fromAngle(this.angle).normalize().scale(this.speed);
		this.actorsDamaged = [];
		this.startTime = Date.now();
	}

	public update(engine: Engine, delta: number) {
		if (Date.now() - this.startTime > this.range) {
			this.kill();
		}
		super.update(engine, delta);
	}

	private onCollision(e: CollisionEvent): void {
		const projectile = e.actor as Projectile;
		if(e.other instanceof(Monster) && projectile.actorsDamaged.indexOf(e.other.id) === -1) {
			e.other.damage(projectile.damage);
			projectile.actorsDamaged.push(e.other.id);
			projectile.kill();
		}
	}
}
