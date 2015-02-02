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
			this.snakeH.init(0,0, 50, 50);
			return true;
		} else {
			return false;
		}
	}

	this.start = function() {
        this.snakeH.draw();
        animate();
	}
}

function Drawable() {
	this.init = function(x, y, width, height) {
		this.x = x;
		this.y = y;
        this.width = width;
        this.height = height;
	}
    this.newx = 0;
    this.newy = 0;
	this.speed = 0;
    this.directionY = 0;
	this.canvasWidth = 0;
	this.canvasHeight = 0;

	this.draw = function() {	
	};
}

var imageRepo = new function() {
	this.snakeH = new Image();
    
    var numImages = 1;
    var numImagesLoaded = 0;
    function imageLoaded() {
        numImagesLoaded++;
        if(numImagesLoaded === numImages) {
            window.init();
        }
    }
 
    this.snakeH.onload = function () {
        imageLoaded();
    }
    
	this.snakeH.src = "img/head.jpg";
}

function SnakeH() {
	this.speed = 1;
    this.directionX = 1;
    var timer = 0;
	this.draw = function() {
        timer += this.speed;
        if(timer % this.width == 0) {
            this.newx = this.x + (this.width * this.directionX);
            this.newy = this.y + (this.height * this.directionY);
            this.context.clearRect(this.x, this.y, this.width, this.height);
            this.context.drawImage(imageRepo.snakeH, this.newx, this.newy);
        }
        this.x = this.newx;
        this.y = this.newy;
	};
    
    this.move = function() {
		// Determine if the action is move action
		if (KEY_STATUS.left || KEY_STATUS.right ||
			KEY_STATUS.down || KEY_STATUS.up) {
			if (KEY_STATUS.left) {
                this.directionX = -1;
                this.directionY = 0;
				if (this.x <= 0) 
					this.x = 0;
			} else if (KEY_STATUS.right) {
				this.directionX = 1;
                this.directionY = 0;
				if (this.x >= this.canvasWidth - this.width)
					this.x = this.canvasWidth - this.width;
			} else if (KEY_STATUS.up) {
				this.directionY = -1;
                this.directionX = 0;
				if (this.y <= this.canvasHeight - this.height)
					this.y = this.canvasHeight - this.height;
			} else if (KEY_STATUS.down) {
				this.directionY = 1;
                this.directionX = 0;
				if (this.y >= this.canvasHeight - this.height)
					this.y = this.canvasHeight - this.height;
			}
			this.draw();
		}
    };
} SnakeH.prototype = new Drawable();

function animate() {
	requestAnimFrame( animate );
	game.snakeH.draw();
    game.snakeH.move();
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

// The keycodes that will be mapped when a user presses a button.
// Original code by Doug McInnes
KEY_CODES = {
  32: 'space',
  37: 'left',
  38: 'up',
  39: 'right',
  40: 'down',
}
// Creates the array to hold the KEY_CODES and sets all their values
// to false. Checking true/flase is the quickest way to check status
// of a key press and which one was pressed when determining
// when to move and which direction.
KEY_STATUS = {};
for (code in KEY_CODES) {
  KEY_STATUS[ KEY_CODES[ code ]] = false;
}
/**
 * Sets up the document to listen to onkeydown events (fired when
 * any key on the keyboard is pressed down). When a key is pressed,
 * it sets the appropriate direction to true to let us know which
 * key it was.
 */
document.onkeydown = function(e) {
  // Firefox and opera use charCode instead of keyCode to
  // return which key was pressed.
  var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
  if (KEY_CODES[keyCode]) {
    e.preventDefault();
    KEY_STATUS[KEY_CODES[keyCode]] = true;
  }
}
/**
 * Sets up the document to listen to ownkeyup events (fired when
 * any key on the keyboard is released). When a key is released,
 * it sets teh appropriate direction to false to let us know which
 * key it was.
 */
document.onkeyup = function(e) {
  var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
  if (KEY_CODES[keyCode]) {
    e.preventDefault();
    KEY_STATUS[KEY_CODES[keyCode]] = false;
  }
}

// end hiding script from old browsers -->