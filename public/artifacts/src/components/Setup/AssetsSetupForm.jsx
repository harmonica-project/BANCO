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
  MenuItem
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { makeStyles } from '@mui/styles';
import Web3 from 'web3';

const useStyles = makeStyles(() => ({
  boxPadding: {
    "& > *": {
      padding: '8px'
    }
  },
  itemMargin: {
    marginBottom: '10px'
  },
  assetColCard: {
    padding: '10px'
  }
}));

const deepCopy = (item) => JSON.parse(JSON.stringify(item));

const blankAssetCol = {
  name: '',
  owner: '',
  data: ''
}

const AssetsSetupForm = ({ nextPage, previousPage, config, displayError }) => {
  const classes = useStyles();
  const [assets, setAssetCols] = useState(config.assets || [blankAssetCol]);

  const assetsValid = () => {
    const foundAssetCols = {};
  
    for (let r of assets) {
      if (foundAssetCols[r.name] || !r.name.length) return false;
      foundAssetCols[r.name] = true;
    }
  
    return true;
  }
  
  const parseDataToBytes = () => {
    return assets.map(a => ({ ...a, data: Web3.utils.rightPad(Web3.utils.asciiToHex(a.data), 64)}));
  };

  const submitAssetCols = () => {
    if (assetsValid()) nextPage('assets', parseDataToBytes());
    else displayError('Cannot submit: there is at least one asset that do not have a unique, non-null, and valid name.');
  };

  const changeAssetCol = (assetsId, key, e) => {
    const newassetss = deepCopy(assets);

    newassetss[assetsId][key] = e.target.value;
    
    setAssetCols(newassetss);
  };

  const deleteassets = (assetsId) => {
    let newassetss = deepCopy(assets);

    newassetss = newassetss.filter((_, i) => i !== assetsId);

    setAssetCols(newassetss);
  };

  const newassets = () => {
    setAssetCols([...assets, blankAssetCol])
  };

  return (
    <Box className={classes.boxPadding}>
      <Typography component="h1" variant="h4">
        Assets setup
      </Typography>
      <Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={newassets}>
          Add
        </Button>
      </Box>
      
        {
          assets.length
          ? (
            <Grid container spacing={2}>
              {
                assets.map((r, i) => (
                  <Grid item xs={12} sm={4} key={i}>
                    <Card className={classes.assetColCard}>
                      <CardHeader 
                        title={`New asset n°${i + 1}`} 
                        action={
                          <IconButton aria-label="delete">
                            <ClearIcon onClick={deleteassets.bind(this, i)} />
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
                            onChange={changeAssetCol.bind(this, i, 'name')} 
                            InputProps={{
                              className: classes.itemMargin
                            }}
                          />
                          <FormControl variant="standard" sx={{ marginBottom: '15px'}}>
                            <InputLabel id="owner-select-label">Owner</InputLabel>
                            <Select
                            labelId="owner-select-label"
                            id="owner-select"
                            value={assets[i].owner}
                            onChange={changeAssetCol.bind(this, i, 'owner')}
                            label="Age"
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
                          <TextField 
                            fullWidth
                            variant="standard"
                            label="Additional data"
                            value={r.data} 
                            onChange={changeAssetCol.bind(this, i, 'data')} 
                            InputProps={{
                              className: classes.itemMargin
                            }}
                            multiline
                            rows={4}
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
            <Typography component="p" variant="h6">Click on "+" above to add a new asset.</Typography>
          )
        }
      <Box>
        <Button variant="contained" startIcon={<ArrowBackIcon />} onClick={previousPage}>
          Previous
        </Button>
        &nbsp;
        <Button variant="contained" onClick={submitAssetCols}>Submit</Button>
      </Box>
    </Box>
  )
}

export default AssetsSetupForm;