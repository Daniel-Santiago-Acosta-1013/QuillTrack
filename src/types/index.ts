export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  labels: string[];
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: Date;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  updatedAt: Date;
  labels: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  picture?: string;
}