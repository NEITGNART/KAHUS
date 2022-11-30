// @mui
import { Container, Box, Grid, Stack } from '@mui/material';
// routes
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// _mock_
import { _classroomCards } from '../../_mock';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import { ClassroomCard } from '../../sections/@dashboard/classroom/cards';
import ClassCard from '../../sections/@dashboard/classroom/cards/ClassCard';
import axios from '../../utils/axios';
import useAuth from '../../hooks/useAuth';
import LoadingScreen from '../../components/LoadingScreen';
import EmptyContent from '../../components/EmptyContent';
import TableNoData from '../../components/table/TableNoData';
import ClassroomSearch from '../../sections/@dashboard/classroom/ClassroomSearch';
import ClassFilter from '../../sections/@dashboard/classroom/ClassFilter';

const SORT_OPTIONS = [
  // { value: 'all', label: 'All' },
  { value: 'attended', label: 'Attended Classes' },
  { value: 'myClass', label: 'My Class' }
];

// ----------------------------------------------------------------------
export default function ClassroomList() {
  const { themeStretch } = useSettings();
  const { user } = useAuth();

  const [classrooms, setClassrooms] = useState([]);
  const [filters, setFilters] = useState('attended');
  const fetchMyClasses = async () => {
    axios
      .get(`/api/group/group-invited`)
      .then((response) => {
        setClassrooms(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    fetchMyClasses();
  }, []);

  const handleChangeFilter = (value) => {
    if (value) {
      setFilters(value);
    }
  };

  useMemo(() => {
    axios
      .get('api/group/search', { params: { filter: filters } })
      .then((res) => {
        setClassrooms(res.data);
      });
  }, [filters]);

  return (
    <Page title="Classes | KAHUS">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs heading="Classes" />
        <Stack
          mb={5}
          direction="row"
          alignItems="center"
          justifyContent="flex-start"
          spacing={2}
        >
          <ClassFilter
            query={filters}
            options={SORT_OPTIONS}
            onSort={handleChangeFilter}
          />
        </Stack>
        <Grid container spacing={3}>
          {classrooms?.length ? (
            classrooms.map((classroom, index) => (
              <Grid key={classroom.id} item xs={12} sm={6} md={4}>
                <ClassCard classInfo={classroom} indexs={index} />
              </Grid>
            ))
          ) : (
            <p> empty </p>
          )}
        </Grid>
      </Container>
    </Page>
  );
}
