// @mui
import { Container, Box } from '@mui/material';
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

// ----------------------------------------------------------------------

export default function ClassroomList() {
  const { themeStretch } = useSettings();

  return (
    <Page title="Classes | KAHUS">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs heading="Classes" />

        <Box
          sx={{
            display: 'grid',
            gap: 3,
            gridTemplateColumns: {
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)'
            }
          }}
        >
          {_classroomCards.map((classroom) => (
            <ClassroomCard key={classroom.id} classroom={classroom} />
          ))}
        </Box>
      </Container>
    </Page>
  );
}
