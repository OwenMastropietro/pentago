/**
 * Constants used throughout the game.
 */

/** Whether or not to print debug messages. */
export const DEBUG = false;

/** 6x6 board */
export const BOARD_SIZE = 6;
/** 3x3 quadrants */
export const QUADRANT_SIZE = 3;
export const NUM_QUADRANTS = 4;
export const QUADRANTS_PER_ROW = 2;

/** The number of consecutive pieces required to win the game. */
export const WIN_COUNT = 5;
/** One rotation clockwise. */
export const CLOCKWISE = 1;
/** One rotation counter-clockwise is equivalent to 3 rotations clockwise. */
export const COUNTER_CLOCKWISE = 3;

/** The number of players in the game. */
export const WHITE = 'white';
export const BLACK = 'black';
