import PropTypes from 'prop-types';
import { InputAdornment, MenuItem, Stack, TextField } from '@mui/material';
// components
import Iconify from '../../../../components/Iconify';

// ----------------------------------------------------------------------

PresentationTableToolbar.propTypes = {
  filterName: PropTypes.string,
  filterTypeOwner: PropTypes.string,
  onFilterName: PropTypes.func,
  onFilterRole: PropTypes.func,
  optionsTypeOwner: PropTypes.arrayOf(PropTypes.string),
  label: PropTypes.string
};

export default function PresentationTableToolbar({
  filterName,
  filterTypeOwner,
  onFilterName,
  onFilterRole,
  optionsTypeOwner,
  label = 'Owner'
}) {
  return (
    <Stack
      spacing={2}
      direction={{ xs: 'column', sm: 'row' }}
      sx={{ py: 2.5, px: 3 }}
    >
      <TextField
        fullWidth
        select
        label={label}
        value={filterTypeOwner}
        onChange={onFilterRole}
        SelectProps={{
          MenuProps: {
            sx: { '& .MuiPaper-root': { maxHeight: 260 } }
          }
        }}
        sx={{
          maxWidth: { sm: 240 },
          textTransform: 'capitalize'
        }}
      >
        {optionsTypeOwner.map((option) => (
          <MenuItem
            key={option}
            value={option}
            sx={{
              mx: 1,
              my: 0.5,
              borderRadius: 0.75,
              typography: 'body2',
              textTransform: 'capitalize'
            }}
          >
            {option}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        fullWidth
        value={filterName}
        onChange={(event) => onFilterName(event.target.value)}
        placeholder="Search presentation..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify
                icon="eva:search-fill"
                sx={{ color: 'text.disabled', width: 20, height: 20 }}
              />
            </InputAdornment>
          )
        }}
      />
    </Stack>
  );
}
