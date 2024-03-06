/**
 * I believe this (or temp/Board.jsx) could be my first
 * functional version of the Pentago game before transitioning to use Reducers?
 */

/* IMPORTS */

import React, { useState } from 'react';
import { Box, Grid, Button, Typography } from '@mui/material';
import './App.css';

/* CONSTANTS */

const DEBUG = true;

const BOARD_SIZE = 6;
const SUBGRID_SIZE = 3;
const NUM_SUBGRIDS = 4;
const SUBGRIDS_PER_ROW = 2;

const WIN_COUNT = 5;

const CLOCKWISE = 1;
const COUNTER_CLOCKWISE = 3;

const BLACK = 'black';

/* INITIALIZATION FUNCTIONS */

function initSubgrids() {
    /* initializes the subgrids */
    /* experimenting with Array.from() */
    const subgrid = Array.from({ length: SUBGRID_SIZE }, () =>
        Array.from({ length: SUBGRID_SIZE }, () =>
            ({ color: 'lightgrey' }))
    );
    const subgrids = Array.from({ length: NUM_SUBGRIDS }, () => subgrid);

    /* DEBUGGING */
    console.assert(
        subgrids.length === NUM_SUBGRIDS, 'subgrids.length === NUM_SUBGRIDS'
    );
    subgrids.forEach((subgrid) => {
        console.assert(
            subgrid.length === SUBGRID_SIZE, 'subgrid.length === SUBGRID_SIZE'
        );
        subgrid.forEach((row) => {
            console.assert(
                row.length === SUBGRID_SIZE, 'row.length === SUBGRID_SIZE'
            );
            row.forEach((cell) => {
                console.assert(
                    cell.color === 'lightgrey', 'cell.color === "lightgrey"'
                );
            });
        });
    });
    /* DEBUGGING */

    return subgrids;
}

/* HELPER FUNCTIONS */

/* 0, 0, 3, 3 */
const rowOffset = (subgridIndex) => (
    Math.floor(subgridIndex / SUBGRIDS_PER_ROW) * SUBGRID_SIZE
);

/* 0, 3, 0, 3 */
const colOffset = (subgridIndex) => (
    (subgridIndex % SUBGRIDS_PER_ROW) * SUBGRID_SIZE
);


function subgridsToBoard(subgrids) {
    /* converts the 4 (3x3) subgrids to a single (6x6) board */
    const board = Array.from({ length: BOARD_SIZE }, () =>
        Array.from({ length: BOARD_SIZE }, () => ({ color: 'lightgrey' }))
    );
    /** Fill the board with the values from the subgrids using Dr. Kooshesh's
    * suggested 00, 03, 30, 33 indexing method.
    */
    subgrids.forEach((subgrid, subgridIndex) => {
        subgrid.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                const ROW_OFFSET = rowOffset(subgridIndex);
                const COL_OFFSET = colOffset(subgridIndex);
                // console.log(`translating subgrid[${subgridIndex}][${rowIndex}][${colIndex}] to board[${ROW_OFFSET + rowIndex}][${COL_OFFSET + colIndex}]`)
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
            console.log(`cellColor: ${cellColor}`);
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
            // const value = row[colIdx];
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

/* COMPONENTS */

function TopBanner() {
    /* renders the top banner */
    return (
        <Box
            margin='auto'
            sx={{
                border: 5,
                borderColor: 'blue',
                borderRadius: 1,
                p: 1,
                m: 1,
            }}
        >
            <Typography variant="h4" align="center">
                Pentago
            </Typography>
        </Box>
    );
}

function Cell({ cell }) {
    /* renders an individual cell */

    return (
        <Box
            sx={{
                height: 20,
                width: 20,
                backgroundColor: cell.color,
                border: 3,
                borderColor: 'teal',
                borderRadius: '50%',
                p: 1,
                m: 1,
            }}
        />
    );
}

function Quadrant({ quadrant, quadrantIdx, onClickCallBack }) {
    /* renders a 3x3 quadrant of cells */
    return (
        <Box
            sx={{
                border: 5,
                borderColor: 'red',
                alignItems: 'center',
                justifyContent: 'center',
                p: 1,
                m: 1,
            }}
        >
            {quadrant.map((row, rowIdx) => (
                <Grid
                    container
                    spacing={2}
                    columns={3}
                    key={rowIdx}
                    sx={{
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    {row.map((cell, cellIdx) => (
                        <Grid
                            item
                            key={cellIdx}
                            onClick={() => onClickCallBack(quadrantIdx, rowIdx, cellIdx)}
                        >
                            <Cell cell={cell} />
                        </Grid>
                    ))}
                </Grid>
            ))}
        </Box>
    );
}

function Quadrants({ subgrids, onClickCallBack }) {
    /* renders the four quadrants, making up a Pentago game board */
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
                {subgrids.map((subgrid, subgridIdx) => (
                    <Grid item key={subgridIdx} >
                        <Quadrant
                            // subgrid={subgrid}
                            // quadrant={subgridIdx}
                            quadrantIdx={subgridIdx}
                            quadrant={subgrid}
                            onClickCallBack={(quadrant, row, cell) => onClickCallBack(quadrant, row, cell)}
                        />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

function Rotators({ onRotateCallBack }) {
    /* renders the four rotators */
    const rotators = [
        [{ quadrant: 0, direction: CLOCKWISE }, { quadrant: 0, direction: COUNTER_CLOCKWISE }],
        [{ quadrant: 1, direction: CLOCKWISE }, { quadrant: 1, direction: COUNTER_CLOCKWISE }],
        [{ quadrant: 2, direction: CLOCKWISE }, { quadrant: 2, direction: COUNTER_CLOCKWISE }],
        [{ quadrant: 3, direction: CLOCKWISE }, { quadrant: 3, direction: COUNTER_CLOCKWISE }],
    ]

    return (
        <Box
            margin='auto'
            sx={{
                border: 5,
                borderColor: 'blue',
                borderRadius: 1,
                p: 1,
                m: 1,
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
                                        onClick={() => onRotateCallBack(rotator.quadrant, rotator.direction)}
                                    >
                                        {rotator.direction}
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

export default function App() {
    /* renders the entire game board */

    /* BOARD STATE */
    /* eslint-disable-next-line no-unused-vars */
    const [hasWinner, setHasWinner] = useState(() => false);
    const [turn, setTurn] = useState(() => BLACK);

    /* subgrids --> Quadrants::quadrants? */
    const [subgrids, setSubGrids] = useState(() => initSubgrids());

    function onClickCallBack(quadrantIdx, row, cell) {
        if (DEBUG) {
            console.log(`quadrant: ${quadrantIdx}, row: ${row}, cell: ${cell}`);
            console.log('should be translated to: ');
            console.log(`boardRow: ${row + rowOffset(quadrantIdx)}, boardCell: ${cell + colOffset(quadrantIdx)}`);
        }
        const newSubgrids = [...subgrids];
        const newSubgrid = [...subgrids[quadrantIdx]];
        const newRow = [...subgrids[quadrantIdx][row]];
        newRow[cell] = { color: turn };
        newSubgrid[row] = newRow;
        newSubgrids[quadrantIdx] = newSubgrid;
        setSubGrids(newSubgrids);
        const theBoard = subgridsToBoard(newSubgrids);
        console.log('theBoard:');
        theBoard.forEach((row) => { console.log(row); });
        if (getWinner(theBoard)) {
            console.log(`\n\nWinner: ${turn}\n\n`);
        }
        setTurn(turn === 'white' ? 'black' : 'white');
    };

    function onRotateCallBack(quadrant, direction) {
        console.log(`quadrant: ${quadrant}, direction: ${direction}`);
    };

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
            <TopBanner />
            <Quadrants
                subgrids={subgrids}
                onClickCallBack={(quadrant, row, cell) => onClickCallBack(quadrant, row, cell)}
            />
            <Rotators
                onRotateCallBack={(quadrant, direction) => onRotateCallBack(quadrant, direction)}
            />
        </Box>
    );
}
