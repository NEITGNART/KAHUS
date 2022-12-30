import PropTypes from 'prop-types';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useSnackbar } from 'notistack';
// @mui
import { styled } from '@mui/material/styles';
import {
  Card,
  Typography,
  CardHeader,
  Stack,
  Link,
  Button,
  IconButton
} from '@mui/material';
// components
import Iconify from '../../../../components/Iconify';

// ----------------------------------------------------------------------

const IconStyle = styled(Iconify)(({ theme }) => ({
  width: 20,
  height: 20,
  marginTop: 1,
  flexShrink: 0,
  marginRight: theme.spacing(2)
}));

// ----------------------------------------------------------------------

ClassroomLinkAlert.propTypes = {
  linkUrl: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string
};

export default function ClassroomLinkAlert({ title, linkUrl, description }) {
  const { enqueueSnackbar } = useSnackbar();
  return (
    <Card>
      <CardHeader
        avatar={<Iconify icon="ic:round-notification-important" color="red" />}
        title={title}
      />

      <Stack spacing={2} sx={{ p: 3 }}>
        <Typography variant="body2">{description}</Typography>
        <Link
          variant="body2"
          // component={RouterLink}
          to="https://mui.com/material-ui/api/link/"
          sx={{
            lineHeight: 2,
            display: 'flex',
            alignItems: 'center',
            color: 'text.primary',
            '& > div': { display: 'inherit' }
          }}
        >
          {linkUrl}
          <CopyToClipboard text={linkUrl}>
            <IconButton
              aria-label="copy"
              size="large"
              onClick={() => {
                enqueueSnackbar('copy link success', { variant: 'success' });
              }}
            >
              <Iconify icon="eva:copy-outline" />
            </IconButton>
          </CopyToClipboard>
        </Link>
      </Stack>
    </Card>
  );
}
