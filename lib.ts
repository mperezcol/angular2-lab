///<reference path="typings/angular2/angular2.d.ts" />
import {Component, View, bootstrap, For, If} from 'angular2/angular2';
/* Javascript functions and variables */
declare function animateFlip(id:number);
declare function animateUnFlip(id:number);
declare var io;
var socket = io(); //io.connect("localhost:4000");
declare var timerPlayer1;
declare var timerPlayer2;
/* Records the time in milliseconds, after a given event */
export class Timer {
  millisec: number;
  seconds: number;
  minutes: number;
  idPlayer: number;
  formattedTime: string;
  constructor(idPlayer:number){
    this.millisec = 0;
    this.seconds = 0;
    this.minutes = 0; 
    this.idPlayer = idPlayer;
  }
  display() {
    if (this.millisec >= 9) {
      this.millisec = 0;
      this.seconds += 1;
    }
    else if (this.seconds >= 60) {
      this.seconds = 0;
      this.millisec = 0;
      this.minutes += 1;
    }else {
      this.millisec += 1;
    }
    this.formattedTime = this.minutes + ":" + this.seconds + ":" + this.millisec;
    if(this.idPlayer === 1){
      timerPlayer1 = setTimeout(() => this.display(), 100);  
    }else if(this.idPlayer === 2){
      timerPlayer2 = setTimeout(() => this.display(), 100);  
    }
  }
  startstoptimer() {
    if(this.idPlayer === 1){
      if (timerPlayer1 > 0) {
        clearTimeout(timerPlayer1);
        timerPlayer1 = 0;
      } else {
        this.display();
      }
    }else if(this.idPlayer === 2){
      if (timerPlayer2 > 0) {
        clearTimeout(timerPlayer2);
        timerPlayer2 = 0;
      } else {
        this.display();
      }
    }
  }
}
/* Tile class */
export class Tile {
  id: number;
  value: string;
  flipped: boolean;
  paired: boolean;
  constructor(pId:number,pValue:string){
    this.id = pId;
    this.flipped = false;
    this.paired = false;
    this.value = pValue;
  }
  flip(idPlayer:number){
    this.flipped = true;
    animateFlip(this.id);
    socket.emit('flip', "" + idPlayer + "," + this.id);
  }
  unflip(idPlayer:number){
    this.flipped = false;
    animateUnFlip(this.id);
    socket.emit('unflip', "" + idPlayer + "," + this.id);
  }
  pair(){
    this.paired = true;
  }
}
/* Tile Array management */
export class TileService{
  tiles: Tile[] = new Array();
  constructor(){
    var tilesNames = ['8-ball', 'baked-potato', 'dinosaur', 'kronos', 'rocket', 'skinny-unicorn', 'that-guy', 'zeppelin'];
    var tile: Tile;
    var j = 1;
    for(var i = 0; i < tilesNames.length; i++){
      tile = new Tile(j,tilesNames[i]);
      this.tiles.push(tile);
      j++;
      tile = new Tile(j,tilesNames[i]);
      this.tiles.push(tile);
      j++;
    }
     /* Shuffle the array */
    var currentIndex = this.tiles.length, temporaryValue, randomIndex ;
    // While there remain elements to shuffle...
    while (0 != currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = this.tiles[currentIndex];
      this.tiles[currentIndex] = this.tiles[randomIndex];
      this.tiles[randomIndex] = temporaryValue; 
    }
  }
}