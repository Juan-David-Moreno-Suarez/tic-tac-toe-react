import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

function Board({ xIsNext, squares, onPlay, n, player1, player2 }) {
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
  const isDraw = !winner && squares.every(square => square !== null);
  let status;
  if (winner) {
    status = "Ganador: " + (winner == "X"? player1 : player2);
  } else if (isDraw) {
  status = "Empate 🤝";}
  else {
    status = "Turno actual: " + (xIsNext ? player1 + " (X)" : player2 + " (O)");
  }

  useEffect(() => {
    if (!winner) {
      toast.info(
        "Turno de " + (xIsNext ? `${player1} (X)` : `${player2} (O)`),
        {
          position: "top-center",
          autoClose: 500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          theme: "dark",
          toastId: "turn-toast",
        }
      );
    } if (isDraw) {
    toast.info(
      "¡La partida terminó en empate! 🤝",
      {
        position: "top-center",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        theme: "dark",
        toastId: "draw-toast",
      }
    );
  }else {
        toast.success(
          `¡Felicitaciones ${winner == "X"? player1 : player2}, has ganado!`,
          {
            position: "top-center",
            autoClose: 2500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            theme: "dark",
            toastId: "turn-toast",
          }
        );
      }
  }, [xIsNext, winner, player1, player2]);

  return (
    <>
      <section className="status">{status}</section>
      {
        items.map((_, i) => (<Row n={n} index={i} value={squares.slice(n * i, n * i + n)} onSquareClick={handleClick} />))
      }
    </>
  );
}

function Menu({ setN, setPlayer1, setPlayer2, handleReady }) {

  const [len, setLen] = useState(3);
  const [p1, setP1] = useState("")
  const [p2, setP2] = useState("");

  function handleStart() {
    if (Number(len) > 1 && p1 && p2) {
      setN(Number(len));
      setPlayer1(p1);
      setPlayer2(p2);
      handleReady()
    } else {
      if (!p1 || !p2) toast.error("Debes ingresar los jugadores", {
        position: "top-center",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        theme: "dark",
      });
      else if (Number(len) <= 1) toast.error("Debes ingresar un tamaño de 3 o más", {
        position: "top-center",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        theme: "dark",
      });
    }
  }

  return (
    <main>
      <h1>Tic-Tac-Toe</h1>
      <h3>Tamaño del tablero</h3>
      <input value={len} onChange={(e) => setLen(e.target.value)} />
      <h3>Nombre del jugador X</h3>
      <input value={p1} onChange={(e) => setP1(e.target.value)} />
      <h3>Nombre del jugador O</h3>
      <input value={p2} onChange={(e) => setP2(e.target.value)} />
      <button onClick={handleStart}>Jugar</button>
    </main>
  )
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
  const [n, setN] = useState(3);
  const [player1, setPlayer1] = useState("")
  const [player2, setPlayer2] = useState("");
  const [history, setHistory] = useState([Array(n * n).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const [isReady, setIsReady] = useState(false);
  const turnCount = currentMove;
  function handleReset() {
    setHistory([Array(n * n).fill(null)]);
    setCurrentMove(0);
  }
  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((_, move) => {
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
  if (isReady) {
    return (
      <>
        <main className="game">
          <section className="game-board">
            <p className="turn-counter">Turnos jugados: {turnCount}</p>
            <button className="reset-btn" onClick={handleReset}>
              Reiniciar partida
            </button>
            <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} n={n} player1={player1} player2={player2} />
          </section>
          <section className="game-info">
            <ol>{moves}</ol>
          </section>
        </main>
        <ToastContainer/>
      </>
    );
  } else {
    return <>
      <Menu setN={setN} setPlayer1={setPlayer1} setPlayer2={setPlayer2} handleReady={() => setIsReady(true)} />
      <ToastContainer />
    </>
  }
}
