import React, { useState } from 'react';

interface CreateRoomProps {
  onCreate: (roomId: string) => void;
}

const CreateRoom: React.FC<CreateRoomProps> = ({ onCreate }) => {
  const [roomId, setRoomId] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = () => {
    if (!roomId.trim()) {
      setError('Room ID cannot be empty');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      onCreate(roomId.trim());
      setRoomId('');
    } catch (err) {
      setError('Failed to create room');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-6">
      <h4 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-100">Create Room</h4>
      <div className="flex space-x-3">
        <input
          type="text"
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
          placeholder="Enter room ID"
          data-testid="create-room-input"
          className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
        />
        <button
          onClick={handleCreate}
          disabled={!roomId.trim() || isLoading}
          data-testid="create-room-button"
          className="bg-green-600 text-white px-4 py-3 rounded-lg shadow hover:bg-green-700 transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Creating...' : 'Create'}
        </button>
      </div>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};

export default CreateRoom;