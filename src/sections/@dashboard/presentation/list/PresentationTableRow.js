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
  Link
} from '@mui/material';

import ReactTimeAgo from 'react-time-ago';
import TextMaxLine from '../../../../components/TextMaxLine';
import { PATH_PRESENTATION } from '../../../../routes/paths';

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

  const { id, title, createdAt, modifiedAt, createdBy } = row;

  const [openMenu, setOpenMenuActions] = useState(null);

  const handleOpenMenu = (event) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  const linkTo = PATH_PRESENTATION.presentation.editPresentation(id);

  return (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>

      <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
        {/* {title} */}
        <Link href={linkTo} color="inherit">
          <TextMaxLine line={1} persistent>
            {title}
          </TextMaxLine>
        </Link>
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
