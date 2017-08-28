import { Engine, Actor, Color, Vector, CollisionType, CollisionEvent } from "excalibur";
import { instanceofIDamageable } from "./interfaces/IDamageable";

export class Projectile extends Actor {
	private startTime: number;
	private readonly angle: number;
	private actorsDamaged: number[];

	private readonly speed: number;
	private readonly range: number;
	
	public readonly damage: number;
	public readonly faction: string;
	
	constructor(startX: number, startY: number, angle: number, damage: number, faction: string) {
		const size: number = 10;

		super(startX, startY, size, size, Color.Black);

		this.collisionType = CollisionType.Passive;
		this.angle = angle;
		this.speed = 1000;
		this.range = 800;
		this.damage = 50;
		this.faction = faction;
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
		const self: Projectile = e.actor as Projectile;
		if (instanceofIDamageable(e.other)) {
			if(e.other.faction !== self.faction && self.actorsDamaged.indexOf(e.other.id) === -1) {
				e.other.damage(self.damage);
				self.actorsDamaged.push(e.other.id);
				self.kill();
			}
		}
	}
}
