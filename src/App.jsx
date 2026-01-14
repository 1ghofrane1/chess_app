import React, { useState } from 'react';

// Service pour gérer l'état du jeu
class ChessService {
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

// Composant principal
export default function ChessApp() {
  const [service] = useState(() => new ChessService());
  const [board, setBoard] = useState(service.getBoard());
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [history, setHistory] = useState([]);

  const handleSquareClick = (row, col) => {
    if (selectedSquare) {
      // Déplacer la pièce
      const { row: fromRow, col: fromCol } = selectedSquare;
      service.movePiece(fromRow, fromCol, row, col);
      setBoard(service.getBoard());
      setHistory(service.getHistory());
      setSelectedSquare(null);
    } else {
      // Sélectionner une pièce
      if (service.getPieceAt(row, col)) {
        setSelectedSquare({ row, col });
      }
    }
  };

  const resetBoard = () => {
    service.board = service.initializeBoard();
    service.history = [];
    setBoard(service.getBoard());
    setHistory([]);
    setSelectedSquare(null);
  };

  const isSelected = (row, col) => {
    return selectedSquare && selectedSquare.row === row && selectedSquare.col === col;
  };

  return (
    <div style={{ 
      display: 'flex', 
      gap: '2rem', 
      padding: '2rem',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <div>
        <h1 style={{ marginBottom: '1rem', color: '#333' }}>Échiquier Libre</h1>
        <div style={{
          display: 'inline-block',
          border: '4px solid #8B4513',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          {board.map((row, rowIndex) => (
            <div key={rowIndex} style={{ display: 'flex' }}>
              {row.map((piece, colIndex) => {
                const isLight = (rowIndex + colIndex) % 2 === 0;
                const selected = isSelected(rowIndex, colIndex);
                
                return (
                  <div
                    key={colIndex}
                    onClick={() => handleSquareClick(rowIndex, colIndex)}
                    style={{
                      width: '70px',
                      height: '70px',
                      backgroundColor: selected ? '#7cb342' : (isLight ? '#f0d9b5' : '#b58863'),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '48px',
                      cursor: 'pointer',
                      userSelect: 'none',
                      transition: 'background-color 0.2s',
                      border: selected ? '3px solid #558b2f' : 'none'
                    }}
                  >
                    {piece}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <button
          onClick={resetBoard}
          style={{
            marginTop: '1rem',
            padding: '0.75rem 1.5rem',
            fontSize: '16px',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Réinitialiser
        </button>
        <p style={{ marginTop: '1rem', color: '#666' }}>
          {selectedSquare ? '✓ Pièce sélectionnée - Cliquez sur une case de destination' : 'Cliquez sur une pièce pour la sélectionner'}
        </p>
      </div>

      <div style={{ 
        flex: 1, 
        backgroundColor: 'white', 
        padding: '1.5rem',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        maxHeight: '600px',
        overflowY: 'auto'
      }}>
        <h2 style={{ marginBottom: '1rem', color: '#333' }}>Historique des déplacements</h2>
        {history.length === 0 ? (
          <p style={{ color: '#999' }}>Aucun déplacement effectué</p>
        ) : (
          <div>
            {history.map((move, index) => (
              <div key={index} style={{ 
                padding: '0.75rem',
                marginBottom: '0.5rem',
                backgroundColor: '#f5f5f5',
                borderRadius: '4px',
                borderLeft: '4px solid #2196F3'
              }}>
                <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
                  Déplacement #{index + 1}
                </div>
                <div style={{ fontSize: '14px', color: '#666' }}>
                  <span style={{ fontSize: '20px' }}>{move.piece}</span> de ({move.from.row}, {move.from.col}) → ({move.to.row}, {move.to.col})
                  {move.captured && (
                    <span style={{ color: '#f44336', marginLeft: '0.5rem' }}>
                      (capture: {move.captured})
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '12px', color: '#999', marginTop: '0.25rem' }}>
                  {new Date(move.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}