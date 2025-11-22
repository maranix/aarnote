import { NotesService } from '@/services/notesService';
import type { CreateNoteInput, Note, SortOption, UpdateNoteInput } from '@/types/note';
import { create } from 'zustand';

interface NotesState {
  notes: Note[];
  sortBy: SortOption;
  isLoading: boolean;
  error: string | null;

  // Actions
  loadNotes: (userId: string) => void;
  createNote: (userId: string, input: CreateNoteInput) => Note;
  updateNote: (input: UpdateNoteInput) => boolean;
  deleteNote: (noteId: string) => boolean;
  setSortBy: (sortBy: SortOption) => void;
  clearNotes: () => void;
  clearError: () => void;
}

export const useNotesStore = create<NotesState>((set, get) => ({
  notes: [],
  sortBy: 'lastUpdate',
  isLoading: false,
  error: null,

  loadNotes: (userId: string) => {
    try {
      set({ isLoading: true, error: null });
      const userNotes = NotesService.getUserNotes(userId);
      const sortedNotes = NotesService.sortNotes(userNotes, get().sortBy);
      set({ notes: sortedNotes, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load notes',
        isLoading: false,
      });
    }
  },

  createNote: (userId: string, input: CreateNoteInput) => {
    try {
      set({ error: null });
      const newNote = NotesService.createNote(userId, input);
      const updatedNotes = [newNote, ...get().notes];
      const sortedNotes = NotesService.sortNotes(updatedNotes, get().sortBy);
      set({ notes: sortedNotes });
      return newNote;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create note';
      set({ error: errorMessage });
      throw new Error(errorMessage);
    }
  },

  updateNote: (input: UpdateNoteInput) => {
    try {
      set({ error: null });
      const updatedNote = NotesService.updateNote(input);

      if (!updatedNote) {
        set({ error: 'Note not found' });
        return false;
      }

      const updatedNotes = get().notes.map((note) => (note.id === input.id ? updatedNote : note));
      const sortedNotes = NotesService.sortNotes(updatedNotes, get().sortBy);
      set({ notes: sortedNotes });
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update note';
      set({ error: errorMessage });
      return false;
    }
  },

  deleteNote: (noteId: string) => {
    try {
      set({ error: null });
      const success = NotesService.deleteNote(noteId);

      if (!success) {
        set({ error: 'Note not found' });
        return false;
      }

      const updatedNotes = get().notes.filter((note) => note.id !== noteId);
      set({ notes: updatedNotes });
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete note';
      set({ error: errorMessage });
      return false;
    }
  },

  setSortBy: (sortBy: SortOption) => {
    const sortedNotes = NotesService.sortNotes(get().notes, sortBy);
    set({ sortBy, notes: sortedNotes });
  },

  clearNotes: () => {
    set({ notes: [], error: null });
  },

  clearError: () => {
    set({ error: null });
  },
}));
