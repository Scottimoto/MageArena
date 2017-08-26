//TODO ADD ALL GAME MODELS HERE

export interface GameState {
    players: Player[];


}

export interface Player {
    id: number;

    health: number;
    position: Position;

    spells: Spell[];

    getClientPlayer(): ClientPlayer;
}

export interface ClientPlayer {
    id: number;
    health: number;
    position: Position;
}

export interface Spell {
    id: number;
    name: string;
    totalCooldown: number;
    cooldownRemaining: number;
    lastCastTime: Date;
}

export interface Position {
    x: number;
    y: number;
}