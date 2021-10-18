import React, { useCallback, useEffect, useRef } from 'react';
import { useScroll } from '../../hooks/useScroll';
import './chat.scss';
import { Player } from '@lottiefiles/react-lottie-player';

const Chat = ({ socket, text, messages, setText }) => {

  const ref = useRef(null);
  const sendRef = useRef(null);
  const scroll = useScroll(ref);


  const onSendClick = useCallback((e) => {
    if (text !== '') {
      socket.publish('chat_message', text);
      setText('');
      sendRef.current.play();
    }
  }, [text, socket, setText]);

  const onEnterListener = useCallback((e) => {
    if (e.key === 'Enter') {
      onSendClick();
    }
  }, [onSendClick]);

  useEffect(() => {
    scroll();
  }, [messages]);
  
  // useEffect(() => {
  //   if (socket != null) {
  //     console.log('subscribe');
  //     socket.subscribe('chat_message', (msg) => {
  //       setMessages(m => [...m, msg]);
  //       scroll();
  //     });
  //   }
  // }, [socket]);



  return (
    <div className="chat">
      <div ref={ref} className="chat-layout">
        {messages.map((msg, index) => {
          return (
            <div key={index} className="message">{msg}</div>
          )
        })}
      </div>
      <div className="input-control">
        <input type='text' value={text} onChange={e => setText(e.target.value)} onKeyPress={onEnterListener}/>
        <span onClick={onSendClick}>
          <Player 
            ref={sendRef}
            src="https://assets8.lottiefiles.com/packages/lf20_r4alsuls.json" 
            background="transparent"
            speed="2"  
            style={{width: '70px', height: '70px', cursor: 'pointer'}}>
          </Player>
        </span>
      </div>
    </div>
  )
}

export default Chat;