/*
TODO:
  Replay option after game finishes
    when win
  Animation
    when get fruit
    when hit wall
    when hit snake
    when pause
  Menu option
    Settings
    volume
    home
  Sound effects
    when fruit
    when hit wall
    when hit snake
  BG music
*/

// settings
var snakeX = 2;
var snakeY = 2;
var height = 30;
var width = 30;
var interval = 100;
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

/**
 * entry point of game
 */
function run() {
  init(); //initialize the webpage
  int = setInterval(gameLoop, interval); //runs gameLoop every interval
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
  document.write("<table>");
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
  document.write("</table>");
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

window.addEventListener("keypress", function key(event) {
  // if key is W/w and curent direction isn't down, set direction up
  //87 is uppercase W, 119 is lowercase
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
  } else if (key == 32) {
    // spacebar is pause
    // display pause sign
    document.getElementById("overlayPause").style.display = "inline";
    running = false;
  }
});

function gameLoop() {
  if (running && !gameOver) {
    update();
  } else if (gameOver) {
    clearInterval(int);
  }
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
    set(width - 1, height - 1, "lose");
    for (var i = length; i > -1; i--) {
      set(tailX[i], tailY[i], "blank");
    }
    document.getElementById("overlay").style.display = "inline";
    gameOver = true;
    console.log("BITCH YOU LOST");
    return false;
  }
  set(width - 1, height - 1, "playing");
  return true;
}

function updateFruit() {
  if (fX == snakeX && fY == snakeY) {
    length++; //grow the snake by 1
    createFruit();
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
  console.log("test");
  document.getElementById("overlay").style.display = "none";
  running = false;
  snakeX = 2;
  snakeY = 2;
  length = 0; //snake's length
  tailX = [snakeX];
  tailY = [snakeY];
  direction = -1; // up = 0, down = -1, left = 1, right = 2
  run();
  gameOver = false;
}

run();