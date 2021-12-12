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
    <div>
      {messages.map((message) => {
        const { id, text, sender } = message;
        return (
          <div key={id}>
            <div>{sender.name}</div>
            <div>{text}</div>
          </div>
        );
      })}
    </div>
  );
}

export default App;
