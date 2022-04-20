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
  cardPadding: {
    padding: '10px'
  },
  stateIcon: {
    textAlign: 'center',
    paddingTop: '20px'
  }
}));

const deepCopy = (item) => JSON.parse(JSON.stringify(item));

const blankStateMachine = {
  name: "",
  states: []
}

const blankState = {
  name: "",
  participants: [],
  roles: []
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

const StateMachineSetupForm = ({ nextPage, previousPage, config, displayError, activated }) => {
  const classes = useStyles();
  const [stateMachines, setStateMachines] = useState(config.stateMachines || [{ ...blankStateMachine, states: [blankState]}]);

  const stateMachinesValid = () => {
    const foundStateMachine = {};
  
    for (let s of stateMachines) {
      if (foundStateMachine[s.name] || !s.name.length) return false;
      foundStateMachine[s.name] = true;
    }
  
    return true;
  }
  
  const submitStateMachine = () => {
    if (stateMachinesValid()) nextPage('stateMachines', stateMachines);
    else displayError('Cannot submit: there is at least one state machine or state that do not have a unique, non-null, and valid name.');
  }

  const changeStateMachineName = (smId, e) => {
    const newStateMachine = deepCopy(stateMachines);

    newStateMachine[smId].name = e.target.value;

    setStateMachines(newStateMachine);
  };

  const changeStateName = (smId, sId, e) => {
    const newStateMachine = deepCopy(stateMachines);

    newStateMachine[smId].states[sId].name = e.target.value;

    setStateMachines(newStateMachine);
  };
  
  const changeRoles = (smId, sId, e) => {
    console.log(smId, sId, e)
    const newStateMachine = deepCopy(stateMachines);
    newStateMachine[smId].states[sId].roles = e.target.value;
    setStateMachines(newStateMachine);
  };

  const changeParticipants = (smId, sId, e) => {
    const newStateMachine = deepCopy(stateMachines);
    newStateMachine[smId].states[sId].participants = e.target.value;
    setStateMachines(newStateMachine);
  };

  const deleteStateMachine = (stateId) => {
    let newStateMachine = deepCopy(stateMachines);

    newStateMachine = newStateMachine.filter((_, i) => i !== stateId);

    setStateMachines(newStateMachine);
  };

  const deleteState = (smId, sId) => {
    let newStateMachine = deepCopy(stateMachines);
    
    newStateMachine[smId].states = newStateMachine[smId].states.filter((_, i) => i !== sId);

    setStateMachines(newStateMachine);
  };

  const newStateMachine = () => {
    setStateMachines([...stateMachines, blankStateMachine])
  };

  const newState = (i, e) => {
    const newStateMachines = deepCopy(stateMachines);
    newStateMachines[i].states = [...newStateMachines[i].states, blankState];
    setStateMachines(newStateMachines);
  }

  return (
    <Box className={classes.boxPadding}>
      <Typography component="h1" variant="h4">
        State machine setup
      </Typography>
      <Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={newStateMachine}>
          Add state machine
        </Button>
      </Box>
      
        {
          stateMachines.length
          ? (
            <Grid container spacing={2}>
              {
                stateMachines.map((sm, i) => (
                  <Grid item xs={12} key={i}>
                    <Card className={classes.cardPadding}>
                      <CardHeader 
                        title={`New state machine model n°${i + 1}`} 
                        action={
                          <IconButton aria-label="delete">
                            <ClearIcon onClick={deleteStateMachine.bind(this, i)} />
                          </IconButton>
                        }
                      >
                      </CardHeader>
                      <CardContent>
                        <TextField 
                          fullWidth
                          variant="standard"
                          label="State machine name"
                          value={sm.name} 
                          onChange={changeStateMachineName.bind(this, i)} 
                          InputProps={{
                            className: classes.itemMargin
                          }}
                        />
                        <Button variant="contained" startIcon={<AddIcon />} onClick={newState.bind(this, i)}>
                          Add state
                        </Button>
                      </CardContent>
                      <CardContent>
                        <Grid container spacing={2}>
                          {
                            stateMachines[i].states.map((s, j) => (
                              <Grid item xs={12} sm={6} md={4} key={j}>
                                <Card className={classes.cardPadding}>
                                  <CardHeader 
                                    title={`State n°${j + 1}`} 
                                    action={
                                      <IconButton aria-label="delete">
                                        <ClearIcon onClick={deleteState.bind(this, i, j)} />
                                      </IconButton>
                                    }
                                  />
                                  <CardContent>
                                    <FormGroup>
                                      <TextField 
                                        fullWidth
                                        variant="standard"
                                        label="Name"
                                        value={s.name} 
                                        onChange={changeStateName.bind(this, i, j)} 
                                        InputProps={{
                                          className: classes.itemMargin
                                        }}
                                      />
                                      {
                                        activated.roles && (
                                          <FormControl sx={{ marginBottom: '15px'}} variant="standard" fullWidth>
                                            <InputLabel id="roles-list-label">Authorized roles</InputLabel>
                                            <Select
                                              labelId="roles-list-label"
                                              id="roles-list"
                                              multiple
                                              value={s.roles}
                                              onChange={changeRoles.bind(this, i, j)}
                                              input={<Input id="roles-list-chip" label="Roles" />}
                                              renderValue={(roles) => (
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                  {roles.map((value) => <Chip key={value} label={value} />)}
                                                </Box>
                                              )}
                                              MenuProps={MenuProps}
                                            >
                                              <MenuItem value="" disabled>
                                                <em>None</em>
                                              </MenuItem>
                                              {
                                                config.roles.flatMap((r) => {
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
                                        )
                                      }
                                      <FormControl sx={{ marginBottom: '15px'}} variant="standard" fullWidth>
                                        <InputLabel id="participants-list-label">Authorized participants</InputLabel>
                                        <Select
                                          labelId="participants-list-label"
                                          id="participants-list"
                                          multiple
                                          value={s.participants}
                                          onChange={changeParticipants.bind(this, i, j)}
                                          input={<Input id="participants-list-chip" label="Roles" />}
                                          renderValue={(participants) => (
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                              {participants.map((value) => <Chip key={value} label={value} />)}
                                            </Box>
                                          )}
                                          MenuProps={MenuProps}
                                        >
                                          <MenuItem value="" disabled>
                                            <em>None</em>
                                          </MenuItem>
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
                              </Grid>
                            ))
                          }
                        </Grid>
                      </CardContent>
                    </Card>
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