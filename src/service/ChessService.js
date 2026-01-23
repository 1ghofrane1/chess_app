export class ChessService {
  constructor() {
    this.board = this.initializeBoard();
    this.history = [];
  }

  initializeBoard() {
    const board = Array(8).fill(null).map(() => Array(8).fill(null));
    
    // Pièces noires
    board[0] = ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜'];
    board[1] = Array(8).fill('♟');
    
    // Pièces blanches
    board[6] = Array(8).fill('♙');
    board[7] = ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖'];
    
    return board;
  }

  movePiece(fromRow, fromCol, toRow, toCol) {
    const piece = this.board[fromRow][fromCol];
    if (!piece) return false;

    const move = {
      piece,
      from: { row: fromRow, col: fromCol },
      to: { row: toRow, col: toCol },
      captured: this.board[toRow][toCol],
      timestamp: new Date().toISOString()
    };

    this.board[toRow][toCol] = piece;
    this.board[fromRow][fromCol] = null;
    this.history.push(move);
    
    return true;
  }

  getBoard() {
    return this.board.map(row => [...row]);
  }

  getHistory() {
    return [...this.history];
  }

  getPieceAt(row, col) {
    return this.board[row][col];
  }

  getAllPieces() {
    const pieces = [];
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (this.board[row][col]) {
          pieces.push({
            piece: this.board[row][col],
            position: { row, col }
          });
        }
      }
    }
    return pieces;
  }
}