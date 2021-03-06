import { Scene, Actor, TileMap, Color, Label, Engine } from 'excalibur';
import { Player } from "./actors/player";
import { EnemyPlayer } from "./actors/enemyplayer";
// import { Monster } from "./actors/monster";
import { GameStateService } from './../app/services/gamestate.service';
import { Position, ClientPlayer, GameState } from "../../server/models/game-sync-models";
import * as _ from 'lodash';

export class MainScene extends Scene {
	constructor(private gameStateService: GameStateService) {
		super();
	}

	private player: Player;
	private enemyPlayers: EnemyPlayer[] = [];

	public onInitialize(engine: Engine): void {
		// engine.
		engine.getDrawHeight();
		// engine.screenToWorldCoordinates
		// 25-(engine.getDrawWidth()/2), 25-(engine.getDrawHeight()/2),
		//this.add(new Label("Hello World", 0,0, "10px Arial"));

		this.gameStateService.newPlayer$.subscribe((data: ClientPlayer) => {
			if (data == null) {
				alert("GAME FULL!");
				return;
			}
			this.player = new Player(data.playerid, data.position.x, data.position.y, new Color(data.color.r, data.color.g, data.color.b, data.color.a), this.gameStateService);
			this.add(this.player);
		});

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

		this.gameStateService.gameStateSync$.subscribe((state: GameState) => {
			console.log("SERVER SYNC RECEVIED!");
			let allPlayers = state.players;
			let timeNow = Date.now();
			// let timeSinceLastUpdate = timeNow - state.lastUpdated;
			var thisPlayer = _.filter(allPlayers, (player) => {return player.playerid == this.player.playerid; })[0];
			if (thisPlayer) {
				// let timeSinceLastUpdate = timeNow - thisPlayer.lastUpdated;
				// thisPlayer.position.x = thisPlayer.position.x + (thisPlayer.velocity.x * (timeSinceLastUpdate/1000));
				// thisPlayer.position.y = thisPlayer.position.y + (thisPlayer.velocity.y * (timeSinceLastUpdate/1000));
				this.player.serverSync(thisPlayer.position.x, thisPlayer.position.y, thisPlayer.velocity);
			}
			
			_.forEach(allPlayers, (player) => {
				let enemyActor = _.find(this.enemyPlayers, (enemyPlayer) => {
					return enemyPlayer.playerid == player.playerid;
				});
				if (enemyActor != null) {
					// let timeSinceLastUpdate = timeNow - player.lastUpdated;
					// player.position.x = player.position.x + (player.velocity.x * (timeSinceLastUpdate/1000));
					// player.position.y = player.position.y + (player.velocity.y * (timeSinceLastUpdate/1000));
					enemyActor.serverSync(player.position.x, player.position.y, player.velocity);
				}
			});
		});

		this.gameStateService.addPlayer();
	}
}