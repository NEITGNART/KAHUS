import PropTypes from 'prop-types';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
// utils
import cssStyles from '../../../../utils/cssStyles';
// hooks
import useAuth from '../../../../hooks/useAuth';
// components
import MyAvatar from '../../../../components/MyAvatar';
import Image from '../../../../components/Image';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  '&:before': {
    top: 0,
    zIndex: 9,
    content: "''",
    width: '100%',
    height: '100%',
    position: 'absolute'
  }
}));

const InfoStyle = styled('div')(({ theme }) => ({
  left: 0,
  right: 0,
  zIndex: 99,
  position: 'absolute',
  marginTop: theme.spacing(5),
  [theme.breakpoints.up('md')]: {
    right: 'auto',
    display: 'flex',
    alignItems: 'center',
    left: theme.spacing(3),
    bottom: theme.spacing(5)
  }
}));

// ----------------------------------------------------------------------

ClassroomCover.propTypes = {
  classInfo: PropTypes.object
};

export default function ClassroomCover({ classInfo }) {
  // const { user } = useAuth();
  const { owner, classRoom } = classInfo;

  return (
    <RootStyle>
      <InfoStyle>
        <Box
          sx={{
            ml: { md: 3 },
            mt: { xs: 1, md: 0 },
            color: 'common.white',
            textAlign: { xs: 'center', md: 'left' }
          }}
        >
          <Typography variant="h2">{classRoom.name}</Typography>
          <Typography sx={{ marginBottom: 5 }}>
            Created by{' '}
            {owner?.displayName || `${owner.firstName}  ${owner.lastName}`}
          </Typography>
        </Box>
      </InfoStyle>
      <Image
        alt="profile cover"
        src="https://gstatic.com/classroom/themes/img_breakfast.jpg"
        sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />
    </RootStyle>
  );
}
