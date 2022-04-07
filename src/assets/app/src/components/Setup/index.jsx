import React, { useState } from 'react';
import DisplayConfigResult from './DisplayConfigResult';
import ParticipantSetupForm from './ParticipantSetupForm';
import RecordSetupForm from './RecordSetupForm';
import RoleSetupForm from './RoleSetupForm';
import StateMachineSetupForm from './StateMachineSetupForm';
import StartConfig from './StartConfig';
import { Snackbar, Alert } from '@mui/material';

const defaultSnackbar = {
  open: false,
  message: ''  
};

const Setup = () => {
  const [current, setCurrent] = useState(0);
  const [config, setConfig] = useState({});
  const [snackbarProps, setSnackbarProps] = useState(defaultSnackbar);

  const displayError = (message) => {
    setSnackbarProps({
      open: true,
      message
    });
  }

  const handleClose = (_, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackbarProps(defaultSnackbar);
  };

  const handleNextPage = (source, content = {}) => {
    setCurrent(current + 1);
    if (source) setConfig({ ...config, [source]: content });
  };

  const handlePreviousPage = () => {
    setCurrent(current - 1);
  };

  const props = {
    'nextPage': handleNextPage,
    'previousPage': handlePreviousPage,
    config,
    setConfig,
    displayError
  }

  const pages = [
    <StartConfig {...props} />,
    <RoleSetupForm {...props} />,
    <ParticipantSetupForm {...props} />,
    <RecordSetupForm {...props} />,
    <StateMachineSetupForm {...props} />,
    <DisplayConfigResult {...props} />
  ]

  return (
    <>
      {pages[current]}
      <Snackbar
        open={snackbarProps.open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleClose} severity="error">{snackbarProps.message}</Alert>
      </Snackbar>
    </>
  );
}

export default Setup;