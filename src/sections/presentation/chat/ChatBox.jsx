import { useState } from 'react';
import PropTypes from 'prop-types';
import MessageIcon from '@mui/icons-material/Message';
import { Card, DialogContent, IconButton, Stack } from '@mui/material';
import { DialogAnimate } from '../../../components/animate';

import ChatWindow from '../../@dashboard/chat/ChatWindow';
import Iconify from '../../../components/Iconify';
import { dispatch, useSelector } from '../../../redux/store';
import { setInChatBox, setOutChatBox } from '../../../redux/slices/chat';

ChatBox.propTypes = { onSendMessageSocket: PropTypes.func };

export default function ChatBox({ onSendMessageSocket }) {
  const [showChatConsole, setShowChatConsole] = useState(false);
  const handleCloseChatConsole = () => {
    dispatch(setOutChatBox());
    setShowChatConsole(false);
  };

  const handleOpenChatConsole = () => {
    dispatch(setInChatBox());
    setShowChatConsole(true);
  };
  return (
    <>
      <IconButton
        onClick={handleOpenChatConsole}
        color="primary"
        aria-label="chatbox"
        component="label"
      >
        <Iconify icon="mdi:message-text-outline" />
      </IconButton>
      <DialogAnimate
        fullWidth
        maxWidth="md"
        open={showChatConsole}
        onClose={handleCloseChatConsole}
      >
        <DialogContent>
          <Card sx={{ height: '72vh', display: 'flex' }}>
            <Stack sx={{ flexGrow: 1, minWidth: '1px' }}>
              <ChatWindow onSendMessageSocket={onSendMessageSocket} />
            </Stack>
          </Card>
        </DialogContent>
      </DialogAnimate>
    </>
  );
}
