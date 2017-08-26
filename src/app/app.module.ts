import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { AppComponent } from './app.component';
import { routes } from './app.router';
import { environment } from '../environments/environment';
import { RouterModule } from '@angular/router';
import { ChatService } from './services/test.service';
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
    !environment.production ? StoreDevtoolsModule.instrument({ maxAge: 50 }) : [],
    RouterModule.forRoot(
      routes
    )
  ],
  providers: [
    ChatService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {}
