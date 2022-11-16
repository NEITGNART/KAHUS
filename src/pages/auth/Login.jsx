// @mui
import { styled } from '@mui/material/styles';
import {
  Box,
  Card,
  Stack,
  Link,
  Alert,
  Tooltip,
  Container,
  Typography
} from '@mui/material';
import Logo from '../../components/Logo';
import useResponsive from '../../hooks/useResponsive';
import Image from '../../components/Image';
import { LoginForm } from '../../sections/auth/login';
import loginImage from '../../static/illustrations/illustration_login.png';
import Page from '../../components/Page';
// routes
// hooks
// components
// sections

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex'
  }
}));

const HeaderStyle = styled('header')(({ theme }) => ({
  top: 0,
  zIndex: 9,
  lineHeight: 0,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  position: 'absolute',
  padding: theme.spacing(3),
  justifyContent: 'space-between',
  [theme.breakpoints.up('md')]: {
    alignItems: 'flex-start',
    padding: theme.spacing(7, 5, 0, 7)
  }
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 464,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  margin: theme.spacing(2, 0, 2, 2)
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(12, 0)
}));

// ----------------------------------------------------------------------

export default function Login() {
  const smUp = useResponsive('up', 'sm');

  const mdUp = useResponsive('up', 'md');

  return (
    <Page title="login">
      <RootStyle>
        <HeaderStyle>
          <Logo />
        </HeaderStyle>
        {smUp ? (
          <SectionStyle>
            <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
              Hi, Welcome Back
            </Typography>
            <Image
              visibleByDefault
              disabledEffect
              alt="login"
              src={loginImage}
            />
            <LoginForm />
          </SectionStyle>
        ) : null}
      </RootStyle>
    </Page>
  );
}
