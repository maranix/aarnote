import { storage, STORAGE_KEYS } from '@/services/storage';
import type { CreateNoteInput, Note, SortOption, UpdateNoteInput } from '@/types/note';

export class NotesService {
  /**
   * Get all notes from storage
   */
  private static getAllNotes(): Note[] {
    const notesJson = storage.getString(STORAGE_KEYS.NOTES);
    return notesJson ? JSON.parse(notesJson) : [];
  }

  /**
   * Save all notes to storage
   */
  private static saveNotes(notes: Note[]): void {
    storage.set(STORAGE_KEYS.NOTES, JSON.stringify(notes));
  }

  /**
   * Get notes for a specific user
   */
  static getUserNotes(userId: string): Note[] {
    const allNotes = this.getAllNotes();
    return allNotes.filter((note) => note.userId === userId);
  }

  /**
   * Create a new note for a user
   */
  static createNote(userId: string, input: CreateNoteInput): Note {
    const allNotes = this.getAllNotes();
    const now = Date.now();

    const newNote: Note = {
      id: `${userId}_${now}_${Math.random().toString(36).substring(7)}`,
      userId,
      title: input.title.trim(),
      content: input.content.trim(),
      imageUri: input.imageUri,
      createdAt: now,
      updatedAt: now,
    };

    allNotes.push(newNote);
    this.saveNotes(allNotes);

    return newNote;
  }

  /**
   * Update an existing note
   */
  static updateNote(input: UpdateNoteInput): Note | null {
    const allNotes = this.getAllNotes();
    const noteIndex = allNotes.findIndex((note) => note.id === input.id);

    if (noteIndex === -1) {
      return null;
    }

    const updatedNote: Note = {
      ...allNotes[noteIndex],
      ...(input.title !== undefined && { title: input.title.trim() }),
      ...(input.content !== undefined && { content: input.content.trim() }),
      ...(input.imageUri !== undefined && { imageUri: input.imageUri }),
      updatedAt: Date.now(),
    };

    allNotes[noteIndex] = updatedNote;
    this.saveNotes(allNotes);

    return updatedNote;
  }

  /**
   * Delete a note by ID
   */
  static deleteNote(noteId: string): boolean {
    const allNotes = this.getAllNotes();
    const filteredNotes = allNotes.filter((note) => note.id !== noteId);

    if (filteredNotes.length === allNotes.length) {
      return false; // Note not found
    }

    this.saveNotes(filteredNotes);
    return true;
  }

  /**
   * Get a single note by ID
   */
  static getNoteById(noteId: string): Note | null {
    const allNotes = this.getAllNotes();
    return allNotes.find((note) => note.id === noteId) ?? null;
  }

  /**
   * Sort notes by the specified option
   */
  static sortNotes(notes: Note[], sortBy: SortOption): Note[] {
    const sortedNotes = [...notes];

    if (sortBy.field === 'lastUpdate') {
      sortedNotes.sort((a, b) => {
        const diff = b.updatedAt - a.updatedAt;
        return sortBy.direction === 'asc' ? -diff : diff;
      });
    } else if (sortBy.field === 'title') {
      sortedNotes.sort((a, b) => {
        const comparison = a.title.localeCompare(b.title);
        return sortBy.direction === 'asc' ? comparison : -comparison;
      });
    }

    return sortedNotes;
  }

  /**
   * Clear all notes for a specific user (useful for testing)
   */
  static clearUserNotes(userId: string): void {
    const allNotes = this.getAllNotes();
    const filteredNotes = allNotes.filter((note) => note.userId !== userId);
    this.saveNotes(filteredNotes);
  }
}
