// @mui
import { Container, Box, Grid } from '@mui/material';
// routes
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
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

// ----------------------------------------------------------------------
export default function ClassroomList() {
  const { themeStretch } = useSettings();
  const { user } = useAuth();

  const [classrooms, setClassrooms] = useState([]);
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

  // const { data: classrooms, isLoading } = useQuery({
  //   queryKey: ['classrooms'],
  //   queryFn: async () => {
  //     const response = await axios.get(`/api/group/group-invited`);
  //     return response.data;
  //   }
  // });
  //
  // if (isLoading) return <LoadingScreen />;

  return (
    <Page title="Classes | KAHUS">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs heading="Classes" />
        <Grid container spacing={3}>
          {classrooms?.map((classroom, index) => (
            <Grid key={classroom.id} item xs={12} sm={6} md={4}>
              <ClassCard classInfo={classroom} indexs={index} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Page>
  );
}
