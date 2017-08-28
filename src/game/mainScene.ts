import { Scene, Actor, TileMap, Color } from 'excalibur';
import { Player } from "./actors/player";
import { EnemyPlayer } from "./actors/enemyPlayer";
import { GameStateService } from './../app/services/gamestate.service';
import { Position, ClientPlayer } from "../../server/models/game-sync-models";
import { Projectile } from "./actors/projectile";
import { ShootEvent } from "./events/shootEvent";
import * as _ from 'lodash';

export class MainScene extends Scene {
	constructor(private gameStateService: GameStateService) {
		super();
	}

	private player: Player;
	private enemyPlayers: EnemyPlayer[] = [];

	public onInitialize(): void {

		this.gameStateService.newPlayer$.subscribe((data: ClientPlayer) => {
			if (data == null) {
				alert("GAME FULL!");
				return;
			}
			this.player = new Player(data.playerid, data.position.x, data.position.y, new Color(data.color.r, data.color.g, data.color.b, data.color.a));
			this.add(this.player);
			this.player.on("shoot", (event: ShootEvent) => {
				this.add(new Projectile(event.startX, event.startY, event.angle, 50, "player"));
			});
		});
		this.add(new Player("AlliedPlayer", 300, 300, Color.White));

		this.gameStateService.playerLeft$.subscribe((id: string) =>  {
			console.log("rmeoving player! id: " + id);
			console.log("current enemy players");
			_.forEach(this.enemyPlayers, (enemyPlayer)=> {console.log("Enemy Player ID: " + enemyPlayer.playerid);});
			console.log("current enemy players END");
			let playerThatLeft = _.find(this.enemyPlayers, {playerid : id});

			console.log("rmeoving player with id: " + playerThatLeft.playerid);
			this.remove(playerThatLeft);
		});

		this.gameStateService.enemyPlayerJoined$.subscribe((data: ClientPlayer[]) => {
			console.log("enemy joined2");
			_.forEach(data, (enemyPlayer: ClientPlayer) => {
				console.log("enemy joinedhit");
				if (_.find(this.enemyPlayers, { playerid: enemyPlayer.playerid }) == null) {
					console.log("enemy joined- not found so adding" +  enemyPlayer.playerid);
					let newEnemyPlayer = new EnemyPlayer(enemyPlayer.playerid, enemyPlayer.position.x, enemyPlayer.position.y, new Color(enemyPlayer.color.r, enemyPlayer.color.g, enemyPlayer.color.b, enemyPlayer.color.a));
					this.enemyPlayers.push(newEnemyPlayer);
					//this.add(this.enemyPlayers[this.enemyPlayers.length - 1]);
					this.add(newEnemyPlayer);
				}
			});
		});

		this.gameStateService.addPlayer();
	}
}