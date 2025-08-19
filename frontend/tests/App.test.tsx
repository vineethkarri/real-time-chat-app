import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../src/App';
import { auth } from '../src/firebase';
import { io } from 'socket.io-client';

// Mock Firebase auth
jest.mock('../src/firebase', () => ({
  auth: {
    getAuth: jest.fn(),
    signInWithPopup: jest.fn(),
    signOut: jest.fn(),
  },
}));

// Mock Socket.IO
const mockSocket = {
  on: jest.fn(),
  off: jest.fn(),
  emit: jest.fn(),
  connect: jest.fn(),
  disconnect: jest.fn(),
};
jest.mock('socket.io-client', () => ({
  io: jest.fn(() => mockSocket),
}));

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock fetch for room list
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(['room1', 'room2']),
      })
    ) as jest.Mock;
  });

  test('renders sign-in button initially', () => {
    render(<App />);
    expect(screen.getByText(/Sign in with Google/i)).toBeInTheDocument();
  });

  test('renders leave room button when in a room', () => {
    // Mock user and room state
    jest.spyOn(React, 'useState')
      .mockImplementationOnce(() => [{ displayName: 'Test User', photoURL: 'test.jpg' }, jest.fn()])
      .mockImplementationOnce(() => ['room1', jest.fn()])
      .mockImplementationOnce(() => [['room1', 'room2'], jest.fn()])
      .mockImplementationOnce(() => [[], jest.fn()])
      .mockImplementationOnce(() => [['Test User'], jest.fn()]);

    render(<App />);
    expect(screen.getByTestId('leave-room-button')).toBeInTheDocument();
    expect(screen.getByText(/Room: room1/i)).toBeInTheDocument();
  });

  test('leave room button clears room state and emits leaveRoom event', () => {
    const setRoomId = jest.fn();
    const setMessages = jest.fn();
    const setUsersInRoom = jest.fn();

    jest.spyOn(React, 'useState')
      .mockImplementationOnce(() => [{ displayName: 'Test User', photoURL: 'test.jpg' }, jest.fn()])
      .mockImplementationOnce(() => ['room1', setRoomId])
      .mockImplementationOnce(() => [['room1', 'room2'], jest.fn()])
      .mockImplementationOnce(() => [[], setMessages])
      .mockImplementationOnce(() => [['Test User'], setUsersInRoom]);

    render(<App />);
    const leaveButton = screen.getByTestId('leave-room-button');
    fireEvent.click(leaveButton);

    expect(setRoomId).toHaveBeenCalledWith('');
    expect(setMessages).toHaveBeenCalledWith([]);
    expect(setUsersInRoom).toHaveBeenCalledWith([]);
    expect(mockSocket.emit).toHaveBeenCalledWith('leaveRoom', {
      roomId: 'room1',
      user: 'Test User',
    });
  });
});