import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  TextField,
  Grid,
  CardContent,
  CardHeader,
  IconButton,
  FormGroup,
  FormControl,
  InputLabel,
  Select,
  Input,
  Chip,
  MenuItem
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(() => ({
  boxPadding: {
    "& > *": {
      padding: '8px'
    }
  },
  itemMargin: {
    marginBottom: '10px'
  },
  recordColCard: {
    padding: '10px'
  },
  stateIcon: {
    textAlign: 'center',
    paddingTop: '20px'
  }
}));

const deepCopy = (item) => JSON.parse(JSON.stringify(item));

const blankRecordCol = {
  name: '',
  roles: [],
  participants: []
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const StateMachineSetupForm = ({ nextPage, previousPage, config, displayError }) => {
  const classes = useStyles();
  const [stateMachine, setStateMachine] = useState(config.stateMachine || [blankRecordCol]);

  const stateMachineValid = () => {
    const foundStateMachine = {};
  
    for (let r of stateMachine) {
      if (foundStateMachine[r.name] || !r.name.length) return false;
      foundStateMachine[r.name] = true;
    }
  
    return true;
  }
  
  const submitStateMachine = () => {
    if (stateMachineValid()) nextPage('stateMachine', stateMachine);
    else displayError('Cannot submit: there is at least one recordCol that do not have a unique, non-null, and valid name.');
  }

  const changeRecordColAddr = (recordsColId, e) => {
    const newStateMachine = deepCopy(stateMachine);

    newStateMachine[recordsColId].name = e.target.value;

    setStateMachine(newStateMachine);
  };

  const changeRoles = (recordsColId, e) => {
    const newStateMachine = deepCopy(stateMachine);
    newStateMachine[recordsColId].roles = e.target.value;
    setStateMachine(newStateMachine);
  };

  const changeParticipants = (recordsColId, e) => {
    const newStateMachine = deepCopy(stateMachine);
    newStateMachine[recordsColId].participants = e.target.value;
    setStateMachine(newStateMachine);
  };

  const deleteState = (stateId) => {
    let newStateMachine = deepCopy(stateMachine);

    newStateMachine = newStateMachine.filter((_, i) => i !== stateId);

    setStateMachine(newStateMachine);
  };

  const newState = () => {
    setStateMachine([...stateMachine, blankRecordCol])
  };

  return (
    <Box className={classes.boxPadding}>
      <Typography component="h1" variant="h4">
        State machine setup
      </Typography>
      <Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={newState}>
          Add
        </Button>
      </Box>
      
        {
          stateMachine.length
          ? (
            <Grid container spacing={2}>
              {
                stateMachine.map((r, i) => (
                  <Grid item xs={12} key={i}>
                    <Card className={classes.recordColCard}>
                      <CardHeader 
                        title={`New state n°${i + 1}`} 
                        action={
                          <IconButton aria-label="delete">
                            <ClearIcon onClick={deleteState.bind(this, i)} />
                          </IconButton>
                        }
                      />
                      <CardContent>
                        <FormGroup>
                          <TextField 
                            fullWidth
                            variant="standard"
                            label="Name"
                            value={r.name} 
                            onChange={changeRecordColAddr.bind(this, i)} 
                            InputProps={{
                              className: classes.itemMargin
                            }}
                          />
                          <FormControl sx={{ marginBottom: '15px'}} variant="standard" fullWidth>
                            <InputLabel id="roles-list-label">Authorized roles</InputLabel>
                            <Select
                              labelId="roles-list-label"
                              id="roles-list"
                              multiple
                              value={stateMachine[i].roles}
                              onChange={changeRoles.bind(this, i)}
                              input={<Input id="roles-list-chip" label="Roles" />}
                              renderValue={(roles) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                  {roles.map((value) => <Chip key={value} label={value} />)}
                                </Box>
                              )}
                              MenuProps={MenuProps}
                            >
                              {
                                config.roles.flatMap((r, i) => {
                                  if (r.name.length) {
                                    return (
                                      <MenuItem
                                        key={`roleCol-${r.name}`}
                                        value={r.name}
                                      >
                                        {r.name}
                                      </MenuItem>
                                    )
                                  } else return [];
                                })
                              }
                            </Select>
                          </FormControl>
                          <FormControl sx={{ marginBottom: '15px'}} variant="standard" fullWidth>
                            <InputLabel id="participants-list-label">Authorized participants</InputLabel>
                            <Select
                              labelId="participants-list-label"
                              id="participants-list"
                              multiple
                              value={stateMachine[i].participants}
                              onChange={changeParticipants.bind(this, i)}
                              input={<Input id="participants-list-chip" label="Roles" />}
                              renderValue={(participants) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                  {participants.map((value) => <Chip key={value} label={value} />)}
                                </Box>
                              )}
                              MenuProps={MenuProps}
                            >
                              {
                                config.participants.flatMap((r, i) => {
                                  if (r.address.length) {
                                    return (
                                      <MenuItem
                                        key={`participantCol-${r.address}`}
                                        value={r.address}
                                      >
                                        {`${r.address.substr(0, 20)}...`}
                                      </MenuItem>
                                    )
                                  } else return [];
                                })
                              }
                            </Select>
                          </FormControl>
                        </FormGroup>
                      </CardContent>
                    </Card>
                    {
                      stateMachine.length && i < stateMachine.length - 1 
                      ? (
                        <Grid className={classes.stateIcon} item xs={12}>
                          <ArrowDownwardIcon sx={{ fontSize: 40 }} />
                        </Grid>
                      ) : <></>
                    }
                  </Grid>
                ))
              }
              </Grid>
            )
          : (
            <Typography component="p" variant="h6">Click on "+" above to add a new record collection.</Typography>
          )
        }
      <Box>
        <Button variant="contained" startIcon={<ArrowBackIcon />} onClick={previousPage}>
          Previous
        </Button>
        &nbsp;
        <Button variant="contained" onClick={submitStateMachine}>Submit</Button>
      </Box>
    </Box>
  )
}

export default StateMachineSetupForm;