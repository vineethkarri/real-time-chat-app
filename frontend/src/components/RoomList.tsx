import React from 'react';

interface RoomListProps {
  rooms: string[];
  onJoin: (roomId: string) => void;
  currentRoom?: string;
}

const RoomList: React.FC<RoomListProps> = ({ rooms, onJoin, currentRoom }) => {
  return (
    <div>
      <h4 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-100">Available Rooms</h4>
      <ul className="space-y-2">
        {rooms.map(room => (
          <li key={room}>
            <button
              onClick={() => onJoin(room)}
              className={`w-full text-left px-4 py-3 rounded-lg transition duration-300 ${
                room === currentRoom
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-100 dark:bg-blue-800 text-gray-800 dark:text-gray-200 hover:bg-blue-200 dark:hover:bg-blue-700'
              }`}
            >
              {room}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RoomList;