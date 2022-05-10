// Module Imports
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

// CSS Imports
import './App.css';

const Message = props => {
  const { id, text, time, username } = props;
  console.log("PROPS:", props);
  return (
    <div className="message">
      <div className="message-top">
        <div className="message-username">{username}</div>
        <div>{time}</div>
      </div>
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
    <div className="messages">
      {[...Object.values(messages)]
        .map((message, i) => (
          <Message key={i} {...message} />
        ))
      }
    </div>
  )
};

const Chat = ({socket}) => {
  const [message, setMessage] = useState("");

  const handleChange = ev => {
    setMessage(ev.target.value);
  };

  const handleKeyDown = ev => {
    if (ev.key === "Enter") {
      socket.emit("chatMessage", message);
      setMessage("");
    }
  };

  return (
    <div className="chat">
      <input
        type="text"
        value={message}
        onChange={handleChange}
        onKeyDown={handleKeyDown} />
    </div>
  )
};

const ScreenShare = props => {
  return (
    <div className="screen-share">
      <div>ScreenShare</div>
      <video autoplay></video>
    </div>
  )
};

const App = () => {
  const [socket, setSocket] = useState(null);

  // WebRTC Initialization
  

  // Socket.IO Initialization
  useEffect(() => {
    const newSocket = io(`http://${window.location.hostname}:5000`);
    setSocket(newSocket);
    newSocket.emit("joinChannel", {username: "geez", channel: "text"});
    return () => newSocket.close();
  }, [setSocket]);

  return (
    <div className="app">
      {socket ? (
        <div className="app-inner">
          <ScreenShare />
          <Messages socket={socket} />
          <Chat socket={socket} />
        </div>
      ) : (
        <div>Not connected to text channel!</div> 
      )}
    </div>
  );
}

export default App;