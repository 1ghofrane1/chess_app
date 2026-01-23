import React from "react";

export default function ChessBoard({ board, selectedSquare, onSquareClick }) {
  const isSelected = (row, col) =>
    selectedSquare && selectedSquare.row === row && selectedSquare.col === col;

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
            const isLight = (rowIndex + colIndex) % 2 === 0;
            const selected = isSelected(rowIndex, colIndex);

            return (
              <div
                key={colIndex}
                data-testid={`square-${rowIndex}-${colIndex}`}
                onClick={() => onSquareClick(rowIndex, colIndex)}
                style={{
                  width: "70px",
                  height: "70px",
                  backgroundColor: selected
                    ? "#7cb342"
                    : isLight
                    ? "#f0d9b5"
                    : "#b58863",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "48px",
                  cursor: "pointer",
                  userSelect: "none",
                  transition: "background-color 0.2s",
                  border: selected ? "3px solid #558b2f" : "none",
                }}
              >
                <span data-testid={`piece-${rowIndex}-${colIndex}`}>
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
