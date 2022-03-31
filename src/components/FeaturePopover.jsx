import React, { useEffect, useState } from 'react';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';

export default function FeaturePopover({ anchorEl, handlePopoverClose, configuration }) {
  const open = Boolean(anchorEl);
  const [desc, setDesc] = useState('');

  useEffect(() => {
    if (anchorEl) {
      setDesc(configuration.model.getFeature(anchorEl.textContent).description);
    }
  }, [anchorEl])  // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Popover
      id="mouse-over-popover"
      sx={{
        pointerEvents: 'none',
      }}
      open={open}
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      onClose={handlePopoverClose}
      disableRestoreFocus
    >
      <Typography sx={{ p: 1 }}>{desc}</Typography>
    </Popover>
  );
}