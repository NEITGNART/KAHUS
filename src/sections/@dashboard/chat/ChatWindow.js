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
import ChatRoom from './ChatRoom';
import ChatMessageList from './ChatMessageList';
import ChatHeaderDetail from './ChatHeaderDetail';
import ChatMessageInput from './ChatMessageInput';
import ChatHeaderCompose from './ChatHeaderCompose';
import { DialogAnimate } from '../../../components/animate';

// ----------------------------------------------------------------------

const conversationSelector = (state) => {
  const { conversation, activeConversationId } = state.chat;

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
  socket: PropTypes.object
};

export default function ChatWindow({ socket }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { code } = useParams();
  const { participants, activeConversationId, isOpenChatBox } = useSelector(
    (state) => state.chat
  );
  const conversationKey = code;
  const conversation = useSelector((state) => conversationSelector(state));
  // const displayParticipants = participants.filter(
  //   (item) => item.id !== '8864c717-587d-472a-929a-8e5f298024da-0'
  // );

  useEffect(() => {
    const getDetails = async () => {
      dispatch(getParticipants(conversationKey));
      try {
        await dispatch(getConversation(conversationKey));
      } catch (error) {
        console.error(error);
        navigate(PATH_DASHBOARD.chat.new);
      }
    };
    if (conversationKey) {
      getDetails();
    } else if (activeConversationId) {
      dispatch(resetActiveConversation());
    }
  }, [conversationKey]);

  // useEffect(() => {
  //   if (activeConversationId) {
  //     dispatch(markConversationAsRead(activeConversationId));
  //   }
  // }, [dispatch, activeConversationId]);

  const handleSendMessage = async (value) => {
    try {
      const {
        conversationId,
        messageId,
        message,
        contentType,
        attachments,
        createdAt,
        senderId
      } = value;

      const newMessage = {
        id: messageId,
        body: message,
        contentType,
        attachments,
        createdAt,
        senderId
      };

      socket.emit('sendMsg', {
        id: conversationId,
        message: newMessage
      });
      dispatch(onSendMessage(value));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {/* <ChatHeaderDetail participants={displayParticipants} /> */}

      <Divider />

      <Box sx={{ flexGrow: 1, display: 'flex', overflow: 'hidden' }}>
        <Stack sx={{ flexGrow: 1 }}>
          <ChatMessageList conversation={conversation} />

          <Divider />

          <ChatMessageInput
            conversationId={activeConversationId}
            onSend={handleSendMessage}
            disabled={pathname === PATH_DASHBOARD.chat.new}
          />
        </Stack>
      </Box>
    </>
  );
}
