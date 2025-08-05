import React from 'react';

interface UserInfoProps {
  name: string;
  photo: string;
}

const UserInfo: React.FC<UserInfoProps> = ({ name, photo }) => {
  return (
    <div className="flex items-center space-x-3">
      <img src={photo} alt={name} className="w-12 h-12 rounded-full border-2 border-blue-500 dark:border-blue-400" />
      <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">{name}</span>
    </div>
  );
};

export default UserInfo;