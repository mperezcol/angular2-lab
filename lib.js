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
exports.Timer = Timer;
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
exports.Tile = Tile;
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
