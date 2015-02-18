<!-- hide script from old browsers

var game = new Game();
var list = new List();
var food;
var trees = new Array();
var noOfTrees = 0;
var timer = 0;

function init() {
    var canvasMain = document.getElementById('main');
    var canvasTree = document.getElementById('tree');
    var canvasSnake = document.getElementById('snake');

    var gameSize = "placeholder";
    while(isNaN(gameSize) || gameSize < 10 || gameSize > 100)
        gameSize = prompt("What is the game size?\nEnter a number between 10-100");

    if(game.init(gameSize))
    {
        Canvas_Resize(canvasMain);
        Canvas_Resize(canvasSnake);
        Canvas_Resize(canvasTree);
        game.start();
    }
}

function Canvas_Resize(canvas) {
    canvas.width = window.innerWidth - (window.innerWidth % game.cellSize);
    canvas.height = window.innerHeight - (window.innerHeight % game.cellSize);
}

function Calculate_Food_Position() {
    var foodX = Math.floor((Math.random() * game.screenWidth)) * game.cellSize;
    var foodY = Math.floor((Math.random() * game.screenHeight))* game.cellSize;
    return {x: foodX, y: foodY};
}

function Spawn_Tree() {
    trees[noOfTrees] = new Tree();
    var data = Calculate_Food_Position();
    while(List.check(List.start, data.x, data.y) == 1 && (data.x !== List.end.data.prevx && data.y !== List.end.data.prevy))
        var data = Calculate_Food_Position();
    trees[noOfTrees].init(data.x, data.y);
    trees[noOfTrees].draw();
    noOfTrees++;
}

function Spawn_Food() {
    food.clear();
    var data = Calculate_Food_Position();
    while(List.check(List.start, data.x, data.y) == 1 && (data.x !== List.end.data.prevx && data.y !== List.end.data.prevy))
        var data = Calculate_Food_Position();
    food.init(data.x, data.y);
    food.draw();
}

function Game() {
    this.cellSize = 0;
    this.screenWidth = Math.floor(window.innerWidth / 1);
    this.screenHeight = Math.floor(window.innerHeight / 1);
    this.init = function(gameSize) {
        this.cellSize = gameSize;
        this.screenWidth = Math.floor(window.innerWidth / this.cellSize);
        this.screenHeight = Math.floor(window.innerHeight / this.cellSize);
        
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
        } else {
            return false;
        }

        var snakeH = new SnakeH();
        snakeH.init(game.cellSize*2, 0, game.cellSize, game.cellSize);
        List.add(snakeH);
        var snakeB = new SnakeB();
        snakeB.init(game.cellSize, 0, game.cellSize, game.cellSize);
        List.add(snakeB);
        return true;
    }

    this.start = function() {
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
        size++;
        this.size = size;
        this.end.data=data;
    };

    List.check=function(current, x, y) {
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
        var current = List.start.next;
        if(List.start.data.x == food.x && List.start.data.y == food.y)
        {
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
    this.snakeHD.src = "img/headDown.jpg";
    this.food.src = "img/food2.png";
    this.tree.src = "img/tree.png";
}

function SnakePiece() {
    this.speed = 50;
    this.prevx = this.x;
    this.prevy = this.y;
    this.clear = function() {
        this.context.clearRect(this.prevx, this.prevy, this.width, this.height);
    }
    
    this.move = function() {
        // Determine if the action is move action
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
    this.img = imageRepo.tree;
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
    }
    this.draw = function() {
        this.context.drawImage(this.img, this.x, this.y, game.cellSize, game.cellSize);
    };
} Tree.prototype = new Drawable();

function Food () {
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
    }
    this.draw = function() {
        this.context.drawImage(this.img, this.x, this.y, game.cellSize, game.cellSize);
    };
} Food.prototype = new Drawable();

function SnakeH () {
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
            this.prevx = this.x;
            this.prevy = this.y;
            this.directionX = this.newDirectionX;
            this.directionY = this.newDirectionY;
            this.x = this.x + (this.width * this.directionX);
            this.y = this.y + (this.height * this.directionY);
            if(this.x >= this.canvasWidth)
                this.x = 0;
            if(this.x < 0)
                this.x = this.canvasWidth-game.cellSize;
            if(this.y >= this.canvasHeight)
                this.y = 0;
            if(this.y < 0)
                this.y = this.canvasHeight-game.cellSize;

            if(List.check(List.start.next, List.start.data.x, List.start.data.y) === 1)
            {
                alert("YOU LOSE! Your score: " + List.size);
                location.reload();
            }

            List.checkFood();
    };
    this.draw = function() {
            this.context.drawImage(this.img, this.x, this.y, game.cellSize, game.cellSize);
    };
} SnakeH.prototype = new SnakePiece();

function SnakeB () {
    var timer = 0;
    this.draw = function() {       
        this.context.drawImage(this.img, this.x, this.y, game.cellSize, game.cellSize);
    };
    this.img = imageRepo.snakeB;
} SnakeB.prototype = new SnakePiece();

function animate() {
    requestAnimFrame( animate );
    var current = List.start;
    var speed = current.data.speed;
    if(KEY_STATUS.space)
        speed = 5;
    timer += 1;
    current.data.move();
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