import { Engine, Actor, Color, Input, Vector } from 'excalibur';
import { GameStateService } from './../../app/services/gamestate.service';

export class Player extends Actor {
	public playerid: string;

	private static readonly SIZE: number = 40;

	private readonly movementSpeed = 200;

	private gameStateService: GameStateService;

	constructor(playerid: string, x, y, color: Color, gameStateService: GameStateService) {
		super(x, y, Player.SIZE, Player.SIZE, color);
		this.playerid = playerid;
		this.gameStateService = gameStateService;
	}

	public onInitialize() {

	}

	public update(engine: Engine, delta: number) {
		this.HandleMovement(engine);
		super.update(engine, delta);
	}

	private HandleMovement(engine: Engine) {
	 	let inputs: Input.Keys[] = [];
		this.vel.setTo(0, 0);
		if (engine.input.keyboard.isHeld(Input.Keys.W)) {
			this.moveForward();
			inputs.push(Input.Keys.W);
		}
		if (engine.input.keyboard.isHeld(Input.Keys.A)) {
			this.moveLeft();
			inputs.push(Input.Keys.A);
		}
		if (engine.input.keyboard.isHeld(Input.Keys.S)) {
			this.moveBackward();
			inputs.push(Input.Keys.S);
		}
		if (engine.input.keyboard.isHeld(Input.Keys.D)) {
			this.moveRight();
			inputs.push(Input.Keys.D);
		}
		if (!this.vel.equals(Vector.Zero)) {
			this.vel = this.vel.normalize().scale(this.movementSpeed);
		}
		this.gameStateService.movePlayer(inputs);
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

	public serverSync(x: number, y: number, velocity: Vector) {
		this.x = x;
		this.y = y;
		//TODO: Do we need this?
		this.vel = velocity;
	}
}
