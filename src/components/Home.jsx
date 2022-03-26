import React, { useState } from 'react';
import {
    Grid,
    Typography,
    Stack,
    Button
} from '@mui/material/';
import Configurator from './Configurator';
import FeatureModel from './FeatureModel';

const Home = () => {
    const [configuration, setConfiguration] = useState();
    const [actions, setActions] = useState({
        unfoldAll: false,
        foldAll: false
    });

    return (
        <Grid container spacing={2} style={{ paddingTop: '40px', paddingLeft: '20px', paddingRight: '20px' }}>
            <Grid item xs={12}>
            <Typography variant="h4" component="h1" gutterBottom>
                Blockchain feature selection
            </Typography>
            <Typography variant="body1" component="h2" gutterBottom>
                Welcome! Please select your desired features and when your selection is complete, click on Generate to get your blockchain application.
            </Typography>
            </Grid>
            <Grid item xs={4}>
                <Configurator setExtConfiguration={setConfiguration} actions={actions} setActions={setActions} />
            </Grid>
            <Grid item xs={8}>
            <Stack spacing={2} direction="row">
                <Button variant="contained" onClick={() => setActions({ ...actions, unfoldAll: true })}>Unfold features</Button>
                <Button variant="contained" onClick={() => setActions({ ...actions, foldAll: true })}>Fold features</Button>
            </Stack>
            <FeatureModel configuration={configuration} />
            </Grid>
        </Grid>
    )
}

export default Home;