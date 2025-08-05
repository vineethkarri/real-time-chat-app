import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { GoogleAuthProvider, signInWithPopup, getAuth, signOut } from 'firebase/auth';
import { auth } from './firebase';
import ChatWindow from './components/ChatWindow';
import RoomList from './components/RoomList';
import CreateRoom from './components/CreateRoom';
import UserInfo from './components/UserInfo';
import { Message } from './types';
import { MoonIcon, SunIcon } from '@heroicons/react/24/solid';

const socket = io('http://localhost:3001', { auth: { token: '' }, autoConnect: false });

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [roomId, setRoomId] = useState('');
  const [rooms, setRooms] = useState<string[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [usersInRoom, setUsersInRoom] = useState<string[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3001/rooms').then(res => res.json()).then(setRooms);

    socket.on('message', (msg: Message) => setMessages(prev => [...prev, msg]));
    socket.on('roomList', (roomList: string[]) => setRooms(roomList));
    socket.on('userList', (userList: string[]) => setUsersInRoom(userList));

    return () => {
      socket.off('message');
      socket.off('roomList');
      socket.off('userList');
    };
  }, []);

  const signIn = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    setUser(result.user);
    socket.auth = { token: await result.user.getIdToken() };
    socket.connect();
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
      socket.disconnect();
      setUser(null);
      setRoomId('');
      setMessages([]);
      setUsersInRoom([]);
    } catch (error) {
      console.error('Sign-out error:', error);
    }
  };

  const joinRoom = (selectedRoom: string) => {
    setRoomId(selectedRoom);
    socket.emit('joinRoom', { roomId: selectedRoom, user: user.displayName });
    setMessages([]);
  };

  const createRoom = (newRoomId: string) => {
    socket.emit('createRoom', { roomId: newRoomId });
  };

  const sendMessage = (text: string) => {
    socket.emit('sendMessage', { roomId, user: user.displayName, text });
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-100'}`}>
      {!user ? (
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">Real-Time Chat</h1>
          <button 
            onClick={signIn} 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
          >
            Sign in with Google
          </button>
        </div>
      ) : (
        <div className="w-full max-w-5xl bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 flex flex-col h-[85vh]">
          <header className="flex justify-between items-center mb-6 border-b pb-3 border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-4">
              <UserInfo name={user.displayName} photo={user.photoURL || ''} />
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-300"
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
              </button>
            </div>
            <button 
              onClick={signOutUser} 
              className="bg-red-600 text-white px-4 py-2 rounded-lg shadow hover:bg-red-700 transition duration-300"
            >
              Sign Out
            </button>
          </header>
          <div className="flex flex-row gap-6 flex-1">
            <aside className="w-full md:w-1/3 lg:w-1/4 border-r pr-4 border-gray-200 dark:border-gray-700">
              <CreateRoom onCreate={createRoom} />
              <RoomList rooms={rooms} onJoin={joinRoom} currentRoom={roomId} />
            </aside>
            <main className="w-full md:w-2/3 lg:w-3/4 flex flex-col">
              {roomId ? (
                <>
                  <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-white">Room: {roomId}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">Online Users: {usersInRoom.join(', ')}</p>
                  <ChatWindow messages={messages} onSend={sendMessage} user={user.displayName} />
                </>
              ) : (
                <p className="text-center text-gray-500 dark:text-gray-400 flex-1 flex items-center justify-center">
                  Select or create a room to start chatting.
                </p>
              )}
            </main>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;