/**
 * This file contains logic to convert a list of 4 (3x3) subgrids into a
 * single (6x6) big grid.
 *
 * subgrids = [
 *              [ [1, 2, 3], [4, 5, 6], [7, 8, 9] ],
 *              [ [10, 11, 12], [13, 14, 15], [16, 17, 18] ],
 *              [ [19, 20, 21], [22, 23, 24], [25, 26, 27] ],
 *              [ [28, 29, 30], [31, 32, 33], [34, 35, 36] ]
 *         ];
 *
 * will be converted to:
 *
 * board = [
 *          [1, 2, 3, 10, 11, 12],
 *          [4, 5, 6, 13, 14, 15],
 *          [7, 8, 9, 16, 17, 18],
 *          [19, 20, 21, 28, 29, 30],
 *          [22, 23, 24, 31, 32, 33],
 *          [25, 26, 27, 34, 35, 36
 *      ];
 *
 * this will make scanning the board for a win much easier.
 *
 * Notes:
 * - Array.from()
 * In JavaScript, Array.from() is designed to work with any iterable object,
 * not just arrays. Iterable objects are objects that implement a method called
 * Symbol.iterator. The Symbol.iterator method returns an iterator object,
 * which is an object with a next() method that returns an object with two
 * properties: value (the next value in the sequence) and done (a boolean
 * indicating whether the end of the sequence has been reached).
 *
 * In the case of
 * Array.from({ length: 6 }, () => Array.from({ length: 6 }, () => 0)),
 * the iterable object is an object with a length property set to 6, which is
 * enough to make it iterable. The length property tells the Array.from() method
 * how many elements to include in the resulting array.
 *
 * The callback function passed to Array.from() is called for each element in
 * the new array, and returns a new array with a length of 6, filled with 0s.
 * This is repeated 6 times, resulting in a new 2-dimensional array with
 * dimensions 6x6, filled with 0s.
 */

/* eslint-disable no-console */

const DEBUG = 1;
const BOARD_SIZE = 6;
const SUBGRID_SIZE = 3;
const SUBGRID_COUNT_PER_ROW = 2;
const WIN_COUNT = 5;


/* 0, 0, 3, 3 */
const rowOffset = (subgridIndex) => (
    Math.floor(subgridIndex / SUBGRID_COUNT_PER_ROW) * SUBGRID_SIZE
);

/* 0, 3, 0, 3 */
const colOffset = (subgridIndex) => (
    (subgridIndex % SUBGRID_COUNT_PER_ROW) * SUBGRID_SIZE
);

function subgridsToBoard(subgrids) {
    /* see notes above for Array.from() */
    /* eslint-disable-next-line max-len */
    const board = Array.from({ length: BOARD_SIZE }, () => Array.from({ length: BOARD_SIZE }, () => 0));
    /** Fill the board with the values from the subgrids using Dr. Kooshesh's
    * suggested 00, 03, 30, 33 indexing method.
    */
    subgrids.forEach((subgrid, subgridIndex) => {
        subgrid.forEach((row, rowIndex) => {
            row.forEach((value, colIndex) => {
                const ROW_OFFSET = rowOffset(subgridIndex);
                const COL_OFFSET = colOffset(subgridIndex);
                board[rowIndex + ROW_OFFSET][colIndex + COL_OFFSET] = value;
            });
        });
    });
    return board;
}

function getVerticalWinner(board) {
    /* returns null or the winning player */
    for (let colIdx = 0; colIdx < BOARD_SIZE; colIdx += 1) {
        let numBlackPieces = 0;
        let numWhitePieces = 0;
        for (let rowIdx = 0; rowIdx < BOARD_SIZE; rowIdx += 1) {
            const currentPiece = board[rowIdx][colIdx];
            switch (currentPiece) {
                case 'b':
                    numBlackPieces += 1;
                    numWhitePieces = 0;
                    break;
                case 'w':
                    numBlackPieces = 0;
                    numWhitePieces += 1;
                    break;
                case '-':
                    numBlackPieces = 0;
                    numWhitePieces = 0;
                    break;
                default:
                    break;
            }
            if (numBlackPieces >= WIN_COUNT || numWhitePieces >= WIN_COUNT) {
                return currentPiece;
            }
        }
    }
    return null;
}

function getHorizontalWinner(board) {
    /* returns null or the winning player */
    for (let rowIdx = 0; rowIdx < BOARD_SIZE; rowIdx += 1) {
        const row = board[rowIdx];
        let numBlackPieces = 0;
        let numWhitePieces = 0;
        for (let colIdx = 0; colIdx < BOARD_SIZE; colIdx += 1) {
            const value = row[colIdx];
            switch (value) {
                case 'b':
                    numBlackPieces += 1;
                    numWhitePieces = 0;
                    break;
                case 'w':
                    numBlackPieces = 0;
                    numWhitePieces += 1;
                    break;
                case '-':
                    numBlackPieces = 0;
                    numWhitePieces = 0;
                    break;
                default:
                    break;
            }
            if (numBlackPieces >= WIN_COUNT || numWhitePieces >= WIN_COUNT) {
                return value;
            }
        }
    }
    return null;
}

function getDiagonalWinner(board) {
    /* returns null or the winning player */
    // Check diagonals from top-left to bottom-right
    for (let i = 0; i <= 1; i += 1) {
        for (let j = 0; j <= 2; j += 1) {
            const value = board[i][j];
            if (value !== '-'
                && value === board[i + 1][j + 1]
                && value === board[i + 2][j + 2]
                && value === board[i + 3][j + 3]
                && value === board[i + 4][j + 4]) {
                return value;
            }
        }
    }

    // Check diagonals from top-right to bottom-left
    for (let i = 0; i <= 1; i += 1) {
        for (let j = 4; j <= 5; j += 1) {
            const value = board[i][j];
            if (board[i][j] !== '-'
                && value === board[i + 1][j - 1]
                && value === board[i + 2][j - 2]
                && value === board[i + 3][j - 3]
                && value === board[i + 4][j - 4]) {
                return value;
            }
        }
    }

    // Check diagonals from bottom-left to top-right
    for (let i = 5; i >= 4; i -= 1) {
        for (let j = 0; j <= 2; j += 1) {
            const value = board[i][j];
            if (value !== '-'
                && value === board[i - 1][j + 1]
                && value === board[i - 2][j + 2]
                && value === board[i - 3][j + 3]
                && value === board[i - 4][j + 4]) {
                return value;
            }
        }
    }

    // Check diagonals from bottom-right to top-left
    for (let i = 5; i >= 4; i -= 1) {
        for (let j = 4; j <= 5; j += 1) {
            const value = board[i][j];
            if (value !== '-'
                && value === board[i - 1][j - 1]
                && value === board[i - 2][j - 2]
                && value === board[i - 3][j - 3]
                && value === board[i - 4][j - 4]) {
                return value;
            }
        }
    }

    return null;
}

function getWinner(board) {
    /* returns null or the winning player */
    const VERTICAL_WINNER = getVerticalWinner(board);
    const HORIZONTAL_WINNER = getHorizontalWinner(board);
    const DIAGONAL_WINNER = getDiagonalWinner(board);
    const WINNER = VERTICAL_WINNER || HORIZONTAL_WINNER || DIAGONAL_WINNER;
    if (DEBUG) {
        console.log(`VERTICAL_WINNER: ${VERTICAL_WINNER}`);
        console.log(`HORIZONTAL_WINNER: ${HORIZONTAL_WINNER}`);
        console.log(`DIAGONAL_WINNER: ${DIAGONAL_WINNER}`);
    }
    return WINNER;
}

function main() {
    if (DEBUG) {
        // const subgrids = [
        //   [['-', 'w', '-'], ['-', 'w', '-'], ['-', 'w', 'w']],
        //   [['-', '-', '-'], ['-', '-', '-'], ['-', '-', '-']],
        //   [['-', 'w', '-'], ['-', 'w', '-'], ['-', '-', '-']],
        //   [['w', '-', '-'], ['-', 'w', '-'], ['-', '-', 'w']],
        // ];
        const subgrids = [
            [[1, 2, 3], [4, 5, 6], [7, 8, 9]],
            [[10, 11, 12], [13, 14, 15], [16, 17, 18]],
            [[19, 20, 21], [22, 23, 24], [25, 26, 27]],
            [[27, 28, 29], [30, 31, 32], [33, 34, 35]],
        ];
        console.log('subgrids:');
        subgrids.forEach((subgrid) => { console.log(subgrid); });

        const theBoard = subgridsToBoard(subgrids);
        console.log('theBoard:');
        theBoard.forEach((row) => { console.log(row); });

        const WINNER = getWinner(theBoard);
        console.log(WINNER ? `Winner: ${WINNER}` : 'No winner');
    } else {
        const subgrids = Array
            .from({ length: 4 }, () => Array.from({ length: 3 }, () => Array.from({ length: 3 }, () => '-')));
        console.log('subgrids:');
        subgrids.forEach((subgrid) => { console.log(subgrid); });

        const theBoard = subgridsToBoard(subgrids);
        console.log('theBoard:');
        theBoard.forEach((row) => { console.log(row); });

        const WINNER = getWinner(theBoard);
        console.log(WINNER ? `Winner: ${WINNER}` : 'No winner');
    }
}

main();
