export interface IDamageable {
	faction: string;
	damage(amount: number);
}

export function instanceofIDamageable(object: any): object is IDamageable {
	return (object as IDamageable).faction != null
			&& (object as IDamageable).damage != null;
}