import { Actor, Color } from 'excalibur';
import { IDamageable } from "./interfaces/IDamageable";

export class DamageableActor extends Actor implements IDamageable {
	private health: number;

	public readonly faction: string

	constructor(x: number, y: number, width: number, height: number, color: Color, health: number, faction: string) {
		super(x, y, width, height, color);

		this.health = health;
		this.faction = faction;
	}

	public damage(amount: number) {
		this.health -= amount;
		if (this.health <= 0) {
			this.kill();
		}
	}
}