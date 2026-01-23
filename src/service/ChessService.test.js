import { describe, it, expect, beforeEach } from 'vitest';
import { ChessService } from './ChessService';

describe('ChessService', () => {
  let service;

  beforeEach(() => {
    service = new ChessService();
  });

  it('initializeBoard() place les pièces au bon endroit', () => {
    const board = service.getBoard();

    expect(board).toHaveLength(8);
    expect(board[0]).toHaveLength(8);

    // Tour noire en (0,0), roi noir en (0,4)
    expect(board[0][0]).toBe('♜');
    expect(board[0][4]).toBe('♚');

    // Pions noirs ligne 1
    expect(board[1].every(p => p === '♟')).toBe(true);

    // Pions blancs ligne 6
    expect(board[6].every(p => p === '♙')).toBe(true);

    // Roi blanc en (7,4)
    expect(board[7][4]).toBe('♔');
  });

  it('getPieceAt(row,col) retourne la pièce attendue', () => {
    expect(service.getPieceAt(7, 3)).toBe('♕'); // dame blanche
    expect(service.getPieceAt(4, 4)).toBe(null); // case vide
  });

  it('movePiece() retourne false si on essaye de déplacer une case vide', () => {
    const ok = service.movePiece(4, 4, 4, 5);
    expect(ok).toBe(false);
    expect(service.getHistory()).toHaveLength(0);
  });

  it('movePiece() déplace une pièce et vide la case de départ', () => {
    // Déplacer un pion blanc de (6,0) vers (4,0)
    const ok = service.movePiece(6, 0, 4, 0);

    expect(ok).toBe(true);
    expect(service.getPieceAt(6, 0)).toBe(null);
    expect(service.getPieceAt(4, 0)).toBe('♙');
  });

  it('movePiece() remplace la pièce si la case d’arrivée est occupée (capture libre)', () => {
    // Tour blanche (7,0) vers (0,0) où il y a une tour noire
    const ok = service.movePiece(7, 0, 0, 0);

    expect(ok).toBe(true);
    expect(service.getPieceAt(0, 0)).toBe('♖'); // remplacée
    expect(service.getPieceAt(7, 0)).toBe(null);

    const lastMove = service.getHistory().at(-1);
    expect(lastMove.captured).toBe('♜');
  });

  it('getHistory() est mis à jour après chaque déplacement', () => {
    service.movePiece(6, 1, 5, 1);
    service.movePiece(6, 2, 4, 2);

    const history = service.getHistory();
    expect(history).toHaveLength(2);

    expect(history[0].piece).toBe('♙');
    expect(history[0].from).toEqual({ row: 6, col: 1 });
    expect(history[0].to).toEqual({ row: 5, col: 1 });
    expect(typeof history[0].timestamp).toBe('string');
    expect(history[0].timestamp.length).toBeGreaterThan(10);
  });

  it('getBoard() retourne une copie (pas la référence interne)', () => {
    const b1 = service.getBoard();
    b1[0][0] = null; // on “casse” la copie

    // L’original ne doit pas changer
    expect(service.getPieceAt(0, 0)).toBe('♜');
  });

  it('getHistory() retourne une copie (pas la référence interne)', () => {
    service.movePiece(6, 0, 5, 0);
    const h1 = service.getHistory();
    h1.push({ fake: true });

    // L’historique interne ne doit pas être modifié
    expect(service.getHistory().some(m => m.fake === true)).toBe(false);
  });

  it('getAllPieces() retourne 32 pièces au démarrage avec des positions', () => {
    const pieces = service.getAllPieces();
    expect(pieces).toHaveLength(32);

    // Exemple : doit contenir le roi noir en (0,4)
    expect(
      pieces.some(p => p.piece === '♚' && p.position.row === 0 && p.position.col === 4)
    ).toBe(true);

    // Et une pièce a toujours un {piece, position:{row,col}}
    expect(pieces[0]).toHaveProperty('piece');
    expect(pieces[0]).toHaveProperty('position');
    expect(pieces[0].position).toHaveProperty('row');
    expect(pieces[0].position).toHaveProperty('col');
  });
});
