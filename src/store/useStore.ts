import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Note, Task, User } from '@/types';
import { localStore } from '@/lib/storage/local';
import { googleDriveSync } from '@/lib/storage/google';

interface Store {
  user: User | null;
  notes: Note[];
  tasks: Task[];
  syncEnabled: boolean;
  lastSync: Date | null;
  isSyncing: boolean;

  setUser: (user: User | null) => void;
  enableSync: (accessToken: string) => Promise<void>;
  disableSync: () => void;

  addNote: (note: Note) => void;
  updateNote: (id: string, note: Partial<Note>) => void;
  deleteNote: (id: string) => void;

  addTask: (task: Task) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskComplete: (id: string) => void;

  // Nueva función para cerrar sesión completamente
  logout: () => void;
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      user: null,
      notes: localStore.getNotes(),
      tasks: localStore.getTasks(),
      syncEnabled: false,
      lastSync: null,
      isSyncing: false,

      setUser: (user) => set({ user }),

      enableSync: async (accessToken) => {
        try {
          set({ isSyncing: true });

          // Obtener información del usuario desde Google
          const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }).then((res) => res.json());

          // Actualizar el usuario en el store
          set({
            user: {
              id: userInfo.sub,
              name: userInfo.name,
              email: userInfo.email,
              picture: userInfo.picture,
            },
          });

          // Inicializar la sincronización de Google Drive (leer y/o crear archivo en Drive)
          // Retorna las notas y tareas que encuentre en Drive (si existen)
          const driveData = await googleDriveSync.init(accessToken);

          // Si se encontró data en Drive, actualizamos el store con ella
          if (driveData) {
            set({ notes: driveData.notes, tasks: driveData.tasks });
            localStore.saveNotes(driveData.notes);
            localStore.saveTasks(driveData.tasks);
          }

          // Referencia al store para que googleDriveSync pueda leer y subir datos periódicamente
          googleDriveSync.setStoreRef(() => get());

          set({ syncEnabled: true, isSyncing: false, lastSync: new Date() });
        } catch (error) {
          set({ isSyncing: false });
          throw error;
        }
      },

      disableSync: () => {
        googleDriveSync.stop();
        set({ syncEnabled: false, lastSync: null });
      },

      addNote: (note) => {
        const notes = [...get().notes, note];
        set({ notes });
        localStore.saveNotes(notes);
      },

      updateNote: (id, noteUpdate) => {
        const notes = get().notes.map((n) =>
          n.id === id ? { ...n, ...noteUpdate } : n
        );
        set({ notes });
        localStore.saveNotes(notes);
      },

      deleteNote: (id) => {
        const notes = get().notes.filter((n) => n.id !== id);
        set({ notes });
        localStore.saveNotes(notes);
      },

      addTask: (task) => {
        const tasks = [...get().tasks, task];
        set({ tasks });
        localStore.saveTasks(tasks);
      },

      updateTask: (id, taskUpdate) => {
        const tasks = get().tasks.map((t) =>
          t.id === id ? { ...t, ...taskUpdate } : t
        );
        set({ tasks });
        localStore.saveTasks(tasks);
      },

      deleteTask: (id) => {
        const tasks = get().tasks.filter((t) => t.id !== id);
        set({ tasks });
        localStore.saveTasks(tasks);
      },

      toggleTaskComplete: (id) => {
        const tasks = get().tasks.map((t) =>
          t.id === id ? { ...t, completed: !t.completed } : t
        );
        set({ tasks });
        localStore.saveTasks(tasks);
      },

      logout: () => {
        googleDriveSync.stop();
        localStorage.clear();

        // Restablecer el estado
        set({
          user: null,
          notes: [],
          tasks: [],
          syncEnabled: false,
          lastSync: null,
          isSyncing: false,
        });
      },
    }),
    {
      name: 'notesflow-storage',
    }
  )
);
