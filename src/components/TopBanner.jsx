/**
 * This file contains the TopBanner component which is used to
 * render the top banner of the Pentago game board including the game title,
 * the current turn (or victor), and a reset button to reset the game state.
 */

import React from 'react';
import { Box, Button, Modal, Typography, Stack } from '@mui/material';
import { brown, amber } from '@mui/material/colors';
import { reset_action } from '../actions';
import PropTypes from 'prop-types';


/**
 * Renders the top banner of the Pentago game board including the game title,
 * the current turn (or victor), and a reset button to reset the game state.
 */
export default function TopBanner({ turn, hasWinner, dispatch }) {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <Stack
            sx={{
                height: '15%',
                width: '90%',
                border: 5,
                borderColor: brown[500],
                borderRadius: 5,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: brown[300],
                mt: 1,
                mb: 1,
            }}
        >
            <Box
                margin='auto'
                sx={{
                    height: '90%',
                    width: '25%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mt: 1,
                    mb: 1,
                }}
            >
                <Button
                    variant="outlined"
                    onClick={handleOpen}
                    sx={{
                        borderColor: brown[900],
                        color: amber[500],
                        backgroundColor: brown[500],
                        '&:hover': {
                            borderColor: brown[900],
                            backgroundColor: brown[700],
                        },
                    }}
                >
                    How To Play
                </Button>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box
                        sx={{
                            height: '50vh',
                            width: '50vh',
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            bgcolor: brown[50],
                            border: 5,
                            borderColor: brown[500],
                            borderRadius: 5,
                            boxShadow: 24,
                            p: 4,
                        }}>
                        <Typography
                            id="modal-modal-title"
                            variant="h4"
                            component="h2"
                        >
                            Pentago Rules
                        </Typography>
                        <Typography
                            id="modal-modal-description"
                            variant="h6"
                            sx={{ mt: 2 }}
                        >
                            <ul>
                                <li>
                                    Take turns placing marbles on the board
                                    until one player gets five in a row.
                                </li>
                                <li>
                                    Players must rotate one of the four
                                    quadrants degrees after placing a marble.
                                </li>
                            </ul>
                        </Typography>
                    </Box>
                </Modal>
            </Box>
            <Box
                margin='auto'
                sx={{
                    height: '90%',
                    width: '45%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mt: 1,
                    mb: 1,
                }}
            >
                <Typography
                    variant='h3'
                    textAlign='center'
                    sx={{
                        color: amber[500],
                        backgroundColor: brown[500],
                        borderRadius: 5,
                        padding: 2,
                    }}
                >
                    Pentago
                </Typography>
            </Box>
            <Box
                margin='auto'
                sx={{
                    height: '90%',
                    width: '25%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mt: 1,
                    mb: 1,
                }}
            >
                <Typography
                    variant='h5'
                    textAlign='center'
                    sx={{
                        color: amber[500],
                        backgroundColor: brown[500],
                        borderRadius: 5,
                        padding: 1.5,
                        mb: 1,
                    }}
                >
                    {hasWinner ? `Winner: ${hasWinner}` : `Turn: ${turn}`}
                </Typography>
                <Button
                    variant="outlined"
                    onClick={() => dispatch(reset_action())}
                    sx={{
                        borderColor: brown[900],
                        color: amber[500],
                        backgroundColor: brown[500],
                        '&:hover': {
                            borderColor: brown[900],
                            backgroundColor: brown[700],
                        },
                    }}
                >
                    Reset
                </Button>
            </Box>
        </Stack>
    );
} TopBanner.propTypes = {
    turn: PropTypes.string.isRequired,
    hasWinner: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired,
};
