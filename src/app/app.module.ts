import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { routes } from './app.router';
import { environment } from '../environments/environment';
import { RouterModule } from '@angular/router';
import { ChatService } from './services/test.service';
import { SocketioService } from './services/socketio.service';
import { GameStateService } from './services/gamestate.service';
import { HomeComponent } from './components/home/home.component';
import { MageArenaComponent } from './components/mage-arena/mage-arena.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MageArenaComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(
      routes
    )
  ],
  providers: [
    ChatService,
    SocketioService,
    GameStateService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {}
