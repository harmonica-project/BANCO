import React from 'react';
import {
  Box,
  Typography,
  Button
} from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(() => ({
  boxPadding: {
    "& > *": {
      padding: '8px'
    },
    textAlign: 'center'
  }
}));

const StartConfig = ({ nextPage }) => {
  const classes = useStyles();

  return (
    <Box className={classes.boxPadding}>
      <Typography component="h1" variant="h4">
        Welcome!
      </Typography> 
      <Typography component="p" variant="body1">
        In this section, you can configure your traceability application (e.g. roles, participants, traced assets and records, ...).
        The choices you will be able to make depend on the selected features in BANCO.
      </Typography> 
      <Box>
        <Button variant="contained" onClick={nextPage}>Start configuration</Button>
      </Box>
    </Box>
  )
}

export default StartConfig;