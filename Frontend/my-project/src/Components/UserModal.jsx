import React, { useState } from 'react';

const UserModal = ({ isOpen, onClose, users }) => {
  const [selectedUserIds, setSelectedUserIds] = useState([]); // State to track selected user IDs

  if (!isOpen) return null;

  const handleUserSelection = (userId) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId) // Deselect if already selected
        : [...prev, userId] // Add to selection
    );
  };

  const handleSelectAll = () => {
    if (selectedUserIds.length === users.length) {
      setSelectedUserIds([]); // Deselect all if all are selected
    } else {
      setSelectedUserIds(users.map(user => user.id)); // Select all users
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6 border-b pb-2">Select Users</h2>

        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            checked={selectedUserIds.length === users.length && users.length > 0}
            onChange={handleSelectAll}
            className="form-checkbox h-5 w-5 text-blue-600 rounded mr-3"
          />
          <span className="text-gray-800 font-medium">Select All</span>
        </div>

        <div className="grid grid-cols-2 gap-4 max-h-80 overflow-y-auto">
          {Array.isArray(users) && users.map(user => (
            <div
              key={user.id}
              className={`flex items-center p-4 bg-gray-50 rounded-lg shadow hover:shadow-md transition-shadow ${
                selectedUserIds.includes(user.id) ? 'border-2 border-blue-500' : ''
              }`}
            >
              <input
                type="checkbox"
                checked={selectedUserIds.includes(user.id)} // Check if this user is selected
                onChange={() => handleUserSelection(user.id)}
                className="form-checkbox h-5 w-5 text-blue-600 rounded mr-3"
              />
              <span className="text-gray-800 font-medium">{user.fullName}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded mr-2"
          >
            Cancel
          </button>
          <button
            onClick={() => alert(`Selected Users: ${selectedUserIds.map(id => users.find(user => user.id === id)?.fullName).join(', ') || 'None'}`)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserModal;
