import PropTypes from 'prop-types';
// @mui
import { alpha, styled } from '@mui/material/styles';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Link,
  Typography
} from '@mui/material';
// routes
// hooks
import useResponsive from '../../../../hooks/useResponsive';
// utils
// components
import Image from '../../../../components/Image';
import TextMaxLine from '../../../../components/TextMaxLine';
import SvgIconStyle from '../../../../components/SvgIconStyle';
import ClassItemAction from '../ClassItemAction';
import { PATH_DASHBOARD } from '../../../../routes/paths';

// ----------------------------------------------------------------------

const OverlayStyle = styled('div')(({ theme }) => ({
  top: 0,
  zIndex: 1,
  width: '100%',
  height: '100%',
  position: 'absolute',
  backgroundColor: alpha(theme.palette.grey[900], 0.8)
}));

const RootStyle = styled('div')(({ theme }) => ({
  position: 'relative',
  '&:hover': {
    zIndex: 999,
    position: 'relative',
    boxShadow: theme.customShadows.z24,
    '& .showActions': { opacity: 1 }
  }
}));

// ----------------------------------------------------------------------

ClassCard.propTypes = {
  classInfo: PropTypes.object.isRequired,
  index: PropTypes.number,
  filter: PropTypes.string,
  handleDelete: PropTypes.func
};

export default function ClassCard({ classInfo, index, filter, handleDelete }) {
  const isDesktop = useResponsive('up', 'md');
  const { id, name, description, owner, avatar, link } = classInfo;
  const linkTo = PATH_DASHBOARD.general.detailClassroom(id);
  const latestPost = index === 0 || index === 1 || index === 2;
  if (isDesktop && latestPost) {
    return (
      <Card>
        <Avatar
          alt={name}
          src={avatar}
          sx={{
            zIndex: 9,
            top: 24,
            left: 24,
            width: 40,
            height: 40,
            position: 'absolute'
          }}
        />
        <ClassContent title={name} index={index} id={id} />
        <OverlayStyle />
        <Image alt="cover" src={avatar} sx={{ height: 360 }} />
      </Card>
    );
  }

  return (
    <Card className="card-container">
      <RootStyle>
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
            alt={name}
            src={owner?.avatar || ''}
            sx={{
              left: 40,
              zIndex: 11,
              width: 64,
              height: 64,
              bottom: -30,
              position: 'absolute'
            }}
          />
          <Image alt="cover" src={avatar} ratio="16/9" />
        </Box>

        <ClassContent title={name} owner={owner} linkTo={linkTo} />
        {filter !== 'attended' && (
          <ClassItemAction
            className="showActions"
            handleDelete={() => {
              handleDelete(id);
            }}
          />
        )}
      </RootStyle>
    </Card>
  );
}

// ----------------------------------------------------------------------

ClassContent.propTypes = {
  index: PropTypes.number,
  title: PropTypes.string,
  owner: PropTypes.object,
  linkTo: PropTypes.string
};

export function ClassContent({ owner, title, linkTo, index }) {
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
        {`${owner.firstName} ${owner.lastName}`}
      </Typography>
      <Link href={linkTo} color="inherit">
        <TextMaxLine variant="h5" line={2} persistent>
          {title}
        </TextMaxLine>
      </Link>
    </CardContent>
  );
}
