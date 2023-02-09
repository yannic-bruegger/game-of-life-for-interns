// Unsere Welt

let world;
let isPaused = true;

// Unsere Einstellungen

const canvasSize = 600;
const gridSize = 64;
const cellSize = canvasSize / gridSize;

// Eine Funktion mit dem Namen "setup", die EINMALIG zu Beginn aufgerufen wird.

function setup() {
  createCanvas(600, 600);
  world = createGrid(gridSize);
  noStroke();
  frameRate(10);
}

// Eine Funktion mit dem Namen "draw", die IMMER WIEDER bei jedem Frame aufgerufen wird.

function draw() {
  clear()
  if(!isPaused) world = fate(world);
  world.forEach((row, indexY) => {
    row.forEach((cell, indexX) => {
      noFill();
      if(cell.isAlive) fill('#E6007EFF');
      rect(indexX * cellSize, indexY * cellSize, cellSize, cellSize);
    })
  });
}

function mousePressed() {
  if (!(mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height)) return false;
  let xIndex = Math.round(mouseX / (canvasSize / gridSize));
  let yIndex = Math.round(mouseY / (canvasSize / gridSize));
  world[yIndex][xIndex].isAlive = !world[yIndex][xIndex].isAlive;
  return false;
}

function keyPressed() {
  if (key === ' ') {
    isPaused = !isPaused;
  }
}

// Die Schicksalsfunktion

function fate(world) {
  const newWorld = [];
  world.forEach((row, indexY) => {
    newWorld[indexY] = [];
    row.forEach((cell, indexX) => {
      const newCell = new Cell(cell.isAlive);
      newWorld[indexY][indexX] = newCell;
      const neighbours = 
        world[mod(indexY - 1, gridSize)][mod(indexX, gridSize)].isAlive + // DRÜBER
        world[mod(indexY + 1, gridSize)][mod(indexX, gridSize)].isAlive + // DRUNTER
        world[mod(indexY - 1, gridSize)][mod(indexX - 1, gridSize)].isAlive + // DRÜBER LINKS
        world[mod(indexY - 1, gridSize)][mod(indexX + 1, gridSize)].isAlive + // DRÜBER RECHTS
        world[mod(indexY, gridSize)][mod(indexX - 1, gridSize)].isAlive + // LINKS
        world[mod(indexY, gridSize)][mod(indexX + 1, gridSize)].isAlive + // RECHTS
        world[mod(indexY + 1, gridSize)][mod(indexX - 1, gridSize)].isAlive + // DRUNTER RECHTS
        world[mod(indexY + 1, gridSize)][mod(indexX + 1, gridSize)].isAlive; // DRUNTER RECHTS
      if(cell.isAlive) {
        // if(neighbours < 2) newCell.kill();
        // if(neighbours > 3) newCell.kill();
      } else {
        if(neighbours === 3) newCell.revive();
      }
    });
  });
  return newWorld;
}

// Unsere Helfer

class Cell {
  isAlive = false;

  constructor(bornAlive) {
    this.isAlive = bornAlive;
  }

  kill() {
    this.isAlive = false;
  }

  revive() {
    this.isAlive = true;
  }
}

function createGrid(size) {
  const newGrid = [];
  for(x = 0; x < size; x++) {
    newGrid[x] = [];
    for(y = 0; y < size; y++) {
      newGrid[x][y] = new Cell(false);
    }
  }
  return newGrid;
}

function getRandomCoordinates() {
  return ({x: Math.round(Math.random() * (gridSize - 1)), y: Math.round(Math.random() * (gridSize - 1))});
}

const mod = (n, d) => n < 0 ?  (n * -1) % gridSize : n % gridSize;