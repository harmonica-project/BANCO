import React, { useState } from 'react';
import { Snackbar, Alert } from '@mui/material';
// Used to remove components related to disabled features
import activated from '../../config-app';
import DisplayConfigResult from './DisplayConfigResult';
import StartConfig from './StartConfig';

/* #CreateIndividualAtSetup */
import ParticipantSetupForm from './ParticipantSetupForm';
/* /CreateIndividualAtSetup */
/* #RecordRegistration */
import RecordsColSetupForm from './RecordsColSetupForm';
/* /RecordRegistration */
/* #Roles */
import RoleSetupForm from './RoleSetupForm';
/* /Roles */
/* #StateMachine */
import StateMachineSetupForm from './StateMachineSetupForm';
/* /StateMachine */
/* #AssetTracking */
import AssetsSetupForm from './AssetsSetupForm';
/* /AssetTracking */

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
    if (source.length) setConfig({ ...config, [source]: content });
  };

  const handleSimpleNextPage = () => {
    setCurrent(current + 1);
  };

  const handlePreviousPage = () => {
    setCurrent(current - 1);
  };

  const props = {
    'nextPage': handleNextPage,
    'previousPage': handlePreviousPage,
    config,
    setConfig,
    displayError,
    activated
  }

  const pages = [
    <StartConfig {...props} nextPage={handleSimpleNextPage} />,
    /* #Roles */
    <RoleSetupForm {...props} />,
    /* /Roles */
    /* #CreateIndividualAtSetup */
    <ParticipantSetupForm {...props} />,
    /* /CreateIndividualAtSetup */
    /* #AssetTracking */
    <AssetsSetupForm {...props} />,
    /* /AssetTracking */
    /* #RecordRegistration */
    <RecordsColSetupForm {...props} />,
    /* /RecordRegistration */
    /* #StateMachine */
    <StateMachineSetupForm {...props} />,
    /* /StateMachine */
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