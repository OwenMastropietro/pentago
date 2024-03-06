/**
 * This file contains the Quadrants, Quadrant, and Cell components which are
 * used to render the 4 (3x3) quadrants of a Pentago game board.
 */

import React from 'react';
import { Box, Grid } from '@mui/material';
import { green, brown } from '@mui/material/colors';

import PropTypes from 'prop-types';
import Rotators from './Rotators';
import { CLOCKWISE, COUNTER_CLOCKWISE } from '../utils/constants';
import { click_on_cell_action } from '../actions';


/**
 * Renders a single board cell with cellColor.
*/
function Cell({ cellColor }) {
    return (
        <Box
            sx={{
                position: 'relative',
                zIndex: 1,
                height: 25,
                width: 25,
                backgroundColor: cellColor,
                border: 2,
                borderColor: brown[600],
                borderRadius: '50%',
                alignItems: 'center',
                justifyContent: 'center',
                margin: 1,
                mt: 2,
                padding: 1,
            }}
        />
    );
} Cell.propTypes = {
    cellColor: PropTypes.string.isRequired,
};

/**
 * Renders a 3x3 quadrant of cells
 */
function Quadrant({ quadrant, quadrantIdx, dispatch }) {
    return (
        <Box
            sx={{
                margin: 0.5,
                height: 200,
                width: 200,
                border: 2,
                borderColor: brown[600],
                borderRadius: 5,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: green[800],
                padding: 1,
            }}
        >
            {quadrant.map((row, rowIdx) => (
                <Grid container columns={3} key={rowIdx}
                    sx={{
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    {row.map((cell, cellIdx) => (
                        <Grid item key={cellIdx}
                            onClick={() => dispatch(click_on_cell_action(quadrantIdx, rowIdx, cellIdx))}
                        >
                            <Cell cellColor={cell.color} />
                        </Grid>
                    ))}
                </Grid>
            ))}
        </Box >
    );
} Quadrant.propTypes = {
    quadrant: PropTypes.array.isRequired,
    quadrantIdx: PropTypes.number.isRequired,
    dispatch: PropTypes.func.isRequired,
};

/**
 * Renders the 4 quadrants of the board
 */
export default function Quadrants({ quadrants, dispatch }) {
    const topRotators = [
        [{ quadrant: 0, direction: COUNTER_CLOCKWISE }, { quadrant: 0, direction: CLOCKWISE }],
        [{ quadrant: 1, direction: COUNTER_CLOCKWISE }, { quadrant: 1, direction: CLOCKWISE }],
    ];

    const bottomRotators = [
        [{ quadrant: 2, direction: COUNTER_CLOCKWISE }, { quadrant: 2, direction: CLOCKWISE }],
        [{ quadrant: 3, direction: COUNTER_CLOCKWISE }, { quadrant: 3, direction: CLOCKWISE }],
    ];

    return (
        <Box margin='auto'
            sx={{
                height: 600,
                width: 600,
                border: 5,
                borderColor: brown[600],
                borderRadius: 5,
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                display: 'flex',
                backgroundColor: brown.A400,
            }}
        >
            <Box
                sx={{
                    height: 100,
                    width: 600,
                    border: 5,
                    borderColor: brown[600],
                    borderRadius: 5,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    display: 'flex',
                    backgroundColor: brown[300],
                }}
            >
                <Rotators rotators={topRotators} dispatch={dispatch} />
            </Box>

            <Grid container columns={2}
                sx={{
                    height: '100%',
                    width: '100%',
                    borderRadius: 5,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    display: 'flex',
                }}
            >
                {quadrants.map((quadrant, quadrantIdx) => (
                    <Grid item key={quadrantIdx} >
                        <Quadrant
                            quadrant={quadrant}
                            quadrantIdx={quadrantIdx}
                            dispatch={dispatch}
                        />
                    </Grid>
                ))}
            </Grid>
            <Box
                sx={{
                    height: 100,
                    width: 600,
                    border: 5,
                    borderColor: brown[600],
                    borderRadius: 5,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    display: 'flex',
                    backgroundColor: brown[300],
                }}
            >
                <Rotators rotators={bottomRotators} dispatch={dispatch} />
            </Box>
        </Box>
    );
} Quadrants.propTypes = {
    quadrants: PropTypes.array.isRequired,
    rotators: PropTypes.array.isRequired,
    dispatch: PropTypes.func.isRequired,
};
