import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';

interface ChatWindowProps {
  messages: Message[];
  onSend: (text: string) => void;
  user: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, onSend, user }) => {
  const [text, setText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSend = () => {
    if (text.trim()) {
      onSend(text);
      setText('');
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col flex-1 bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
      <div className="flex-1 overflow-y-auto mb-4 space-y-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            data-testid={`message-${i}`}
            className={`flex ${msg.user === user ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-sm p-3 rounded-lg shadow-sm ${
                msg.user === user
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200'
              }`}
            >
              <div className="flex items-baseline space-x-2">
                <span className="font-semibold">{msg.user}</span>
                <span className="text-xs opacity-70">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <p>{msg.text}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex space-x-3">
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Type a message"
          data-testid="message-input"
          className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600"
        />
        <button
          onClick={handleSend}
          disabled={!text.trim()}
          data-testid="send-button"
          className="bg-blue-600 text-white px-4 py-3 rounded-lg shadow hover:bg-blue-700 transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;