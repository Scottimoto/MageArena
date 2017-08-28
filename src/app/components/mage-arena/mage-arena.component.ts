import { Component, OnInit } from '@angular/core';
// import { SocketioService } from './../../services/socketio.service';
import { GameStateService } from './../../services/gamestate.service';

import { Game } from "../../../game/game";

@Component({
  selector: 'app-mage-arena',
  templateUrl: './mage-arena.component.html',
  styleUrls: ['./mage-arena.component.css']
})
export class MageArenaComponent implements OnInit {

  constructor(private gameStateService: GameStateService) { }

  ngOnInit() {
	  const game = new Game(this.gameStateService);
    game.start();
    
    // this.socketio.addPlayer();
  }
}
