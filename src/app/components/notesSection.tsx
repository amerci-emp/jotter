'use client';

import { useState, useEffect, useRef } from 'react';
import { trpc } from '../../utils/trpc';
import { Loader2, Send, Edit, ChevronDown, ChevronUp } from 'lucide-react';

interface NoteVersion {
  text: string;
  timestamp: string;
}

interface Note {
  id: string;
  member: string;
  text: string;
  timestamp?: string;
  versions?: NoteVersion[];
}

interface GroupedNotes {
  [key: string]: Note[];
}

interface NotesSectionProps {
  selectedUserId: string | null;
}

export default function NotesSection({ selectedUserId }: NotesSectionProps) {
  const [newNote, setNewNote] = useState('');
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [expandedVersions, setExpandedVersions] = useState<Set<string>>(new Set());
  const utils = trpc.useContext();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const { data: notes, isLoading } = trpc.getUserNotes.useQuery(
    { userId: selectedUserId! },
    { enabled: !!selectedUserId }
  );

  useEffect(() => {
    setNewNote('');
  }, [selectedUserId]);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [notes]);

  const createNote = trpc.createNote.useMutation({
    onSuccess: () => {
      utils.getUserNotes.invalidate({ userId: selectedUserId! });
      setNewNote('');
    }
  });

  const updateNote = trpc.updateNote.useMutation({
    onSuccess: () => {
      utils.getUserNotes.invalidate({ userId: selectedUserId! });
      setEditingNote(null);
    }
  });

  // Format timestamp helper function
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Helper function to get just the date part
  const getDateString = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Get original timestamp for sorting
  const getOriginalTimestamp = (note: Note): string => {
    if (note.versions && note.versions.length > 0) {
      return note.versions[0].timestamp;
    }
    return note.timestamp || '2024-02-19T12:00:00.000Z';
  };

  // Group notes by date
  const groupedNotes = notes?.reduce((groups: GroupedNotes, note: Note) => {
    const timestamp = getOriginalTimestamp(note);
    const dateKey = getDateString(timestamp);
    
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(note);
    return groups;
  }, {});

  // Sort notes within each group by original timestamp
  (Object.values(groupedNotes || {}) as Note[][]).forEach(notes => {
    notes.sort((a, b) => {
      const timestampA = getOriginalTimestamp(a);
      const timestampB = getOriginalTimestamp(b);
      return new Date(timestampA).getTime() - new Date(timestampB).getTime();
    });
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId || !newNote.trim()) return;

    const tempId = `note_${Date.now()}`;
    await createNote.mutateAsync({
      id: tempId,
      member: selectedUserId,
      text: newNote.trim(),
      timestamp: new Date().toISOString() // Add current timestamp
    });
  };

  const handleUpdateNote = async (note: Note, newText: string) => {
    if (newText.trim() === note.text) {
      setEditingNote(null);
      return;
    }

    await updateNote.mutateAsync({
      id: note.id,
      text: newText.trim(),
      previousVersion: {
        text: note.text,
        timestamp: note.timestamp || new Date().toISOString()
      }
    });
  };

  const toggleVersions = (noteId: string) => {
    setExpandedVersions(prev => {
      const next = new Set(prev);
      if (next.has(noteId)) {
        next.delete(noteId);
      } else {
        next.add(noteId);
      }
      return next;
    });
  };

  const baseClasses = "h-[calc(100vh-3.5rem)] bg-gray-50 flex flex-col";

  if (!selectedUserId) {
    return (
      <div className={`${baseClasses} items-center justify-center text-gray-500`}>
        Select a user to view their notes
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={`${baseClasses} items-center justify-center`}>
        <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className={baseClasses}>
      <div ref={scrollContainerRef} className="h-[80%] overflow-y-auto">
        <div className="max-w-2xl mx-auto w-full space-y-8 p-8">
          {groupedNotes && Object.entries(groupedNotes).map(([date, dateNotes]) => (
            <div key={date} className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500 sticky top-0 bg-gray-50 py-2">
                {date}
              </h3>
              <div className="space-y-2">
                {(dateNotes as Note[]).map((note: Note) => (
                  <div 
                    key={note.id}
                    className="p-4 bg-white rounded-lg shadow-sm border border-gray-100"
                  >
                    {editingNote?.id === note.id ? (
                      <div className="space-y-2">
                        <textarea
                          value={editingNote.text}
                          onChange={(e) => setEditingNote({...editingNote, text: e.target.value})}
                          className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black resize-none"
                          rows={3}
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setEditingNote(null)}
                            className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-md"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleUpdateNote(note, editingNote.text)}
                            className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between">
                          <p className="text-gray-700">{note.text}</p>
                          <button
                            onClick={() => setEditingNote(note)}
                            className="ml-2 text-gray-400 hover:text-blue-500"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <p className="text-xs text-gray-400">
                            {formatTimestamp(note.timestamp || '')}
                          </p>
                          {note.versions && note.versions.length > 0 && (
                            <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                              Edited
                            </span>
                          )}
                        </div>
                        {note.versions && note.versions.length > 0 && (
                          <div className="mt-2">
                            <button
                              onClick={() => toggleVersions(note.id)}
                              className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700"
                            >
                              {expandedVersions.has(note.id) ? (
                                <>
                                  <ChevronUp className="w-4 h-4" />
                                  Hide history
                                </>
                              ) : (
                                <>
                                  <ChevronDown className="w-4 h-4" />
                                  Show history ({note.versions.length})
                                </>
                              )}
                            </button>
                            {expandedVersions.has(note.id) && (
                              <div className="mt-2 space-y-2 pl-4 border-l-2 border-gray-100">
                                {note.versions.map((version, index) => (
                                  <div key={index} className="text-sm text-gray-500">
                                    <p>{version.text}</p>
                                    <p className="text-xs text-gray-400 mt-1">
                                      {formatTimestamp(version.timestamp)}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 border-t border-gray-200 bg-gray-50">
        <div className="h-full flex items-center p-4">
          <form 
            onSubmit={handleSubmit}
            className="max-w-2xl mx-auto w-full"
          >
            <div className="flex gap-2 items-start">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Type a new note..."
                rows={1}
                className="flex-1 p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black resize-none min-h-[40px] max-h-[120px] overflow-y-auto"
                style={{
                  height: 'auto',
                  minHeight: '40px',
                  maxHeight: '120px'
                }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
                }}
              />
              <button
                type="submit"
                disabled={!newNote.trim()}
                className="px-4 py-2 bg-[#0052FF] text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 