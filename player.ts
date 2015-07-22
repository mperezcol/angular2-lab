///<reference path="typings/angular2/angular2.d.ts" />
///<reference path="lib.ts" />
import {Component, View, bootstrap, For, If} from 'angular2/angular2';
import {Timer,Tile,TileService} from 'lib';
/* Javascript functions and variables */
declare var io;
var socket = io(); //io.connect("localhost:4000");
declare var playersNumber;
@Component({
  selector: 'player',
  injectables: [TileService]
})
@View({
  template: `
    <div class="playerTitle">
      <h2>Player {{ idPlayer }}</h2>
      <span>Time </span>
      <span>{{ timer.formattedTime }}</span>
    </div>  
    <ul class="tileList">
      <li *for="#tile of tiles">
          <div class="flipper" id="flipper{{ tile.id }}">
            <div class="front">
              <img id="front{{ tile.id }}" alt="back" (click)="flipTile(tile);" src="images/back.png"/>
            </div>
            <div class="back">
              <img id="back{{ tile.id }}" alt="{{ tile.value }}" (click)="flipTile(tile);" src="images/{{ tile.value }}.png"/>
            </div>
           </div>
      </li>
    </ul>`,
  directives: [For, If]
})
export class PlayerComponent{
  tiles: Tile[] = new Array();
  lastFlipped: Tile;
  lastFlipped2: Tile;
  pairsLeft: number;
  idPlayer: number;
  timer: Timer;
  constructor(tileService:TileService){ 
    this.tiles = tileService.tiles;
    this.lastFlipped = null;
    this.lastFlipped2 = null;
    this.pairsLeft = 8;
    this.idPlayer = playersNumber;
    playersNumber+=1;
    // game starts
    this.timer = new Timer(this.idPlayer);
    this.timer.startstoptimer();
  }
  /* Game logic */
  flipTile(tile: Tile){
    if(tile.paired || tile.flipped){ // Time already paired
      return;
    } else {
      if (this.lastFlipped === null) { // First tile selected
        this.lastFlipped = tile;
        tile.flip(this.idPlayer);
      } else if(this.lastFlipped != null && this.lastFlipped2 != null){ // two non-matching tiles previously selected
          this.lastFlipped2.unflip(this.idPlayer);
          this.lastFlipped.unflip(this.idPlayer);
          this.lastFlipped = tile;
          this.lastFlipped2 = null; 
          tile.flip(this.idPlayer);
      } else if ((this.lastFlipped.value === tile.value) && (this.lastFlipped.id != tile.id)) { // Pair found
          tile.flip(this.idPlayer);
          this.pairsLeft--;
          this.lastFlipped.pair();
          tile.pair();
          this.lastFlipped = null;
          this.lastFlipped2 = null;
          if(this.pairsLeft === 0){
            //game ends
            this.timer.startstoptimer();
            socket.emit('playerHasWon', "" + this.idPlayer);
          }
      } else { // Second tile selected
          this.lastFlipped2 = this.lastFlipped;
          this.lastFlipped = tile;
          tile.flip(this.idPlayer);
      }
    }
  }

}