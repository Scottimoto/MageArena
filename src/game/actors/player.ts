import { Engine, Actor, Color, Input, Vector } from 'excalibur';

export class Player extends Actor {
	private static readonly SIZE: number = 40;

	private readonly movementSpeed: number = 200;

	constructor() {
		super(-(Player.SIZE / 2), -(Player.SIZE / 2), Player.SIZE, Player.SIZE, Color.White);
	}

	public onInitialize(engine: Engine): void {
		engine.input.pointers.on("down", (event: PointerEvent) => {
			if (event.button === Input.PointerButton.Left) {
				this.shoot(event.clientX, event.clientY);
			}
		});
	}

	public update(engine: Engine, delta: number): void {
		this.HandleMovement(engine.input);

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

	private shoot(clickX: number, clickY: number): void {
		
	}
}
