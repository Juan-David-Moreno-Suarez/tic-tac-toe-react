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

export default function Board() {
  const n = 4;
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(n * n).fill(null));
  const items = Array(n).fill(null);

  function handleClick(i) {
    if (squares[i]) return;
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    }
    else {
      nextSquares[i] = "O";
    }
    setXIsNext(!xIsNext);
    setSquares(nextSquares);
  }
  return (
    <>
      {
        items.map((_, i) => (<Row n={n} index={i} value={squares.slice(n * i, n * i + n)} onSquareClick={handleClick} />))
      }
    </>
  );
}

function calculateWinner(squares, n) { }
