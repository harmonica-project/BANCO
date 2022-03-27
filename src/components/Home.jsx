import React, { useState, useEffect } from 'react';
import {
    Grid,
    Typography,
    Stack,
    Button,
    IconButton
} from '@mui/material/';
import Snackbar from '@mui/material/Snackbar';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import Configurator from './Configurator';
import FeatureModel from './FeatureModel';

const defaultSnackbar = {
    open: false,
    vertical: 'bottom',
    horizontal: 'left',
    message: '',
    timeout: 6000
};

const Home = () => {
    const [configuration, setConfiguration] = useState();
    const [actions, setActions] = useState({
        unfoldAll: false,
        foldAll: false
    });
    const [draggableMode, setDraggableMode] = useState(false);
    const [snackbar, setSnackbar] = useState(defaultSnackbar);

    useEffect(() => {
        if (draggableMode) {
            setSnackbar({
                open: true,
                vertical: 'top',
                horizontal: 'center',
                message: 'Draggable mode: you can now drag the feature selection panel across the screen.',
                timeout: 6000
            });
        }
    }, [draggableMode]);

    const handleClose = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <Grid container spacing={2} style={{ paddingTop: '40px', paddingLeft: '20px', paddingRight: '20px' }}>
            <Grid item xs={12}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Blockchain feature selection
                </Typography>
                <Typography variant="body1" component="h2">
                    Welcome! Please select your desired features and when your selection is complete, click on Generate to get your blockchain application.
                </Typography>
            </Grid>
            <Grid item xs={4}>
                <Configurator 
                    setExtConfiguration={setConfiguration}
                    actions={actions}
                    setActions={setActions} 
                    draggableMode={draggableMode}
                />
            </Grid>
            <Grid item xs={draggableMode ? 12 : 8}>
            <Stack spacing={2} direction="row">
                <IconButton 
                    color="primary"
                    aria-label="Expand feature model"
                    style={{ border: '1px solid #1976d2'}}
                    onClick={() => setDraggableMode(!draggableMode)}
                >
                    {draggableMode ? <CloseFullscreenIcon /> : <OpenInFullIcon />}
                </IconButton>
                <Button variant="outlined" onClick={() => setActions({ ...actions, unfoldAll: true })}>Unfold features</Button>
                <Button variant="outlined" onClick={() => setActions({ ...actions, foldAll: true })}>Fold features</Button>
            </Stack>
            <FeatureModel configuration={configuration} />
            </Grid>
            <Snackbar
                anchorOrigin={{ vertical: snackbar.vertical, horizontal: snackbar.horizontal }}
                open={snackbar.open}
                autoHideDuration={snackbar.timeout}
                message={snackbar.message}
                onClose={handleClose}
            />
        </Grid>
    )
}

export default Home;