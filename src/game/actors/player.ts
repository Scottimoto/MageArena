import { Engine, Actor, Color, Input, Vector } from 'excalibur';

export class Player extends Actor {
	private static readonly SIZE: number = 40;

	private readonly movementSpeed = 200;

	constructor() {
		super(-(Player.SIZE / 2), -(Player.SIZE / 2), Player.SIZE, Player.SIZE, Color.White);
	}

	public onInitialize() {

	}

	public update(engine: Engine, delta: number) {
		this.HandleMovement(engine);
		super.update(engine, delta);
	}

	private HandleMovement(engine: Engine) {
		this.vel.setTo(0, 0);
		if (engine.input.keyboard.isHeld(Input.Keys.W)) {
			this.moveForward();
		}
		if (engine.input.keyboard.isHeld(Input.Keys.A)) {
			this.moveLeft();
		}
		if (engine.input.keyboard.isHeld(Input.Keys.S)) {
			this.moveBackward();
		}
		if (engine.input.keyboard.isHeld(Input.Keys.D)) {
			this.moveRight();
		}
		if (!this.vel.equals(Vector.Zero)) {
			this.vel = this.vel.normalize().scale(this.movementSpeed);
		}
	}

	private moveForward() {
		this.vel = this.vel.add(new Vector(0, -this.movementSpeed));
	}

	private moveLeft() {
		this.vel = this.vel.add(new Vector(-this.movementSpeed, 0));
	}

	private moveRight() {
		this.vel = this.vel.add(new Vector(this.movementSpeed, 0));
	}

	private moveBackward() {
		this.vel = this.vel.add(new Vector(0, this.movementSpeed));
	}
}
