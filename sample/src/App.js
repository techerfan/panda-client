import React, { useEffect, useState } from 'react';
import './App.scss';
import { panda } from 'panda-client';
import Topbar from './components/topbar/Topbar';
import Sidebar from './components/sidebar/Sidebar';
import Chat from './components/chat/Chat';
import { useLoadingText } from './hooks/useLoadingText';


const App = () => {

  const [socket, setSocket] = useState(null);
  const [showDialog, setShowDialog] = useState(true);
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);
  const loadingText = useLoadingText([
    '.',
    '..',
    '...',
  ], showDialog);

  useEffect(() => {
    let sock = panda('ws://localhost:8000/ws', {
      autoReconnect: true,
      onClose: (event) => {
        if (showDialog !== false) {
          setShowDialog(true);
        }
      },
      onOpen: () => {
        setShowDialog(false);
      }
    });
    console.log(sock.id);
    sock.init();
    setSocket(sock);

    sock.subscribe('chat_message', (msg) => {
      setMessages(m => [...m, msg]);
    });

    return () => {
      sock.destroyConnection();
    };
  }, []);

  return (
    <div className="App">
      <Topbar/>
      <div className="layout">
        <Sidebar/>
        <Chat 
          socket={socket}
          messages={messages}
          text={text}
          setText={setText}/>
      </div>
      {
        showDialog ?
          <div className="dialog">
            <div className="box">Getting socket ready{loadingText}</div>
          </div>
          :
          null
      }
    </div>
  );
}

export default App;
