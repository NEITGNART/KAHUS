import { paramCase } from 'change-case';
import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
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
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useTabs from '../../hooks/useTabs';
import useSettings from '../../hooks/useSettings';
import useTable, { getComparator, emptyRows } from '../../hooks/useTable';
// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import Scrollbar from '../../components/Scrollbar';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import {
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TableSelectedActions
} from '../../components/table';
// sections
import {
  PresentationTableToolbar,
  PresentationTableRow
} from '../../sections/@dashboard/presentation/list';
import { DialogAnimate } from '../../components/animate';
import CreatePresentationForm from '../../sections/@dashboard/presentation/CreatePresentationForm';
import axios from '../../utils/axios';
import useAuth from '../../hooks/useAuth';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import {
  getPresentations,
  closeModal,
  openModal,
  deletePresentation,
  selectPresentation
} from '../../redux/slices/presentation';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = ['all'];

const OWNER_OPTIONS = ['all', 'owned by me', 'shared by me', 'shared with me'];

const TABLE_HEAD = [
  { id: 'name', label: 'Name', align: 'left' },
  {
    id: 'owner',
    label: 'Owner',
    align: 'left'
  },
  { id: 'modified', label: 'modified', align: 'left' },
  {
    id: 'created',
    label: 'created',
    align: 'left'
  },
  {
    id: 'share link',
    label: 'share link',
    align: 'left'
  },
  {
    id: ''
  }
];

const selectedPresentationSelector = (state) => {
  const { presentations, selectedPresentationId } = state.presentation;
  if (selectedPresentationId) {
    return presentations.find(
      (_presentation) => _presentation.id === selectedPresentationId
    );
  }
  return null;
};
// ----------------------------------------------------------------------

export default function PresentationList() {
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

  const [filterName, setFilterName] = useState('');

  const [filterRole, setFilterRole] = useState('all');

  const { currentTab: filterStatus, onChangeTab: onChangeFilterStatus } =
    useTabs('all');

  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useDispatch();
  const selectedPresentation = useSelector(selectedPresentationSelector);
  //  selectEdit: false,
  //   selectDelete: false, selectShare: false,
  //   selectDuplicate: false
  const { presentations, isOpenModal, selectEdit, selectShare, selectDuplicate} = useSelector(
    (state) => state.presentation
  );

  useEffect(() => {
    dispatch(getPresentations());
  }, [dispatch]);

  const handleCreatePresentation = () => {
    dispatch(openModal());
  };

  const handleCloseModal = () => {
    dispatch(closeModal());
  };

  const handleFilterName = (filter) => {
    setFilterName(filter);
    setPage(0);
  };

  const handleFilterRole = (event) => {
    setFilterRole(event.target.value);
  };

  const handleDeleteRow = (id) => {
    dispatch(deletePresentation(id));
  };

  // const handleDeleteRows = (selectedDeletion) => {
  //   const deleteRows = tableData.filter(
  //     (row) => !selectedDeletion.includes(row.id)
  //   );
  //   setSelected([]);
  //   setTableData(deleteRows);
  // };

  const handleEditRow = (id) => {
    // navigate(PATH_DASHBOARD.user.edit(paramCase(id)));
    dispatch(selectPresentation({ id, event: 'selectEdit' }));
  };

  const handleShareInGroup = (id) => {
    dispatch(selectPresentation({ id, event: 'selectShare' }));
  };

  const handleDuplicate = (id) => {
    dispatch(selectPresentation({ id, event: 'selectDuplicate' }));
  };

  const dataFiltered = applySortFilter({
    tableData: presentations,
    comparator: getComparator(order, orderBy),
    filterName,
    filterRole
  });

  const denseHeight = dense ? 52 : 72;

  const isNotFound =
    (!dataFiltered.length && !!filterName) ||
    (!dataFiltered.length && !!filterRole);

  let renderModal = null;

  if (selectEdit) {
    renderModal = (
      <>
        <DialogTitle>
          {selectedPresentation ? 'Edit Presentation' : ''}
        </DialogTitle>
        <CreatePresentationForm
          presentation={selectedPresentation || {}}
          onCancel={handleCloseModal}
        />
      </>
    );
  } else if (selectShare) {
    renderModal = <div>Hehe</div>;
  } else if (selectDuplicate) {
    renderModal = <div>Duplicate nè</div>;
  }
  else {
    renderModal = (
      <>
        <DialogTitle>Create Presentation</DialogTitle>
        <CreatePresentationForm presentation={selectedPresentation || {}} onCancel={handleCloseModal} />
      </>
    );
  }

  return (
    <Page title="Presentation: List">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Presentation List"
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
              onClick={handleCreatePresentation}
              // component={RouterLink}
              //   to={PATH_DASHBOARD.user.new}
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              New Presentation
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

          <PresentationTableToolbar
            filterName={filterName}
            filterTypeOwner={filterRole}
            onFilterName={handleFilterName}
            onFilterRole={handleFilterRole}
            optionsTypeOwner={OWNER_OPTIONS}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
              {selected.length > 0 && (
                <TableSelectedActions
                  dense={dense}
                  numSelected={selected.length}
                  rowCount={presentations.length}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      presentations.map((row) => row.id)
                    )
                  }
                  actions={
                    <Tooltip title="Delete">
                      <IconButton
                        color="primary"
                        // onClick={() => handleDeleteRows(selected)}
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
                  rowCount={presentations.length}
                  numSelected={selected.length}
                  onSort={onSort}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      presentations.map((row) => row.id)
                    )
                  }
                />

                <TableBody>
                  {dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <PresentationTableRow
                        key={row.id}
                        row={row}
                        selected={selected.includes(row.id)}
                        onSelectRow={() => onSelectRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        onEditRow={() => handleEditRow(row.id)}
                        onShareRow={() => handleShareInGroup(row.id)}
                        onDuplicateRow={() => handleDuplicate(row.id)}
                      />
                    ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(
                      page,
                      rowsPerPage,
                      presentations.length
                    )}
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

        <DialogAnimate open={isOpenModal} onClose={handleCloseModal}>
          {renderModal}
        </DialogAnimate>
        {/* )} */}
        {/* {selectShare === true ? (<div>Hehe, share nè</div>) : (<> */}
        {/*    <DialogTitle> */}
        {/*      
          
          {selectedPresentation ? 'Edit Presentation' : 'Create Presentation'} */}
        {/*    </DialogTitle> */}
        {/*    <CreatePresentationForm */}
        {/*      presentation={selectedPresentation || {}} */}
        {/*      onCancel={handleCloseModal} */}
        {/*    /> */}
        {/*  </>)} */}
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

  tableData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    tableData = tableData.filter(
      (item) =>
        item.title.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  if (filterStatus !== 'all') {
    tableData = tableData.filter((item) => item.status === filterStatus);
  }

  if (filterRole !== 'all') {
    tableData = tableData.filter((item) => item.role === filterRole);
  }

  return tableData;
}
