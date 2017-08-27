import { Engine, Actor, Color, Input, Vector, CollisionType } from "excalibur";
import { ShootEvent } from "../events/shootEvent";

export class Player extends Actor {
	private static readonly SIZE: number = 40;

	private readonly movementSpeed: number = 300;

	private readonly fireRate: number = 10;
	private firing: boolean;
	private lastFireTime: number;

	constructor() {
		super(-(Player.SIZE / 2), -(Player.SIZE / 2), Player.SIZE, Player.SIZE, Color.White);
		this.collisionType = CollisionType.Active;
	}

	public onInitialize(engine: Engine): void {
		engine.input.pointers.primary.on("down", (event: PointerEvent) => {
			if (event.button === Input.PointerButton.Left) {
				this.firing = true;
			}
		});
		engine.input.pointers.primary.on("up", (event: PointerEvent) => {
			if (event.button === Input.PointerButton.Left) {
				this.firing = false;
			}
		});

		this.lastFireTime = 0;
		this.firing = false;
	}

	public update(engine: Engine, delta: number): void {
		this.HandleMovement(engine.input);
		const currentTime = Date.now();
		if (this.firing && currentTime - this.lastFireTime > 1000 / this.fireRate) {
			const pointerPosition = engine.input.pointers.primary.lastWorldPos;
			this.shoot(pointerPosition.x, pointerPosition.y);
			this.lastFireTime = currentTime
		}

		super.update(engine, delta);
	}

	private HandleMovement(input: Input.IEngineInput): void {
		this.vel.setTo(0, 0);

		if (input.keyboard.isHeld(Input.Keys.W)) {
			this.moveForward();
		}
		if (input.keyboard.isHeld(Input.Keys.A)) {
			this.moveLeft();
		}
		if (input.keyboard.isHeld(Input.Keys.S)) {
			this.moveBackward();
		}
		if (input.keyboard.isHeld(Input.Keys.D)) {
			this.moveRight();
		}

		if (!this.vel.equals(Vector.Zero)) {
			this.vel = this.vel.normalize().scale(this.movementSpeed);
		}
	}

	private moveForward(): void {
		this.vel = this.vel.add(new Vector(0, -this.movementSpeed));
	}

	private moveLeft(): void {
		this.vel = this.vel.add(new Vector(-this.movementSpeed, 0));
	}

	private moveRight(): void {
		this.vel = this.vel.add(new Vector(this.movementSpeed, 0));
	}

	private moveBackward(): void {
		this.vel = this.vel.add(new Vector(0, this.movementSpeed));
	}

	private shoot(atX: number, atY: number): void {
		const angle: number = new Vector(atX, atY).sub(new Vector(this.x, this.y)).toAngle();
		this.emit("shoot", new ShootEvent(this, this.x, this.y, angle));
	}
}
