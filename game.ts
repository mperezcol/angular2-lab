///<reference path="typings/angular2/angular2.d.ts" />
import {Component, View, bootstrap, For, If} from 'angular2/angular2';

declare function animateFlip(id:number);
declare function animateUnFlip(id:number);

class Item {
  id: number;
  value: string;
  image: string;
  flipped: boolean;
  paired: boolean;
  constructor(pId:number,pValue:string){
    this.id = pId;
    this.flipped = false;
    this.paired = false;
    this.value = pValue;
  }
  flip(){
    this.flipped = true;
    animateFlip(this.id);
  }
  unflip(){
    this.flipped = false;
    animateUnFlip(this.id);
  }
  pair(){
    this.paired = true;
  }

}
class ItemService{
  pairs: Item[] = new Array();
  constructor(){
    var tilesNames = ['8-ball', 'baked-potato', 'dinosaur', 'kronos', 'rocket', 'skinny-unicorn', 'that-guy', 'zeppelin'];
    var item: Item;
    var j = 1;
    for(var i = 0; i < tilesNames.length; i++){
      item = new Item(j,tilesNames[i]);
      this.pairs.push(item);
      j++;
      item = new Item(j,tilesNames[i]);
      this.pairs.push(item);
      j++;
    }    
  }  
  shufflePairs(){
    var currentIndex = this.pairs.length, temporaryValue, randomIndex ;
    // While there remain elements to shuffle...
    while (0 != currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = this.pairs[currentIndex];
      this.pairs[currentIndex] = this.pairs[randomIndex];
      this.pairs[randomIndex] = temporaryValue; 
    }
  }
}

/* Contenedor principal */
@Component({
  selector: 'game',
  injectables: [ItemService]
})
@View({
  template: `

  <p>Pairs left to win: {{ pairsLeft }}</p>
  <ul class="gameContainer">
     <li *for="#item of pairs">
         <div class="flipper" id="flipper{{ item.id }}">
           <div class="front">
             <img id="front{{ item.id }}" alt="back" src="images/back.png" (click)="flipItem(item);" title="Click me!"/>
           </div>
           <div class="back">
             <img id="back{{ item.id }}" alt="{{ item.value }}" src="images/{{ item.value }}.png" (click)="flipItem(item);" title="Click me!"/>
           </div>
        </div>
     </li>
  </ul>
  
  `,
  directives: [For, If]
})
class GameComponent { 
  pairs: Item[] = new Array();
  lastFlipped: Item = null;
  lastFlipped2: Item = null;
  pairsLeft: number;

	constructor(itemService:ItemService) {
    itemService.shufflePairs();
    this.pairs = itemService.pairs;
    this.pairsLeft = 8;
	}	  

  flipItem(item: Item){
    if(item.paired || item.flipped){ // Item already paired
      return;
    } else {
      if (this.lastFlipped === null) { // First item selected
        this.lastFlipped = item;
        item.flip();
      } else if(this.lastFlipped != null && this.lastFlipped2 != null){ // two items previously selected
          this.lastFlipped2.unflip();
          this.lastFlipped.unflip();
          this.lastFlipped = item;
          this.lastFlipped2 = null;
          item.flip();
      } else if ((this.lastFlipped.value === item.value) && (this.lastFlipped.id != item.id)) { // Pair found
          item.flip();
          this.pairsLeft--;
          this.lastFlipped.pair();
          item.pair();
          this.lastFlipped = null;
          this.lastFlipped2 = null;
      } else { // Second item selected
          this.lastFlipped2 = this.lastFlipped;
          this.lastFlipped = item;
          item.flip();
      }
    }
  }

}
bootstrap(GameComponent); 