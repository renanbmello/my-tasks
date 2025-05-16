export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: Date;
  status: "pending" | "in-progress" | "completed";
  createdAt: Date;
  updatedAt: Date;
}

