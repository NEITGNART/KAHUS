import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import {
  Avatar,
  Checkbox,
  MenuItem,
  TableCell,
  TableRow,
  Typography
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

CollaborationTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func
};

export default function CollaborationTableRow({
  row,
  selected,
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
        <Typography variant="subtitle2" noWrap>
          {role}
        </Typography>
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
            </>
          }
        />
      </TableCell>
    </TableRow>
  );
}
