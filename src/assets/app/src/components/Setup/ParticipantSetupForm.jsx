import React from 'react';
import {
  Box,
  Typography,
  Button
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const useStyles = makeStyles(() => ({
  boxPadding: {
    "& > *": {
      padding: '8px'
    }
  }
}));

const ParticipantSetupForm = ({ nextPage, previousPage }) => {
  const classes = useStyles();

  return (
    <Box className={classes.boxPadding}>
      <Typography component="h1" variant="h4">
        Participant setup
      </Typography>
      <Box>
        <Button variant="contained" startIcon={<ArrowBackIcon />} onClick={previousPage}>
          Previous
        </Button>
        &nbsp;
        <Button variant="contained" onClick={() => console.log('submit')}>Submit</Button>
      </Box>
    </Box>
  )
}

export default ParticipantSetupForm;