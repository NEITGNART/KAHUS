// @mui
import { Container, Grid, Stack } from '@mui/material';
// routes
import React, { useEffect, useState } from 'react';
// hooks
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import useSettings from '../../hooks/useSettings';
// _mock_
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import ClassCard from '../../sections/@dashboard/classroom/cards/ClassCard';
import axios from '../../utils/axios';
import EmptyContent from '../../components/EmptyContent';
import ClassFilter from '../../sections/@dashboard/classroom/ClassFilter';

const SORT_OPTIONS = [
  // { value: 'all', label: 'All' },
  { value: 'attended', label: 'Attended Classes' },
  { value: 'myClass', label: 'My Class' }
];

// ----------------------------------------------------------------------
export default function ClassroomList() {
  const { themeStretch } = useSettings();

  const [classrooms, setClassrooms] = useState([]);
  const [filters, setFilters] = useState('attended');
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  useEffect(() => {
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

    fetchMyClasses();
  }, []);

  const handleChangeFilter = (value) => {
    if (value) {
      setFilters(value);
    }
  };

  const [cache, setCache] = useState({});

  useEffect(() => {
    // Check if the current filters are in the cache
    if (cache[JSON.stringify(filters)]) {
      // If they are, use the cached data instead of making a new request
      setClassrooms(cache[JSON.stringify(filters)]);
      return;
    }

    // If the filters are not in the cache, make a new request and update the cache
    axios
      .get('api/group/search', { params: { filter: filters } })
      .then((res) => {
        setCache({ ...cache, [JSON.stringify(filters)]: res.data });
        setClassrooms(res.data);
      });
  }, [filters, cache]);

  const handleDelete = (id) => {
    enqueueSnackbar('Class deleted', { variant: 'success' });
    classrooms.splice(
      classrooms.findIndex((item) => item.id === id),
      1
    );
    setClassrooms([...classrooms]);
    axios
      .post(`/api/group/remove`, {
        groupId: id
      })
      .catch((err) => {
        navigate('dashboard/classroom/classes', { replace: true });
      });
  };

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
        {classrooms.length !== 0 ? (
          <Grid container spacing={3}>
            {classrooms?.map((classroom, index) => (
              <Grid key={classroom.id} item xs={12} sm={6} md={4}>
                <ClassCard
                  classInfo={classroom}
                  indexs={index}
                  filter={filters}
                  handleDelete={handleDelete}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <EmptyContent title="No classes found" />
        )}
      </Container>
    </Page>
  );
}
