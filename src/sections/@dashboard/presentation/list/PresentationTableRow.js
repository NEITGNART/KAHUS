import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { Checkbox, Link, MenuItem, TableCell, TableRow } from '@mui/material';

import ReactTimeAgo from 'react-time-ago';
import TextMaxLine from '../../../../components/TextMaxLine';
import { PATH_PRESENTATION } from '../../../../routes/paths';

// components
import Iconify from '../../../../components/Iconify';
import { TableMoreMenu } from '../../../../components/table';
// ----------------------------------------------------------------------

PresentationTableRow.propTypes = {
  classId: PropTypes.string,
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onDuplicateRow: PropTypes.func,
  onShareRow: PropTypes.func,
  onInviteRow: PropTypes.func
};

export default function PresentationTableRow({
  classId,
  row,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
  onInviteRow,
  onDuplicateRow,
  onShareRow
}) {
  const { id, title, createdAt, modifiedAt, createdBy, role } = row;
  const share = row.share || 'public';

  const [openMenu, setOpenMenuActions] = useState(null);

  const handleOpenMenu = (event) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  const linkTo = row.group
    ? PATH_PRESENTATION.presentation.editPresentationGroup(
        id,
        row.code,
        row.group
      )
    : PATH_PRESENTATION.presentation.editPresentation(id, row.code);

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

      {!classId && <TableCell align="left">{role}</TableCell>}

      <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
        <ReactTimeAgo date={Date.parse(modifiedAt)} locale="en-US" />
      </TableCell>

      <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
        <ReactTimeAgo date={Date.parse(createdAt)} locale="en-US" />
      </TableCell>

      <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
        {share}
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
                  onEditRow();
                  handleCloseMenu();
                }}
              >
                <Iconify icon="eva:edit-fill" />
                Rename
              </MenuItem>
              {role === 'owner' && (
                <>
                  {/* <MenuItem
                    onClick={() => {
                      onShareRow();
                      handleCloseMenu();
                    }}
                  >
                    <Iconify icon="material-symbols:share-outline" />
                    Share in group
                  </MenuItem> */}

                  {/* <MenuItem
                    onClick={() => {
                      onInviteRow();
                      handleCloseMenu();
                    }}
                  >
                    <Iconify icon="wpf:collaborator" />
                    Manage Collaborator
                  </MenuItem> */}

                  {/* <MenuItem
                    onClick={() => {
                      onDuplicateRow();
                      handleCloseMenu();
                    }}
                  >
                    <Iconify icon="fad:duplicate" />
                    Duplicate
                  </MenuItem> */}

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
              )}
            </>
          }
        />
      </TableCell>
    </TableRow>
  );
}
