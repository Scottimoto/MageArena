import { Scene, Actor, TileMap, Color } from 'excalibur';
import { Player } from "./actors/player";
import { EnemyPlayer } from "./actors/enemyplayer";
// import { Monster } from "./actors/monster";
import { GameStateService } from './../app/services/gamestate.service';
import { Position, ClientPlayer } from "../../server/models/game-sync-models";
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
			this.player = new Player(data.id, data.position.x, data.position.y, new Color(data.color.r, data.color.g, data.color.b, data.color.a));
			this.add(this.player);
		});

		this.gameStateService.playerLeft$.subscribe((id: string) =>  {
			var playerThatLeft = _.find(this.enemyPlayers, {playerid : id});
			this.remove(playerThatLeft);
		});

		this.gameStateService.enemyPlayerJoined$.subscribe((data: ClientPlayer[]) => {
			console.log("enemy joined2");
			_.forEach(data, (enemyPlayer: ClientPlayer) => {
				console.log("enemy joinedhit");
				if (_.find(this.enemyPlayers, { playerid: enemyPlayer.id }) == null) {
					console.log("enemy joinednotfounded");
					var newEnemyPlayer = new EnemyPlayer(enemyPlayer.id, enemyPlayer.position.x, enemyPlayer.position.y, new Color(enemyPlayer.color.r, enemyPlayer.color.g, enemyPlayer.color.b, enemyPlayer.color.a));
					this.enemyPlayers.push(newEnemyPlayer);
					this.add(this.enemyPlayers[this.enemyPlayers.length - 1]);
				}
			});
		});

		this.gameStateService.addPlayer();


		// this.add(new Player(50, 500));
		// this.add(new Monster(-200, 0));
	}
}