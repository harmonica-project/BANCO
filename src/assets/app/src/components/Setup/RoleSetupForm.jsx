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
  OutlinedInput,
  Chip,
  MenuItem
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from '@mui/icons-material/Add';
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

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const RoleSetupForm = ({ nextPage }) => {
  const classes = useStyles();
  const theme = useTheme();
  const [roles, setRoles] = useState([blankRole]);
  const [personName, setPersonName] = React.useState([]);

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
    console.log('Submitted roles: ', roles);
  }

  const changeRoleName = (roleId, e) => {
    const newRoles = deepCopy(roles);
    newRoles[roleId].name = e.target.value;
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

  const deleteRole = (roleId, e) => {
    let newRoles = JSON.parse(JSON.stringify(roles));
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
                        <FormGroup className={classes.boxMargin}>
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
                          <FormControl sx={{ m: 1, width: 300 }}>
                            <InputLabel id="demo-multiple-chip-label">Managed Roles</InputLabel>
                            <Select
                              labelId="demo-multiple-chip-label"
                              id="demo-multiple-chip"
                              multiple
                              value={roles[i].managedRoles}
                              onChange={changeManagedRoles.bind(this, i)}
                              input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                              renderValue={(managedRoles) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                  {managedRoles.map((value) => {
                                    console.log(value)
                                    return <Chip key={value} label={value} />
                                  })}
                                </Box>
                              )}
                              MenuProps={MenuProps}
                            >
                              {roles.map((r) => (
                                <MenuItem
                                  key={r.name}
                                  value={r.name}
                                  style={getStyles(r.name, personName, theme)}
                                >
                                  {r.name}
                                </MenuItem>
                              ))}
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
            <Typography component="p" variant="h6">Click on "+" above to add a new role.</Typography>
          )
        }
      <Box>
        <Button variant="contained" onClick={submitRoles}>Submit</Button>
      </Box>
    </Box>
  )
}

export default RoleSetupForm;