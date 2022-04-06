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
    }
  }
}));

const ParticipantSetupForm = ({ nextPage }) => {
  const classes = useStyles();

  return (
    <Box className={classes.boxPadding}>
      <Typography component="h1" variant="h4">
        Participant setup
      </Typography>
      <Box>
        <Button variant="contained" onClick={nextPage}>Submit</Button>
      </Box>
    </Box>
  )
}

export default ParticipantSetupForm;