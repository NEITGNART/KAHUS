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

ClassroomAbout.propTypes = {
  description: PropTypes.string
};

export default function ClassroomAbout({ description }) {
  return (
    <Card>
      <CardHeader avatar={<Iconify icon='mdi:about' />} title="About class" />
      <Stack spacing={2} sx={{ p: 3 }}>
        <Typography variant="body2">{description}</Typography>
      </Stack>
    </Card>
  );
}
