// @mui
import { Container, Box, Grid } from '@mui/material';
// routes
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

// ----------------------------------------------------------------------

export default function ClassroomList() {
  const { themeStretch } = useSettings();

  return (
    <Page title="Classes | KAHUS">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs heading="Classes" />
        <Grid container spacing={3}>
          {_classroomCards.map((classroom, index) => (
            <Grid key={classroom.id} item xs={12} sm={6} md={4}>
              <ClassCard classInfo={classroom} indexs={index} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Page>
  );
}
