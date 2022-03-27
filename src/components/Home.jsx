import React, { useState, useEffect } from 'react';
import {
    Grid,
    Typography,
    Stack,
    Button,
    IconButton,
    CircularProgress
} from '@mui/material/';
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import Configurator from './Configurator';
import FeatureModel from './FeatureModel';
import { Configuration } from '../lib/feature-configurator/configuration';

const Alert = React.forwardRef(function Alert(
    props,
    ref,
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const defaultSnackbar = {
    open: false,
    vertical: 'bottom',
    horizontal: 'left',
    message: '',
    timeout: 6000,
    severity: 'info'
};

const Home = () => {
    const [configuration, setConfiguration] = useState({});
    const [actions, setActions] = useState({
        unfoldAll: false,
        foldAll: false,
        updateFeatureRender: false
    });
    const [draggableMode, setDraggableMode] = useState(false);
    const [snackbar, setSnackbar] = useState(defaultSnackbar);

    useEffect(() => {
        if (draggableMode) {
            setSnackbar({
                open: true,
                vertical: 'top',
                horizontal: 'center',
                severity: 'info',
                message: 'Draggable mode: you can now drag the feature selection panel across the screen.',
                timeout: 6000
            });
        }
    }, [draggableMode]);

    const handleClose = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const getFileContent = async file => {
        var fileContent = '';
        const reader = new FileReader();
    
        await new Promise(resolve => {
            reader.onload = (e) => { 
                // must verify later that json provided is correct
                fileContent = e.target.result
                resolve(true);
            };
    
            reader.readAsText(file);
        });
        
        return fileContent;
    }

    const importConfiguration = async (e) => {
        try {
            const file = e.target.files[0];
            const xml = await getFileContent(file);
            const newConfiguration = Configuration.fromXml(configuration.model, xml);
            setConfiguration(new Configuration(configuration.model, newConfiguration.selectedFeatures, newConfiguration.deselectedFeatures));
            setActions({ ...actions, updateFeatureRender: true })
        } catch (e) {
            console.error (e);
            setSnackbar({
                open: true,
                vertical: 'top',
                horizontal: 'center',
                severity: 'info',
                message: 'Imported configuration is invalid.',
                timeout: 6000
            });
        }
    }

    const exportConfiguration = () => {
        if (configuration.isComplete()) {
            var bb = new Blob([configuration.serialize()], { type: 'text/plain' });
            var a = document.createElement('a');
            a.download = 'configuration.xml';
            a.href = window.URL.createObjectURL(bb);
            a.click();
        } else {
            setSnackbar({
                open: true,
                vertical: 'bottom',
                horizontal: 'left',
                severity: 'error',
                message: 'The selection is not complete: you cannot export your configuration yet.',
                timeout: 6000
            })
        }
    }

    const renderLoading = () => {
        return (
            <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justifyContent="center"
                style={{ minHeight: '100vh' }}
                >

                <Grid item xs={3}>
                    <CircularProgress size="5rem" />
                </Grid>   
                
            </Grid> 
        )
    };

    return (
        <>
            <Grid display={'model' in configuration ? '' : 'none'} container spacing={2} style={{ paddingTop: '40px', paddingLeft: '20px', paddingRight: '20px' }}>
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
                        setConfiguration={setConfiguration}
                        configuration={configuration}
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
                    <Button variant="outlined" onClick={() => setActions({ ...actions, unfoldAll: true })}>Unfold all</Button>
                    <Button variant="outlined" onClick={() => setActions({ ...actions, foldAll: true })}>Fold all</Button>
                    <Button variant="outlined" onClick={exportConfiguration} startIcon={<FileDownloadIcon />}>Export</Button>
                    <Button
                        variant="outlined"
                        component="label"
                        startIcon={<FileUploadIcon />}
                    >
                        Import
                        <input
                            type="file"
                            accept='.xml'
                            onChange={importConfiguration}
                            hidden
                        />
                    </Button>
                </Stack>
                <FeatureModel configuration={configuration} />
                </Grid>
                <Snackbar
                    anchorOrigin={{ vertical: snackbar.vertical, horizontal: snackbar.horizontal }}
                    open={snackbar.open}
                    autoHideDuration={snackbar.timeout}
                    onClose={handleClose}
                >
                    <Alert onClose={handleClose} severity={snackbar.severity} sx={{ width: '100%' }}>
                        { snackbar.message }
                    </Alert>
                </Snackbar>
            </Grid>
            {(!('model' in configuration) && renderLoading())}
        </>
    )
}

export default Home;