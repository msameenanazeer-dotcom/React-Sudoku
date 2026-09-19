import React, { useState } from "react";

const puzzles = [
  [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9]
  ]
];

function copyBoard(board) {
  return board.map(row => [...row]);
}

function isValid(board, row, col, num) {
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === num) return false;
    if (board[i][col] === num) return false;
  }

  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;

  for (let r = startRow; r < startRow + 3; r++) {
    for (let c = startCol; c < startCol + 3; c++) {
      if (board[r][c] === num) return false;
    }
  }

  return true;
}

function solveSudoku(board) {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        for (let num = 1; num <= 9; num++) {
          if (isValid(board, row, col, num)) {
            board[row][col] = num;

            if (solveSudoku(board)) {
              return true;
            }

            board[row][col] = 0;
          }
        }

        return false;
      }
    }
  }

  return true;
}

function App() {
  const [originalBoard, setOriginalBoard] = useState(
    copyBoard(puzzles[0])
  );

  const [board, setBoard] = useState(copyBoard(puzzles[0]));
  const [message, setMessage] = useState("");

  const handleChange = (row, col, value) => {
    if (originalBoard[row][col] !== 0) return;

    if (value === "" || /^[1-9]$/.test(value)) {
      const newBoard = copyBoard(board);
      newBoard[row][col] = value === "" ? 0 : Number(value);
      setBoard(newBoard);
      setMessage("");
    }
  };

  const checkSolution = () => {
    const testBoard = copyBoard(board);

    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (testBoard[row][col] === 0) {
          setMessage("⚠️ Please fill all cells.");
          return;
        }
      }
    }

    const solvedBoard = copyBoard(originalBoard);

    if (!solveSudoku(solvedBoard)) {
      setMessage("❌ Invalid Sudoku puzzle.");
      return;
    }

    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (testBoard[row][col] !== solvedBoard[row][col]) {
          setMessage("❌ Some answers are incorrect.");
          return;
        }
      }
    }

    setMessage("🎉 Congratulations! Sudoku solved correctly!");
  };

  const solveGame = () => {
    const solvedBoard = copyBoard(originalBoard);

    if (solveSudoku(solvedBoard)) {
      setBoard(solvedBoard);
      setMessage("✅ Sudoku solved!");
    }
  };

  const resetGame = () => {
    setBoard(copyBoard(originalBoard));
    setMessage("");
  };

  const newGame = () => {
    const puzzle = copyBoard(puzzles[0]);

    setOriginalBoard(puzzle);
    setBoard(copyBoard(puzzle));
    setMessage("");
  };

  return (
    <div className="app">
      <div className="container">
        <h1>🧩 Sudoku</h1>

        <p className="subtitle">
          Fill every row, column, and 3×3 box with numbers 1–9.
        </p>

        <div className="sudoku-board">
          {board.map((row, rowIndex) =>
            row.map((value, colIndex) => {
              const fixed = originalBoard[rowIndex][colIndex] !== 0;

              return (
                <input
                  key={`${rowIndex}-${colIndex}`}
                  className={`cell
                    ${fixed ? "fixed" : ""}
                    ${colIndex % 3 === 2 && colIndex !== 8 ? "right-border" : ""}
                    ${rowIndex % 3 === 2 && rowIndex !== 8 ? "bottom-border" : ""}
                  `}
                  type="text"
                  maxLength="1"
                  value={value === 0 ? "" : value}
                  disabled={fixed}
                  onChange={(e) =>
                    handleChange(rowIndex, colIndex, e.target.value)
                  }
                />
              );
            })
          )}
        </div>

        <div className="buttons">
          <button onClick={checkSolution}>Check</button>
          <button onClick={solveGame}>Solve</button>
          <button onClick={resetGame}>Reset</button>
          <button onClick={newGame}>New Game</button>
        </div>

        {message && <div className="message">{message}</div>}
      </div>
    </div>
  );
}

export default App;
