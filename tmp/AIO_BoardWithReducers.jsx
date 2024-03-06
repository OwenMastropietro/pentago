/**
 * This file contains a roughly styled, functional version of the
 * Pentago game with all of the logic in one file (AIO = All In One) and
 * using React's useReducer hook.
 * Historic Relic: My first file / attempt at using React's useReducer hook.
 */

import React, { useReducer } from 'react';
import { Box, Grid, Button, Typography, Stack } from '@mui/material';
import { grey } from '@mui/material/colors';
import './App.css';

/* CONSTANTS */

const DEBUG = false;

const BOARD_SIZE = 6;
const QUADRANT_SIZE = 3;
const NUM_QUADRANTS = 4;
const QUADRANTS_PER_ROW = 2;

const WIN_COUNT = 5;

const CLOCKWISE = 1;
const COUNTER_CLOCKWISE = 3;

const BLACK = 'black';
const WHITE = 'white';

/* INITIALIZATION FUNCTIONS */

function initQuadrants() {
    /* initializes an array of FOUR Quadrants */
    const quadrant = Array.from({ length: QUADRANT_SIZE }, () =>
        Array.from({ length: QUADRANT_SIZE }, () =>
            ({ color: 'lightgrey' }))
    );
    const quadrants = Array.from({ length: NUM_QUADRANTS }, () => quadrant);

    /* DEBUGGING */
    console.assert(
        quadrants.length === NUM_QUADRANTS, 'subgrids.length === NUM_QUADRANTS'
    );
    quadrants.forEach((subgrid) => {
        console.assert(
            subgrid.length === QUADRANT_SIZE, 'subgrid.length === QUADRANT_SIZE'
        );
        subgrid.forEach((row) => {
            console.assert(
                row.length === QUADRANT_SIZE, 'row.length === QUADRANT_SIZE'
            );
            row.forEach((cell) => {
                console.assert(
                    cell.color === 'lightgrey', 'cell.color === "lightgrey"'
                );
            });
        });
    });
    /* DEBUGGING */

    return quadrants;
}

function createInitialState() {
    /* initializes the state */
    return {
        quadrants: initQuadrants(),
        turn: WHITE,
        lastPlayerRotated: true,
        lastPlayerMoved: false,
        hasWinner: false,
    };
}

/* HELPER FUNCTIONS */

/* 0, 0, 3, 3 */
const rowOffset = (subgridIndex) => (
    Math.floor(subgridIndex / QUADRANTS_PER_ROW) * QUADRANT_SIZE
);

/* 0, 3, 0, 3 */
const colOffset = (subgridIndex) => (
    (subgridIndex % QUADRANTS_PER_ROW) * QUADRANT_SIZE
);

/**
 * Rotates a 2D array 90 degrees clockwise k times.
 * @param {Array} array - The 2D array to rotate.
 * @param {Number} k - The number of times to rotate the array.
 * @returns {Array} The rotated array.
 * @throws {Error} If the input is invalid.
 * @NumPy_till_I_die Inspired by NumPy.rot90()
 */
function rot90(array, k) {
    if (!Array.isArray(array) || !array.length || !Array.isArray(array[0])) {
        throw new Error('Invalid input. Expected a 2D array.');
    }

    const rows = array.length;
    const cols = array[0].length;
    const numRotations = ((k % 4) + 4) % 4; // Ensure k is between 0 and 3

    if (numRotations === 0) {
        return array.slice();
    }

    if (numRotations === 1) {
        // Rotate 90 degrees clockwise
        const result = new Array(cols).fill().map(() => new Array(rows));
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                result[j][rows - 1 - i] = array[i][j];
            }
        }
        return result;
    }

    if (numRotations === 2) {
        // Rotate 180 degrees clockwise
        const result = new Array(rows).fill().map(() => new Array(cols));
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                result[rows - 1 - i][cols - 1 - j] = array[i][j];
            }
        }
        return result;
    }

    if (numRotations === 3) {
        /* Rotate 270 degrees clockwise */
        const result = new Array(cols).fill().map(() => new Array(rows));
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                result[cols - 1 - j][i] = array[i][j];
            }
        }
        return result;
    }

    return -1;
}

function subgridsToBoard(subgrids) {
    /* converts the 4 (3x3) subgrids to a single (6x6) board */
    const board = Array.from({ length: BOARD_SIZE }, () =>
        Array.from({ length: BOARD_SIZE }, () => ({ color: 'lightgrey' }))
    );

    subgrids.forEach((subgrid, subgridIndex) => {
        subgrid.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                const ROW_OFFSET = rowOffset(subgridIndex);
                const COL_OFFSET = colOffset(subgridIndex);
                board[rowIndex + ROW_OFFSET][colIndex + COL_OFFSET] = cell;
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

function getHorizontalWinner(board) {
    /* returns null or the winning player */
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

function getDiagonalWinner(board) {
    /* returns null or the winning player */

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

function getWinner(QUADRANTS) {
    /* returns null or the winning player */
    const BOARD = subgridsToBoard(QUADRANTS);
    const VERTICAL_WINNER = getVerticalWinner(BOARD);
    const HORIZONTAL_WINNER = getHorizontalWinner(BOARD);
    const DIAGONAL_WINNER = getDiagonalWinner(BOARD);
    const WINNER = VERTICAL_WINNER || HORIZONTAL_WINNER || DIAGONAL_WINNER;

    return WINNER;
}

/* REDUCER FUNCTIONS */

function integrateClick(state, quadrantIdx, row, cell) {
    /* callback for when a cell is clicked */
    const {
        quadrants, hasWinner, lastPlayerRotated, turn,
    } = state;
    const emptyCellClicked = quadrants[quadrantIdx][row][cell].color === 'lightgrey';

    if (!hasWinner && emptyCellClicked && lastPlayerRotated) {
        const newQuadrants = quadrants.slice();
        const newQuadrant = quadrants[quadrantIdx].slice();
        const newRow = quadrants[quadrantIdx][row].slice();
        newRow[cell] = { color: turn };
        newQuadrant[row] = newRow;
        newQuadrants[quadrantIdx] = newQuadrant;
        // const theBoard = subgridsToBoard(newQuadrants);
        return {
            quadrants: newQuadrants,
            lastPlayerRotated: false,
            lastPlayerMoved: true,
            hasWinner: getWinner(newQuadrants) ? true : false,
        };
    }
}

function click_on_cell_action(quadrantIdx, rowIdx, cellIdx) {
    if (DEBUG) {
        console.log(`click_on_cell_action(${quadrantIdx}, ${rowIdx}, ${cellIdx})`);
    }

    return {
        type: 'CELL_CLICKED',
        payload: {
            quadrantIdx: quadrantIdx,
            row: rowIdx,
            cell: cellIdx,
        },
    };
}

function rotate_action(quadrantIdx, direction) {
    if (DEBUG) {
        console.log(`rotate_action(${quadrantIdx}, ${direction})`);
    }

    return {
        type: 'ROTATE',
        payload: {
            quadrantIdx: quadrantIdx,
            direction: direction,
        },
    };
}

function reducers(state, action) {
    if (DEBUG) {
        console.log('reducers() called with state: ', state, ' and action: ', action);
    }

    if (state) {
        if (action.type === 'INITIALIZE' || action.type === 'RESET') {
            return createInitialState();
        } else if (action.type === 'CELL_CLICKED') {
            const { quadrants, hasWinner, lastPlayerRotated } = state;
            const { quadrantIdx, row, cell } = action.payload;
            const emptyCellClicked = quadrants[quadrantIdx][row][cell].color === 'lightgrey';
            if (!hasWinner && emptyCellClicked && lastPlayerRotated) {
                return {
                    ...state,
                    ...integrateClick(state, quadrantIdx, row, cell),
                };
            }
        } else if (action.type === 'ROTATE') {
            const { quadrants, hasWinner, lastPlayerMoved } = state;
            const { quadrantIdx, direction } = action.payload;
            if (!hasWinner && lastPlayerMoved) {
                const newQuadrants = quadrants.slice();
                newQuadrants[quadrantIdx] = rot90(quadrants[quadrantIdx], direction);
                return {
                    ...state,
                    quadrants: newQuadrants,
                    turn: state.turn === BLACK ? WHITE : BLACK,
                    lastPlayerRotated: true,
                    lastPlayerMoved: false,
                };
            }
        } else {
            console.error('Unknown action type: ', action.type);
        }
    }

    return state;
}

function reset_action() {
    return {
        type: 'RESET'
    };
}

/* COMPONENTS */

function Cell({ cellColor }) {
    /* renders an individual cell */
    return (
        <Box
            sx={{
                height: 20,
                width: 20,
                backgroundColor: cellColor,
                border: 2,
                borderColor: 'black',
                borderRadius: '50%',
                p: 1,
                m: 1,
            }}
        />
    );
}

function Quadrant({ quadrant, quadrantIdx, dispatch }) {
    /* renders a 3x3 quadrant of cells */
    return (
        <Box
            sx={{
                border: 5,
                borderColor: 'red',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: grey[500],
                p: 1,
                m: 1,
            }}
        >
            {quadrant.map((row, rowIdx) => (
                <Grid container
                    spacing={2}
                    columns={3}
                    key={rowIdx}
                    sx={{
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    {row.map((cell, cellIdx) => (
                        <Grid item
                            key={cellIdx}
                            // onClick={() => onClickCallBack(quadrantIdx, rowIdx, cellIdx)}
                            onClick={() => dispatch(click_on_cell_action(quadrantIdx, rowIdx, cellIdx))}
                        >
                            <Cell cellColor={cell.color} />
                        </Grid>
                    ))}
                </Grid>
            ))}
        </Box >
    );
}

function Rotators({ dispatch }) {
    /* renders the four rotators */
    const rotators = [
        [{ quadrant: 0, direction: COUNTER_CLOCKWISE }, { quadrant: 0, direction: CLOCKWISE }],
        [{ quadrant: 1, direction: COUNTER_CLOCKWISE }, { quadrant: 1, direction: CLOCKWISE }],
        [{ quadrant: 2, direction: COUNTER_CLOCKWISE }, { quadrant: 2, direction: CLOCKWISE }],
        [{ quadrant: 3, direction: COUNTER_CLOCKWISE }, { quadrant: 3, direction: CLOCKWISE }],
    ];

    return (
        <Box
            margin='auto'
            sx={{
                height: 600,
                width: 400,
                border: 5,
                borderColor: 'blue',
                flexDirection: 'row',
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'center',
                mt: 1,
                mb: 1,
            }}
        >
            <Grid
                container
                spacing={2}
                columns={2}
                sx={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                {rotators.map((rotator, rotatorIdx) => (
                    <Grid item key={rotatorIdx}>
                        <Grid
                            container
                            spacing={2}
                            columns={2}
                            sx={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            {rotator.map((rotator, rotatorIdx) => (
                                <Grid item key={rotatorIdx}>
                                    <Button
                                        variant="contained"
                                        onClick={() => dispatch(rotate_action(rotator.quadrant, rotator.direction))}
                                    // onClick={() => onRotateCallBack(rotator.quadrant, rotator.direction)}
                                    >
                                        {rotator.direction === CLOCKWISE ? '-->' : '<--'}
                                    </Button>
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

function Quadrants({ quadrants, dispatch }) {
    /* renders the four quadrants */
    return (
        <Box
            margin='auto'
            sx={{
                height: 600,
                width: 600,
                border: 5,
                borderColor: 'blue',
                flexDirection: 'row',
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'center',
            }}
        >
            <Grid
                container
                spacing={2}
                columns={2}
                sx={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                {quadrants.map((quadrant, quadrantIdx) => (
                    <Grid item key={quadrantIdx} >
                        <Quadrant
                            quadrant={quadrant}
                            quadrantIdx={quadrantIdx}
                            // onClickCallBack={(quadrantIdx, row, cell) => onClickCallBack(quadrantIdx, row, cell)}
                            dispatch={dispatch}
                        />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

function TopBanner({ turn, hasWinner, dispatch }) {
    /* renders the top banner */
    return (
        <Stack width='90%'>
            <Box margin='auto'
                sx={{
                    height: '100%',
                    width: '100%',
                    border: 5,
                    borderColor: 'green',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mt: 1,
                    mb: 1,
                }}
            >
                <Typography variant='h3' textAlign='center'>
                    Pentago
                </Typography>
                <Typography variant='h5' textAlign='center'>
                    {hasWinner ? `Winner: ${turn}` : `Turn: ${turn}`}
                </Typography>
                <Button variant="contained"
                    onClick={() => dispatch(reset_action())}
                >
                    Reset
                </Button>
            </Box>
        </Stack>
    );
}

export default function Board() {
    /* renders the entire game board */
    const [state, dispatch] = useReducer(reducers, undefined, createInitialState);
    const { quadrants, hasWinner, turn } = state;

    return (
        <Box
            margin='auto'
            sx={{
                height: 800,
                width: 1200,
                border: 5,
                borderColor: 'pink',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                mt: 1,
            }}
        >
            <TopBanner turn={turn} hasWinner={hasWinner} dispatch={dispatch} />
            <Quadrants quadrants={quadrants} dispatch={dispatch} />
            <Rotators dispatch={dispatch} />
        </Box>
    );
}
