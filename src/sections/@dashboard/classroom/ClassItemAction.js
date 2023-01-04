import { useState } from 'react';
import PropTypes from 'prop-types';
// @mui
import { styled } from '@mui/material/styles';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Tooltip
} from '@mui/material';
// components
import Iconify from '../../../components/Iconify';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  height: 40,
  zIndex: 99,
  opacity: 0,
  margin: 'auto',
  display: 'flex',
  position: 'absolute',
  alignItems: 'center',
  top: theme.spacing(1),
  right: theme.spacing(1),
  bottom: theme.spacing(1),
  justifyContent: 'center',
  padding: theme.spacing(0, 0.75),
  boxShadow: theme.customShadows.z12,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  transition: theme.transitions.create('opacity')
}));

// ----------------------------------------------------------------------

ClassItemAction.propTypes = {
  handleDelete: PropTypes.func
};

export default function ClassItemAction({ handleDelete, ...other }) {
  const [open, setOpen] = useState(false);
  const CLASS_ACTIONS = [
    // {
    //   name: 'Unroll',
    //   icon: 'eva:log-out-outline',
    //   action: handleUnroll
    // },
    {
      name: 'Delete',
      icon: 'eva:trash-2-outline'
    }
  ];

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onConfirmDelete = () => {
    handleClose();
    handleDelete();
  };

  return (
    <RootStyle {...other}>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this group? This action cannot be
            undone. All presentations in the group will be deleted as well
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={onConfirmDelete} color="secondary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      {CLASS_ACTIONS.map((action) => (
        <Tooltip key={action.name} title={action.name}>
          <IconButton
            size="small"
            onClick={handleClickOpen}
            sx={{
              mx: 0.75,
              '&:hover': {
                color: 'text.primary'
              }
            }}
          >
            <Iconify icon={action.icon} width={24} height={24} />
          </IconButton>
        </Tooltip>
      ))}
    </RootStyle>
  );
}
