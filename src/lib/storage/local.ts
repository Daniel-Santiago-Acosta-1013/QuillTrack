import { Note, Task } from '@/types';

const STORAGE_KEYS = {
  NOTES: 'notesflow_notes',
  TASKS: 'notesflow_tasks',
} as const;

export const localStore = {
  getNotes: (): Note[] => {
    const notes = localStorage.getItem(STORAGE_KEYS.NOTES);
    return notes ? JSON.parse(notes) : [];
  },

  saveTasks: (tasks: Task[]): void => {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  },

  getTasks: (): Task[] => {
    const tasks = localStorage.getItem(STORAGE_KEYS.TASKS);
    return tasks ? JSON.parse(tasks) : [];
  },

  saveNotes: (notes: Note[]): void => {
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
  },
};