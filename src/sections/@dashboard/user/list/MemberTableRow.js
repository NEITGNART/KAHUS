import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import {
  Avatar,
  Checkbox,
  TableRow,
  TableCell,
  Typography,
  MenuItem,
  TextField
} from '@mui/material';
// components
import Iconify from '../../../../components/Iconify';
import { TableMoreMenu } from '../../../../components/table';

// ----------------------------------------------------------------------

const roles = [
  { name: 'co-owner', value: '1' },
  { name: 'member', value: '2' },
  { name: 'kick out', value: '3' }
];

MemberTableRow.propTypes = {
  row: PropTypes.object,
  currentAccountRole: PropTypes.string,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func
};

export default function MemberTableRow({
  row,
  currentAccountRole,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow
}) {
  // const theme = useTheme();

  const { firstName, lastName, avatar } = row;

  const [role, setRole] = useState(row.role);

  const [openMenu, setOpenMenuActions] = useState(null);

  const handleOpenMenu = (event) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  const handleChange = (event) => {
    onEditRow(event.target.value, setRole);
  };

  return (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>

      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar
          referrerPolicy="no-referrer"
          alt={firstName}
          src={avatar || ''}
          sx={{ mr: 2 }}
        />
        <Typography variant="subtitle2" noWrap>
          {`${firstName} ${lastName}`}
        </Typography>
      </TableCell>

      <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
        {currentAccountRole === 'member' ||
        currentAccountRole === 'kick out' ? (
          <Typography variant="subtitle2" noWrap>
            {role}
          </Typography>
        ) : (
          <>
            {role === 'owner' ||
            (role === 'co-owner' && currentAccountRole === 'co-owner') ? (
              <Typography variant="subtitle2" noWrap>
                {role}
              </Typography>
            ) : (
              <TextField
                select
                size="small"
                value={role}
                onChange={handleChange}
                sx={{ minWidth: 150 }}
              >
                {roles
                  .filter(
                    (r) =>
                      (currentAccountRole === 'co-owner' &&
                        r.name !== 'co-owner') ||
                      currentAccountRole === 'owner'
                  )
                  .map((r) => (
                    <MenuItem
                      key={r.value}
                      value={r.name}
                      sx={{
                        borderRadius: 1,
                        minWidth: 150,
                        textTransform: 'capitalize'
                      }}
                    >
                      {r.name}
                    </MenuItem>
                  ))}
              </TextField>
            )}
          </>
        )}
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
