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

export default function ChatMessageList({ conversation }) {
  // const messagePerScroll = 7;
  const scrollRef = useRef(null);
  // const [scrollTurn, setScrollTurn] = useState(
  //   Math.floor(conversation.messages.length / messagePerScroll)
  // );
  // const messageScrolling = Math.floor(
  //   conversation.messages.length / messagePerScroll
  // );
  const [messageContent, setMessageContent] = useState([]);
  // const numberRolling1 = Math.floor(
  //   conversation.messages.length / messagePerScroll
  // );
  // const numberRolling2 = conversation.messages.length - numberRolling1 * 7;
  // let messageContent = conversation.messages.slice(numberRolling1 * 7);
  // console.log(messageContent);
  const { isPublic } = useSelector((state) => state.chat);
  useEffect(() => {
    const scrollMessagesToBottom = () => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    };
    scrollMessagesToBottom();
  }, [conversation.messages]);

  // useEffect(() => {
  //   scrollRef.current.onscroll = () => {
  //     if (scrollRef.current.scrollTop === 0) {
  //       console.log((scrollTurn - 1) * 7);
  //       console.log(conversation.messages.indexOf(messageContent[0]));
  //       console.log(messageContent[0]);
  //       if (scrollTurn > 0) {
  //         setMessageContent(
  //           conversation.messages
  //             .slice(
  //               (scrollTurn - 1) * 7,
  //               conversation.messages.indexOf(messageContent[0])
  //             )
  //             .concat(messageContent)
  //         );
  //         setScrollTurn(scrollTurn - 1);
  //       }
  //     }
  //   };
  // }, [scrollTurn]);

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
