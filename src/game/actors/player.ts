import { Engine, Actor, Color, Input, Vector } from 'excalibur';

export class Player extends Actor {
	private static readonly SIZE: number = 40;

	private readonly movementSpeed = 100;

	constructor() {
		super(-(Player.SIZE / 2), -(Player.SIZE / 2), Player.SIZE, Player.SIZE, Color.White);
	}

	public onInitialize() {

	}

	public update(engine: Engine, delta: number) {
		if (engine.input.keyboard.isHeld(Input.Keys.W)) {
			this.moveForward();
		} else {
			this.stopMoving();
		}
		super.update(engine, delta);
	}

	private moveForward() {
		this.vel.setTo(0, -this.movementSpeed);
	}

	private stopMoving() {
		this.vel.setTo(0, 0);
	}
}