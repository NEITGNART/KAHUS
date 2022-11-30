import PropTypes, { element } from 'prop-types';
import { paramCase } from 'change-case';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import {
  Box,
  Tab,
  Tabs,
  Card,
  Table,
  Switch,
  Button,
  Tooltip,
  Divider,
  TableBody,
  Container,
  IconButton,
  TableContainer,
  TablePagination,
  FormControlLabel,
  DialogTitle
} from '@mui/material';
// routes
import { useSnackbar } from 'notistack';
import { PATH_DASHBOARD } from '../../routes/paths';
// redux
// hooks
import useTabs from '../../hooks/useTabs';
import useSettings from '../../hooks/useSettings';
import useTable, { getComparator, emptyRows } from '../../hooks/useTable';
// _mock_
import { _userList } from '../../_mock';
// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import Scrollbar from '../../components/Scrollbar';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { DialogAnimate } from '../../components/animate';
import { InviteMemberForm } from '../../sections/@dashboard/invitation';
import {
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TableSelectedActions
} from '../../components/table';
// sections
import {
  MemberTableToolbar,
  MemberTableRow
} from '../../sections/@dashboard/user/list';
import axios from '../../utils/axios';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = ['all'];

const ROLE_OPTIONS = ['all', 'owner', 'co-owner', 'member'];

const TABLE_HEAD = [
  { id: 'name', label: 'Name', align: 'left' },
  { id: 'role', label: 'Role', align: 'left' },
  { id: '' }
];

MemberList.propTypes = {
  classId: PropTypes.string,
  className: PropTypes.string
};

// ----------------------------------------------------------------------

export default function MemberList({ classId, className }) {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage
  } = useTable();

  const { themeStretch } = useSettings();
  const currentRoleAccount = 'owner';

  useEffect(() => {
    const getMembers = async () => {
      const response = await axios.post(`/api/group/members`, {
        groupId: classId
      });
      setTableData(response.data);
    };
    getMembers();
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
      .post(`/api/group/kick-member`, {
        email,
        groupId: classId
      })
      .then((data) => {
        setSelected([]);
        setTableData(deleteRow);
        enqueueSnackbar('Delete member successfully', { variant: 'success' });
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

  const handleEditRole = (row, newRole, setRole) => {
    console.log(row);
    console.log(newRole);
    setRole(newRole);
    // axios
    //   .post(`/api/group/update-role`, {
    //     email: row.email,
    //     groupId: classId,
    //     role: newRole
    //   })
    //   .then((data) => {
    //     setSelected([]);
    //     row.role = newRole;
    //     enqueueSnackbar('assign role successfully', { variant: 'success' });
    //   })
    //   .catch((error) => {
    //     enqueueSnackbar('You are not the owner!', { variant: 'error' });
    //   });
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
    filterRole,
    filterStatus
  });

  const denseHeight = dense ? 52 : 72;

  const isNotFound =
    (!dataFiltered.length && !!filterName) ||
    (!dataFiltered.length && !!filterRole) ||
    (!dataFiltered.length && !!filterStatus);

  return (
    <Page title="User: List">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="User List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'User', href: PATH_DASHBOARD.user.root },
            { name: 'List' }
          ]}
          action={
            <Button
              variant="contained"
              onClick={handleOpenModal}
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              Invite member
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
                      console.log(row);
                      return (
                        <MemberTableRow
                          key={row.id}
                          row={row}
                          selected={selected.includes(row.id)}
                          onSelectRow={() => onSelectRow(row.email)}
                          onDeleteRow={() => handleDeleteRow(row.email)}
                          onEditRow={(newRole, setRole) =>
                            handleEditRole(row, newRole, setRole)
                          }
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

          <InviteMemberForm
            classId={classId}
            className={className}
            onCancel={handleCloseModal}
          />
        </DialogAnimate>
      </Container>
    </Page>
  );
}

// ----------------------------------------------------------------------

function applySortFilter({
  tableData,
  comparator,
  filterName,
  filterStatus,
  filterRole
}) {
  const stabilizedThis = tableData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  let tempData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    tempData = tempData.filter(
      (item) => item.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  if (filterStatus !== 'all') {
    tempData = tempData.filter((item) => item.status === filterStatus);
  }

  if (filterRole !== 'all') {
    tempData = tempData.filter((item) => item.role === filterRole);
  }
  return tempData;
}
