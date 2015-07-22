///<reference path="typings/angular2/angular2.d.ts" />
///<reference path="player.ts" />
///<reference path="lib.ts" />
import {Component, View, bootstrap, For, If} from 'angular2/angular2';
import {PlayerComponent} from 'player';
import {TileService} from 'lib';
/* Contenedor principal */
@Component({
  selector: 'game',
  injectables: [PlayerComponent,TileService]
})
@View({
  template: `
  <h1>Multi-user Memory Game!!</h1>
  <div id="gameContainer">
    <div id="playerContainer1">
      <player>
      </player>
    </div>
    <div id="playerContainer2">
      <player>
      </player>
    </div>
  </div>
  `,
  directives: [PlayerComponent] 
})
export class GameComponent {
  player1: PlayerComponent;
  player2: PlayerComponent;
	constructor(player1:PlayerComponent,player2:PlayerComponent){
    this.player1 = player1;
    this.player2 = player2;
	}
}
bootstrap(GameComponent); 