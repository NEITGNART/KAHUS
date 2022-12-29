import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
// @mui
import {
  Box,
  Button,
  Card,
  Container,
  DialogTitle,
  Divider,
  FormControlLabel,
  IconButton,
  Switch,
  Tab,
  Table,
  TableBody,
  TableContainer,
  TablePagination,
  Tabs,
  Tooltip
} from '@mui/material';
// routes
import { useSnackbar } from 'notistack';
import { PATH_DASHBOARD } from '../../routes/paths';
// redux
// hooks
import useTabs from '../../hooks/useTabs';
import useSettings from '../../hooks/useSettings';
import useTable, { emptyRows, getComparator } from '../../hooks/useTable';
// _mock_
// components
import Iconify from '../../components/Iconify';
import Scrollbar from '../../components/Scrollbar';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { DialogAnimate } from '../../components/animate';
import {
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TableSelectedActions
} from '../../components/table';
// sections
import { MemberTableToolbar } from '../../sections/@dashboard/user/list';
import axios from '../../utils/axios';
import useAuth from '../../hooks/useAuth';
import CollaborationTableRow from '../../sections/@dashboard/user/list/CollaborationTableRow';
import InviteCollaboratorsForm from '../../sections/@dashboard/invitation/InviteCollaboratorsForm';

// ----------------------------------------------------------------------
const STATUS_OPTIONS = ['all'];

const ROLE_OPTIONS = [
  'all',
  'owner',
  'co-owner',
  'member',
  'kick-out',
  'collaborator'
];

const TABLE_HEAD = [
  { id: 'name', label: 'Name', align: 'left' },
  {
    id: 'role',
    label: 'Role',
    align: 'left'
  },
  { id: '' }
];

CollaborationList.propTypes = {
  presentationId: PropTypes.string,
  className: PropTypes.string
};

const rolesMap = new Map([
  ['owner', 1],
  ['co-owner', 2],
  ['member', 3],
  ['kick out', 4],
  ['collaborator', 5]
]);

// ----------------------------------------------------------------------

export default function CollaborationList({ presentationId, className }) {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage, //
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows, //
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage
  } = useTable();

  const { themeStretch } = useSettings();
  const [currentRole, setCurrentRole] = useState('');
  const { user } = useAuth();

  // useEffect(() => {
  //   const getRole = async () => {
  //     const response = await axios.post(`/api/group/get-role`, {
  //       email: user?.email,
  //       groupId: presentationId
  //     });
  //     setCurrentRole(response.data.role);
  //   };
  //   getRole();
  // }, []);

  useEffect(() => {
    const getMembers = async () => {
      try {
        const response = await axios.post(`/api/presentation/collaborators`, {
          presentationId
        });
        console.log(response.data);
        const dataTable = response.data.sort((a, b) => {
          return rolesMap.get(a.role) - rolesMap.get(b.role);
        });
        setTableData(dataTable);
      } catch (e) {
        console.log(e);
      }
    };
    if (presentationId) {
      getMembers();
    }
  }, []);

  const [tableData, setTableData] = useState([]);

  const [filterName, setFilterName] = useState('');

  const [filterRole, setFilterRole] = useState('all');

  const [openModal, setOpenModal] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const { currentTab: filterStatus, onChangeTab: onChangeFilterStatus } =
    useTabs('all');

  const handleFilterName = (filName) => {
    setFilterName(filName);
    setPage(0);
  };

  const handleFilterRole = (event) => {
    setFilterRole(event.target.value);
  };

  const handleDeleteRow = (email) => {
    const deleteRow = tableData.filter((row) => row.email !== email);
    axios
      .post(`/api/presentation/remove-collaborator`, {
        email,
        presentationId
      })
      .then((data) => {
        setSelected([]);
        setTableData(deleteRow);
        enqueueSnackbar('Delete collaborators successfully', {
          variant: 'success'
        });
      })
      .catch((error) => {
        enqueueSnackbar('You are not the owner!', { variant: 'error' });
      });
  };

  const handleDeleteRows = (selectedRow) => {
    const deleteRows = tableData.filter((row) => !selectedRow.includes(row.id));
    setSelected([]);
    setTableData(deleteRows);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const dataFiltered = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterRole
  });

  const denseHeight = dense ? 52 : 72;

  const isNotFound =
    (!dataFiltered.length && !!filterName) ||
    (!dataFiltered.length && !!filterRole);

  return (
    <Container maxWidth={themeStretch ? false : 'lg'}>
      <HeaderBreadcrumbs
        heading="Collaborators"
        links={[
          { name: 'Dashboard', href: PATH_DASHBOARD.root },
          {
            name: 'User',
            href: PATH_DASHBOARD.user.root
          },
          { name: 'List' }
        ]}
        action={
          <Button
            variant="contained"
            onClick={handleOpenModal}
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            Invite Collaborator
          </Button>
        }
      />

      <Card>
        <Tabs
          allowScrollButtonsMobile
          variant="scrollable"
          scrollButtons="auto"
          value={filterStatus}
          onChange={onChangeFilterStatus}
          sx={{ px: 2, bgcolor: 'background.neutral' }}
        >
          {STATUS_OPTIONS.map((tab) => (
            <Tab disableRipple key={tab} label={tab} value={tab} />
          ))}
        </Tabs>

        <Divider />

        <MemberTableToolbar
          filterName={filterName}
          filterRole={filterRole}
          onFilterName={handleFilterName}
          onFilterRole={handleFilterRole}
          optionsRole={ROLE_OPTIONS}
          placeholder="Find a collaborator"
        />

        <Scrollbar>
          <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
            {selected.length > 0 && (
              <TableSelectedActions
                dense={dense}
                numSelected={selected.length}
                rowCount={tableData.length}
                onSelectAllRows={(checked) =>
                  onSelectAllRows(
                    checked,
                    tableData.map((row) => row.id)
                  )
                }
                actions={
                  <Tooltip title="Delete">
                    <IconButton
                      color="primary"
                      onClick={() => handleDeleteRows(selected)}
                    >
                      <Iconify icon="eva:trash-2-outline" />
                    </IconButton>
                  </Tooltip>
                }
              />
            )}

            <Table size={dense ? 'small' : 'medium'}>
              <TableHeadCustom
                order={order}
                orderBy={orderBy}
                headLabel={TABLE_HEAD}
                rowCount={tableData.length}
                numSelected={selected.length}
                onSort={onSort}
                onSelectAllRows={(checked) =>
                  onSelectAllRows(
                    checked,
                    tableData.map((row) => row.id)
                  )
                }
              />

              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    return (
                      <CollaborationTableRow
                        key={row.id}
                        row={row}
                        selected={selected.includes(row.id)}
                        onSelectRow={() => onSelectRow(row.email)}
                        onDeleteRow={() => handleDeleteRow(row.email)}
                      />
                    );
                  })}

                <TableEmptyRows
                  height={denseHeight}
                  emptyRows={emptyRows(page, rowsPerPage, tableData.length)}
                />

                <TableNoData isNotFound={isNotFound} />
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <Box sx={{ position: 'relative' }}>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={dataFiltered.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
          />

          <FormControlLabel
            control={<Switch checked={dense} onChange={onChangeDense} />}
            label="Dense"
            sx={{ px: 3, py: 1.5, top: 0, position: { md: 'absolute' } }}
          />
        </Box>
      </Card>

      <DialogAnimate open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Invite</DialogTitle>

        <InviteCollaboratorsForm
          presentationId={presentationId}
          onCancel={handleCloseModal}
        />
      </DialogAnimate>
    </Container>
  );
}

// ----------------------------------------------------------------------

function applySortFilter({ tableData, comparator, filterName, filterRole }) {
  const stabilizedThis = tableData.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  let tempData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    tempData = tempData.filter((item) => {
      return (
        item.firstName.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
      );
    });
  }

  if (filterRole !== 'all') {
    tempData = tempData.filter((item) => item.role === filterRole);
  }
  return tempData;
}
