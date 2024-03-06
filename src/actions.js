/**
 * action for Pentago game.
 */


import { DEBUG } from './utils/constants';


/**
 * Creates an action for clicking on a cell.
 * - @param {Number} quadrantIdx - index of selected quadrant.
 * - @param {Number} rowIdx - row of selected cell.
 * - @param {Number} cellIdx - column of selected cell that was clicked.
 * - @returns {Object} The action.
 */
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

/**
 * Creates an action for rotating a quadrant.
 * - @param {Number} quadrantIdx - index of quadrant to rotate.
 * - @param {Number} direction - CLOCKWISE or COUNTER_CLOCKWISE.
 * - @returns {Object} The action.
 */
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

/**
 * Creates an action for resetting the game.
 * - @returns {Object} The action.
 */
function reset_action() {
    return { type: 'RESET' };
}


export {
    click_on_cell_action,
    rotate_action,
    reset_action
};
