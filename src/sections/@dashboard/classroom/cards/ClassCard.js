import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { styled, alpha } from '@mui/material/styles';
import {
  Box,
  Link,
  Card,
  Avatar,
  Typography,
  CardContent,
  Stack
} from '@mui/material';
// routes
// hooks
import useResponsive from '../../../../hooks/useResponsive';
// utils
// components
import Image from '../../../../components/Image';
import TextMaxLine from '../../../../components/TextMaxLine';
import SvgIconStyle from '../../../../components/SvgIconStyle';

// ----------------------------------------------------------------------

const OverlayStyle = styled('div')(({ theme }) => ({
  top: 0,
  zIndex: 1,
  width: '100%',
  height: '100%',
  position: 'absolute',
  backgroundColor: alpha(theme.palette.grey[900], 0.8)
}));

// ----------------------------------------------------------------------

ClassCard.propTypes = {
  classInfo: PropTypes.object.isRequired,
  index: PropTypes.number
};

export default function ClassCard({ classInfo, index }) {
  const isDesktop = useResponsive('up', 'md');

  const { id, name, cover, hostAvatarUrl, hostId, hostName } = classInfo;

  const latestPost = index === 0 || index === 1 || index === 2;

  if (isDesktop && latestPost) {
    return (
      <Card>
        <Avatar
          alt={hostName}
          src={hostAvatarUrl}
          sx={{
            zIndex: 9,
            top: 24,
            left: 24,
            width: 40,
            height: 40,
            position: 'absolute'
          }}
        />
        <ClassContent title={name} index={index} />
        <OverlayStyle />
        <Image alt="cover" src={cover} sx={{ height: 360 }} />
      </Card>
    );
  }

  return (
    <Card>
      <Box sx={{ position: 'relative' }}>
        <SvgIconStyle
          src="https://minimal-assets-api.vercel.app/assets/icons/shape-avatar.svg"
          sx={{
            width: 144,
            height: 62,
            zIndex: 10,
            bottom: -26,
            mx: 'auto',
            position: 'absolute',
            color: 'background.paper'
          }}
        />
        <Avatar
          alt={hostName}
          src={hostAvatarUrl}
          sx={{
            left: 40,
            zIndex: 11,
            width: 64,
            height: 64,
            bottom: -30,
            position: 'absolute'
          }}
        />
        <Image alt="cover" src={cover} ratio="16/9" />
      </Box>

      <ClassContent title={name} />
    </Card>
  );
}

// ----------------------------------------------------------------------

ClassContent.propTypes = {
  index: PropTypes.number,
  title: PropTypes.string
};

export function ClassContent({ title, index }) {
  const isDesktop = useResponsive('up', 'md');
  const latestPostLarge = index === 0;
  const latestPostSmall = index === 1 || index === 2;

  return (
    <CardContent
      sx={{
        pt: 6,
        width: 1,
        ...((latestPostLarge || latestPostSmall) && {
          pt: 0,
          zIndex: 9,
          bottom: 0,
          position: 'absolute',
          color: 'common.white'
        })
      }}
    >
      <Typography
        gutterBottom
        variant="caption"
        component="div"
        sx={{
          color: 'text.disabled',
          ...((latestPostLarge || latestPostSmall) && {
            opacity: 0.64,
            color: 'common.white'
          })
        }}
      >
        {title}
      </Typography>
      <Link to="/" color="inherit" component={RouterLink}>
        <TextMaxLine
          variant={isDesktop && latestPostLarge ? 'h5' : 'h5'}
          line={2}
          persistent
        >
          {title}
        </TextMaxLine>
      </Link>
    </CardContent>
  );
}
