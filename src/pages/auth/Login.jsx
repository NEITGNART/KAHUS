// @mui
import { styled } from '@mui/material/styles';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  Stack,
  Link,
  Alert,
  Tooltip,
  Container,
  Typography,
  Button,
  Divider
} from '@mui/material';
import { capitalCase } from 'change-case';
import OauthPopup from 'react-oauth-popup';
import Logo from '../../components/Logo';
import useResponsive from '../../hooks/useResponsive';
import Image from '../../components/Image';
import { LoginForm } from '../../sections/auth/login';
import loginImage from '../../assets/illustrations/illustration_login.png';
import Page from '../../components/Page';
import { PATH_AUTH } from '../../routes/paths';
import Iconify from '../../components/Iconify';
import useAuth from '../../hooks/useAuth';
// routes
// hooks
// components
// sections

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export default function Login() {
  const { googleLogin } = useAuth();
  const navigate = useNavigate();
  const smUp = useResponsive('up', 'sm');
  const mdUp = useResponsive('up', 'md');

  const URL_AUTH = 'http://localhost:5001/auth/login/google';

  const onCode = async (code, params) => {
    await googleLogin(code, JSON.parse(params.get('user')));
    navigate('/dashboard', { replace: true });
  };

  const onClose = () => console.log('closed!');

  return (
    <Page title="Login">
      <RootStyle>
        <HeaderStyle>
          <Logo />
          {smUp && (
            <Typography variant="body2" sx={{ mt: { md: -2 } }}>
              Don’t have an account?
              <Link
                variant="subtitle2"
                component={RouterLink}
                to={PATH_AUTH.register}
              >
                Get started
              </Link>
            </Typography>
          )}
        </HeaderStyle>

        {mdUp ? (
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
          </SectionStyle>
        ) : null}

        <Container maxWidth="sm">
          <ContentStyle>
            <Stack direction="row" alignItems="center" sx={{}}>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h4" gutterBottom>
                  Sign in to KAHUS
                </Typography>
              </Box>

              <Tooltip title={capitalCase('jwt')} placement="right">
                <>
                  <Image
                    disabledEffect
                    src={`https://minimal-assets-api.vercel.app/assets/icons/auth/ic_${'jwt'}.png`}
                    sx={{ width: 32, height: 32 }}
                  />
                </>
              </Tooltip>
            </Stack>

            <OauthPopup
              onClose={onClose}
              onCode={onCode}
              title="Login with Google"
              url={URL_AUTH}
            >
              <Stack direction="row" spacing={2}>
                <Button
                  fullWidth
                  size="large"
                  color="inherit"
                  variant="outlined"
                >
                  <Iconify
                    icon="eva:google-fill"
                    color="#DF3E30"
                    width={22}
                    height={22}
                  />
                </Button>
              </Stack>
            </OauthPopup>

            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                OR
              </Typography>
            </Divider>

            <Alert severity="info" sx={{ mt: 1, mb: 3 }}>
              Use email : <strong>demo@kahus.com</strong> / password :
              <strong> demo1234</strong>
            </Alert>
            <LoginForm />
            {!smUp && (
              <Typography variant="body2" align="center" sx={{ mt: 3 }}>
                Don’t have an account?{' '}
                <Link
                  variant="subtitle2"
                  component={RouterLink}
                  to={PATH_AUTH.register}
                >
                  Get started
                </Link>
              </Typography>
            )}
          </ContentStyle>
        </Container>
      </RootStyle>
    </Page>
  );
}

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
