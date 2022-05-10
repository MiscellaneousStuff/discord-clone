import logo from './logo.svg';
import './App.css';

const testMessages = [
  {
    "author": "Bob",
    "msg": "hi"
  },
  {
    "author": "Jim",
    "msg": "hello"
  },
  {
    "author": "Bob",
    "msg": "so, what have you been up to ?"
  },
];

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
  return (
    <div className="app">
      <Messages messages={testMessages} />
    </div>
  );
}

export default App;