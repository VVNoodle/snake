/*
TODO:
  Animation
    when get fruit
    when hit wall
    when hit snake
    when pause
  Sound effects
    when fruit
    when hit wall
    when hit snake
*/

// settings
var snakeX = 2;
var snakeY = 2;
var height = 30;
var width = 30;
var interval;
var increment = 1;

// game variables
var length = 0; //snake's length
var tailX = [snakeX];
var tailY = [snakeY];
var fX;
var fY;
var running = false;
var gameOver;
var direction = -1; // up = 0, down = -1, left = 1, right = 2
var int;
var score = 0;
/**
 * entry point of game
 */
function run() {
  init(); //initialize the webpage
  gameLoop(); //runs gameLoop every interval
}

function init() {
  if (!gameOver) {
    createMap();
    createFruit();
  }
  createSnake();
}

/**
  * Generate the map for the snake
  */
function createMap() {
  document.write('<div class="col-md-7 offset-md-2"><table>');
  for (var y = 0; y < height; y++) {
    document.write("<tr>");
    for (var x = 0; x < width; x++) {
      if (x == 0 || x == width - 1 || y == 0 || y == height - 1) {
        document.write("<td class='wall' id='" + x + "-" + y + "'></td>");
      } else {
        document.write("<td class='blank' id='" + x + "-" + y + "'></td>");
      }
    }
    document.write("</tr>");
  }
  document.write("</div></table>");
}

function createSnake() {
  set(snakeX, snakeY, "snake");
}

function get(x, y) {
  return document.getElementById(x + "-" + y);
}

function set(x, y, value) {
  get(x, y).setAttribute("class", value);
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function getType(x, y) {
  return get(x, y).getAttribute("class");
}

function createFruit() {
  var found = false;
  while (!found && length < (width - 2) * (height - 2) + 1) {
    var fruitX = rand(1, width - 1);
    var fruitY = rand(1, height - 1);
    if (getType(fruitX, fruitY) == "blank") found = true;
  }
  set(fruitX, fruitY, "fruit");
  fX = fruitX;
  fY = fruitY;
}

function createObstacle() {
  var found = false;
  while (!found && length < (width - 2) * (height - 2) + 1) {
    var obsX = rand(1, width - 1);
    var obsY = rand(1, height - 1);
    if (getType(obsX, obsY) == "blank") found = true;
  }
  set(obsX, obsY, "wall");
}

function clearObstacle() {
  for (var i = 1; i < width - 1; i++) {
    for (var j = 1; j < height - 1; j++) {
      console.log("halalallals");
      if (getType(i, j) == "wall") {
        set(i, j, "blank");
      }
    }
  }
}

window.addEventListener("keypress", function key(event) {
  // if key is W/w and curent direction isn't down, set direction up
  //87 is uppercase W, 119 is lowercase

  // up = 0, down = -1, left = 1, right = 2
  var key = event.keyCode;
  if (direction != -1 && (key == 87 || key == 119)) {
    direction = 0;
  } else if (direction != 0 && (key == 83 || key == 115)) {
    // if key is S/s, set direction down
    direction = -1;
  } else if (direction != 2 && (key == 65 || key == 97)) {
    // if key is A/a, set direction left
    direction = 1;
  } else if (direction != 1 && (key == 68 || key == 100)) {
    // if key is D/d, set direction right
    direction = 2;
  }
  if (!running) {
    running = true;
    // hide pause sign
    document.getElementById("overlayPause").style.display = "none";
  } else if (key == 32 && gameOver == true) {
    replay();
  } else if (key == 32) {
    // spacebar is pause
    // display pause sign
    document.getElementById("overlayPause").style.display = "inline";
    running = false;
  }
});

function gameLoop() {
  interval = document.getElementById("test").value;
  if (running && !gameOver) {
    update();
  } else if (gameOver) {
    clearTimeout(int);
  }
  //recursive setTimeout so taht we can alter the interval aka speed of the snake while the game is 'running' 
  int = setTimeout(gameLoop, interval);
}

function update() {
  set(fX, fY, "fruit");
  updateTail();
  set(tailX[length], tailY[length], "blank"); //the snake's head will updated...
  if (direction == 0) {
    snakeY--;
  } else if (direction == -1) {
    snakeY++;
  } else if (direction == 1) {
    snakeX--;
  } else if (direction == 2) {
    snakeX++;
  }
  if (stillAlive()) {
    set(snakeX, snakeY, "snake"); //the snake's head gets updated!
    updateFruit();
  }
}

function stillAlive() {
  if (getType(snakeX, snakeY) == "wall" || getType(snakeX, snakeY) == "snake") {
    //set the rightmost bottom block the color of red, meaning lose 
    set(width - 1, height - 1, "lose");
    for (var i = length; i > -1; i--) {
      set(tailX[i], tailY[i], "blank");
    }
    //if highscore is lower than score when player die, then change the highscore to that current score
    if (document.getElementById("hs").innerHTML < score) {
      document.getElementById("hs").innerHTML = score;
    }
    score = 0;
    document.getElementById("score").innerHTML = score;

    //displays the replay button
    document.getElementById("overlay").style.display = "inline";
    gameOver = true;
    console.log("BITCH YOU LOST");
    return false;
  }

  //set the rightmost bottom block the color of yellow, meaning still alive
  set(width - 1, height - 1, "playing");
  return true;
}

function updateFruit() {
  if (fX == snakeX && fY == snakeY) {
    length++; //grow the snake by 1
    score++;
    document.getElementById("score").innerHTML = score;
    createFruit();
    createObstacle();
  }
}

function updateTail() {
  //Makes the snake move one pixel
  for (var i = length; i > 0; i--) {
    tailX[i] = tailX[i - 1];
    tailY[i] = tailY[i - 1];
  }
  tailX[0] = snakeX;
  tailY[0] = snakeY;
}

function replay() {
  document.getElementById("overlay").style.display = "none";
  running = false;
  snakeX = 2;
  snakeY = 2;
  length = 0; //snake's length
  tailX = [snakeX];
  tailY = [snakeY];
  direction = -1; // up = 0, down = -1, left = 1, right = 2
  clearObstacle();
  run();
  gameOver = false;
}

run();
