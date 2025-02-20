'use client';

import { useState, useEffect } from 'react';
import { trpc } from '../../utils/trpc';
import { Loader2, PlusCircle } from 'lucide-react';
import UserListItem, { User, EditingUser } from './userListItem';

interface UsersListProps {
  selectedUser: string | null;
  onSelectUser: (userId: string | null) => void;
}

export default function UsersList({ selectedUser, onSelectUser }: UsersListProps) {
  const utils = trpc.useContext();
  const { data: users, isLoading } = trpc.getUsers.useQuery();
  const createUser = trpc.createUser.useMutation({
    onSuccess: () => {
      utils.getUsers.invalidate();
    }
  });
  const updateUser = trpc.updateUser.useMutation({
    onSuccess: () => {
      utils.getUsers.invalidate();
    }
  });
  const deleteUser = trpc.deleteUser.useMutation({
    onSuccess: () => {
      utils.getUsers.invalidate();
    }
  });
  const [editingUser, setEditingUser] = useState<EditingUser | null>(null);

  // Select first user when data loads
  useEffect(() => {
    if (users && users.length > 0 && !selectedUser) {
      onSelectUser(users[0].id);
    }
  }, [users, selectedUser, onSelectUser]);

  const baseClasses = "h-[calc(100vh-3.5rem)] border-r border-gray-200 bg-white fixed left-0 top-14 w-64 overflow-y-auto";

  const handleNewUser = () => {
    const tempId = `user_${Date.now()}`;
    setEditingUser({
      id: tempId,
      firstName: '',
      lastName: '',
      isNew: true
    });
    onSelectUser(tempId);
  };

  const handleSave = async () => {
    if (!editingUser) return;
    
    if (editingUser.isNew) {
      await createUser.mutateAsync({
        id: editingUser.id,
        firstName: editingUser.firstName,
        lastName: editingUser.lastName
      });
    } else {
      await updateUser.mutateAsync({
        id: editingUser.id,
        firstName: editingUser.firstName,
        lastName: editingUser.lastName
      });
    }
    setEditingUser(null);
  };

  const handleCancel = () => {
    setEditingUser(null);
    if (editingUser?.isNew) {
      onSelectUser(null);
    }
  };

  const handleDelete = async (userId: string) => {
    await deleteUser.mutateAsync({ id: userId });
    if (selectedUser === userId) {
      onSelectUser(null);
    }
  };

  if (isLoading) {
    return (
      <div className={baseClasses}>
        <div className="flex items-center justify-center h-full p-4">
          <Loader2 className="w-5 h-5 animate-spin" />
        </div>
      </div>
    );
  }

  console.log('UsersList rendering:');
  return (
    <div className={baseClasses}>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Users</h2>
          <button 
            className="flex items-center text-sm px-2 py-1 rounded-md text-[#0052FF] hover:bg-blue-50"
            onClick={handleNewUser}
          >
            <PlusCircle className="w-4 h-4 mr-1" />
            New
          </button>
        </div>
        <div className="space-y-1">
          {users?.map((user: User) => (
            <UserListItem 
              key={user.id}
              user={editingUser?.id === user.id ? editingUser : user}
              isSelected={selectedUser === user.id}
              isEditing={editingUser?.id === user.id}
              onSelect={() => onSelectUser(user.id)}
              onEdit={(editedUser) => setEditingUser(editedUser)}
              onSave={handleSave}
              onCancel={handleCancel}
              onDelete={() => handleDelete(user.id)}
            />
          ))}
          {editingUser?.isNew && (
            <UserListItem 
              user={editingUser}
              isSelected={true}
              isEditing={true}
              onSelect={() => {}}
              onEdit={(editedUser) => setEditingUser(editedUser)}
              onSave={handleSave}
              onCancel={handleCancel}
              onDelete={() => {}}
            />
          )}
        </div>
      </div>
    </div>
  );
}