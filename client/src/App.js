import { useState } from 'react';
import logo from './logo.svg';
import './App.css';

const Message = props => {
  console.log("PROPS:", props)
  const { message } = props;
  const { author, msg } = message;
  return (
    <div>
      <div>
        {author}
      </div>
      <div>
        {msg}
      </div>
    </div>
  )
}

const Messages = props => {
  const { messages } = props;
  console.log(messages)
  return (
    <div>
      {messages.map((message, i) => <Message key={i} message={message}/>)}
    </div>
  )
};

const App = () => {
  const [messages, setMessages] = useState([]);
  return (
    <div className="app">
      <Messages messages={messages} />
    </div>
  );
}

export default App;