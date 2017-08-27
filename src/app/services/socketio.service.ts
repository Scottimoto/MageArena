import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { GameState, Player, ClientPlayer, Position } from './../../../server/models/game-sync-models';


@Injectable()
export class SocketioService {

  private url = 'http://192.168.0.85:4300';  
  private socket: any;

  private gameStateSync: Subject<GameState> = new Subject<GameState>();
  public gameStateSync$: Observable<GameState> = this.gameStateSync.asObservable();

  private newPlayer: Subject<ClientPlayer> = new Subject<ClientPlayer>();
  public newPlayer$: Observable<ClientPlayer> = this.newPlayer.asObservable();

  private enemyPlayerJoined: Subject<ClientPlayer[]> = new Subject<ClientPlayer[]>();
  public enemyPlayerJoined$: Observable<ClientPlayer[]> = this.enemyPlayerJoined.asObservable();

  private playerLeft: Subject<string> = new Subject<string>();
  public playerLeft$: Observable<string> = this.playerLeft.asObservable();


  constructor() {
    // this.socket:  = io (this.url);
    this.socket = io(this.url);
  }

  public beginListeningForGameStateSyncs() {
    // this.socket
    this.socket.on("game-state-sync", (data: GameState) => {
        this.gameStateSync.next(data);
        // console.log(data);
    });

    this.socket.on("player-left", (playerid: string) => {
      this.playerLeft.next(playerid);
    });

    this.socket.on("player-joined", (data: ClientPlayer[]) => {
      //Game.addNewPlayer(data.id,data.x,data.y);
      this.enemyPlayerJoined.next(data);
      console.log("enemy joined!");
    });

    // this.socket.on("newplayer", (data: NewPlayer) => {

    // });

    // this.server.on("");
  }

  public playerClick() {
    this.socket.emit('click');
  }

  public addPlayer() {
    this.socket = io.connect(this.url);
    // io.connect();
    this.socket.on('newplayer', (data: ClientPlayer) => {
      //Game.addNewPlayer(data.id,data.x,data.y);
      this.newPlayer.next(data);
    });

    this.beginListeningForGameStateSyncs();


    this.socket.emit('newplayer');

    // Client.
  
  // Client.socket.on('allplayers',function(data){
  //     console.log(data);
  //     for(var i = 0; i < data.length; i++){
  //         Game.addNewPlayer(data[i].id,data[i].x,data[i].y);
  //     }
  // });
  }
}
