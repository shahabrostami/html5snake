<!-- hide script from old browsers

var game = new Game();
var list = new List();
var timer = 1;

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
            SnakePiece.prototype.context = this.canvas;
            this.snakeH = new SnakeH();
            this.snakeH.init(500, 0, 50, 50);
            List.add(this.snakeH);
            this.snakeB = new SnakeB();
            this.snakeB.init(50, 0, 50, 50);
            List.add(this.snakeB);
            this.snakeB = new SnakeB();
            this.snakeB.init(50, 0, 50, 50);
            List.add(this.snakeB);
            this.snakeB = new SnakeB();
            this.snakeB.init(50, 0, 50, 50);
            List.add(this.snakeB);
            this.snakeB = new SnakeB();
            this.snakeB.init(50, 0, 50, 50);
            List.add(this.snakeB);
            return true;
        } else {
            return false;
        }
    }

    this.start = function() {
        var current = List.start;
        while(current !== null) {
                current.data.draw();
                current = current.next;
        }
        animate();
    }
}

function Drawable() {
    this.init = function(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.prevx = this.x;
        this.prevy = this.y;
    }
    this.canvasWidth = window.innerWidth;
    this.canvasHeight = window.innerHeight;

    this.draw = function() {    
    };
}

function List () {
    List.makeNode=function() {
        return{data:null, next:null, prev:null};
    };
    
    this.start = null;
    this.end = null;
    List.add=function(data) {
        if(this.start==null) {
            this.start=List.makeNode();
            this.end = this.start;
            this.end.prev = this.start;
        }
        else {
            this.end.next=List.makeNode();
            this.end.next.prev = this.end;
            this.end=this.end.next;
        }
        this.end.data=data;
    };
    
    List.update=function() {
        var current = List.start.next;
        while(current !== null) {
            current.data.prevx = current.data.x;
            current.data.prevy = current.data.y;
            current.data.x = current.prev.data.prevx;
            current.data.y = current.prev.data.prevy;
            current = current.next;
        }
    }
}

var imageRepo = new function() {
    this.snakeH = new Image();
    this.snakeB = new Image();
    
    var numImages = 2;
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
    
    this.snakeB.onload = function () {
        imageLoaded();
    }
    
    this.snakeB.src = "img/body.jpg";
    this.snakeH.src = "img/head.jpg";
}

function SnakePiece() {
    this.speed = 1;
    this.clear = function() {
        this.context.clearRect(this.prevx, this.prevy, this.width, this.height);
    }
    
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
        }
    };
} SnakePiece.prototype = new Drawable();

function SnakeH () {
    this.img = imageRepo.snakeH;
    this.directionX = 1;
    this.directionY = 0;
    this.speed = 1;
    this.update = function() {
            this.prevx = this.x;
            this.prevy = this.y;
            this.x = this.x + (this.width * this.directionX);
            this.y = this.y + (this.height * this.directionY);
            if(this.x >= this.canvasWidth)
                this.x = 0;
            if(this.x < 0)
                this.x = this.canvasWidth;
            if(this.y >= this.canvasHeight)
                this.y = 0;
            if(this.y < 0)
                this.y = this.canvasHeight-50;
    };
    this.draw = function() {
            this.context.drawImage(this.img, this.x, this.y);
    }
} SnakeH.prototype = new SnakePiece();

function SnakeB () {
    var timer = 0;
    this.draw = function() {       
        this.context.drawImage(this.img, this.x, this.y);
    };
    this.img = imageRepo.snakeB;
} SnakeB.prototype = new SnakePiece();

function animate() {
    requestAnimFrame( animate );
    var current = List.start;
    timer += current.data.speed;
    current.data.move();
    if(timer % current.data.width == 0)
    {
        current.data.update();
        current.data.draw();
        List.update();
        current = current.next;
        while(current !== null) {
                current.data.draw();
                current = current.next;
        }
        List.end.data.clear();
    }
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