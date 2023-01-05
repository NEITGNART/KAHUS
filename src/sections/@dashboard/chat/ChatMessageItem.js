import PropTypes from 'prop-types';
import { formatDistanceToNowStrict } from 'date-fns';
// @mui
import { styled } from '@mui/material/styles';
import { Avatar, Box, Typography } from '@mui/material';
// components
import Image from '../../../components/Image';
import useAuth from '../../../hooks/useAuth';
import { useSelector } from '../../../redux/store';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  marginBottom: theme.spacing(3)
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 320,
  padding: theme.spacing(1.5),
  marginTop: theme.spacing(0.5),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.neutral
}));

const InfoStyle = styled(Typography)(({ theme }) => ({
  display: 'flex',
  marginBottom: theme.spacing(0.75),
  color: theme.palette.text.secondary
}));

// ----------------------------------------------------------------------

ChatMessageItem.propTypes = {
  message: PropTypes.object.isRequired,
  conversation: PropTypes.object.isRequired,
  onOpenLightbox: PropTypes.func
};

export default function ChatMessageItem({
  message,
  conversation,
  onOpenLightbox
}) {
  const { user, deviceId } = useAuth();
  // const sender = conversation.participants.find(
  //   // eslint-disable-next-line no-underscore-dangle
  //   (participant) => participant._id === message.senderId
  // );
  // eslint-disable-next-line no-underscore-dangle
  const { anonymousId } = useSelector((state) => state.chat);

  let senderDetails;

  if (user) {
    console.log(user);
    console.log(message);
    senderDetails =
      // eslint-disable-next-line no-underscore-dangle
      message.sender.id === user.id
        ? { type: 'me' }
        : {
            avatar: message.sender.avatar,
            name: message.sender.displayName
          };
  } else {
    senderDetails =
      // eslint-disable-next-line no-underscore-dangle
      message.sender.id === deviceId
        ? { type: 'me' }
        : {
            avatar: message.sender.avatar,
            name: message.sender.displayName
          };
  }

  const isMe = senderDetails.type === 'me';
  const isImage = message.contentType === 'image';
  const firstName = senderDetails.name;

  return (
    <RootStyle>
      <Box
        sx={{
          display: 'flex',
          ...(isMe && {
            ml: 'auto'
          })
        }}
      >
        {senderDetails.type !== 'me' && (
          <Avatar
            alt={senderDetails.name}
            src={senderDetails.avatar}
            sx={{ width: 32, height: 32, mr: 2 }}
          />
        )}

        <div>
          <InfoStyle
            variant="caption"
            sx={{
              ...(isMe && { justifyContent: 'flex-end' })
            }}
          >
            {!isMe && `${firstName},`}&nbsp;
            {formatDistanceToNowStrict(new Date(message.createdAt), {
              addSuffix: true
            })}
          </InfoStyle>

          <ContentStyle
            sx={{
              ...(isMe && { color: 'grey.800', bgcolor: 'primary.lighter' }),
              ...(isImage && { p: 0 })
            }}
          >
            {isImage ? (
              <Image
                alt="attachment"
                src={message.body}
                onClick={() => onOpenLightbox(message.body)}
                sx={{
                  borderRadius: 1,
                  cursor: 'pointer',
                  '&:hover': { opacity: 0.8 }
                }}
              />
            ) : (
              <Typography variant="body2">{message.body}</Typography>
            )}
          </ContentStyle>
        </div>
      </Box>
    </RootStyle>
  );
}
