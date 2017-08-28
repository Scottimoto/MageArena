import { Injectable } from '@angular/core';
import { Position, Player, ClientPlayer, GameState } from "../../../server/models/game-sync-models";
import { SocketioService } from './socketio.service';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';
import { Engine, Actor, Color, Input, Vector } from 'excalibur';

@Injectable()
export class GameStateService {

  public lastUpdated: number = 0;

  public Player: ClientPlayer;
  public EnemyPlayers: ClientPlayer[];

  public newPlayer$: Observable<ClientPlayer>;

  public playerLeft$: Observable<string>;
  public enemyPlayerJoined$: Observable<ClientPlayer[]>;

  public gameStateSync$: Observable<GameState>;

  constructor(private socketService: SocketioService) {
    this.socketService.newPlayer$.subscribe((player: ClientPlayer) => {
      this.Player = player;
      this.lastUpdated = Date.now();
    });
    this.socketService.playerLeft$.subscribe((playerid: string) => {
      this.removePlayer(playerid);
    });
    this.socketService.gameStateSync$.subscribe((state: GameState) =>{
      let allPlayers = state.players;
      var thisPlayer = _.filter(allPlayers, (player) => {return player.playerid == this.Player.playerid; });
      this.Player = thisPlayer[0];
      this.EnemyPlayers = allPlayers;
    });

    this.newPlayer$ = this.socketService.newPlayer$;
    this.playerLeft$ = this.socketService.playerLeft$;
    this.enemyPlayerJoined$ = this.socketService.enemyPlayerJoined$;
    this.gameStateSync$ = this.socketService.gameStateSync$;
  }

  public addPlayer() {
    this.socketService.addPlayer();
  }
  private lastInputs: Input.Keys[] = [];
  public movePlayer(inputs) {
    if (!_.isEqual(this.lastInputs, inputs)) {
      this.lastInputs = inputs;
      this.socketService.playerMove(inputs);
    }
  }

  public removePlayer(playerId): void {
    // this.EnemyPlayers
    _.remove(this.EnemyPlayers, (enemyPlayer) => { return enemyPlayer.playerid == playerId; });
  }

}
