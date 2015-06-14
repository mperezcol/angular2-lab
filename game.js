if (typeof __decorate !== "function") __decorate = function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
if (typeof __metadata !== "function") __metadata = function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
///<reference path="typings/angular2/angular2.d.ts" />
var angular2_1 = require('angular2/angular2');
var Item = (function () {
    function Item(pId, pValue) {
        this.id = pId;
        this.flipped = false;
        this.paired = false;
        this.value = pValue;
    }
    Item.prototype.flip = function () {
        this.flipped = true;
        animateFlip(this.id);
    };
    Item.prototype.unflip = function () {
        this.flipped = false;
        animateUnFlip(this.id);
    };
    Item.prototype.pair = function () {
        this.paired = true;
    };
    return Item;
})();
var ItemService = (function () {
    function ItemService() {
        this.pairs = new Array();
        var tilesNames = ['8-ball', 'baked-potato', 'dinosaur', 'kronos', 'rocket', 'skinny-unicorn', 'that-guy', 'zeppelin'];
        var item;
        var j = 1;
        for (var i = 0; i < tilesNames.length; i++) {
            item = new Item(j, tilesNames[i]);
            this.pairs.push(item);
            j++;
            item = new Item(j, tilesNames[i]);
            this.pairs.push(item);
            j++;
        }
    }
    ItemService.prototype.shufflePairs = function () {
        var currentIndex = this.pairs.length, temporaryValue, randomIndex;
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
    };
    return ItemService;
})();
/* Contenedor principal */
var GameComponent = (function () {
    function GameComponent(itemService) {
        this.pairs = new Array();
        this.lastFlipped = null;
        this.lastFlipped2 = null;
        itemService.shufflePairs();
        this.pairs = itemService.pairs;
        this.pairsLeft = 8;
    }
    GameComponent.prototype.flipItem = function (item) {
        if (item.paired || item.flipped) {
            return;
        }
        else {
            if (this.lastFlipped === null) {
                this.lastFlipped = item;
                item.flip();
            }
            else if (this.lastFlipped != null && this.lastFlipped2 != null) {
                this.lastFlipped2.unflip();
                this.lastFlipped.unflip();
                this.lastFlipped = item;
                this.lastFlipped2 = null;
                item.flip();
            }
            else if ((this.lastFlipped.value === item.value) && (this.lastFlipped.id != item.id)) {
                item.flip();
                this.pairsLeft--;
                this.lastFlipped.pair();
                item.pair();
                this.lastFlipped = null;
                this.lastFlipped2 = null;
            }
            else {
                this.lastFlipped2 = this.lastFlipped;
                this.lastFlipped = item;
                item.flip();
            }
        }
    };
    GameComponent = __decorate([
        angular2_1.Component({
            selector: 'game',
            injectables: [ItemService]
        }),
        angular2_1.View({
            template: "\n\n  <p>Pairs left to win: {{ pairsLeft }}</p>\n  <ul class=\"gameContainer\">\n     <li *for=\"#item of pairs\">\n         <div class=\"flipper\" id=\"flipper{{ item.id }}\">\n           <div class=\"front\">\n             <img id=\"front{{ item.id }}\" alt=\"back\" src=\"images/back.png\" (click)=\"flipItem(item);\" title=\"Click me!\"/>\n           </div>\n           <div class=\"back\">\n             <img id=\"back{{ item.id }}\" alt=\"{{ item.value }}\" src=\"images/{{ item.value }}.png\" (click)=\"flipItem(item);\" title=\"Click me!\"/>\n           </div>\n        </div>\n     </li>\n  </ul>\n  \n  ",
            directives: [angular2_1.For, angular2_1.If]
        }), 
        __metadata('design:paramtypes', [ItemService])
    ], GameComponent);
    return GameComponent;
})();
angular2_1.bootstrap(GameComponent);
