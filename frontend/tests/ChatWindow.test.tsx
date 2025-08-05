import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ChatWindow from '../src/components/ChatWindow';
import { Message } from '../src/types';

const mockMessages: Message[] = [
  { user: 'Alice', text: 'Hello', timestamp: 1631234567890 },
  { user: 'Bob', text: 'World', timestamp: 1631234567900 },
];

const mockOnSend = jest.fn();

describe('ChatWindow Component', () => {
  test('renders ChatWindow component', () => {
    render(<ChatWindow messages={mockMessages} onSend={mockOnSend} user="TestUser" />);
    expect(screen.getByTestId('chat-window')).toBeInTheDocument();
  });

  test('displays messages correctly', () => {
    render(<ChatWindow messages={mockMessages} onSend={mockOnSend} user="TestUser" />);
    mockMessages.forEach((message, index) => {
      const messageElement = screen.getByTestId(`message-${index}`);
      expect(messageElement).toHaveTextContent(`${message.user}: ${message.text}`);
    });
  });

  test('calls onSend when send button is clicked with valid input', () => {
    render(<ChatWindow messages={mockMessages} onSend={mockOnSend} user="TestUser" />);
    const input = screen.getByTestId('message-input');
    const button = screen.getByTestId('send-button');

    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.click(button);

    expect(mockOnSend).toHaveBeenCalledWith('Test message');
  });
});