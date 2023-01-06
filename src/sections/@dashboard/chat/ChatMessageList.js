import PropTypes, { number } from 'prop-types';
import { useEffect, useState, useRef } from 'react';
//
import Scrollbar from '../../../components/Scrollbar';
import LightboxModal from '../../../components/LightboxModal';
import ChatMessageItem from './ChatMessageItem';
import useAuth from '../../../hooks/useAuth';
import { useSelector } from '../../../redux/store';

// ----------------------------------------------------------------------

ChatMessageList.propTypes = {
  conversation: PropTypes.object.isRequired
};

const pageSize = 6;

export default function ChatMessageList({ conversation }) {
  const scrollRef = useRef(null);
  const [scrollTurn, setScrollTurn] = useState(
    Math.floor(conversation.messages.length / pageSize - 1)
  );
  const [messageContent, setMessageContent] = useState(
    scrollTurn === 0
      ? conversation.messages.slice(0)
      : conversation.messages.slice(
          (scrollTurn - 1) * pageSize,
          scrollTurn * pageSize
        )
  );
  const [isNewMsg, setIsNewMsg] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(true);
  const [isFirstScroll, setIsFirstScroll] = useState(true);

  const scrollMessagesToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    if (isFirstTime === false) {
      setIsNewMsg(true);
      setMessageContent([
        ...messageContent,
        conversation.messages[conversation.messages.length - 1]
      ]);
    } else {
      setIsFirstTime(false);
      scrollMessagesToBottom();
    }
  }, [conversation.messages]);

  useEffect(() => {
    if (isNewMsg || isFirstTime) {
      scrollMessagesToBottom();
    }
  }, [messageContent]);

  useEffect(() => {
    scrollRef.current.onscroll = () => {
      if (scrollRef.current.scrollTop === 0) {
        if (scrollTurn > 0) {
          if (isFirstScroll) {
            setMessageContent(
              conversation.messages.slice((scrollTurn - 1) * pageSize)
            );
            setIsFirstScroll(false);
          } else {
            setMessageContent(
              conversation.messages
                .slice((scrollTurn - 1) * pageSize, scrollTurn * pageSize)
                .concat(messageContent)
            );
          }
          setScrollTurn(scrollTurn - 1);
        }
      }
    };
  }, [scrollTurn]);

  return (
    <>
      <Scrollbar
        scrollableNodeProps={{ ref: scrollRef }}
        sx={{ p: 3, height: 1 }}
      >
        {messageContent.map((message) => (
          <ChatMessageItem key={message.id} message={message} />
        ))}
      </Scrollbar>
    </>
  );
}
