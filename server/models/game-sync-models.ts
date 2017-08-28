//TODO ADD ALL GAME MODELS HERE

import { Color, Vector } from 'excalibur';

export interface GameState {
    players: ClientPlayer[];
    lastUpdated: number;
}

export interface Player {
    id: number;

    health: number;
    position: Position;

    spells: Spell[];

    getClientPlayer(): ClientPlayer;
}

export interface ClientPlayer {
    playerid: string;
    health: number;
    position: Position;
    color: Color;
    order: number;
    velocity: Vector;
    lastUpdated: number;
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