<!-- hide script from old browsers

var game = new Game();

function init() {
	var canvasMain = document.getElementById('main');
	var canvasSnake = document.getElementById('snake');
	Canvas_Resize(canvasMain);
	Canvas_Resize(canvasSnake);
	
	if(game.init())
		game.start();
}

function Canvas_Resize(canvas) {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}

function Game() {
	this.init = function() {
		this.canvas = document.getElementById('snake');
		if(this.canvas.getContext) {
			this.canvas = this.canvas.getContext('2d');
			SnakeH.prototype.context = this.canvas;
			SnakeH.prototype.canvasWidth = this.canvas.width;
			SnakeH.prototype.canvasHeight = this.canvas.height;
			
			this.snakeH = new SnakeH();
			this.snakeH.init(0,0);
			return true;
		} else {
			return false;
		}
	}

	this.start = function() {
		animate();
	}
}

function Drawable() {
	this.init = function(x, y, sizeX, sizeY) {
		this.x = x;
		this.y = y;
	}
	this.speed = 0;
	this.canvasWidth = 0;
	this.canvasHeight = 0;

	this.draw = function() {	
	};
}

var imageRepo = new function() {
	this.snakeH = new Image();
	this.snakeH.src = "img/head.jpg";
}

function SnakeH() {
	this.speed = 1;
	this.draw = function() {
		this.context.drawImage(imageRepo.snakeH, this.x, this.y);
	};
} SnakeH.prototype = new Drawable();

function animate() {
	requestAnimFrame( animate );
	game.snakeH.draw();
}

/**
 * requestAnim shim layer by Paul Irish
 * Finds the first API that works to optimize the animation loop,
 * otherwise defaults to setTimeout().
 */
window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame   ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame    ||
			window.oRequestAnimationFrame      ||
			window.msRequestAnimationFrame     ||
			function(/* function */ callback, /* DOMElement */ element){
				window.setTimeout(callback, 1000 / 60);
			};
})();

// end hiding script from old browsers -->