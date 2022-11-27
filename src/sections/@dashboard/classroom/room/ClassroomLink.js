import PropTypes from 'prop-types';
// @mui
import { styled } from '@mui/material/styles';
import { Card, Typography, CardHeader, Stack, Link } from '@mui/material';
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

ClassroomLink.propTypes = {
  linkUrl: PropTypes.string
};

export default function ClassroomLink({ linkUrl }) {
  return (
    <Card>
      <CardHeader title="Invitation link" />

      <Stack spacing={2} sx={{ p: 3 }}>
        {/* <Typography variant="body2">{description}</Typography> */}
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
        </Link>
      </Stack>
    </Card>
  );
}
