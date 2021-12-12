import './App.css';
import { useEffect, useState } from 'react';

function App() {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    loadMessages();

    async function loadMessages() {
      const response = await fetch('/api/messages');
      const data = await response.json();
      setMessages(data.messages);
    }
  }, []);
  return (
    <div className="app__container">
      {messages.map((message) => {
        const { id, text, sender } = message;
        return (
          <div key={id} className="message">
            <div className="message__sender">{sender.name}</div>
            <div className="message__text">{text}</div>
          </div>
        );
      })}
    </div>
  );
}

export default App;
