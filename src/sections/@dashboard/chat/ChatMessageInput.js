import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import {
  Stack,
  Input,
  Divider,
  IconButton,
  InputAdornment
} from '@mui/material';
// utils
import uuidv4 from '../../../utils/uuidv4';
// components
import Iconify from '../../../components/Iconify';
import EmojiPicker from '../../../components/EmojiPicker';
import useAuth from '../../../hooks/useAuth';
import { useDispatch } from '../../../redux/store';
import { setAnonymousId } from '../../../redux/slices/chat';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  minHeight: 56,
  display: 'flex',
  position: 'relative',
  alignItems: 'center',
  paddingLeft: theme.spacing(2)
}));

// ----------------------------------------------------------------------

ChatMessageInput.propTypes = {
  disabled: PropTypes.bool,
  conversationId: PropTypes.string,
  onSend: PropTypes.func
};

export default function ChatMessageInput({ disabled, conversationId, onSend }) {
  const [message, setMessage] = useState('');
  const { user, deviceId } = useAuth();
  const [sender, setSender] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log(user);
    if (sender == null) {
      if (user) {
        setSender({
          id: user?.id,
          displayName: user?.firstName.concat(' ', user?.lastName),
          avatar: user?.avatar
        });
      } else {
        const id = deviceId;
        dispatch(setAnonymousId(id));
        setSender({
          id,
          displayName: 'anonymous'.concat(id),
          avatar: user?.avatar
        });
      }
    }
  }, [user]);

  const handleKeyUp = (event) => {
    if (event.key === 'Enter') {
      handleSend();
    }
  };

  const handleSend = () => {
    if (!message) {
      return '';
    }
    if (onSend && conversationId) {
      onSend({
        conversationId,
        messageId: uuidv4(),
        message,
        contentType: 'text',
        createdAt: Date.now(),
        sender
      });
      console.log(sender);
    }
    return setMessage('');
  };

  return (
    <RootStyle>
      <Input
        disabled={disabled}
        fullWidth
        value={message}
        disableUnderline
        onKeyUp={handleKeyUp}
        onChange={(event) => setMessage(event.target.value)}
        placeholder="Type a message"
        startAdornment={
          <InputAdornment position="start">
            <EmojiPicker
              disabled={disabled}
              value={message}
              setValue={setMessage}
            />
          </InputAdornment>
        }
      />

      <Divider orientation="vertical" flexItem />

      <IconButton
        color="primary"
        disabled={!message}
        onClick={handleSend}
        sx={{ mx: 1 }}
      >
        <Iconify icon="ic:round-send" width={22} height={22} />
      </IconButton>
    </RootStyle>
  );
}
