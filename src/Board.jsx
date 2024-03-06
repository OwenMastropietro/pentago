/**
 * Board.jsx
 * This file contains the Board component which is responsible for rendering
 * a Pentago game board, including the TopBanner, Quadrants, and Rotators of the
 * game.
 */

import React, { useReducer } from 'react';
import { Box } from '@mui/material';

import Quadrants from './components/Quadrants';
import TopBanner from './components/TopBanner';

import { createInitialState, reducers } from './reducers';
import { COUNTER_CLOCKWISE, CLOCKWISE } from './utils/constants';

/**
 * Renders the Board component containing the TopBanner, Quadrants, and Rotators
 */
export default function Board() {
    const [state, dispatch] = useReducer(reducers, undefined, createInitialState);
    const { quadrants, hasWinner, turn } = state;
    const rotators = [
        [{ quadrant: 0, direction: COUNTER_CLOCKWISE }, { quadrant: 0, direction: CLOCKWISE }],
        [{ quadrant: 1, direction: COUNTER_CLOCKWISE }, { quadrant: 1, direction: CLOCKWISE }],
        [{ quadrant: 2, direction: COUNTER_CLOCKWISE }, { quadrant: 2, direction: CLOCKWISE }],
        [{ quadrant: 3, direction: COUNTER_CLOCKWISE }, { quadrant: 3, direction: CLOCKWISE }],
    ];

    return (
        <Box margin='auto'
            sx={{
                mt: 5,
                height: 800,
                width: 800,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 5,
            }}
        >
            <TopBanner
                turn={turn}
                hasWinner={hasWinner}
                dispatch={dispatch}
            />
            <Quadrants
                quadrants={quadrants}
                rotators={rotators}
                dispatch={dispatch}
            />
        </Box>
    );
}
