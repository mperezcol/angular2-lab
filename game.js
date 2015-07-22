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
///<reference path="player.ts" />
///<reference path="lib.ts" />
var angular2_1 = require('angular2/angular2');
var player_1 = require('player');
var lib_1 = require('lib');
/* Contenedor principal */
var GameComponent = (function () {
    function GameComponent(player1, player2) {
        this.player1 = player1;
        this.player2 = player2;
    }
    GameComponent = __decorate([
        angular2_1.Component({
            selector: 'game',
            injectables: [player_1.PlayerComponent, lib_1.TileService]
        }),
        angular2_1.View({
            template: "\n  <h1>Multi-user Memory Game!!</h1>\n  <div id=\"gameContainer\">\n    <div id=\"playerContainer1\">\n      <player>\n      </player>\n    </div>\n    <div id=\"playerContainer2\">\n      <player>\n      </player>\n    </div>\n  </div>\n  ",
            directives: [player_1.PlayerComponent]
        }), 
        __metadata('design:paramtypes', [player_1.PlayerComponent, player_1.PlayerComponent])
    ], GameComponent);
    return GameComponent;
})();
exports.GameComponent = GameComponent;
angular2_1.bootstrap(GameComponent);
