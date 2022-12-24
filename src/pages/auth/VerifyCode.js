import { Link as RouterLink } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Button, Link, Container, Typography } from '@mui/material';
// layouts
import LogoOnlyLayout from '../../layout/LogoOnlyLayout';
// routes
import { PATH_AUTH } from '../../routes/paths';
// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
// sections
import { ResetPassword } from '../../sections/@dashboard/user/account';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  height: '100%',
  alignItems: 'center',
  padding: theme.spacing(12, 0)
}));

// ----------------------------------------------------------------------

export default function VerifyCode() {
  return (
    <Page title="Verify" sx={{ height: 1 }}>
      <RootStyle>
        <LogoOnlyLayout />
        <Container>
          <Box sx={{ maxWidth: 480, mx: 'auto' }}>
            <Typography variant="h3" paragraph>
              Enter new password
            </Typography>
            <ResetPassword />
          </Box>
        </Container>
      </RootStyle>
    </Page>
  );
}
