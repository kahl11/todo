export type Priority = 1 | 2 | 3 | 4 | 5;

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  deadline?: Date;
  completed: boolean;
  completedDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  priority: Priority;
  deadline?: Date;
}