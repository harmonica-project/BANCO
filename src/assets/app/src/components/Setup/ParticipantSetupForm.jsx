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
  FormControlLabel,
  Checkbox,
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
  participantCard: {
    padding: '10px'
  }
}));

function validateAddress(address) {
  return (/^(0x){1}[0-9a-fA-F]{40}$/i.test(address));
}

const deepCopy = (item) => JSON.parse(JSON.stringify(item));

const blankParticipant = {
  address: '',
  isAdmin: false,
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

const ParticipantSetupForm = ({ nextPage, previousPage, config, setConfig, displayError }) => {
  const classes = useStyles();
  const [participants, setParticipants] = useState(config.participants || [blankParticipant]);

  const participantsValid = () => {
    const foundParticipants = {};
  
    for (let r of participants) {
      if (foundParticipants[r.address] || !r.address.length || !validateAddress(r.address)) return false;
      foundParticipants[r.address] = true;
    }
  
    return true;
  }
  
  const submitParticipants = () => {
    if (participantsValid()) nextPage('participants', participants);
    else displayError('Cannot submit: there is at least one participant that do not have a unique, non-null, and valid address.');
  }

  const changeParticipantAddr = (participantId, e) => {
    const newParticipants = deepCopy(participants);
    const newAddress = e.target.value;

    for (let key of ['recordsCols', 'stateMachine']) {
      if (config[key]) {
        const newSubconfig = deepCopy(config[key]);
        for (let i in newSubconfig) {
          let rId = newSubconfig[i].participants.findIndex(p => p === participants[participantId].address);
          newSubconfig[i].roles[rId] = newAddress;
        }

        setConfig({ ...config, [key]: newSubconfig });
      }
    }
    
    newParticipants[participantId].address = newAddress;
    setParticipants(newParticipants);
  };

  const changeRoles = (participantId, e) => {
    const newParticipants = deepCopy(participants);
    newParticipants[participantId].roles = e.target.value;
    setParticipants(newParticipants);
  };

  const changeIsAdmin = (participantId, e) => {
    const newParticipants = deepCopy(participants);
    newParticipants[participantId].isAdmin = e.target.checked;
    setParticipants(newParticipants);
  };

  const deleteParticipant = (participantId) => {
    let newParticipants = deepCopy(participants);

    for (let key of ['recordsCols']) {
      if (config[key]) {
        let newSubconfig = deepCopy(config[key]);
        for (let i in newSubconfig) {
          newSubconfig[i].roles = newSubconfig[i].participants.filter(p => p !== participants[participantId].address);
        }

        setConfig({ ...config, [key]: newSubconfig });
      }
    }

    newParticipants = newParticipants.filter((_, i) => i !== participantId);

    setParticipants(newParticipants);
  };

  const newParticipant = () => {
    setParticipants([...participants, blankParticipant])
  };

  return (
    <Box className={classes.boxPadding}>
      <Typography component="h1" variant="h4">
        Participant setup
      </Typography>
      <Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={newParticipant}>
          Add
        </Button>
      </Box>
      
        {
          participants.length
          ? (
            <Grid container spacing={2}>
              {
                participants.map((r, i) => (
                  <Grid item xs={12} sm={4} key={i}>
                    <Card className={classes.participantCard}>
                      <CardHeader 
                        title={`New participant n°${i + 1}`} 
                        action={
                          <IconButton aria-label="delete">
                            <ClearIcon onClick={deleteParticipant.bind(this, i)} />
                          </IconButton>
                        }
                      />
                      <CardContent>
                        <FormGroup>
                          <TextField 
                            fullWidth
                            variant="standard"
                            label="Address"
                            value={r.address} 
                            onChange={changeParticipantAddr.bind(this, i)} 
                            InputProps={{
                              className: classes.itemMargin
                            }}
                          />
                          <FormControl sx={{ marginBottom: '15px'}} variant="standard" fullWidth>
                            <InputLabel id="roles-list-label">Roles</InputLabel>
                            <Select
                              labelId="roles-list-label"
                              id="roles-list"
                              multiple
                              value={participants[i].roles}
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
                                        key={`participant-${r.name}`}
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
                          <FormControlLabel
                            control={
                              <Checkbox 
                                checked={r.isAdmin}
                                onChange={changeIsAdmin.bind(this, i)} 
                                inputProps={{ 'aria-label': 'controlled' }}
                              />
                            } 
                            label="Admin"
                          />
                        </FormGroup>
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              }
              </Grid>
            )
          : (
            <Typography component="p" variant="h6">Click on "+" above to add a new participant.</Typography>
          )
        }
      <Box>
        <Button variant="contained" startIcon={<ArrowBackIcon />} onClick={previousPage}>
          Previous
        </Button>
        &nbsp;
        <Button variant="contained" onClick={submitParticipants}>Submit</Button>
      </Box>
    </Box>
  )
}

export default ParticipantSetupForm;