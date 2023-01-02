import PropTypes from 'prop-types';
import { useEffect, useState, useRef } from 'react';
//
import Scrollbar from '../../../components/Scrollbar';
import LightboxModal from '../../../components/LightboxModal';
import ChatMessageItem from './ChatMessageItem';
import useAuth from '../../../hooks/useAuth';

// ----------------------------------------------------------------------

ChatMessageList.propTypes = {
  conversation: PropTypes.object.isRequired
};

export default function ChatMessageList({ conversation }) {
  const scrollRef = useRef(null);

  // const messagePerScroll = 7
  // const numberRolling1 = conversation.message.length() / messagePerScroll
  // const numberRolling2 = conversation.message.length() % messagePerScroll
  // const messageContent = conversation.message.slice()

  useEffect(() => {
    const scrollMessagesToBottom = () => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    };
    scrollMessagesToBottom();
    // scrollRef.current.onscroll = () => {
    //   if (scrollRef.current.scrollTop === 0) {
    //     console.log('reach top');
    //   }
    // };
  }, [conversation.messages]);

  const imagesLightbox = conversation.messages
    .filter((messages) => messages.contentType === 'image')
    .map((messages) => messages.body);

  const handleOpenLightbox = (url) => {
    const localSelectedImage = imagesLightbox.findIndex(
      (index) => index === url
    );
  };

  return (
    <>
      <Scrollbar
        scrollableNodeProps={{ ref: scrollRef }}
        sx={{ p: 3, height: 1 }}
      >
        {conversation.messages.map((message) => (
          <ChatMessageItem
            key={message.id}
            message={message}
            conversation={conversation}
            onOpenLightbox={handleOpenLightbox}
          />
        ))}
      </Scrollbar>
    </>
  );
}
