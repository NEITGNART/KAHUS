import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import {
  Avatar,
  Checkbox,
  TableRow,
  TableCell,
  Typography,
  MenuItem,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
// components
import Label from '../../../../components/Label';
import Iconify from '../../../../components/Iconify';
import { TableMoreMenu } from '../../../../components/table';

// ----------------------------------------------------------------------

MemberTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func
};

export default function MemberTableRow({
  row,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow
}) {
  // const theme = useTheme();

  const { firstName, avatar } = row;

  const [role, setRole] = useState(row.role);

  const [openMenu, setOpenMenuActions] = useState(null);

  const handleOpenMenu = (event) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  const handleChange = (event) => {
    setRole(event.target.value);
  };

  return (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>

      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar
          alt={firstName}
          src={
            avatar || 'https://gstatic.com/classroom/themes/img_breakfast.jpg'
          }
          sx={{ mr: 2 }}
        />
        <Typography variant="subtitle2" noWrap>
          {firstName}
        </Typography>
      </TableCell>

      <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
        {/* {role === 'owner' ? (
          <FormControl sx={{ minWidth: 200 }}>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={role}
              onChange={handleChange}
            >
              <MenuItem value="owner">Owner</MenuItem>
              <MenuItem value="co-owner">Co-owner</MenuItem>
              <MenuItem value="member">Member</MenuItem>
            </Select>
          </FormControl>
        ) : (
          <Typography variant="subtitle2" noWrap>
            {role}
          </Typography>
        )} */}

        <FormControl sx={{ minWidth: 200 }}>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={role}
            onChange={handleChange}
          >
            <MenuItem value="owner">Owner</MenuItem>
            <MenuItem value="co-owner">Co-owner</MenuItem>
            <MenuItem value="member">Member</MenuItem>
          </Select>
        </FormControl>
      </TableCell>

      <TableCell align="right">
        <TableMoreMenu
          open={openMenu}
          onOpen={handleOpenMenu}
          onClose={handleCloseMenu}
          actions={
            <>
              <MenuItem
                onClick={() => {
                  onDeleteRow();
                  handleCloseMenu();
                }}
                sx={{ color: 'error.main' }}
              >
                <Iconify icon="eva:trash-2-outline" />
                Delete
              </MenuItem>
              <MenuItem
                onClick={() => {
                  onEditRow();
                  handleCloseMenu();
                }}
              >
                <Iconify icon="eva:edit-fill" />
                Edit
              </MenuItem>
            </>
          }
        />
      </TableCell>
    </TableRow>
  );
}
