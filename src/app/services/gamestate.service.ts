import { Injectable } from '@angular/core';
import { Position, Player, ClientPlayer } from "../../../server/models/game-sync-models";
import { SocketioService } from './socketio.service';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';

@Injectable()
export class GameStateService {

  public Player: ClientPlayer;
  public EnemyPlayers: ClientPlayer[];

  public newPlayer$: Observable<ClientPlayer>;

  public playerLeft$: Observable<string>;
  public enemyPlayerJoined$: Observable<ClientPlayer[]>;

  constructor(private socketService: SocketioService) {
    this.socketService.newPlayer$.subscribe((player: ClientPlayer) => {
      this.Player = player;
    });
    this.socketService.playerLeft$.subscribe((playerid: string) => {
      this.removePlayer(playerid);
    });

    this.newPlayer$ = this.socketService.newPlayer$;
    this.playerLeft$ = this.socketService.playerLeft$;
    this.enemyPlayerJoined$ = this.socketService.enemyPlayerJoined$;
  }

  public addPlayer() {
    this.socketService.addPlayer();
  }

  public removePlayer(playerId): void {
    // this.EnemyPlayers
    _.remove(this.EnemyPlayers, (enemyPlayer) => { return enemyPlayer.playerid == playerId; });
  }

}
