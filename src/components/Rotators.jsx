/**
 * This file contains the Rotators component which is responsible for
 * rendering the 4 rotators of a Pentago game board, which are used to rotate
 * their respective quadrants.
 */

import React from 'react';
import { Box, Grid, Button } from '@mui/material';
import { CLOCKWISE } from '../utils/constants';
import { rotate_action } from '../actions';
import PropTypes from 'prop-types';
import { amber, brown } from '@mui/material/colors';

import Rotate90DegreesCwIcon from '@mui/icons-material/Rotate90DegreesCw';
import Rotate90DegreesCcwIcon from '@mui/icons-material/Rotate90DegreesCcw';


/**
 * Renders the Rotators component which is responsible for rendering the 4
 * rotators of a Pentago game board, which are used to rotate their respective
 * quadrants.
 */
export default function Rotators({ rotators, dispatch }) {
    return (
        <Box
            margin='auto'
            sx={{
                height: '30%',
                width: 400,
                flexDirection: 'row',
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'center',
                mt: 1,
                mb: 1,
                padding: 1,
            }}
        >
            <Grid container columns={2} spacing={10}
                sx={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                {rotators.map((rotator, rotatorIdx) => (
                    <Grid item key={rotatorIdx}>
                        <Grid container spacing={2} columns={2}
                            sx={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            {rotator.map((rotator, rotatorIdx) => (
                                <Grid item key={rotatorIdx}>
                                    <Button variant="contained"
                                        onClick={() => dispatch(rotate_action(rotator.quadrant, rotator.direction))}
                                        sx={{
                                            backgroundColor: brown[600],
                                            color: amber[600],
                                            '&:hover': {
                                                backgroundColor: brown[800],
                                                color: amber[600],
                                            },
                                        }}
                                    >
                                        {rotator.direction === CLOCKWISE ?
                                            <Rotate90DegreesCwIcon /> :
                                            <Rotate90DegreesCcwIcon />}
                                    </Button>
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
} Rotators.propTypes = {
    rotators: PropTypes.array.isRequired,
    dispatch: PropTypes.func.isRequired,
};
