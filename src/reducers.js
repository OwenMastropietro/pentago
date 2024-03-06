/**
 * Reducers for Pentago
 */


import {
    QUADRANT_SIZE,
    NUM_QUADRANTS,
    WHITE,
    BLACK,
} from './utils/constants';
import { getWinner } from './utils/evaluateBoard';
import { rot90 } from './utils/helpers';


/**
 * Initializes array of 4 (3x3) quadrants containing default lightgrey cells.
 */
function initQuadrants() {
    const quadrant = Array.from({ length: QUADRANT_SIZE }, () =>
        Array.from({ length: QUADRANT_SIZE }, () =>
            ({ color: 'lightgrey' }))
    );
    const quadrants = Array.from({ length: NUM_QUADRANTS }, () => quadrant);

    return quadrants;
}

/**
 * initializes Pentago state
 */
function createInitialState() {
    return {
        quadrants: initQuadrants(),
        turn: WHITE,
        lastPlayerRotated: true,
        lastPlayerMoved: false,
        hasWinner: false,
    };
}

/**
 * Integrates a click on a cell into the game state, updating the quadrants and
 * potentially hasWinner.
 * @param {Object} state - The current game state.
 * @param {Number} quadrantIdx - The index of the quadrant that was clicked.
 * @param {Number} row - The row of the cell that was clicked.
 * @param {Number} cell - The column of the cell that was clicked.
 * @returns {Object} The new game state.
 * @todo: row --> cellRowIdx, cell --> cellColIdx?
 * @todo: throw error if invalid input
 */
function integrateClick(state, quadrantIdx, row, cell) {
    const {
        quadrants, hasWinner, lastPlayerRotated, turn,
    } = state;

    const emptyCellClicked = quadrants[quadrantIdx][row][cell].color === 'lightgrey';

    if (hasWinner || !emptyCellClicked || !lastPlayerRotated) {
        return state;
    }

    const newQuadrants = quadrants.slice();
    const newQuadrant = quadrants[quadrantIdx].slice();
    const newRow = quadrants[quadrantIdx][row].slice();
    newRow[cell] = { color: turn };
    newQuadrant[row] = newRow;
    newQuadrants[quadrantIdx] = newQuadrant;

    return {
        quadrants: newQuadrants,
        lastPlayerRotated: false,
        lastPlayerMoved: true,
        hasWinner: getWinner(newQuadrants)
    };
}

function integrateRotate(state, quadrantIdx, direction) {
    const {
        quadrants, hasWinner, lastPlayerMoved, turn,
    } = state;

    if (hasWinner || !lastPlayerMoved) {
        return state;
    }

    const newQuadrants = quadrants.slice();
    newQuadrants[quadrantIdx] = rot90(quadrants[quadrantIdx], direction);

    const advanceTurn = (prevTurn) => {
        return prevTurn === BLACK ? WHITE : BLACK;
    };

    return {
        quadrants: newQuadrants,
        hasWinner: getWinner(newQuadrants),
        turn: advanceTurn(turn, getWinner(newQuadrants)),
        lastPlayerRotated: true,
        lastPlayerMoved: false,
    };
}

/**
 * Provides reducers for reducing Pentago actions.
 */
function reducers(state, action) {

    if (state === undefined) {
        return createInitialState();
    }

    if (action.type === 'INITIALIZE' || action.type === 'RESET') {
        return createInitialState();
    }

    if (action.type === 'CELL_CLICKED') {
        const { quadrantIdx, row, cell } = action.payload;
        return {
            ...state,
            ...integrateClick(state, quadrantIdx, row, cell),
        };
    }

    if (action.type === 'ROTATE') {
        const { quadrantIdx, direction } = action.payload;
        return {
            ...state,
            ...integrateRotate(state, quadrantIdx, direction),
        };
    }

    console.error(`Unknown action type: ${action.type}`);
}


export {
    reducers,
    createInitialState
};