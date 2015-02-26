<!-- hide script from old browsers

var game = new Game(),
    keyPressed = false;

function init() {
    // Make sure the user submits a valid numerical grid size between 10-200.
    var gameSize = "placeholder";
    while(isNaN(gameSize) || gameSize < 10 || gameSize > 200)
        gameSize = prompt("What is the game size?\nEnter a number between 10-200");

    // Resize all the canvas elements to match the maximum number of cells within the window size are used.
    if(game.init(gameSize))
    {
        game.start();
    }
}

function calcRandomPosition() {
    var calcX = Math.floor((Math.random() * game.screenCellWidth)) * game.cellSize,
        calcY = Math.floor((Math.random() * game.screenCellHeight))* game.cellSize;
    return {x: calcX, y: calcY};
}

function canvasResize(canvas) {
    canvas.width = window.innerWidth - (window.innerWidth % game.cellSize);
    canvas.height = window.innerHeight - (window.innerHeight % game.cellSize);
}

function initCanvas(canvas, prototypeObj) {
    canvas.width = window.innerWidth - (window.innerWidth % game.cellSize);
    canvas.height = window.innerHeight - (window.innerHeight % game.cellSize);
    if(canvas.getContext && prototypeObj !== undefined) {
            canvas = canvas.getContext('2d');
            prototypeObj.prototype.context = canvas;
    } else {
        return false;
    }
}

function Game() {
    // Placeholder values
    this.cellSize = 0;
    this.canvasWidth = Math.floor(window.innerWidth / 1);
    this.canvasHeight = Math.floor(window.innerHeight / 1);
    this.timer = 0;
    this.speed = 30;

    this.init = function(gameSize) {
        this.cellSize = gameSize;
        this.screenCellWidth = Math.floor(window.innerWidth / this.cellSize);
        this.screenCellHeight = Math.floor(window.innerHeight / this.cellSize);
        // Retrieve the canvas elements, allowing us to resize them to the correct inner size of window.
        var canvasBackground = document.getElementById('background'),
            canvasMain = document.getElementById('main'),
            canvasTree = document.getElementById('tree'),
            canvasSnake = document.getElementById('snake'),
            canvasShots = document.getElementById('shots');

        initCanvas(canvasBackground);
        initCanvas(canvasMain, Food);
        initCanvas(canvasTree, Tree);
        initCanvas(canvasShots, Shot);
        initCanvas(canvasSnake, SnakePiece);
        
        var backgroundContext = canvasBackground.getContext('2d');
        var ptrn = backgroundContext.createPattern(imageRepo.grass, 'repeat'); 
        backgroundContext.fillStyle = ptrn;
        backgroundContext.fillRect(0, 0, canvasBackground.width, canvasBackground.height); 

        this.snake = new Snake();
        this.shots = new ShotPool();
        this.trees = new TreePool();
        this.food = new Food();
        // Create the initial snake head and body.
        var snakeH = new SnakeH();
        snakeH.init(game.cellSize*2, 0);
        game.snake.add(snakeH);
        var snakeB = new SnakeB();
        snakeB.init(game.cellSize, 0);
        game.snake.add(snakeB);
        return true;
    }

    this.start = function() {
        // Start the game by drawing out the initial snake body, spawning a piece of food and a tree.
        var current = this.snake.start;
        game.food.reset();
        game.trees.add();
        while(current !== null) {
                current.data.draw();
                current = current.next;
        }
        animate();
    }
}

function Drawable() {
    this.init = function(x, y) {
        this.x = x;
        this.y = y;
        this.width = game.cellSize;
        this.height = game.cellSize;

        this.canvasWidth = game.screenCellWidth * game.cellSize;
        this.canvasHeight = game.screenCellHeight * game.cellSize;
    }

    this.clear = function() {
        console.log("lol");
        this.context.clearRect(this.x, this.y, game.cellSize, game.cellSize);
    };

    this.draw = function() {    
    };
}

function Snake () {
    this.makeNode=function() {
        return{data:null, next:null, prev:null};
    };
    
    this.start = null;
    this.end = null;
    this.size = null;
    var size = -2;
  
    this.add=function(data) {
        // Add a snake head if hasn't already.
        if(this.start === null) {
            this.start=this.makeNode();
            this.end = this.start;
            this.end.prev = this.start;
        }
        // Otherwise, add a piece of snake body to the list.
        else {
            this.end.next=this.makeNode();
            this.end.next.prev = this.end;
            this.end=this.end.next;
        }
        size++;
        this.size = size;
        this.end.data=data;
    };

    this.check=function(current, x, y) {
        // Check to see if the given node 'current' hasn't collided with any trees or other snake pieces.
        while(current !== null) {
            if(x === current.data.x && y === current.data.y)
                return 1;
            current = current.next;
        }
        for(i = 0; i < game.trees.noOfTrees; i++)
        {
            if(x === game.trees.pool[i].x && y === game.trees.pool[i].y)
                return 1;
        }
        return 0;
    }

    this.checkFood=function() {
        // Check to see if a piece of food has been eaten.
        var current = this.start.next;
        if(this.start.data.x === game.food.x && this.start.data.y === game.food.y)
        {
            // If so, add a new snake piece body
            var snakeB = new SnakeB();
            snakeB.init(game.cellSize, 0);
            this.add(snakeB)
            // Increase speed if necessary
            if(game.speed > 10)
                game.speed -= 5;
            else if(game.speed > 2)
                game.speed -= 1;
            // spawn another food and tree.
            game.food.reset();
            game.trees.add();
        }
    }
    
    this.updatePositions=function() {
        // Update all the snake pieces using the previous node as the coordinates.
        var current = this.start.next;
        while(current !== null) {
            current.data.prevx = current.data.x;
            current.data.prevy = current.data.y;
            current.data.x = current.prev.data.prevx;
            current.data.y = current.prev.data.prevy;
            current = current.next;
        }
    }

    this.updateAll=function() {
        this.start.data.move();
        if(game.timer % game.speed === 0)
        {
            this.start.data.update();
            this.start.data.draw();
            
            this.updatePositions();
            var current = this.start.next;
            while(current !== null) {
                    current.data.draw();
                    current = current.next;
            }
            this.end.data.clear();
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
    this.grass = new Image();
    this.fire = new Image();
    
    var numImages = 9;
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
    this.grass.onload = function(){
        imageLoaded();
    }
    this.fire.onload = function(){
        imageLoaded();
    }
    
    this.snakeB.src = "img/body.jpg";
    this.snakeHL.src = "img/headLeft.jpg";
    this.snakeHR.src = "img/headRight.jpg";
    this.snakeHU.src = "img/headUp.jpg";
    this.snakeHD.src = "img/headDown.jpg";
    this.food.src = "img/mouse2.png";
    this.tree.src = "img/trees2.png"
    this.grass.src = 'img/grass.png';
    this.fire.src = 'img/fire.png';
}

function SnakePiece() { 
    // snake piece struct, self explanatory, requires coordinates and the directions to move in.
    this.prevx = this.x;
    this.prevy = this.y;

    // we override Drawable's clear function as we need to remove it's previous position, not it's current one.
    this.clear = function() {
        this.context.clearRect(this.prevx, this.prevy, this.width, this.height);
    }
    
    this.move = function() {
        // Determine if the action is moving, if so, update accordingly.
        if (KEY_STATUS.left || KEY_STATUS.right ||
            KEY_STATUS.down || KEY_STATUS.up) {
            if (KEY_STATUS.left) {
                if(this.directionX === 1)
                    return;
                this.img = this.imgL;
                this.newDirectionX = -1;
                this.newDirectionY = 0;
            } else if (KEY_STATUS.right) {
                if(this.directionX === -1)
                    return;
                this.img = this.imgR;
                this.newDirectionX = 1;
                this.newDirectionY = 0;
            } else if (KEY_STATUS.up) {
                if(this.directionY === 1)
                    return;
                this.img = this.imgU;
                this.newDirectionY = -1;
                this.newDirectionX = 0;
            } else if (KEY_STATUS.down) {
                if(this.directionY === -1)
                    return;
                this.img = this.imgD;
                this.newDirectionY = 1;
                this.newDirectionX = 0;
            }
        }
    };
} SnakePiece.prototype = new Drawable();

function TreePool () {
    this.pool = new Array();
    var noOfTrees = 0;
    this.noOfTrees = 0;

    this.add = function() {
        // Here we spawn a tree and ensure that it's position is 
        this.pool[noOfTrees] = new Tree();
        var data = calcRandomPosition();
        while(game.snake.check(game.snake.start, data.x, data.y) === 1 
            && (data.x !== game.snake.end.data.prevx && data.y !== game.snake.end.data.prevy))
            var data = calcRandomPosition();
        this.pool[noOfTrees].init(data.x, data.y, Math.floor(Math.random() * 4));
        this.pool[noOfTrees].draw();
        noOfTrees++;
        this.noOfTrees = noOfTrees;
    }

    this.checkHit = function(x,y) {
       var i = this.pool.length;
        while (i--) {
            if(this.pool[i].x === x && this.pool[i].y === y)
            {
                noOfTrees--;
                this.noOfTrees = noOfTrees;
                this.pool[i].clear();
                this.pool.splice(i, 1);
                return 1;
            }
        }
        return 0;
    };
}

function Tree () {
    // tree struct, self explanatory, only needs coordinates
    this.img = imageRepo.tree;
    this.imageIndex = 0;
    this.imgRow = 0;
    this.imgW = 125;
    this.imgH = 125;
    this.init = function(x,y,imageIndex) {
        this.imageIndex = imageIndex;
        this.imgRow = this.imageIndex*this.imgH;
        this.width = game.cellSize;
        this.height = game.cellSize;
        this.x = x;
        this.y = y;
    };
    this.draw = function() {
        this.context.drawImage(this.img, 0, this.imgRow, this.imgW, this.imgH, this.x, this.y, this.width, this.height);
    };
} Tree.prototype = new Drawable();

function Food () {
    // food struct, self explanatory, only needs coordinates
    this.img = imageRepo.food;
    this.x = 0;
    this.y = 0;
    this.dx = 0;
    this.dy = 0;
    this.sx = 20;
    this.sy = 490;
    this.origW = 100;
    this.origH = 110;
    this.init = function(x,y) {
        this.width = game.cellSize/2;
        this.height = game.cellSize/2;
        this.x=x;
        this.y=y;
        this.dx = x+(game.cellSize/4);
        this.dy = y+(game.cellSize/4);
    };
    this.draw = function() {
        this.context.drawImage(this.img, this.sx, this.sy, this.origW, this.origH, this.dx, this.dy, this.width, this.height);
    };

    this.reset = function() {
        this.clear();
        var data = calcRandomPosition();
        while(game.snake.check(game.snake.start, data.x, data.y) === 1 && (data.x != game.snake.end.data.prevx && data.y != game.snake.end.data.prevy))
            var data = calcRandomPosition();
        this.init(data.x, data.y);
        this.draw();
    };
} Food.prototype = new Drawable();


function ShotPool () {
    this.pool = new Array();
    var noOfShots = 0;
    
    this.update = function() {
        var head = game.snake.start;
        // ensure the shot has only been spawned once per key press.
        if(KEY_STATUS.space)
            keyPressed = true;
        if(keyPressed && !KEY_STATUS.space)
        {
            this.pool[noOfShots] = new Shot();
            this.pool[noOfShots].init(head.data.x, head.data.y, head.data.directionX, head.data.directionY);
            noOfShots++;
            keyPressed = false;
        }
        for(i = 0; i < noOfShots; i++)
        {
            this.pool[i].update();
            this.pool[i].draw();
            if(game.trees.checkHit(this.pool[i].x, this.pool[i].y) === 1 ||
                ((this.pool[i].x < 0 || this.pool[i].x > game.canvasWidth) &&
                (this.pool[i].y < 0 || this.pool[i].y > game.canvasHeight)))
            {
                noOfShots--;
                this.pool[i].clear();
                this.pool.splice(i, 1);
            }
        }
    };
}

function Shot () {
    // shot struct, self explanatory, only needs coordinates and directions to move in.
    // uses previous coords to remove trail drawn.
    this.img = imageRepo.fire;
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
    this.clearPrev = function() {
        this.context.clearRect(this.prevx, this.prevy, game.cellSize, game.cellSize);
    };
    this.clear = function() {
        this.context.clearRect(this.x, this.y, game.cellSize, game.cellSize);
    };
    this.draw = function() {
        this.clearPrev();
        this.context.drawImage(this.img, 0, 0, 40, 40, this.x, this.y, game.cellSize, game.cellSize);
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
            if(game.snake.check(game.snake.start.next, game.snake.start.data.x, game.snake.start.data.y) === 1)
            {
                alert("YOU LOSE! Your score: " + game.snake.size);
                location.reload();
            }
            // Check if the snake has hit food.
            game.snake.checkFood();
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


function animate() {
    // the messy animate loop that needs to be updated.
    requestAnimFrame( animate );
    game.timer += 1;

    // update the shots
    game.shots.update();
    game.snake.updateAll();
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