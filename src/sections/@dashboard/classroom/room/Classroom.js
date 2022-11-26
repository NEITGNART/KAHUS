import PropTypes from 'prop-types';
// @mui
import { Grid, Stack } from '@mui/material';
//
import ClassroomAbout from './ClassroomAbout';
import ClassroomLink from './ClassroomLink';
import PostCard from './PostCard';
import PostInput from './PostInput';
import ProfileSocialInfo from './ProfileSocialInfo';

// ----------------------------------------------------------------------

Classroom.propTypes = {
  classInfo: PropTypes.object,
  posts: PropTypes.array
};

export default function Classroom({ classInfo, posts }) {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Stack spacing={3}>
          <ClassroomAbout description={classInfo.description} />
        </Stack>
        <Stack spacing={3} mt={3}>
          <ClassroomLink linkUrl={classInfo.linkUrl} />
        </Stack>
      </Grid>

      <Grid item xs={12} md={8}>
        <Stack spacing={3}>
          <PostInput />
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </Stack>
      </Grid>
    </Grid>
  );
}
