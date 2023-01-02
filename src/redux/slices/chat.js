/* eslint-disable no-underscore-dangle */
import { createSlice } from '@reduxjs/toolkit';
import { useSnackbar } from 'notistack';
// utils
import axios from '../../utils/axios';
//
import { dispatch } from '../store';

// ----------------------------------------------------------------------

function objFromArray(array, key = 'id') {
  return array.reduce((accumulator, current) => {
    accumulator[current[key]] = current;
    return accumulator;
  }, {});
}

const initialState = {
  isLoading: false,
  error: null,
  conversation: null,
  activeConversationId: null,
  participants: [],
  isInChatBox: false
};

const slice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    // GET CONVERSATION
    getConversationSuccess(state, action) {
      const temp = action.payload;
      let conversation = temp[0];
      const id = conversation._id;
      conversation = { ...conversation, id };
      if (conversation) {
        state.conversation = conversation;
        state.activeConversationId = conversation.id;
      } else {
        state.activeConversationId = null;
      }
    },

    // ON SEND MESSAGE
    onSendMessage(state, action) {
      const conversation = action.payload;
      const {
        conversationId,
        messageId,
        message,
        contentType,
        attachments,
        createdAt,
        senderId
      } = conversation;

      const newMessage = {
        id: messageId,
        body: message,
        contentType,
        attachments,
        createdAt,
        senderId
      };

      state.conversation.messages.push(newMessage);
    },

    // ON RECEIVE MESSAGE
    onReceiveMessage(state, action) {
      const conversation = action.payload;
      state.conversation.messages.push(conversation.message);
    },

    // ON PARTICIPANT JOIN
    onParticipantJoinChat(state, action) {
      const newParticipant = action.payload;
      state.conversation.participants.push(newParticipant);
      const newParticipants = [...state.participants, newParticipant];
      state.participants = newParticipants;
    },

    markConversationAsReadSuccess(state, action) {
      // const { conversationId } = action.payload;
      // const conversation = state.conversations.byId[conversationId];
      // if (conversation) {
      //   conversation.unreadCount = 0;
      // }
    },

    // GET PARTICIPANTS
    getParticipantsSuccess(state, action) {
      const participants = action.payload;
      if (participants) {
        state.participants = participants;
      }
    },

    // RESET ACTIVE CONVERSATION
    resetActiveConversation(state) {
      state.activeConversationId = null;
    },

    setInChatBox(state) {
      console.log('hahaha');
      state.isInChatBox = true;
    },
    setOutChatBox(state) {
      console.log('hihihi');
      state.isInChatBox = false;
    }
  }
});

// Reducer
export default slice.reducer;

// Actions
export const {
  onSendMessage,
  onReceiveMessage,
  resetActiveConversation,
  onParticipantJoinChat,
  setInChatBox,
  setOutChatBox
} = slice.actions;

// ----------------------------------------------------------------------

export function getConversation(conversationKey) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/conversation', {
        params: { conversationKey }
      });
      dispatch(
        // slice.actions.getConversationSuccess(response.data.conversation)
        slice.actions.getConversationSuccess(response.data)
      );
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function markConversationAsRead(conversationId) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.get('/api/chat/conversation/mark-as-seen', {
        params: { conversationId }
      });
      dispatch(slice.actions.markConversationAsReadSuccess({ conversationId }));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getParticipants(conversationKey) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/conversation/participants', {
        params: { conversationKey }
      });
      dispatch(
        slice.actions.getParticipantsSuccess(response.data.participants)
      );
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
