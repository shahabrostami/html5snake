<!-- hide script from old browsers

var game = new Game();
var list = new List();
var food;
var trees = new Array();
var shots = new Array();
var noOfShots = 0;
var noOfTrees = 0;
var timer = 0;
var keyPressed = false;

function init() {
	// Retrieve the canvas elements, allowing us to resize them to the correct inner size of window.
	var canvasBackground = document.getElementById('background');
    var canvasMain = document.getElementById('main');
    var canvasTree = document.getElementById('tree');
    var canvasSnake = document.getElementById('snake');
    var canvasShots = document.getElementById('shots');

    // Make sure the user submits a valid numerical grid size between 10-200.
    var gameSize = "placeholder";
    while(isNaN(gameSize) || gameSize < 10 || gameSize > 200)
        gameSize = prompt("What is the game size?\nEnter a number between 10-200");

    // Resize all the canvas elements to match the maximum number of cells within the window size are used.
    if(game.init(gameSize))
    {
	    context = canvasBackground.getContext("2d"),
    	img = new Image();
    	Canvas_Resize(canvasBackground);
    	canvasBackground.style.background = 'green';
		img.src = 'img/grass.png';

		img.onload = function(){
    	// create pattern
    	var ptrn = context.createPattern(img, 'repeat'); // Create a pattern with this image, and set it to "repeat".
    	context.fillStyle = ptrn;
    	context.fillRect(0, 0, canvasBackground.width, canvasBackground.height); // context.fillRect(x, y, width, height);
    }
        Canvas_Resize(canvasMain);
        Canvas_Resize(canvasSnake);
        Canvas_Resize(canvasTree);
        Canvas_Resize(canvasShots);
        game.start();
    }
}

function Canvas_Resize(canvas) {
    canvas.width = window.innerWidth - (window.innerWidth % game.cellSize);
    canvas.height = window.innerHeight - (window.innerHeight % game.cellSize);
}

function Calculate_Random_Position() {
    var calcX = Math.floor((Math.random() * game.screenWidth)) * game.cellSize;
    var calcY = Math.floor((Math.random() * game.screenHeight))* game.cellSize;
    return {x: calcX, y: calcY};
}

function Spawn_Tree() {
	// Here we spawn a tree and ensure that it's position is 
    trees[noOfTrees] = new Tree();
    var data = Calculate_Random_Position();
    while(List.check(List.start, data.x, data.y) == 1 && (data.x !== List.end.data.prevx && data.y !== List.end.data.prevy))
        var data = Calculate_Random_Position();
    trees[noOfTrees].init(data.x, data.y, Math.floor(Math.random() * 4));
    trees[noOfTrees].draw();
    noOfTrees++;
}

function Spawn_Food() {
    food.clear();
    var data = Calculate_Random_Position();
    while(List.check(List.start, data.x, data.y) == 1 && (data.x !== List.end.data.prevx && data.y !== List.end.data.prevy))
        var data = Calculate_Random_Position();
    food.init(data.x, data.y);
    food.draw();
}

function Game() {
	// Placeholder values
    this.cellSize = 0;
    this.screenWidth = Math.floor(window.innerWidth / 1);
    this.screenHeight = Math.floor(window.innerHeight / 1);
    this.init = function(gameSize) {
        this.cellSize = gameSize;
        this.screenWidth = Math.floor(window.innerWidth / this.cellSize);
        this.screenHeight = Math.floor(window.innerHeight / this.cellSize);
        
        // Initialise the canvas elements and their respective object's context.
        this.canvas = document.getElementById('snake');
        if(this.canvas.getContext) {
            this.canvas = this.canvas.getContext('2d');
            SnakePiece.prototype.context = this.canvas;
        } else {
            return false;
        }
        
        this.canvas = document.getElementById('tree');
        if(this.canvas.getContext) {
            this.canvas = this.canvas.getContext('2d');
            Tree.prototype.context = this.canvas;
        } else {
            return false;
        }
        
        this.canvas = document.getElementById('main');
        if(this.canvas.getContext) {
            this.canvas = this.canvas.getContext('2d');
            Food.prototype.context = this.canvas;
            Shot.prototype.context = this.canvas;
        } else {
            return false;
        }

        this.canvas = document.getElementById('shots');
        if(this.canvas.getContext) {
            this.canvas = this.canvas.getContext('2d');
            Shot.prototype.context = this.canvas;
        } else {
            return false;
        }

        // Create the initial snake head and body.
        var snakeH = new SnakeH();
        snakeH.init(game.cellSize*2, 0, game.cellSize, game.cellSize);
        List.add(snakeH);
        var snakeB = new SnakeB();
        snakeB.init(game.cellSize, 0, game.cellSize, game.cellSize);
        List.add(snakeB);
        return true;
    }

    this.start = function() {
    	// Start the game by drawing out the initial snake body, spawning a piece of food and a tree.
        var current = List.start;
        food = new Food();
        Spawn_Food();
        Spawn_Tree();
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

        this.canvasWidth = game.screenWidth * game.cellSize;
        this.canvasHeight = game.screenHeight * game.cellSize;
    }

    this.draw = function() {    
    };
}

function List () {
    List.makeNode=function() {
        return{data:null, next:null, prev:null};
    };
    
    this.start = null;
    this.end = null;
    this.size = null;
    var size = -2;
    
  
    List.add=function(data) {
    	// Add a snake head if hasn't already.
        if(this.start==null) {
            this.start=List.makeNode();
            this.end = this.start;
            this.end.prev = this.start;
        }
        // Otherwise, add a piece of snake body to the list.
        else {
            this.end.next=List.makeNode();
            this.end.next.prev = this.end;
            this.end=this.end.next;
        }
        size++;
        this.size = size;
        this.end.data=data;
    };

    List.check=function(current, x, y) {
    	// Check to see if the given node 'current' hasn't collided with any trees or other snake pieces.
        while(current !== null) {
            if(x == current.data.x && y == current.data.y)
                return 1;
            current = current.next;
        }
        for(i = 0; i < noOfTrees; i++)
            if(x == trees[i].x && y == trees[i].y)
                return 1;
        return 0;
    }

    List.checkFood=function() {
    	// Check to see if a piece of food has been eaten.
        var current = List.start.next;
        if(List.start.data.x == food.x && List.start.data.y == food.y)
        {
        	// If so, add a new snake piece body, speed up the snake and spawn another food and tree.
            var snakeB = new SnakeB();
            snakeB.init(game.cellSize, 0, game.cellSize, game.cellSize);
            List.add(snakeB);
            if(List.start.data.speed > 10)
                List.start.data.speed -= 5;
            else if(List.start.data.speed > 2)
                List.start.data.speed -= 1;
            Spawn_Food();
            Spawn_Tree();
        }
    }
    
    List.update=function() {
    	// Update all the snake pieces using the previous node as the coordinates.
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
	// Initialie all images.
    this.snakeHL = new Image();
    this.snakeHR = new Image();
    this.snakeHU = new Image();
    this.snakeHD = new Image();
    this.snakeB = new Image();
    this.food = new Image();
    this.tree = new Image();
    
    var numImages = 6;
    var numImagesLoaded = 0;
    function imageLoaded() {
        numImagesLoaded++;
        if(numImagesLoaded === numImages) {
            window.init();
        }
    }
 
    this.snakeHL.onload = function () {
        imageLoaded();
    }
    this.snakeHU.onload = function () {
        imageLoaded();
    }
    this.snakeHD.onload = function () {
        imageLoaded();
    }
    this.snakeHR.onload = function () {
        imageLoaded();
    }
    this.snakeB.onload = function () {
        imageLoaded();
    }
    this.food.onload = function () {
        imageLoaded();
    }
    this.tree.onload = function () {
        imageLoaded();
    }
    
    this.snakeB.src = "img/body.jpg";
    this.snakeHL.src = "img/headLeft.jpg";
    this.snakeHR.src = "img/headRight.jpg";
    this.snakeHU.src = "img/headUp.jpg";
    this.snakeHD.src = "img/headDown.jpg	";
    this.food.src = "img/mouse2.png";
    this.tree.src = "img/trees2.png"
}

function SnakePiece() {	
	// snake piece struct, self explanatory, requires coordinates and the directions to move in.
	this.speed = 30;
    this.prevx = this.x;
    this.prevy = this.y;

    this.clear = function() {
        this.context.clearRect(this.prevx, this.prevy, this.width, this.height);
    }
    
    this.move = function() {
        // Determine if the action is moving, if so, update accordingly.
        if (KEY_STATUS.left || KEY_STATUS.right ||
            KEY_STATUS.down || KEY_STATUS.up) {
            if (KEY_STATUS.left) {
                if(this.directionX == 1)
                    return;
                this.img = this.imgL;
                this.newDirectionX = -1;
                this.newDirectionY = 0;
            } else if (KEY_STATUS.right) {
                if(this.directionX == -1)
                    return;
                this.img = this.imgR;
                this.newDirectionX = 1;
                this.newDirectionY = 0;
            } else if (KEY_STATUS.up) {
                if(this.directionY == 1)
                    return;
                this.img = this.imgU;
                this.newDirectionY = -1;
                this.newDirectionX = 0;
            } else if (KEY_STATUS.down) {
                if(this.directionY == -1)
                    return;
                this.img = this.imgD;
                this.newDirectionY = 1;
                this.newDirectionX = 0;
            }
        }
    };
} SnakePiece.prototype = new Drawable();

function Tree () {
	// tree struct, self explanatory, only needs coordinates
    this.img = imageRepo.tree;
    this.imageIndex = 0;
    this.imgW = 125;
    this.imgH = 125;
    this.init = function(x,y,imageIndex) {
        this.imageIndex = imageIndex;
        this.width = game.cellSize;
        this.height = game.cellSize;
        this.x = x;
        this.y = y;
    };
    this.clear = function() {
        this.context.clearRect(this.x, this.y, this.width, this.height);
    }
    this.draw = function() {
        this.context.drawImage(this.img, 0, this.imageIndex*this.imgH, this.imgW, this.imgH, this.x, this.y, game.cellSize, game.cellSize);
    };
} Tree.prototype = new Drawable();

function Food () {
	// food struct, self explanatory, only needs coordinates
    this.img = imageRepo.food;
    this.x = 0;
    this.y = 0;
    this.init = function(x,y) {
        this.width = game.cellSize;
        this.height = game.cellSize;
        this.x = x;
        this.y = y;
    };
    this.clear = function() {
        this.context.clearRect(this.x, this.y, this.width, this.height);
    };
    this.draw = function() {
        this.context.drawImage(this.img, 20, 490, 100, 110, this.x, this.y, game.cellSize, game.cellSize);
    };
} Food.prototype = new Drawable();

function Shot () {
	// shot struct, self explanatory, only needs coordinates and directions to move in.
	// uses previous coords to remove trail drawn.
	this.img = imageRepo.food;
    this.directionX = 0;
    this.directionY = 0;
    this.prevx = 0;
    this.prevy = 0;
    this.x = 0;
    this.y = 0;
    this.init = function(x, y, directionX, directionY) {
    	this.x = x;
    	this.y = y;
    	this.directionX = directionX;
    	this.directionY = directionY;
    }
    this.update = function() {
    	this.prevx = this.x;
    	this.prevy = this.y;
    	this.x += this.directionX * game.cellSize;
    	this.y += this.directionY * game.cellSize;
    };
    this.clear = function() {
        this.context.clearRect(this.prevx, this.prevy, game.cellSize, game.cellSize);
    };
    this.draw = function() {
    	this.clear();
        this.context.drawImage(this.img, this.x, this.y, game.cellSize, game.cellSize);
    };
} Shot.prototype = new Drawable();

function SnakeH () {
	// snake head struct, different to snake piece as this is used to update the rest of the snake.
	// the snake head has 4 images representing each direction.
    this.imgR = imageRepo.snakeHR;
    this.imgL = imageRepo.snakeHL;
    this.imgU = imageRepo.snakeHU;
    this.imgD = imageRepo.snakeHD;
    this.img = imageRepo.snakeHR;
    this.newDirectionX = 1;
    this.newDirectionY = 0;
    this.directionX = 1;
    this.directionY = 0;
    this.update = function() {
    		// update the directions accordingly.
            this.prevx = this.x;
            this.prevy = this.y;
            this.directionX = this.newDirectionX;
            this.directionY = this.newDirectionY;
            this.x += (this.width * this.directionX);
            this.y += (this.height * this.directionY);
            // if the position of the snake is moving out the canvas, update and loop around the canvas.
            if(this.x >= this.canvasWidth)
                this.x = 0;
            if(this.x < 0)
                this.x = this.canvasWidth-game.cellSize;
            if(this.y >= this.canvasHeight)
                this.y = 0;
            if(this.y < 0)
                this.y = this.canvasHeight-game.cellSize;
            // If the snake head has collided with anything, fail.
            if(List.check(List.start.next, List.start.data.x, List.start.data.y) === 1)
            {
                alert("YOU LOSE! Your score: " + List.size);
                location.reload();
            }
            // Check if the snake has hit food.
            List.checkFood();
    };
    this.draw = function() {
            this.context.drawImage(this.img, this.x, this.y, game.cellSize, game.cellSize);
    };
} SnakeH.prototype = new SnakePiece();

function SnakeB () {
	// The snake body is also a snake piece, but with no extra luggage.
    this.draw = function() {       
        this.context.drawImage(this.img, this.x, this.y, game.cellSize, game.cellSize);
    };
    this.img = imageRepo.snakeB;
} SnakeB.prototype = new SnakePiece();

function updateShots() {
	var head = List.start;
	// ensure the shot has only been spawned once per key press.
	if(KEY_STATUS.space)
    	keyPressed = true;
    if(keyPressed && !KEY_STATUS.space)
    {
        shots[noOfShots] = new Shot();
        shots[noOfShots].init(head.data.x, head.data.y, head.data.directionX, head.data.directionY);
        noOfShots++;
        keyPressed = false;
    }
    for(i = 0; i < noOfShots; i++)
    {
    	shots[i].update();
    	shots[i].draw();
    }
}

function animate() {
	// the messy animate loop that needs to be updated.
    requestAnimFrame( animate );
    var current = List.start;
    var speed = current.data.speed;
    timer += 1;
    current.data.move();
    // update the shots
    updateShots();

    // if the timer tick has occurred (time to redraw), then update and draw all snake pieces
    if(timer % speed == 0)
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