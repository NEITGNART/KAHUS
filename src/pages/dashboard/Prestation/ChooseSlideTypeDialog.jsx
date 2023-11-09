import PropTypes from 'prop-types';
import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material';

ChooseSlideTypeDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  selectedValue: PropTypes.object
};

export default function ChooseSlideTypeDialog({
  open,
  onClose,
  selectedValue
}) {
  const handleClose = () => {
    onClose(selectedValue);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Set backup account</DialogTitle>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onClose}>Subscribe</Button>
      </DialogActions>
    </Dialog>
  );
}
