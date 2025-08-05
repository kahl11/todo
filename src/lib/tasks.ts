import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  Timestamp,
  QuerySnapshot,
  DocumentData 
} from 'firebase/firestore';
import { db } from '../app/firebase';
import { Task, CreateTaskData, Priority } from '../types';
import { isToday, isSameDay } from 'date-fns';

const TASKS_COLLECTION = 'tasks';

// Priority order for sorting (higher number = higher priority)
const PRIORITY_ORDER: Record<Priority, number> = {
  5: 5,
  4: 4,
  3: 3,
  2: 2,
  1: 1,
};

// Convert Firestore document to Task type
const convertFirestoreTask = (doc: any): Task => {
  const data = doc.data();
  return {
    id: doc.id,
    title: data.title,
    description: data.description,
    priority: data.priority,
    deadline: data.deadline?.toDate(),
    completed: data.completed,
    completedDate: data.completedDate?.toDate(),
    createdAt: data.createdAt.toDate(),
    updatedAt: data.updatedAt.toDate(),
    userId: data.userId,
  };
};

export const createTask = async (userId: string, taskData: CreateTaskData): Promise<string> => {
  const now = new Date();
  const task: any = {
    title: taskData.title,
    priority: taskData.priority,
    completed: false,
    createdAt: Timestamp.fromDate(now),
    updatedAt: Timestamp.fromDate(now),
    userId,
    deadline: taskData.deadline ? Timestamp.fromDate(taskData.deadline) : null,
  };

  // Only add description if it's not undefined
  if (taskData.description !== undefined) {
    task.description = taskData.description;
  }

  const docRef = await addDoc(collection(db, TASKS_COLLECTION), task);
  return docRef.id;
};

export const updateTask = async (taskId: string, updates: Partial<Task>): Promise<void> => {
  const taskRef = doc(db, TASKS_COLLECTION, taskId);
  const updateData: any = {
    updatedAt: Timestamp.fromDate(new Date()),
  };

  // Only add fields that are not undefined
  Object.keys(updates).forEach(key => {
    const value = updates[key as keyof Task];
    if (value !== undefined) {
      if (key === 'deadline' && value instanceof Date) {
        updateData.deadline = Timestamp.fromDate(value);
      } else if (key === 'completedDate' && value instanceof Date) {
        updateData.completedDate = Timestamp.fromDate(value);
      } else if (key !== 'deadline' && key !== 'completedDate') {
        updateData[key] = value;
      }
    }
  });

  await updateDoc(taskRef, updateData);
};

export const deleteTask = async (taskId: string): Promise<void> => {
  await deleteDoc(doc(db, TASKS_COLLECTION, taskId));
};

export const subscribeToUserTasks = (
  userId: string, 
  callback: (tasks: Task[]) => void
): (() => void) => {
  const q = query(
    collection(db, TASKS_COLLECTION),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(q, (querySnapshot: QuerySnapshot<DocumentData>) => {
    const tasks = querySnapshot.docs.map(convertFirestoreTask);
    callback(tasks);
  });
};

export const sortTasksByPriority = (tasks: Task[]): Task[] => {
  return [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1; // Completed tasks go to bottom
    }
    return PRIORITY_ORDER[b.priority] - PRIORITY_ORDER[a.priority];
  });
};

export const getTodaysTasks = (tasks: Task[]): Task[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return tasks.filter(task => {
    if (!task.deadline || task.completed) return false;
    const deadline = new Date(task.deadline);
    deadline.setHours(0, 0, 0, 0);
    return deadline.getTime() === today.getTime();
  });
};

export const getTodaysCompletedTasks = (tasks: Task[]): Task[] => {
  return tasks.filter(task => {
    if (!task.completed || !task.completedDate) return false;
    return isToday(task.completedDate);
  });
};

export const getCompletedTasksByDate = (tasks: Task[], selectedDate: Date): Task[] => {
  return tasks.filter(task => {
    if (!task.completed || !task.completedDate) return false;
    return isSameDay(task.completedDate, selectedDate);
  });
};

export const getPriorityColor = (priority: Priority): string => {
  switch (priority) {
    case 5:
      return 'bg-red-100 text-red-800 border-red-200';
    case 4:
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 3:
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 2:
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 1:
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const getPriorityLabel = (priority: Priority): string => {
  switch (priority) {
    case 5:
      return 'Priority 5 (Urgent)';
    case 4:
      return 'Priority 4 (High)';
    case 3:
      return 'Priority 3 (Medium)';
    case 2:
      return 'Priority 2 (Low)';
    case 1:
      return 'Priority 1 (Lowest)';
    default:
      return `Priority ${priority}`;
  }
};