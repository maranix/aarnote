import { useAuthStore } from '@/store/authStore';
import { useNotesStore } from '@/store/notesStore';
import type { Note } from '@/types/note';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Home() {
  const { signOut, session } = useAuthStore();
  const { notes, loadNotes, deleteNote, sortBy, setSortBy } = useNotesStore();

  useEffect(() => {
    if (session) {
      loadNotes(session);
    }
  }, [session, loadNotes]);

  const handleDeleteNote = (noteId: string) => {
    Alert.alert('Delete Note', 'Are you sure you want to delete this note?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          const success = deleteNote(noteId);
          if (success) {
            // Refresh notes to reflect deletion
            if (session) loadNotes(session);
          }
        },
      },
    ]);
  };

  const renderNote = ({ item }: { item: Note }) => (
    <TouchableOpacity
      style={styles.noteCard}
      onPress={() => router.push({ pathname: '/(app)/note/[id]' as any, params: { id: item.id } })}
      onLongPress={() => handleDeleteNote(item.id)}
    >
      {item.imageUri && (
        <Image source={{ uri: item.imageUri }} style={styles.noteImage} resizeMode="cover" />
      )}
      <View style={styles.noteContent}>
        <Text style={styles.noteTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.noteText} numberOfLines={2}>
          {item.content}
        </Text>
        <Text style={styles.noteDate}>{new Date(item.updatedAt).toLocaleDateString()}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Notes</Text>
        <TouchableOpacity style={styles.signOutButton} onPress={signOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>Sort by:</Text>
        <TouchableOpacity
          style={[styles.sortButton, sortBy === 'lastUpdate' && styles.sortButtonActive]}
          onPress={() => setSortBy('lastUpdate')}
        >
          <Text
            style={[styles.sortButtonText, sortBy === 'lastUpdate' && styles.sortButtonTextActive]}
          >
            Last Update
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.sortButton, sortBy === 'title' && styles.sortButtonActive]}
          onPress={() => setSortBy('title')}
        >
          <Text style={[styles.sortButtonText, sortBy === 'title' && styles.sortButtonTextActive]}>
            Title
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={notes}
        renderItem={renderNote}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No notes yet</Text>
            <Text style={styles.emptySubtext}>Tap the + button to create your first note</Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push({ pathname: '/(app)/create-note' as any })}
        activeOpacity={0.8}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  signOutButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#f0f0f0',
  },
  signOutText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '600',
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    gap: 8,
  },
  sortLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 4,
  },
  sortButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#f0f0f0',
  },
  sortButtonActive: {
    backgroundColor: '#007AFF',
  },
  sortButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  sortButtonTextActive: {
    color: '#fff',
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  noteCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  noteImage: {
    width: '100%',
    height: 150,
    backgroundColor: '#e0e0e0',
  },
  noteContent: {
    padding: 16,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  noteText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  noteDate: {
    fontSize: 12,
    color: '#999',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#bbb',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  fabText: {
    fontSize: 32,
    color: '#fff',
    fontWeight: '300',
  },
});
