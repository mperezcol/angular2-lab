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
var socket = io(); //io.connect("localhost:4000");
/* Records the time in milliseconds, after a given event */
var Timer = (function () {
    function Timer(idPlayer) {
        this.millisec = 0;
        this.seconds = 0;
        this.minutes = 0;
        this.idPlayer = idPlayer;
    }
    Timer.prototype.display = function () {
        var _this = this;
        if (this.millisec >= 9) {
            this.millisec = 0;
            this.seconds += 1;
        }
        else if (this.seconds >= 60) {
            this.seconds = 0;
            this.millisec = 0;
            this.minutes += 1;
        }
        else {
            this.millisec += 1;
        }
        this.formattedTime = this.minutes + ":" + this.seconds + ":" + this.millisec;
        if (this.idPlayer === 1) {
            timerPlayer1 = setTimeout(function () { return _this.display(); }, 100);
        }
        else if (this.idPlayer === 2) {
            timerPlayer2 = setTimeout(function () { return _this.display(); }, 100);
        }
    };
    Timer.prototype.startstoptimer = function () {
        if (this.idPlayer === 1) {
            if (timerPlayer1 > 0) {
                clearTimeout(timerPlayer1);
                timerPlayer1 = 0;
            }
            else {
                this.display();
            }
        }
        else if (this.idPlayer === 2) {
            if (timerPlayer2 > 0) {
                clearTimeout(timerPlayer2);
                timerPlayer2 = 0;
            }
            else {
                this.display();
            }
        }
    };
    return Timer;
})();
/* Tile class */
var Tile = (function () {
    function Tile(pId, pValue) {
        this.id = pId;
        this.flipped = false;
        this.paired = false;
        this.value = pValue;
    }
    Tile.prototype.flip = function (idPlayer) {
        this.flipped = true;
        animateFlip(this.id);
        socket.emit('flip', "" + idPlayer + "," + this.id);
    };
    Tile.prototype.unflip = function (idPlayer) {
        this.flipped = false;
        animateUnFlip(this.id);
        socket.emit('unflip', "" + idPlayer + "," + this.id);
    };
    Tile.prototype.pair = function () {
        this.paired = true;
    };
    return Tile;
})();
/* Tile Array management */
var TileService = (function () {
    function TileService() {
        this.tiles = new Array();
        var tilesNames = ['8-ball', 'baked-potato', 'dinosaur', 'kronos', 'rocket', 'skinny-unicorn', 'that-guy', 'zeppelin'];
        var tile;
        var j = 1;
        for (var i = 0; i < tilesNames.length; i++) {
            tile = new Tile(j, tilesNames[i]);
            this.tiles.push(tile);
            j++;
            tile = new Tile(j, tilesNames[i]);
            this.tiles.push(tile);
            j++;
        }
        /* Shuffle the array */
        var currentIndex = this.tiles.length, temporaryValue, randomIndex;
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
    return TileService;
})();
exports.TileService = TileService;
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
        this.timer = new Timer(this.idPlayer);
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
            injectables: [TileService]
        }),
        angular2_1.View({
            template: "\n    <div class=\"playerTitle\">\n      <h2>Player {{ idPlayer }}</h2>\n      <span>Time </span>\n      <span>{{ timer.formattedTime }}</span>\n    </div>  \n    <ul class=\"tileList\">\n      <li *for=\"#tile of tiles\">\n          <div class=\"flipper\" id=\"flipper{{ tile.id }}\">\n            <div class=\"front\">\n              <img id=\"front{{ tile.id }}\" alt=\"back\" (click)=\"flipTile(tile);\" src=\"images/back.png\"/>\n            </div>\n            <div class=\"back\">\n              <img id=\"back{{ tile.id }}\" alt=\"{{ tile.value }}\" (click)=\"flipTile(tile);\" src=\"images/{{ tile.value }}.png\"/>\n            </div>\n           </div>\n      </li>\n    </ul>",
            directives: [angular2_1.For, angular2_1.If]
        }), 
        __metadata('design:paramtypes', [TileService])
    ], PlayerComponent);
    return PlayerComponent;
})();
exports.PlayerComponent = PlayerComponent;
