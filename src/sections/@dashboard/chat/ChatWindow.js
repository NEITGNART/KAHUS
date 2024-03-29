import { useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
// @mui
import { Box, Card, DialogContent, Divider, Stack } from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../../redux/store';
import {
  onSendMessage,
  getConversation,
  getParticipants,
  resetActiveConversation
} from '../../../redux/slices/chat';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
//
import ChatMessageList from './ChatMessageList';
import ChatMessageInput from './ChatMessageInput';
import { DialogAnimate } from '../../../components/animate';

// ----------------------------------------------------------------------

const conversationSelector = (state) => {
  const { conversation } = state.chat;

  if (conversation) {
    return conversation;
  }

  const initState = {
    id: '',
    messages: [],
    participants: [],
    unreadCount: 0,
    type: ''
  };
  return initState;
};

ChatWindow.propTypes = {
  onSendMessageSocket: PropTypes.func
};

export default function ChatWindow({ onSendMessageSocket }) {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { activeConversationId } = useSelector((state) => state.chat);
  const conversation = useSelector((state) => conversationSelector(state));

  const handleSendMessage = async (value) => {
    try {
      const {
        conversationId,
        messageId,
        message,
        contentType,
        attachments,
        createdAt,
        sender
      } = value;

      const newMessage = {
        id: messageId,
        body: message,
        contentType,
        attachments,
        createdAt,
        sender
      };

      onSendMessageSocket({
        id: conversationId,
        message: newMessage
      });
      dispatch(onSendMessage(value));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box sx={{ flexGrow: 1, display: 'flex', overflow: 'hidden' }}>
      <Stack sx={{ flexGrow: 1 }}>
        <ChatMessageList conversation={conversation} />

        <Divider />

        <ChatMessageInput
          conversationId={activeConversationId}
          onSend={handleSendMessage}
          disabled={pathname.slice(-4) === 'edit'}
        />
      </Stack>
    </Box>
  );
}
