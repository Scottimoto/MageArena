import { Component, OnInit } from '@angular/core';

import { Game } from "../../../game/game";

@Component({
  selector: 'app-mage-arena',
  templateUrl: './mage-arena.component.html',
  styleUrls: ['./mage-arena.component.css']
})
export class MageArenaComponent implements OnInit {

  constructor() { }

  ngOnInit() {
	  const game = new Game();
	  game.start();
  }
}
