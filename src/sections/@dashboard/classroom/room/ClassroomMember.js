import PropTypes from 'prop-types';
// @mui
import {
  Box,
  Grid,
  Card,
  Link,
  Avatar,
  IconButton,
  Typography,
  InputAdornment
} from '@mui/material';
// components
import Iconify from '../../../../components/Iconify';
import InputStyle from '../../../../components/InputStyle';
import SocialsButton from '../../../../components/SocialsButton';
import SearchNotFound from '../../../../components/SearchNotFound';

// ----------------------------------------------------------------------

ClassroomMember.propTypes = {
  members: PropTypes.array,
  findMembers: PropTypes.string,
  onFindMembers: PropTypes.func
};

export default function ClassroomMember({
  members,
  findMembers,
  onFindMembers
}) {
  const memberFiltered = applyFilter(members, findMembers);

  const isNotFound = memberFiltered.length === 0;

  return (
    <Box sx={{ mt: 5 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Members
      </Typography>

      <InputStyle
        stretchStart={240}
        value={findMembers}
        onChange={(event) => onFindMembers(event.target.value)}
        placeholder="Find members..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify
                icon="eva:search-fill"
                sx={{ color: 'text.disabled', width: 20, height: 20 }}
              />
            </InputAdornment>
          )
        }}
        sx={{ mb: 5 }}
      />
      <Grid container spacing={3}>
        {memberFiltered.map((member) => (
          <Grid key={member.id} item xs={12} md={4}>
            <MemberCard member={member} />
          </Grid>
        ))}
      </Grid>

      {isNotFound && (
        <Box sx={{ mt: 5 }}>
          <SearchNotFound searchQuery={findMembers} />
        </Box>
      )}
    </Box>
  );
}

// ----------------------------------------------------------------------

MemberCard.propTypes = {
  member: PropTypes.object
};

function MemberCard({ member }) {
  const { firstName, lastName, avatar } = member;
  const fullName = `${firstName} ${lastName}`;
  return (
    <Card
      sx={{
        py: 5,
        display: 'flex',
        position: 'relative',
        alignItems: 'center',
        flexDirection: 'column'
      }}
    >
      <Avatar
        alt={fullName}
        referrerPolicy="no-referrer"
        src={avatar || 'https://i.pravatar.cc/300'}
        sx={{ width: 64, height: 64, mb: 3 }}
      />
      <Link href="/" variant="subtitle1" color="text.primary">
        {fullName}
      </Link>

      <IconButton sx={{ top: 8, right: 8, position: 'absolute' }}>
        <Iconify icon="eva:more-vertical-fill" width={20} height={20} />
      </IconButton>
    </Card>
  );
}

// ----------------------------------------------------------------------

function applyFilter(array, query) {
  if (query) {
    return array.filter(
      (member) =>
        `${member.firstName} ${member.lastName}`
          .toLowerCase()
          .indexOf(query.toLowerCase()) !== -1
    );
  }

  return array;
}
