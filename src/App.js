import { useState } from "react";

function Square({ value, onSquareClick }) {

  return <button
    className="square"
    onClick={onSquareClick}
  >
    {value}
  </button>
}

function Row({ n, index, value, onSquareClick }) {
  const items = Array.from({ length: n });
  return (
    <section className="board-row">
      {
        items.map((_, i) => (<Square className="square" value={value[i]} onSquareClick={() => onSquareClick(n * index + i)} />))
      }
    </section>
  );
}

function Board({ xIsNext, squares, onPlay, n }) {
  const items = Array(n).fill(null);

  function handleClick(i) {
    if (squares[i] || calculateWinner(squares, n)) return;
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    }
    else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares, n);
  let status;
  if (winner) {
    status = "Ganador: " + winner;
  } else {
    status = "Siguiente Jugador: " + (xIsNext ? "X" : "O");
  }

  return (
    <>
      <section className="status">{status}</section>
      {
        items.map((_, i) => (<Row n={n} index={i} value={squares.slice(n * i, n * i + n)} onSquareClick={handleClick} />))
      }
    </>
  );
}

function calculateWinner(squares, n) {
  //! Revisión de columnas
  for (let col = 0; col < n; col++) {
    if (!squares[col]) continue
    let consCol = true;
    for (let row = 1; row < n; row++) {
      if (squares[col] !== squares[col + n * row]) {
        consCol = false;
        break;
      }
    }
    if (consCol) return squares[col];
  }

  //! Revisión de filas
  for (let row = 0; row < n; row++) {
    if (!squares[row * n]) continue
    let consRow = true;
    for (let col = 1; col < n; col++) {
      if (squares[row * n] !== squares[row * n + col]) {
        consRow = false;
        break;
      }
    }
    if (consRow) return squares[row * n];
  }
  //! Revisión de diagonales
  //? Diagonal principal
  if (squares[0]) {
    let consDiag1 = true;
    for (let row = 1; row < n; row++) {
      if (squares[0] !== squares[n * row + row]) {
        consDiag1 = false;
        break;
      }
    }
    if (consDiag1) return squares[0];
  }
  //? Diagonal secundaria
  if (squares[n - 1]) {
    let consDiag2 = true;
    for (let row = 1; row < n; row++) {
      if (squares[n - 1] !== squares[n - 1 + n * row - row]) {
        consDiag2 = false;
        break;
      }
    }
    if (consDiag2) return squares[n - 1];
  }
  //!Si nada se cumple
  return null;
}

export default function Game() {
  const n = 4;
  const [history, setHistory] = useState([Array(n * n).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Ir al movimiento #' + move
    } else {
      description = 'Ir al inicio del juego';
    }

    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <main className="game">
      <section className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} n={n} />
      </section>
      <section className="game-info">
        <ol>{moves}</ol>
      </section>
    </main>
  )
}
