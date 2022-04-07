import React from 'react';
import {
  Box,
  Typography,
  Button,
  TextField
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import GetAppIcon from '@mui/icons-material/GetApp';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(() => ({
  boxPadding: {
    "& > *": {
      padding: '8px'
    }
  }
}));

const DisplayConfigResult = ({ previousPage, config }) => {
  const classes = useStyles();

  const exportConfig = () => {
    var bb = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    var a = document.createElement('a');
    a.download = 'config.json';
    a.href = window.URL.createObjectURL(bb);
    a.click();
  };

  return (
    <Box className={classes.boxPadding}>
      <Typography component="h1" variant="h4" sx={{ marginBottom: '15px'}}>
        Result
      </Typography>
      <TextField
          id="config-textfield"
          label="Config"
          multiline
          fullWidth
          rows={30}
          defaultValue={JSON.stringify(config, null, 2)}
          sx={{ marginBottom: '15px'}}
        />
      <Box>
        <Button variant="contained" startIcon={<ArrowBackIcon />} onClick={previousPage}>
          Previous
        </Button>
        &nbsp;
        <Button variant="contained" startIcon={<FileCopyIcon />} onClick={() => navigator.clipboard.writeText(JSON.stringify(config, null, 2))}>
          Copy
        </Button>
        &nbsp;
        <Button variant="contained" startIcon={<GetAppIcon />} onClick={exportConfig}>
          Download
        </Button>
      </Box>
    </Box>
  )
}

export default DisplayConfigResult;