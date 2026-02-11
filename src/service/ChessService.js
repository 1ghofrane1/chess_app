import { Chess } from 'chess.js';

// Map chess.js piece codes to Unicode symbols
const PIECE_SYMBOLS = {
  // White pieces
  'K': '♔', 'Q': '♕', 'R': '♖', 'B': '♗', 'N': '♘', 'P': '♙',
  // Black pieces
  'k': '♚', 'q': '♛', 'r': '♜', 'b': '♝', 'n': '♞', 'p': '♟',
};

// Convert row/col (0-7) to chess.js square notation (e.g. 'e2')
export function toSquare(row, col) {
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  return files[col] + (8 - row);
}

// Convert chess.js square notation to row/col
export function fromSquare(square) {
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const col = files.indexOf(square[0]);
  const row = 8 - parseInt(square[1]);
  return { row, col };
}

export class ChessService {
  constructor() {
    this.chess = new Chess();
    this.history = [];
  }

  // Returns an 8x8 array of Unicode piece symbols (or null)
  getBoard() {
    const board = Array(8).fill(null).map(() => Array(8).fill(null));
    const chessBoard = this.chess.board(); // 8x8 array of piece objects or null

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = chessBoard[row][col];
        if (piece) {
          // chess.js uses lowercase for black, uppercase for white
          const key = piece.color === 'w'
            ? piece.type.toUpperCase()
            : piece.type.toLowerCase();
          board[row][col] = PIECE_SYMBOLS[key] ?? null;
        }
      }
    }
    return board;
  }

  // Returns the piece symbol at a given row/col, or null
  getPieceAt(row, col) {
    const square = toSquare(row, col);
    const piece = this.chess.get(square);
    if (!piece) return null;
    const key = piece.color === 'w' ? piece.type.toUpperCase() : piece.type.toLowerCase();
    return PIECE_SYMBOLS[key] ?? null;
  }

  // Returns whose turn it is: 'w' or 'b'
  getCurrentTurn() {
    return this.chess.turn();
  }

  // Returns legal destination squares (as {row, col}) for a given piece position
  getLegalMovesFrom(row, col) {
    const square = toSquare(row, col);
    const moves = this.chess.moves({ square, verbose: true });
    return moves.map(m => fromSquare(m.to));
  }

  // Attempt to move a piece; returns true if the move was legal and executed
  movePiece(fromRow, fromCol, toRow, toCol) {
    const from = toSquare(fromRow, fromCol);
    const to = toSquare(toRow, toCol);

    // Detect pawn promotion: auto-promote to queen
    const piece = this.chess.get(from);
    let promotion;
    if (
      piece &&
      piece.type === 'p' &&
      ((piece.color === 'w' && toRow === 0) || (piece.color === 'b' && toRow === 7))
    ) {
      promotion = 'q';
    }

    const move = this.chess.move({ from, to, promotion });
    if (!move) return false; // Illegal move

    this.history.push({
      piece: PIECE_SYMBOLS[move.color === 'w' ? move.piece.toUpperCase() : move.piece.toLowerCase()],
      from: { row: fromRow, col: fromCol },
      to: { row: toRow, col: toCol },
      captured: move.captured
        ? PIECE_SYMBOLS[move.color === 'w' ? move.captured.toLowerCase() : move.captured.toUpperCase()]
        : null,
      san: move.san,        // Standard Algebraic Notation e.g. "e4", "Nf3"
      flags: move.flags,    // 'c' = capture, 'e' = en passant, 'k'/'q' = castling, 'p' = promotion
      timestamp: new Date().toISOString(),
    });

    return true;
  }

  getHistory() {
    return [...this.history];
  }

  // Game status helpers
  isGameOver() {
    return this.chess.isGameOver();
  }

  isInCheck() {
    return this.chess.inCheck();
  }

  isCheckmate() {
    return this.chess.isCheckmate();
  }

  isStalemate() {
    return this.chess.isStalemate();
  }

  isDraw() {
    return this.chess.isDraw();
  }

  getGameStatus() {
    if (this.chess.isCheckmate()) {
      return { status: 'checkmate', winner: this.chess.turn() === 'w' ? 'Noirs' : 'Blancs' };
    }
    if (this.chess.isStalemate()) return { status: 'stalemate' };
    if (this.chess.isDraw()) return { status: 'draw' };
    if (this.chess.inCheck()) {
      return { status: 'check', turn: this.chess.turn() === 'w' ? 'Blancs' : 'Noirs' };
    }
    return { status: 'playing', turn: this.chess.turn() === 'w' ? 'Blancs' : 'Noirs' };
  }

  reset() {
    this.chess.reset();
    this.history = [];
  }
}