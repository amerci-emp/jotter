'use client'

import UsersList from "./components/usersList";
import NotesSection from "./components/notesSection";
import { useState } from 'react';

export default function Home() {
   const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

   return (
      <div>
         <header className="fixed top-0 w-full h-14 bg-white shadow-md z-50 flex items-center px-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-[#0052FF]">Jotter</h1>
         </header>
         
         <div className="flex min-h-screen pt-14">
            <div className="w-64 flex-shrink-0">
               <UsersList 
                  selectedUser={selectedUserId}
                  onSelectUser={setSelectedUserId}
               />
            </div>
            <div className="flex-1 ml-50">
               <NotesSection selectedUserId={selectedUserId} />
            </div>
         </div>
      </div>
   );
}
