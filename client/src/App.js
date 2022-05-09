import logo from './logo.svg';
import './App.css';

const testMessages = ["hi", "hello!", "so, how are ya ?"];

const Message = props => {
  const { message } = props;
  return (
    <div>
      {message}
    </div>
  )
}

const Messages = props => {
  const { messages } = props;
  return (
    <div>
      {messages.map((message, i) => <Message message={message}/>)}
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