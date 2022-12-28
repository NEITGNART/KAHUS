// @mui
import { Button, Container } from '@mui/material';
// routes
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';

// redux
import { useDispatch } from '../../redux/store';
import { openModal } from '../../redux/slices/presentation';
import PresentationCard from '../../components/PresentationCard';
import { PATH_DASHBOARD } from '../../routes/paths';

// ----------------------------------------------------------------------

export default function PresentationList() {
  const { themeStretch } = useSettings();

  const dispatch = useDispatch();

  const handleCreatePresentation = () => {
    dispatch(openModal());
  };

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
        <PresentationCard />
      </Container>
    </Page>
  );
}
