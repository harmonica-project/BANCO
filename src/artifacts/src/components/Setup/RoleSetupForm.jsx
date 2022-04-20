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
  roleCard: {
    padding: '10px'
  }
}));

const deepCopy = (item) => JSON.parse(JSON.stringify(item));

const blankRole = {
  name: '',
  isAdmin: false,
  managedRoles: []
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

const RoleSetupForm = ({ nextPage, previousPage, config, setConfig, displayError }) => {
  const classes = useStyles();
  const [roles, setRoles] = useState(config.roles || [blankRole]);

  const rolesValid = () => {
    const foundRoles = {};
  
    for (let r of roles) {
      if (foundRoles[r.name] || !r.name.length) return false;
      foundRoles[r.name] = true;
    }
  
    return true;
  }
  
  const submitRoles = () => {
    if (rolesValid()) nextPage('roles', roles);
    else displayError('Cannot submit: there is at least one role that do not have a unique non-null name.');
  }

  const changeRoleName = (roleId, e) => {
    const newRoles = deepCopy(roles);
    const newName = e.target.value;

    for (let i in newRoles) {
      let mId = newRoles[i].managedRoles.findIndex(mr => mr === newRoles[roleId].name);
      newRoles[i].managedRoles[mId] = newName;
    }

    for (let key of ['participants', 'recordsCols', 'stateMachine']) {
      if (config[key]) {
        const newSubconfig = deepCopy(config[key]);
        for (let i in newSubconfig) {
          let rId = newSubconfig[i].roles.findIndex(r => r === newRoles[roleId].name);
          newSubconfig[i].roles[rId] = newName;
        }

        setConfig({ ...config, [key]: newSubconfig });
      }
    }

    newRoles[roleId].name = newName;

    setRoles(newRoles);
  };

  const changeManagedRoles = (roleId, e) => {
    const newRoles = deepCopy(roles);
    newRoles[roleId].managedRoles = e.target.value;
    setRoles(newRoles);
  };

  const changeIsAdmin = (roleId, e) => {
    const newRoles = deepCopy(roles);
    newRoles[roleId].isAdmin = e.target.checked;
    setRoles(newRoles);
  };

  const deleteRole = (roleId) => {
    let newRoles = deepCopy(roles);

    for (let i in newRoles) {
      newRoles[i].managedRoles = newRoles[i].managedRoles.filter(mr => mr !== roles[roleId].name);
    }

    for (let key of ['participants', 'recordsCols']) {
      if (config[key]) {
        let newSubconfig = deepCopy(config[key]);
        for (let i in newSubconfig) {
          newSubconfig[i].roles = newSubconfig[i].roles.filter(r => r !== roles[roleId].name);
        }

        setConfig({ ...config, [key]: newSubconfig });
      }
    }

    newRoles = newRoles.filter((_, i) => i !== roleId);

    setRoles(newRoles);
  };

  const newRole = () => {
    setRoles([...roles, blankRole])
  };

  return (
    <Box className={classes.boxPadding}>
      <Typography component="h1" variant="h4">
        Role setup
      </Typography>
      <Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={newRole}>
          Add
        </Button>
      </Box>
      
        {
          roles.length
          ? (
            <Grid container spacing={2}>
              {
                roles.map((r, i) => (
                  <Grid item xs={12} sm={4} key={i}>
                    <Card className={classes.roleCard}>
                      <CardHeader 
                        title={`New role n°${i + 1}`} 
                        action={
                          <IconButton aria-label="delete">
                            <ClearIcon onClick={deleteRole.bind(this, i)} />
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
                            onChange={changeRoleName.bind(this, i)} 
                            InputProps={{
                              className: classes.itemMargin
                            }}
                          />
                          <FormControl sx={{ marginBottom: '15px'}} variant="standard" fullWidth>
                            <InputLabel id="managed-roles-list-label">Managed Roles</InputLabel>
                            <Select
                              labelId="managed-roles-list-label"
                              id="managed-roles-list"
                              multiple
                              value={roles[i].managedRoles}
                              onChange={changeManagedRoles.bind(this, i)}
                              input={<Input id="managed-roles-list-chip" label="Managed roles" />}
                              renderValue={(managedRoles) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                  {managedRoles.map((value) => <Chip key={value} label={value} />)}
                                </Box>
                              )}
                              MenuProps={MenuProps}
                            >
                              <MenuItem value="" disabled>
                                <em>None</em>
                              </MenuItem>
                              {
                                roles.flatMap((r, i) => {
                                  if (r.name.length) {
                                    return (
                                      <MenuItem
                                        key={`role-${r.name}`}
                                        value={r.name}
                                      >
                                        Role n°{i + 1}: {r.name}
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
            <Typography component="p" variant="h6">Click on "+" above to add a new role.</Typography>
          )
        }
      <Box>
        <Button variant="contained" startIcon={<ArrowBackIcon />} onClick={previousPage}>
          Previous
        </Button>
        &nbsp;
        <Button variant="contained" onClick={submitRoles}>Submit</Button>
      </Box>
    </Box>
  )
}

export default RoleSetupForm;