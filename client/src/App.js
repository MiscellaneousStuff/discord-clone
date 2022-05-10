// Module Imports
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

// CSS Imports
import './App.css';

const Message = props => {
  const { id, text, time, username } = props;
  console.log("PROPS:", props);
  return (
    <div>
      <div>{username}</div>
      <div>{text}</div>
    </div>
  )
}

const Messages = ({socket}) => {
  const [messages, setMessages] = useState([]);
  
  useEffect(() => {
    const msgListener = msg => {
      setMessages((prevMsgs) => {
        const newMsgs = {...prevMsgs};
        newMsgs[msg.id] = msg;
        console.log("new msgs:", newMsgs);
        return newMsgs;
      })
    };
    const delMsgListener = msgId => {
      setMessages((prevMsgs) => {
        const newMsgs = {...prevMsgs};
        delete newMsgs[msgId];
        return newMsgs;
      });
    };
    
    socket.on("message", msgListener);
    socket.on("deleteMessage", delMsgListener);
    socket.emit("getMessages");

    return () => {
      socket.off("message", msgListener);
      socket.off("deleteMessage", delMsgListener);
    };
  }, [socket]);

  console.log("messages:", messages)
  // {messages.map((message, i) => <Message key={i} message={message}/>)}
  return (
    <div>
      {[...Object.values(messages)]
        .map((message, i) => (
          <Message key={i} {...message} />
        ))
      }
    </div>
  )
};

const App = () => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(`http://${window.location.hostname}:5000`);
    setSocket(newSocket);
    newSocket.emit("joinChannel", {username: "geez", channel: "text"});
    return () => newSocket.close();
  }, [setSocket]);

  return (
    <div className="app">
      {socket ? (
        <Messages socket={socket}/>
      ) : (
        <div>Not connected to text channel!</div> 
      )}
    </div>
  );
}

export default App;