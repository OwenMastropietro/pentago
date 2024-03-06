/**
 * functions for evaluating the state of the board.
 */

import {
    BOARD_SIZE,
    QUADRANT_SIZE,
    QUADRANTS_PER_ROW,
    WIN_COUNT,
} from './constants';

/** maps a quadrantIdx to a corresponding row offset for the 6x6 board. */
const rowOffset = (quadrantIdx) => (
    Math.floor(quadrantIdx / QUADRANTS_PER_ROW) * QUADRANT_SIZE
);

/** maps a quadrantIdx to a corresponding column offset for the 6x6 board. */
const colOffset = (quadrantIdx) => (
    (quadrantIdx % QUADRANTS_PER_ROW) * QUADRANT_SIZE
);

/**
 * Converts the 4 (3x3) quadrants to a single (6x6) board.
 */
function quadrantsToBoard(quadrants) {
    const board = Array.from({ length: BOARD_SIZE }, () =>
        Array.from({ length: BOARD_SIZE }, () => ({ color: 'lightgrey' }))
    );

    quadrants.forEach((quadrant, quadrantIdx) => {
        quadrant.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                const ROW_OFFSET = rowOffset(quadrantIdx);
                const COL_OFFSET = colOffset(quadrantIdx);
                board[rowIndex + ROW_OFFSET][colIndex + COL_OFFSET] = cell;
            });
        });
    });

    return board;
}

/**
 * Scans the board for a win along the vertical axis, left to right.
 */
function getVerticalWinner(board) {
    for (let colIdx = 0; colIdx < BOARD_SIZE; colIdx += 1) {
        let numBlackPieces = 0;
        let numWhitePieces = 0;
        for (let rowIdx = 0; rowIdx < BOARD_SIZE; rowIdx += 1) {
            const cellColor = board[rowIdx][colIdx].color;
            switch (cellColor) {
                case 'black':
                    numBlackPieces += 1;
                    numWhitePieces = 0;
                    break;
                case 'white':
                    numBlackPieces = 0;
                    numWhitePieces += 1;
                    break;
                case 'lightgrey':
                    numBlackPieces = 0;
                    numWhitePieces = 0;
                    break;
                default:
                    break;
            }
            if (numBlackPieces >= WIN_COUNT || numWhitePieces >= WIN_COUNT) {
                return cellColor;
            }
        }
    }

    return null;
}

/**
 * Scans the board for a win along the horizontal axis, top to bottom.
 */
function getHorizontalWinner(board) {
    for (let rowIdx = 0; rowIdx < BOARD_SIZE; rowIdx += 1) {
        const row = board[rowIdx];
        let numBlackPieces = 0;
        let numWhitePieces = 0;
        for (let colIdx = 0; colIdx < BOARD_SIZE; colIdx += 1) {
            const cellColor = row[colIdx].color;
            switch (cellColor) {
                case 'black':
                    numBlackPieces += 1;
                    numWhitePieces = 0;
                    break;
                case 'white':
                    numBlackPieces = 0;
                    numWhitePieces += 1;
                    break;
                case 'lightgrey':
                    numBlackPieces = 0;
                    numWhitePieces = 0;
                    break;
                default:
                    break;
            }
            if (numBlackPieces >= WIN_COUNT || numWhitePieces >= WIN_COUNT) {
                return cellColor;
            }
        }
    }

    return null;
}

/**
 * Scans the board for a win along each of the diagonals.
 * 3 from top-left to bottom-right,
 * 3 from top-right to bottom-left,
 * 1 from bottom-left to top-right, and
 * 1 from bottom-right to top-left.
 */
function getDiagonalWinner(board) {
    // Check diagonals from top-left to bottom-right
    for (let rowIdx = 0; rowIdx <= 1; rowIdx += 1) {
        for (let colIdx = 0; colIdx <= 2; colIdx += 1) {
            const cellColor = board[rowIdx][colIdx].color;
            if (cellColor !== 'lightgrey'
                && cellColor === board[rowIdx + 1][colIdx + 1].color
                && cellColor === board[rowIdx + 2][colIdx + 2].color
                && cellColor === board[rowIdx + 3][colIdx + 3].color
                && cellColor === board[rowIdx + 4][colIdx + 4].color) {
                return cellColor;
            }
        }
    }

    // Check diagonals from top-right to bottom-left
    for (let rowIdx = 0; rowIdx <= 1; rowIdx += 1) {
        for (let colIdx = 4; colIdx <= 5; colIdx += 1) {
            const cellColor = board[rowIdx][colIdx].color;
            if (cellColor !== 'lightgrey'
                && cellColor === board[rowIdx + 1][colIdx - 1].color
                && cellColor === board[rowIdx + 2][colIdx - 2].color
                && cellColor === board[rowIdx + 3][colIdx - 3].color
                && cellColor === board[rowIdx + 4][colIdx - 4].color) {
                return cellColor;
            }
        }
    }

    // Check diagonals from bottom-left to top-right
    for (let rowIdx = 5; rowIdx >= 4; rowIdx -= 1) {
        for (let colIdx = 0; colIdx <= 2; colIdx += 1) {
            const cellColor = board[rowIdx][colIdx].color;
            if (cellColor !== 'lightgrey'
                && cellColor === board[rowIdx - 1][colIdx + 1].color
                && cellColor === board[rowIdx - 2][colIdx + 2].color
                && cellColor === board[rowIdx - 3][colIdx + 3].color
                && cellColor === board[rowIdx - 4][colIdx + 4].color) {
                return cellColor;
            }
        }
    }

    // Check diagonals from bottom-right to top-left
    for (let rowIdx = 5; rowIdx >= 4; rowIdx -= 1) {
        for (let colIdx = 4; colIdx <= 5; colIdx += 1) {
            const cellColor = board[rowIdx][colIdx].color;
            if (cellColor !== 'lightgrey'
                && cellColor === board[rowIdx - 1][colIdx - 1].color
                && cellColor === board[rowIdx - 2][colIdx - 2].color
                && cellColor === board[rowIdx - 3][colIdx - 3].color
                && cellColor === board[rowIdx - 4][colIdx - 4].color) {
                return cellColor;
            }
        }
    }

    return null;
}

/**
 * Scans quadrants for a winner in accordance with the rules of Pentago.
 */
function getWinner(QUADRANTS) {
    const BOARD = quadrantsToBoard(QUADRANTS);

    return (getVerticalWinner(BOARD)
        || getHorizontalWinner(BOARD)
        || getDiagonalWinner(BOARD));
}


export {
    getWinner,
    quadrantsToBoard
};
