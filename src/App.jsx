import React, { useState } from 'react';
import { ChessService } from './service/ChessService';
import ChessBoard from "./components/ChessBoard";

export default function ChessApp() {
  const [service] = useState(() => new ChessService());
  const [board, setBoard] = useState(() => service.getBoard());
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [legalMoves, setLegalMoves] = useState([]);
  const [history, setHistory] = useState([]);
  const [gameStatus, setGameStatus] = useState(service.getGameStatus());

  const syncState = () => {
    setBoard(service.getBoard());
    setHistory(service.getHistory());
    setGameStatus(service.getGameStatus());
  };

  const handleSquareClick = (row, col) => {
    // Game is over — ignore clicks
    if (service.isGameOver()) return;

    if (selectedSquare) {
      const { row: fromRow, col: fromCol } = selectedSquare;

      // Clicking the same square deselects
      if (fromRow === row && fromCol === col) {
        setSelectedSquare(null);
        setLegalMoves([]);
        return;
      }

      // Try the move
      const moved = service.movePiece(fromRow, fromCol, row, col);

      if (moved) {
        syncState();
        setSelectedSquare(null);
        setLegalMoves([]);
      } else {
        // Maybe the player clicked another of their own pieces — try selecting it
        const piece = service.getPieceAt(row, col);
        const turn = service.getCurrentTurn();
        const isOwnPiece = piece && isCurrentPlayerPiece(piece, turn);

        if (isOwnPiece) {
          const moves = service.getLegalMovesFrom(row, col);
          setSelectedSquare({ row, col });
          setLegalMoves(moves);
        } else {
          // Illegal target and not own piece — deselect
          setSelectedSquare(null);
          setLegalMoves([]);
        }
      }
    } else {
      // No piece currently selected — try to select one
      const piece = service.getPieceAt(row, col);
      const turn = service.getCurrentTurn();

      if (piece && isCurrentPlayerPiece(piece, turn)) {
        const moves = service.getLegalMovesFrom(row, col);
        setSelectedSquare({ row, col });
        setLegalMoves(moves);
      }
    }
  };

  const resetBoard = () => {
    service.reset();
    syncState();
    setSelectedSquare(null);
    setLegalMoves([]);
  };

  // White pieces: ♔♕♖♗♘♙ — Black pieces: ♚♛♜♝♞♟
  const WHITE_PIECES = new Set(['♔', '♕', '♖', '♗', '♘', '♙']);
  const BLACK_PIECES = new Set(['♚', '♛', '♜', '♝', '♞', '♟']);

  const isCurrentPlayerPiece = (piece, turn) => {
    if (turn === 'w') return WHITE_PIECES.has(piece);
    if (turn === 'b') return BLACK_PIECES.has(piece);
    return false;
  };

  const status = gameStatus;
  const statusColor = status.status === 'checkmate' ? '#c62828'
    : status.status === 'check' ? '#e65100'
    : status.status === 'stalemate' || status.status === 'draw' ? '#6a1b9a'
    : '#1565c0';

  const statusMessage = () => {
    if (status.status === 'checkmate') return `♚ Échec et mat ! ${status.winner} gagnent !`;
    if (status.status === 'stalemate') return '🤝 Pat — Match nul';
    if (status.status === 'draw') return '🤝 Match nul';
    if (status.status === 'check') return `⚠️ Échec ! (Tour des ${status.turn})`;
    return `Tour des ${status.turn}`;
  };

  const moveFlagLabel = (flags) => {
    if (!flags) return '';
    if (flags.includes('e')) return ' · En passant';
    if (flags.includes('k')) return ' · Petit roque';
    if (flags.includes('q')) return ' · Grand roque';
    if (flags.includes('p')) return ' · Promotion ♕';
    return '';
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
        <h1 style={{ marginBottom: '0.5rem', color: '#333' }}>Jeu d'Échecs</h1>

        {/* Status bar */}
        <div style={{
          marginBottom: '1rem',
          padding: '0.6rem 1rem',
          backgroundColor: 'white',
          borderRadius: '6px',
          borderLeft: `4px solid ${statusColor}`,
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          fontWeight: 'bold',
          color: statusColor,
          fontSize: '15px',
        }}>
          {statusMessage()}
        </div>

        <ChessBoard
          board={board}
          selectedSquare={selectedSquare}
          legalMoves={legalMoves}
          onSquareClick={handleSquareClick}
        />

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

        <p style={{ marginTop: '0.75rem', color: '#666', fontSize: '14px' }}>
          {selectedSquare
            ? '✓ Pièce sélectionnée — Cliquez sur une case en surbrillance'
            : service.isGameOver()
              ? 'Partie terminée. Cliquez sur Réinitialiser pour rejouer.'
              : 'Cliquez sur une de vos pièces pour la sélectionner'}
        </p>
      </div>

      {/* Move history panel */}
      <div style={{
        flex: 1,
        backgroundColor: 'white',
        padding: '1.5rem',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        maxHeight: '640px',
        overflowY: 'auto'
      }}>
        <h2 style={{ marginBottom: '1rem', color: '#333' }}>Historique des coups</h2>
        {history.length === 0 ? (
          <p style={{ color: '#999' }}>Aucun coup effectué</p>
        ) : (
          <div>
            {history.map((move, index) => (
              <div key={index} style={{
                padding: '0.6rem 0.75rem',
                marginBottom: '0.4rem',
                backgroundColor: '#f5f5f5',
                borderRadius: '4px',
                borderLeft: `4px solid ${index % 2 === 0 ? '#1565c0' : '#37474f'}`,
              }}>
                <div style={{ fontWeight: 'bold', fontSize: '13px', color: '#888', marginBottom: '2px' }}>
                  Coup #{index + 1} · {index % 2 === 0 ? '⬜ Blancs' : '⬛ Noirs'}
                </div>
                <div style={{ fontSize: '15px', color: '#333' }}>
                  <span style={{ fontSize: '22px', marginRight: '6px' }}>{move.piece}</span>
                  <span style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{move.san}</span>
                  {move.captured && (
                    <span style={{ color: '#c62828', marginLeft: '8px', fontSize: '13px' }}>
                      capture {move.captured}
                    </span>
                  )}
                  <span style={{ color: '#7b1fa2', fontSize: '12px', marginLeft: '4px' }}>
                    {moveFlagLabel(move.flags)}
                  </span>
                </div>
                <div style={{ fontSize: '11px', color: '#bbb', marginTop: '2px' }}>
                  ({move.from.row},{move.from.col}) → ({move.to.row},{move.to.col}) · {new Date(move.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
