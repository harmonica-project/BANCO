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
  recordColCard: {
    padding: '10px'
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

const RecordColSetupForm = ({ nextPage, previousPage, config, displayError, activated }) => {
  const classes = useStyles();
  const [recordsCols, setRecordCols] = useState(config.recordsCols || [blankRecordCol]);

  const recordsColsValid = () => {
    const foundRecordCols = {};
  
    for (let r of recordsCols) {
      if (foundRecordCols[r.name] || !r.name.length) return false;
      foundRecordCols[r.name] = true;
    }
  
    return true;
  }
  
  const submitRecordCols = () => {
    if (recordsColsValid()) nextPage('recordsCols', recordsCols);
    else displayError('Cannot submit: there is at least one record collection that do not have a unique, non-null, and valid name.');
  }

  const changeRecordColAddr = (recordsColId, e) => {
    const newRecordsCols = deepCopy(recordsCols);

    newRecordsCols[recordsColId].name = e.target.value;

    setRecordCols(newRecordsCols);
  };

  const changeRoles = (recordsColId, e) => {
    const newRecordsCols = deepCopy(recordsCols);
    newRecordsCols[recordsColId].roles = e.target.value;
    setRecordCols(newRecordsCols);
  };

  const changeParticipants = (recordsColId, e) => {
    const newRecordsCols = deepCopy(recordsCols);
    newRecordsCols[recordsColId].participants = e.target.value;
    setRecordCols(newRecordsCols);
  };

  const deleteRecordsCol = (recordsColId) => {
    let newRecordsCols = deepCopy(recordsCols);

    newRecordsCols = newRecordsCols.filter((_, i) => i !== recordsColId);

    setRecordCols(newRecordsCols);
  };

  const newRecordsCol = () => {
    setRecordCols([...recordsCols, blankRecordCol])
  };

  return (
    <Box className={classes.boxPadding}>
      <Typography component="h1" variant="h4">
        Record collection setup
      </Typography>
      <Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={newRecordsCol}>
          Add
        </Button>
      </Box>
      
        {
          recordsCols.length
          ? (
            <Grid container spacing={2}>
              {
                recordsCols.map((r, i) => (
                  <Grid item xs={12} sm={4} key={i}>
                    <Card className={classes.recordColCard}>
                      <CardHeader 
                        title={`New record collection n°${i + 1}`} 
                        action={
                          <IconButton aria-label="delete">
                            <ClearIcon onClick={deleteRecordsCol.bind(this, i)} />
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
                          {
                            activated.roles && (
                              <FormControl sx={{ marginBottom: '15px'}} variant="standard" fullWidth>
                                <InputLabel id="roles-list-label">Authorized roles</InputLabel>
                                <Select
                                  labelId="roles-list-label"
                                  id="roles-list"
                                  multiple
                                  value={recordsCols[i].roles}
                                  onChange={changeRoles.bind(this, i)}
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
                            )
                          }
                          <FormControl sx={{ marginBottom: '15px'}} variant="standard" fullWidth>
                            <InputLabel id="participants-list-label">Authorized participants</InputLabel>
                            <Select
                              labelId="participants-list-label"
                              id="participants-list"
                              multiple
                              value={recordsCols[i].participants}
                              onChange={changeParticipants.bind(this, i)}
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
        <Button variant="contained" onClick={submitRecordCols}>Submit</Button>
      </Box>
    </Box>
  )
}

export default RecordColSetupForm;