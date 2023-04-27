var board; // creating our board
var score = 0; // keeping score
var rows = 4; // the board has 4 rows
var columns = 4;  // the board has 4 columns

window.onload = function() {   // when the window loads, the game set up is loaded
  setGame();  
}

function setGame() {  // setGame creates the set up of the game
  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ]
  
  // resetting score -- when restarting game
  score = 0;
  document.getElementById("score").innerText = score;
  
  // adding tiles via loops that iterate through the rows and columns of board
  for (let rowVal = 0; rowVal < rows; rowVal++) {   // iterates through rows
    for (let colVal = 0; colVal < columns; colVal++) {  // iterates through columns 
      let tile = document.createElement("div");   // adding a new <div> tag to add the tiles: <div id="0-0"></div>
      tile.id = rowVal.toString() + "-" + colVal.toString();  // setting coordinates for each tile that correspond to board
      let num = board[rowVal][colVal];   // num is the number value of the tile
      updateTile(tile, num);  
      document.getElementById("board").append(tile);  // adding tile <div> tag to board
    }
  }
  
  // adding two "2" tiles
  setTwo();
  setTwo();
}

// hasEmptyTile() is a helper function for setTwo(): checks whether a tile spot is empty or not
function hasEmptyTile() {
  for (let rowVal = 0; rowVal < rows; rowVal++) {
    for (let colVal = 0; colVal < columns; colVal++) {
      if (board[rowVal][colVal] == 0) {
        return true;
      }
    }
  }
  
  return false;
}

// setTwo() creates two tiles with number 2 and adds them to board
function setTwo() {
  if (!hasEmptyTile()) {
    return; 
  }
  
  let found = false;
  while (!found) {
    // random row and column value to place tiles
    let row = Math.floor(Math.random() * rows);     // random non-decimal number between 0 and 4
    let col = Math.floor(Math.random() * columns);
    
    if (board[row][col] == 0) {
      board[row][col] = 2;
      let tile = document.getElementById(row.toString() + "-" + col.toString());
      tile.innerText = "2";
      tile.classList.add("x2");
      found = true;
    }
  }
}

// updateTile() updates the number and style class
function updateTile(tile, num) {
  tile.innerText = "";  // clearing inner text for updating tiles
  tile.classList.value = "";  // clearing classlist of tile to redefine it
  tile.classList.add("tile");
  if (num > 0) {
    tile.innerText = num;
    if (num <= 4096) {
      tile.classList.add("x" + num.toString());  // applying the correct style class to tile
    } else { // any tile of number greater than 4096 has the same color and style
      tile.classList.add("x8192");
    }
  }
}

// tiles are going to slide in direction of arrow keys
document.addEventListener("keyup", (e) => {  // every slide move, 2 tiles are added
  if (e.code == "ArrowLeft") {
    slideLeft();
    setTwo();
  } else if (e.code == "ArrowRight") {
    slideRight();
    setTwo();
  } else if (e.code == "ArrowUp") {
    slideUp();
    setTwo();
  } else if (e.code == "ArrowDown") {
    slideDown();
    setTwo();
  }
  
  // handling score
  document.getElementById("score").innerText = score;
})

// removes zeroes in a row
function filterZero(row) {
  return row.filter(num => num != 0); // creates a new array without zeroes
}

// resets tiles in a row correctly from a slide
function slide(row) {
  // (i.e) [0, 2, 2, 2]
  row = filterZero(row);  // filtering zeroes of the row -> [2, 2, 2]
  
  // slide tiles
  for (let i = 0; i < row.length-1; i++) {
    // check every 2 tiles since 1 slide combines 2 tiles if same
    if (row[i] == row[i + 1]) {
      row[i] *= 2;
      row[i + 1] = 0;
      score += row[i];
    } // [2, 2, 2] -> [4, 0, 2]
  }
  // filtering zero again to place tiles in correct place
  row = filterZero(row); // [4, 0, 2] -> [4, 2]
  
  // add zeros back in
  while (row.length < columns) {
    row.push(0);
  } // [4, 2, 0, 0]
  
  return row;
}

// sliding left
function slideLeft() {  // handles a slide to left
  for (let rowVal = 0; rowVal < rows; rowVal++) {
    let row = board[rowVal];
    row = slide(row);  // modifies the array, the row, to get a new row
    board[rowVal] = row;  // put the new row back in the board
    
    for (let colVal = 0; colVal < columns; colVal++) {
      let tile = document.getElementById(rowVal.toString() + "-" + colVal.toString());
      let num = board[rowVal][colVal];
      updateTile(tile, num);
    }
  }
}

// sliding right
function slideRight() {  // handles a slide to left
  for (let rowVal = 0; rowVal < rows; rowVal++) {
    let row = board[rowVal];
    row.reverse();  // reversing the row before slide
    row = slide(row);  // modifies the array, the row, to get a new row
    row.reverse();  // reverse row again after slide
    board[rowVal] = row;  // put the new row back in the board
    
    for (let colVal = 0; colVal < columns; colVal++) {
      let tile = document.getElementById(rowVal.toString() + "-" + colVal.toString());
      let num = board[rowVal][colVal];
      updateTile(tile, num);
    }
  }
}

// sliding up --> equivalent to taking column as a row and sliding right
function slideUp() {
  for (let colVal = 0; colVal < columns; colVal++) {
    let row = [board[0][colVal], board[1][colVal], board[2][colVal], board[3][colVal]];
    row = slide(row);
    
//     board[0][colVal] = row[0];
//     board[1][colVal] = row[1];
//     board[2][colVal] = row[2];
//     board[3][colVal] = row[3];
    
    for (let rowVal = 0; rowVal < rows; rowVal++) {
      board[rowVal][colVal] = row[rowVal];
      let tile = document.getElementById(rowVal.toString() + "-" + colVal.toString());
      let num = board[rowVal][colVal];
      updateTile(tile, num);
    }
  }
}

// sliding down: essentially the slideUp function but reverse the row
function slideDown() {
  for (let colVal = 0; colVal < columns; colVal++) {
    let row = [board[0][colVal], board[1][colVal], board[2][colVal], board[3][colVal]];
    row.reverse();
    row = slide(row);
    row.reverse();
    
    for (let rowVal = 0; rowVal < rows; rowVal++) {
      board[rowVal][colVal] = row[rowVal];
      let tile = document.getElementById(rowVal.toString() + "-" + colVal.toString());
      let num = board[rowVal][colVal];
      updateTile(tile, num);
    }
  }
}

// Determining if game is over 
// function gameOver() {
//   for (let rowVal = 0; rowVal < rows; rowVal++) {
//     let currentRow = board[rowVal];
    
//     console.log(rowVal);
    
//     slideLeft();
//     if (currentRow != board[rowVal]) {
//       return false;
//     }
    
//     slideRight();
//     if (currentRow != board[rowVal]) {
//       return false;
//     }
    
//     for (let colVal = 0; colVal < columns; colVal++) {
//       let currentCol = board[rowVal][colVal];
      
//       consol.log(colVal);
      
//       slideUp();
//       if (currentCol != board[rowVal][colVal]) {
//         return false;
//       }
      
//       slideDown();
//       if (currentCol != board[rowVal][colVal]) {
//         return false;
//       }
//     }
//   }
  
//   console.log("true");
//   return true;
// }

function refreshGame() {
  window.location.reload();
}