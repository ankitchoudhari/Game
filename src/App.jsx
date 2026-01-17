import React, { useState, useEffect, useCallback } from 'react';
import { RotateCcw, Clock, ChevronLeft } from 'lucide-react';

const POKEMON_PIECES = {
  'K': { name: 'Pikachu King', pokemon: 'Pikachu', piece: '♔', color: '#FFD700' },
  'Q': { name: 'Dragonite Queen', pokemon: 'Dragonite', piece: '♕', color: '#FF8C00' },
  'R': { name: 'Charizard Rook', pokemon: 'Charizard', piece: '♖', color: '#FF4500' },
  'B': { name: 'Alakazam Bishop', pokemon: 'Alakazam', piece: '♗', color: '#9370DB' },
  'N': { name: 'Rapidash Knight', pokemon: 'Rapidash', piece: '♘', color: '#FF69B4' },
  'P': { name: 'Bulbasaur Pawn', pokemon: 'Bulbasaur', piece: '♙', color: '#90EE90' },
  'k': { name: 'Mewtwo King', pokemon: 'Mewtwo', piece: '♚', color: '#9370DB' },
  'q': { name: 'Gyarados Queen', pokemon: 'Gyarados', piece: '♛', color: '#4169E1' },
  'r': { name: 'Blastoise Rook', pokemon: 'Blastoise', piece: '♜', color: '#1E90FF' },
  'b': { name: 'Gengar Bishop', pokemon: 'Gengar', piece: '♝', color: '#8B008B' },
  'n': { name: 'Ponyta Knight', pokemon: 'Ponyta', piece: '♞', color: '#FFA07A' },
  'p': { name: 'Squirtle Pawn', pokemon: 'Squirtle', piece: '♟', color: '#87CEEB' }
};

const INITIAL_BOARD = [
  ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
  ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
  ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
];

const PokemonChess = () => {
  const [board, setBoard] = useState(JSON.parse(JSON.stringify(INITIAL_BOARD)));
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState('white');
  const [moveHistory, setMoveHistory] = useState([]);
  const [gameStatus, setGameStatus] = useState('playing');
  const [difficulty, setDifficulty] = useState('medium');
  const [whiteTime, setWhiteTime] = useState(600);
  const [blackTime, setBlackTime] = useState(600);
  const [timerActive, setTimerActive] = useState(true);
  const [validMoves, setValidMoves] = useState([]);

  useEffect(() => {
    if (!timerActive || gameStatus !== 'playing') return;
    
    const timer = setInterval(() => {
      if (currentPlayer === 'white') {
        setWhiteTime(prev => {
          if (prev <= 1) {
            setGameStatus('black_wins_time');
            setTimerActive(false);
            return 0;
          }
          return prev - 1;
        });
      } else {
        setBlackTime(prev => {
          if (prev <= 1) {
            setGameStatus('white_wins_time');
            setTimerActive(false);
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [currentPlayer, timerActive, gameStatus]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isWhitePiece = (piece) => piece && piece === piece.toUpperCase();
  const isBlackPiece = (piece) => piece && piece === piece.toLowerCase();

  const getValidMoves = (row, col, boardState = board) => {
    const piece = boardState[row][col];
    if (!piece) return [];

    const moves = [];
    const isWhite = isWhitePiece(piece);
    const pieceType = piece.toUpperCase();

    const addMove = (r, c) => {
      if (r >= 0 && r < 8 && c >= 0 && c < 8) {
        const targetPiece = boardState[r][c];
        if (!targetPiece || (isWhite ? isBlackPiece(targetPiece) : isWhitePiece(targetPiece))) {
          moves.push([r, c]);
          return !targetPiece;
        }
      }
      return false;
    };

    if (pieceType === 'P') {
      const direction = isWhite ? -1 : 1;
      const startRow = isWhite ? 6 : 1;
      
      if (!boardState[row + direction]?.[col]) {
        addMove(row + direction, col);
        if (row === startRow && !boardState[row + 2 * direction]?.[col]) {
          addMove(row + 2 * direction, col);
        }
      }
      
      [-1, 1].forEach(dc => {
        const target = boardState[row + direction]?.[col + dc];
        if (target && (isWhite ? isBlackPiece(target) : isWhitePiece(target))) {
          addMove(row + direction, col + dc);
        }
      });
    } else if (pieceType === 'N') {
      [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]].forEach(([dr, dc]) => {
        addMove(row + dr, col + dc);
      });
    } else if (pieceType === 'B') {
      [[-1,-1],[-1,1],[1,-1],[1,1]].forEach(([dr, dc]) => {
        for (let i = 1; i < 8; i++) {
          if (!addMove(row + dr * i, col + dc * i)) break;
        }
      });
    } else if (pieceType === 'R') {
      [[-1,0],[1,0],[0,-1],[0,1]].forEach(([dr, dc]) => {
        for (let i = 1; i < 8; i++) {
          if (!addMove(row + dr * i, col + dc * i)) break;
        }
      });
    } else if (pieceType === 'Q') {
      [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]].forEach(([dr, dc]) => {
        for (let i = 1; i < 8; i++) {
          if (!addMove(row + dr * i, col + dc * i)) break;
        }
      });
    } else if (pieceType === 'K') {
      [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]].forEach(([dr, dc]) => {
        addMove(row + dr, col + dc);
      });
    }

    return moves;
  };

  const isInCheck = (boardState, isWhiteKing) => {
    let kingPos = null;
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = boardState[r][c];
        if (piece === (isWhiteKing ? 'K' : 'k')) {
          kingPos = [r, c];
          break;
        }
      }
      if (kingPos) break;
    }

    if (!kingPos) return false;

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = boardState[r][c];
        if (piece && (isWhiteKing ? isBlackPiece(piece) : isWhitePiece(piece))) {
          const moves = getValidMoves(r, c, boardState);
          if (moves.some(([mr, mc]) => mr === kingPos[0] && mc === kingPos[1])) {
            return true;
          }
        }
      }
    }
    return false;
  };

  const makeComputerMove = useCallback(() => {
    const possibleMoves = [];
    
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = board[r][c];
        if (piece && isBlackPiece(piece)) {
          const moves = getValidMoves(r, c);
          moves.forEach(([tr, tc]) => {
            const newBoard = JSON.parse(JSON.stringify(board));
            newBoard[tr][tc] = newBoard[r][c];
            newBoard[r][c] = null;
            
            if (!isInCheck(newBoard, false)) {
              const captureValue = board[tr][tc] ? 
                ({'P':1,'N':3,'B':3,'R':5,'Q':9,'K':100}[board[tr][tc].toUpperCase()] || 0) : 0;
              possibleMoves.push({
                from: [r, c],
                to: [tr, tc],
                value: captureValue + Math.random() * 0.1
              });
            }
          });
        }
      }
    }

    if (possibleMoves.length === 0) {
      setGameStatus('white_wins');
      setTimerActive(false);
      return;
    }

    let chosenMove;
    if (difficulty === 'easy') {
      chosenMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
    } else if (difficulty === 'medium') {
      possibleMoves.sort((a, b) => b.value - a.value);
      const topMoves = possibleMoves.slice(0, Math.min(5, possibleMoves.length));
      chosenMove = topMoves[Math.floor(Math.random() * topMoves.length)];
    } else {
      possibleMoves.sort((a, b) => b.value - a.value);
      chosenMove = possibleMoves[0];
    }

    const [fromR, fromC] = chosenMove.from;
    const [toR, toC] = chosenMove.to;
    
    const newBoard = JSON.parse(JSON.stringify(board));
    const piece = newBoard[fromR][fromC];
    newBoard[toR][toC] = piece;
    newBoard[fromR][fromC] = null;

    setMoveHistory(prev => [...prev, { board: JSON.parse(JSON.stringify(board)), player: 'black' }]);
    setBoard(newBoard);
    setCurrentPlayer('white');

    if (isInCheck(newBoard, true)) {
      const hasValidMoves = checkForValidMoves(newBoard, true);
      if (!hasValidMoves) {
        setGameStatus('black_wins');
        setTimerActive(false);
      }
    }
  }, [board, difficulty, getValidMoves, isInCheck, checkForValidMoves]);

  const checkForValidMoves = (boardState, isWhite) => {
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = boardState[r][c];
        if (piece && (isWhite ? isWhitePiece(piece) : isBlackPiece(piece))) {
          const moves = getValidMoves(r, c, boardState);
          for (const [tr, tc] of moves) {
            const testBoard = JSON.parse(JSON.stringify(boardState));
            testBoard[tr][tc] = testBoard[r][c];
            testBoard[r][c] = null;
            if (!isInCheck(testBoard, isWhite)) {
              return true;
            }
          }
        }
      }
    }
    return false;
  };

  useEffect(() => {
    if (currentPlayer === 'black' && gameStatus === 'playing') {
      const timeout = setTimeout(() => makeComputerMove(), 500);
      return () => clearTimeout(timeout);
    }
  }, [currentPlayer, gameStatus, makeComputerMove]);

  const handleSquareClick = (row, col) => {
    if (gameStatus !== 'playing' || currentPlayer !== 'white') return;

    const piece = board[row][col];

    if (selectedSquare) {
      const [selectedRow, selectedCol] = selectedSquare;
      const isValidMove = validMoves.some(([r, c]) => r === row && c === col);

      if (isValidMove) {
        const newBoard = JSON.parse(JSON.stringify(board));
        newBoard[row][col] = newBoard[selectedRow][selectedCol];
        newBoard[selectedRow][selectedCol] = null;

        if (!isInCheck(newBoard, true)) {
          setMoveHistory(prev => [...prev, { board: JSON.parse(JSON.stringify(board)), player: 'white' }]);
          setBoard(newBoard);
          setCurrentPlayer('black');
          setSelectedSquare(null);
          setValidMoves([]);

          if (isInCheck(newBoard, false)) {
            const hasValidMoves = checkForValidMoves(newBoard, false);
            if (!hasValidMoves) {
              setGameStatus('white_wins');
              setTimerActive(false);
            }
          }
        } else {
          setSelectedSquare(null);
          setValidMoves([]);
        }
      } else if (piece && isWhitePiece(piece)) {
        const moves = getValidMoves(row, col);
        setSelectedSquare([row, col]);
        setValidMoves(moves);
      } else {
        setSelectedSquare(null);
        setValidMoves([]);
      }
    } else if (piece && isWhitePiece(piece)) {
      const moves = getValidMoves(row, col);
      setSelectedSquare([row, col]);
      setValidMoves(moves);
    }
  };

  const undoMove = () => {
    if (moveHistory.length < 2) return;
    
    const newHistory = [...moveHistory];
    newHistory.pop();
    newHistory.pop();
    
    const lastState = newHistory[newHistory.length - 1];
    setBoard(lastState ? lastState.board : JSON.parse(JSON.stringify(INITIAL_BOARD)));
    setMoveHistory(newHistory);
    setCurrentPlayer('white');
    setSelectedSquare(null);
    setValidMoves([]);
    
    if (gameStatus !== 'playing') {
      setGameStatus('playing');
      setTimerActive(true);
    }
  };

  const resetGame = () => {
    setBoard(JSON.parse(JSON.stringify(INITIAL_BOARD)));
    setSelectedSquare(null);
    setCurrentPlayer('white');
    setMoveHistory([]);
    setGameStatus('playing');
    setWhiteTime(600);
    setBlackTime(600);
    setTimerActive(true);
    setValidMoves([]);
  };

  const renderPiece = (piece) => {
    if (!piece) return null;
    const pokemon = POKEMON_PIECES[piece];
    const isWhite = isWhitePiece(piece);
    
    return (
      <div className="flex flex-col items-center justify-center h-full relative">
        <span 
          className="text-5xl drop-shadow-lg transition-transform hover:scale-110"
          style={{ 
            color: isWhite ? '#3B82F6' : '#1F2937',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
          }}
        >
          {pokemon.piece}
        </span>
        <div className="absolute -bottom-1 bg-black/70 px-2 py-0.5 rounded text-xs font-bold" style={{ color: pokemon.color }}>
          {pokemon.pokemon}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400">
          Pokemon Chess Battle
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2 bg-purple-500/30 px-4 py-2 rounded-lg border-2 border-purple-400">
                  <Clock className="text-purple-300" size={20} />
                  <span className="text-white font-bold text-lg">{formatTime(blackTime)}</span>
                  <span className="text-purple-200 text-sm font-semibold">Computer</span>
                </div>
                {gameStatus !== 'playing' && (
                  <div className="bg-yellow-400 px-6 py-3 rounded-lg font-bold text-black text-lg shadow-lg animate-pulse">
                    {gameStatus === 'white_wins' && '🎉 You Win!'}
                    {gameStatus === 'black_wins' && '💪 Computer Wins!'}
                    {gameStatus === 'white_wins_time' && '⏰ You Win by Time!'}
                    {gameStatus === 'black_wins_time' && '⏰ Computer Wins by Time!'}
                  </div>
                )}
              </div>

              <div className="inline-block border-8 border-yellow-600 rounded-xl overflow-hidden shadow-2xl bg-gradient-to-br from-amber-800 to-yellow-900">
                {board.map((row, rowIndex) => (
                  <div key={rowIndex} className="flex">
                    {row.map((piece, colIndex) => {
                      const isLight = (rowIndex + colIndex) % 2 === 0;
                      const isSelected = selectedSquare && selectedSquare[0] === rowIndex && selectedSquare[1] === colIndex;
                      const isValidMove = validMoves.some(([r, c]) => r === rowIndex && c === colIndex);
                      
                      return (
                        <div
                          key={`${rowIndex}-${colIndex}`}
                          onClick={() => handleSquareClick(rowIndex, colIndex)}
                          className={`w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center cursor-pointer transition-all relative
                            ${isLight ? 'bg-amber-50' : 'bg-green-800'}
                            ${isSelected ? 'ring-8 ring-yellow-400 ring-inset z-10' : ''}
                            ${isValidMove ? 'ring-8 ring-blue-400 ring-inset' : ''}
                            hover:brightness-110 hover:scale-105`}
                        >
                          {isValidMove && !piece && (
                            <div className="absolute w-4 h-4 bg-blue-400 rounded-full opacity-60"></div>
                          )}
                          {renderPiece(piece)}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 bg-blue-500/30 px-4 py-2 rounded-lg mt-4 border-2 border-blue-400">
                <Clock className="text-blue-300" size={20} />
                <span className="text-white font-bold text-lg">{formatTime(whiteTime)}</span>
                <span className="text-blue-200 text-sm font-semibold">You (Player)</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border-2 border-white/20">
              <h2 className="text-2xl font-bold text-white mb-4">⚙️ Game Controls</h2>
              
              <div className="space-y-3">
                <div>
                  <label className="text-white text-sm mb-2 block font-semibold">🎮 Difficulty Level</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    disabled={moveHistory.length > 0}
                    className="w-full bg-white/20 text-white rounded-lg px-4 py-3 border-2 border-white/30 font-semibold text-lg"
                  >
                    <option value="easy">😊 Easy</option>
                    <option value="medium">🤔 Medium</option>
                    <option value="hard">😈 Hard</option>
                  </select>
                </div>

                <button
                  onClick={undoMove}
                  disabled={moveHistory.length < 2}
                  className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 disabled:opacity-50 text-white font-bold py-4 px-4 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg text-lg"
                >
                  <ChevronLeft size={24} />
                  Take Back Move
                </button>

                <button
                  onClick={resetGame}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-4 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg text-lg"
                >
                  <RotateCcw size={24} />
                  New Game
                </button>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border-2 border-white/20">
              <h2 className="text-2xl font-bold text-white mb-4">📜 Move History</h2>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {moveHistory.length === 0 ? (
                  <p className="text-white/60 text-sm italic">No moves yet - start playing!</p>
                ) : (
                  moveHistory.map((move, index) => (
                    <div key={index} className="text-white text-sm bg-white/10 px-3 py-2 rounded border border-white/20 font-semibold">
                      Move {index + 1}: {move.player === 'white' ? '🔵 You' : '🟣 Computer'}
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-400/20 to-pink-400/20 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border-2 border-yellow-400/50">
              <h2 className="text-xl font-bold text-white mb-3">🎯 Pokemon Chess Pieces</h2>
              <div className="space-y-2 text-sm text-white">
                <div className="flex justify-between items-center bg-white/10 px-3 py-2 rounded">
                  <span className="font-semibold">♔ King</span>
                  <span>Pikachu / Mewtwo</span>
                </div>
                <div className="flex justify-between items-center bg-white/10 px-3 py-2 rounded">
                  <span className="font-semibold">♕ Queen</span>
                  <span>Dragonite / Gyarados</span>
                </div>
                <div className="flex justify-between items-center bg-white/10 px-3 py-2 rounded">
                  <span className="font-semibold">♖ Rook</span>
                  <span>Charizard / Blastoise</span>
                </div>
                <div className="flex justify-between items-center bg-white/10 px-3 py-2 rounded">
                  <span className="font-semibold">♗ Bishop</span>
                  <span>Alakazam / Gengar</span>
                </div>
                <div className="flex justify-between items-center bg-white/10 px-3 py-2 rounded">
                  <span className="font-semibold">♘ Knight</span>
                  <span>Rapidash / Ponyta</span>
                </div>
                <div className="flex justify-between items-center bg-white/10 px-3 py-2 rounded">
                  <span className="font-semibold">♙ Pawn</span>
                  <span>Bulbasaur / Squirtle</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokemonChess;
