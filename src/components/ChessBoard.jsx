import React from "react";

export default function ChessBoard({ board, selectedSquare, legalMoves = [], onSquareClick }) {
  const isSelected = (row, col) =>
    selectedSquare && selectedSquare.row === row && selectedSquare.col === col;

  const isLegalTarget = (row, col) =>
    legalMoves.some(m => m.row === row && m.col === col);

  const getSquareColor = (row, col) => {
    if (isSelected(row, col)) return '#7cb342';
    if (isLegalTarget(row, col)) {
      const isLight = (row + col) % 2 === 0;
      return isLight ? '#cdd16f' : '#aab523'; // Yellow-green tint for legal moves
    }
    return (row + col) % 2 === 0 ? '#f0d9b5' : '#b58863';
  };

  const getBorder = (row, col) => {
    if (isSelected(row, col)) return '3px solid #558b2f';
    return 'none';
  };

  return (
    <div
      data-testid="chessboard"
      style={{
        display: "inline-block",
        border: "4px solid #8B4513",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
      }}
    >
      {board.map((row, rowIndex) => (
        <div key={rowIndex} style={{ display: "flex" }}>
          {row.map((piece, colIndex) => {
            const legal = isLegalTarget(rowIndex, colIndex);

            return (
              <div
                key={colIndex}
                data-testid={`square-${rowIndex}-${colIndex}`}
                onClick={() => onSquareClick(rowIndex, colIndex)}
                style={{
                  width: "70px",
                  height: "70px",
                  backgroundColor: getSquareColor(rowIndex, colIndex),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "48px",
                  cursor: "pointer",
                  userSelect: "none",
                  transition: "background-color 0.15s",
                  border: getBorder(rowIndex, colIndex),
                  position: "relative",
                }}
              >
                {/* Dot indicator for empty legal squares */}
                {legal && !piece && (
                  <div style={{
                    position: "absolute",
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(0,0,0,0.18)",
                    pointerEvents: "none",
                  }} />
                )}
                {/* Ring indicator for capturable squares */}
                {legal && piece && (
                  <div style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "0",
                    border: "5px solid rgba(0,0,0,0.22)",
                    pointerEvents: "none",
                    borderRadius: "50%",
                    margin: "3px",
                  }} />
                )}
                <span
                  data-testid={`piece-${rowIndex}-${colIndex}`}
                  style={{ position: "relative", zIndex: 1 }}
                >
                  {piece ?? ""}
                </span>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
