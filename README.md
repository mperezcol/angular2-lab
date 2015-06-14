# angular2-lab
Angular 2.0. Memory Game

Developer Guide
==============

This is an angular 2 app, that renders a Memory game with flipping images.<br/>
I'm using typescript 1.5 for Game's @Component, @View and injectables objects. I'm also using Jquery for CSS animations.<br/>

1. Install nodej and npm
--------------
https://nodejs.org/

# node js server
npm install -g http-server
npm install requirejs --save
npm install express --save
npm install serve-favicon --save
npm install morgan --save
npm install errorhandler --save
npm install ejs --save

# typescript
npm install -g tsd
tsd query angular2 --action install
npm install -g typescript@^1.5.0-beta
tsc --watch -m commonjs -t es5 --emitDecoratorMetadata game.ts