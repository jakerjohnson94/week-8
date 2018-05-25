"use strict";

const board = {
  mines : 0,
  output: document.getElementById('boardWrapper'),
  width: 0,
  height: 0,
  size: 0,
  grid: [],
  buttons: [],
  offsets: {
    left: [0, -1],
    right: [0, 1],
    top: [-1, 0],
    bottom: [1, 0],
    topRight: [1, 1],    
    topLeft: [-1, 1],    
    bottomRight: [1, -1],    
    bottomLeft: [-1, -1],    
  },

  randomRowInt: function () {
    return Math.round(Math.random(this.height) * (this.height - 1))
  },
  randomColInt: function () {
    return Math.round(Math.random(this.width) * (this.width - 1))
  },

  makeGrid: function (height, width) {
    this.height = height
    this.width = width
    return this.grid = Array(this.height).fill().map((a) => Array(this.width).fill(0))

  },

  drawMines: function (numberOfMines) {
    this.mines = numberOfMines;
    for (let i = 1; i <= this.mines; i++) {
      const randomIndex1 = this.randomRowInt()
      const randomIndex2 = this.randomColInt()
      if (this.grid[randomIndex1][randomIndex2] === 0 && this.grid[randomIndex1][randomIndex2] !== 'X') {
        this.grid[randomIndex1][randomIndex2] = 'X';
      } else if (this.grid[randomIndex1][randomIndex2] === 'X') {
        i--
        console.log('duplicate location')
      }
    }
    console.log('current grid', this.grid);

  },

  drawNumbers: function (rowIndex, colIndex) {
    let counter = 0;
    if (this.grid[rowIndex][colIndex] !== 'X') {
      Object.values(this.offsets).forEach((offset) => {
        const [rowOffset, colOffset] = offset;
        const row = this.grid[rowIndex + rowOffset];
        if (row) {
          const cell = row[colIndex + colOffset];
          if (cell === "X") counter++
        }
      })

      this.grid[rowIndex][colIndex] = counter;
    }

  },

  revealCellIfNotMine: function (rowIndex, columnIndex) {
    const rowOfButtons = this.buttons[rowIndex]
    const button = rowOfButtons && rowOfButtons[columnIndex]
    if (button && !button.dataset.isMine) button.style.visibility = 'hidden'
  },

  revealNumbers: function (clickedRowIndex, clickedColumnIndex) {
    let q = []
    q.push([clickedRowIndex, clickedColumnIndex])
    //console.log('THIS Q:', q);
    while (q.length) {
      const [thisRowIndex, thisColumnIndex] = q.shift();
      this.revealCellIfNotMine(thisRowIndex, thisColumnIndex)

      Object.values(this.offsets).forEach((offset) => {
        const [rowOffset, colOffset] = offset;
        const neighborRowIndex = Number(thisRowIndex) + rowOffset
        const neighborColumnIndex = Number(thisColumnIndex) + colOffset

        if (this.grid[neighborRowIndex] && this.buttons[neighborRowIndex][neighborColumnIndex]  && this.buttons[neighborRowIndex][neighborColumnIndex].style.visibility !== "hidden" && this.grid[thisRowIndex][thisColumnIndex] === 0) {
          if(this.grid[neighborRowIndex][neighborColumnIndex] === 0){
          q.push([neighborRowIndex, neighborColumnIndex])
          } if(this.grid[neighborRowIndex][neighborColumnIndex] !== 0 ){
            this.revealCellIfNotMine(neighborRowIndex, neighborColumnIndex)
          }
        }
      })
    }
  },

  drawBoard: function () {
    for (let r = 0; r < this.height; r++) {
      const rowDiv = document.createElement('div');
      rowDiv.classList.add('row')
      board.output.appendChild(rowDiv)
      this.buttons.push([])
      for (let c = 0; c < board.grid[r].length; c++) {
        this.drawNumbers(r, c)
        const cellDiv = document.createElement('div');
        const button = document.createElement('button');
        this.buttons[r].push(button);

        cellDiv.classList.add('cell')
        button.classList.add('button')
        button.dataset.rowIndex = r
        button.dataset.columnIndex = c
        if (this.grid[r][c] === 'X') button.dataset.isMine = 1
        rowDiv.appendChild(cellDiv)
        const textContentSpanElement = document.createElement('span')
        textContentSpanElement.textContent = board.grid[r][c]
        cellDiv.classList.add('cell-type-'+ textContentSpanElement.textContent)
        cellDiv.appendChild(textContentSpanElement)
        cellDiv.appendChild(button)
      }
    }
  },

  clearBoard: function(){
   // const losingAudio = document.getElementById('losingAudio');
    for (let btn of buttons) {
      if(btn.dataset.isMine) {btn.style.visibility = 'hidden'
    }

    }
    outDiv.style.visibility = 'visible'
    //losingAudio.play();
    return;
  }
}



board.makeGrid(9, 12)
board.drawMines(20);
board.drawBoard();

const game = {
  clickCounter: 0,
  timer: 0,

  handleClick: function (event) {
  
    let clickedCellButton = event.currentTarget
    let rowIndex = Number(clickedCellButton.dataset.rowIndex)
    let columnIndex = Number(clickedCellButton.dataset.columnIndex)

    if (board.grid[rowIndex][columnIndex] === 'X') {
     board.clearBoard()
    } else {
      board.revealNumbers(rowIndex, columnIndex)
     
    }

  },

  checkWinner: function (currentButton){
    if(currentButton.classList.contains('rightClicked') && currentButton.parentElement.classList.contains('cell-type-X')){
      game.clickCounter += 1;
    }else if(!currentButton.classList.contains('rightClicked') && currentButton.parentElement.classList.contains('cell-type-X')){
      game.clickCounter -= 1;
    }
    if (game.clickCounter === board.mines){
      outDiv.firstElementChild.textContent = 'You Win'
      outDiv.style.visibility = 'visible'
    }

  }


}
const outDiv = document.querySelector('#output')
const buttons = document.querySelectorAll('.button')
for (let btn of buttons) {
  btn.addEventListener('click', game.handleClick)
  btn.addEventListener('contextmenu', function(event) {
    btn.classList.toggle('rightClicked')
    event.preventDefault();
    game.checkWinner(btn);
    console.log(game.clickCounter)
    return false;
}, false);
}