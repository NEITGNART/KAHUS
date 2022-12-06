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
  MenuItem
} from '@mui/material';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en.json';
import ru from 'javascript-time-ago/locale/ru.json';
import ReactTimeAgo from 'react-time-ago';
// components
import Label from '../../../../components/Label';
import Iconify from '../../../../components/Iconify';
import { TableMoreMenu } from '../../../../components/table';
// ----------------------------------------------------------------------

PresentationTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func
};

export default function PresentationTableRow({
  row,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow
}) {
  const theme = useTheme();

  const { title, createdAt, modifiedAt, createdBy } = row;

  const [openMenu, setOpenMenuActions] = useState(null);

  const handleOpenMenu = (event) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  TimeAgo.addDefaultLocale(en);
  TimeAgo.addLocale(ru);

  return (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>

      <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
        {title}
      </TableCell>

      <TableCell align="left">{createdBy}</TableCell>

      <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
        <ReactTimeAgo date={modifiedAt} locale="en-US" />
      </TableCell>

      <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
        <ReactTimeAgo date={createdAt} locale="en-US" />
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
