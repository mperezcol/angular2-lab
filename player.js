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
///<reference path="lib.ts" />
var angular2_1 = require('angular2/angular2');
var lib_1 = require('lib');
var socket = io(); //io.connect("localhost:4000");
var PlayerComponent = (function () {
    function PlayerComponent(tileService) {
        this.tiles = new Array();
        this.tiles = tileService.tiles;
        this.lastFlipped = null;
        this.lastFlipped2 = null;
        this.pairsLeft = 8;
        this.idPlayer = playersNumber;
        playersNumber += 1;
        // game starts
        this.timer = new lib_1.Timer(this.idPlayer);
        this.timer.startstoptimer();
    }
    /* Game logic */
    PlayerComponent.prototype.flipTile = function (tile) {
        if (tile.paired || tile.flipped) {
            return;
        }
        else {
            if (this.lastFlipped === null) {
                this.lastFlipped = tile;
                tile.flip(this.idPlayer);
            }
            else if (this.lastFlipped != null && this.lastFlipped2 != null) {
                this.lastFlipped2.unflip(this.idPlayer);
                this.lastFlipped.unflip(this.idPlayer);
                this.lastFlipped = tile;
                this.lastFlipped2 = null;
                tile.flip(this.idPlayer);
            }
            else if ((this.lastFlipped.value === tile.value) && (this.lastFlipped.id != tile.id)) {
                tile.flip(this.idPlayer);
                this.pairsLeft--;
                this.lastFlipped.pair();
                tile.pair();
                this.lastFlipped = null;
                this.lastFlipped2 = null;
                if (this.pairsLeft === 0) {
                    //game ends
                    this.timer.startstoptimer();
                    socket.emit('playerHasWon', "" + this.idPlayer);
                }
            }
            else {
                this.lastFlipped2 = this.lastFlipped;
                this.lastFlipped = tile;
                tile.flip(this.idPlayer);
            }
        }
    };
    PlayerComponent = __decorate([
        angular2_1.Component({
            selector: 'player',
            injectables: [lib_1.TileService]
        }),
        angular2_1.View({
            template: "\n    <div class=\"playerTitle\">\n      <h2>Player {{ idPlayer }}</h2>\n      <span>Time </span>\n      <span>{{ timer.formattedTime }}</span>\n    </div>  \n    <ul class=\"tileList\">\n      <li *for=\"#tile of tiles\">\n          <div class=\"flipper\" id=\"flipper{{ tile.id }}\">\n            <div class=\"front\">\n              <img id=\"front{{ tile.id }}\" alt=\"back\" (click)=\"flipTile(tile);\" src=\"images/back.png\"/>\n            </div>\n            <div class=\"back\">\n              <img id=\"back{{ tile.id }}\" alt=\"{{ tile.value }}\" (click)=\"flipTile(tile);\" src=\"images/{{ tile.value }}.png\"/>\n            </div>\n           </div>\n      </li>\n    </ul>",
            directives: [angular2_1.For, angular2_1.If]
        }), 
        __metadata('design:paramtypes', [lib_1.TileService])
    ], PlayerComponent);
    return PlayerComponent;
})();
exports.PlayerComponent = PlayerComponent;
