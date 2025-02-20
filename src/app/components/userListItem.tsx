'use client';

import { UserCircle, Check, X, Trash2, Edit2 } from 'lucide-react';

export interface User {
   id: string;
   firstName: string;
   lastName: string;
}

export interface EditingUser {
   id: string;
   firstName: string;
   lastName: string;
   isNew?: boolean;
}

interface UserListItemProps {
   user: User | EditingUser;
   isSelected: boolean;
   isEditing: boolean;
   onSelect: () => void;
   onEdit: (user: EditingUser) => void;
   onSave: () => void;
   onCancel: () => void;
   onDelete: () => void;
}

export default function UserListItem({ 
   user, 
   isSelected, 
   isEditing, 
   onSelect, 
   onEdit, 
   onSave, 
   onCancel,
   onDelete
}: UserListItemProps) {
   if (isEditing) {
      return (
         <div className="p-2 bg-blue-50 rounded-md">
         <div className="flex gap-2 mb-2 min-w-0">
            <input
               type="text"
               value={user.firstName}
               onChange={(e) => onEdit({
                  ...user,
                  firstName: e.target.value,
                  isNew: 'isNew' in user ? user.isNew : false
               })}
               placeholder="First name"
               className="flex-1 px-2 py-1 text-sm border rounded min-w-0 text-black"
            />
            <input
               type="text"
               value={user.lastName}
               onChange={(e) => onEdit({
                  ...user,
                  lastName: e.target.value,
                  isNew: 'isNew' in user ? user.isNew : false
               })}
               placeholder="Last name"
               className="flex-1 px-2 py-1 text-sm border rounded min-w-0 text-black"
            />
         </div>
         <div className="flex justify-center gap-2">
            <button 
               onClick={onSave}
               className="flex items-center text-sm px-2 py-1 rounded-md text-green-600 hover:bg-green-50"
            >
               <Check className="w-4 h-4 mr-1" />
               Save
            </button>
            <button 
               onClick={onCancel}
               className="flex items-center text-sm px-2 py-1 rounded-md text-red-600 hover:bg-red-50"
            >
               <X className="w-4 h-4 mr-1" />
               Cancel
            </button>
         </div>
         </div>
      );
   }

   return (
      <div 
         className="group flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-gray-100"
         onClick={onSelect}
      >
         <div className={`flex items-center min-w-0 flex-1 mr-2 ${isSelected ? 'text-[#0052FF]' : 'text-gray-700'}`}>
            <UserCircle className="w-5 h-5 mr-2 flex-shrink-0" />
            <span className="truncate">
               {user.firstName} {user.lastName}
            </span>
         </div>
         <div className="hidden group-hover:flex items-center gap-1 flex-shrink-0">
            <button
               onClick={(e) => {
                  e.stopPropagation();
                  onEdit({
                     id: user.id,
                     firstName: user.firstName,
                     lastName: user.lastName,
                     isNew: false
                  });
               }}
               className="flex items-center text-sm px-2 py-1 text-blue-600 hover:bg-blue-50 rounded-md"
            >
               <Edit2 className="w-4 h-4" />
            </button>
            <button
               onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
               }}
               className="flex items-center text-sm px-2 py-1 text-red-600 hover:bg-red-50 rounded-md"
            >
               <Trash2 className="w-4 h-4" />
            </button>
         </div>
      </div>
   );
} 