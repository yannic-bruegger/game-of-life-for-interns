// Unsere Welt

let world;

// Unsere Einstellungen

let isPaused = true;
const canvasSize = 600;
const gridSize = 128;
const cellSize = canvasSize / gridSize;

// Eine Funktion mit dem Namen "setup", die EINMALIG zu Beginn aufgerufen wird.

function setup() {
  createCanvas(canvasSize, canvasSize);
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
      // Für jede Zelle soll folgendes ausgeführt werden:
      const newCell = new Cell(cell.isAlive);
      
      const livingNeighbours = 
        world[mod(indexY - 1, gridSize)][mod(indexX, gridSize)].isAlive + // DRÜBER
        world[mod(indexY + 1, gridSize)][mod(indexX, gridSize)].isAlive + // DRUNTER
        world[mod(indexY - 1, gridSize)][mod(indexX - 1, gridSize)].isAlive + // DRÜBER LINKS
        world[mod(indexY - 1, gridSize)][mod(indexX + 1, gridSize)].isAlive + // DRÜBER RECHTS
        world[mod(indexY, gridSize)][mod(indexX - 1, gridSize)].isAlive + // LINKS
        world[mod(indexY, gridSize)][mod(indexX + 1, gridSize)].isAlive + // RECHTS
        world[mod(indexY + 1, gridSize)][mod(indexX - 1, gridSize)].isAlive + // DRUNTER LINKS
        world[mod(indexY + 1, gridSize)][mod(indexX + 1, gridSize)].isAlive; // DRUNTER RECHTS

      if(cell.isAlive) {
        if(livingNeighbours < 2) newCell.kill();
        if(livingNeighbours > 3) newCell.kill();
      }

      if(!cell.isAlive) {
        if(livingNeighbours === 3) newCell.revive();
      }

      newWorld[indexY][indexX] = newCell;
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
      newGrid[x][y] = new Cell(Math.random() > 0.9);
    }
  }
  return newGrid;
}

function getRandomCoordinates() {
  return ({x: Math.round(Math.random() * (gridSize - 1)), y: Math.round(Math.random() * (gridSize - 1))});
}

const mod = (n, d) => n < 0 ?  (n * -1) % gridSize : n % gridSize;