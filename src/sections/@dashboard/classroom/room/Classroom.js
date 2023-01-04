import PropTypes from 'prop-types';
// @mui
import { Grid, Stack } from '@mui/material';
//
import ClassroomAbout from './ClassroomAbout';
import ClassroomLink from './ClassroomLink';
import PostCard from './PostCard';
import PostInput from './PostInput';
import ClassroomLinkAlert from './ClassroomLinkAlert';

// ----------------------------------------------------------------------

Classroom.propTypes = {
  classInfo: PropTypes.object,
  posts: PropTypes.array
};

export default function Classroom({ classInfo, posts }) {
  const isDisplayPresentLink =
    classInfo.role === 'co-owner' || classInfo.role === 'owner';

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        {classInfo.notification && (
          <Stack spacing={3}>
            <ClassroomLinkAlert
              title="Important notice"
              linkUrl={
                isDisplayPresentLink
                  ? classInfo.presentLink
                  : classInfo.notification
              }
              description="The presentation has been started. Please join the presentation using the link below."
            />
          </Stack>
        )}
        <Stack spacing={3} mt={3}>
          <ClassroomAbout description={classInfo.description} />
        </Stack>
        <Stack spacing={3} mt={3}>
          <ClassroomLink
            title="Invitation link"
            linkUrl={classInfo.linkUrl}
            description="This is a private class. Only students with the link can join. Please do not share the link with anyone."
          />
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
