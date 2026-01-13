export enum TaskStatus {
  NEW = "NEW",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  BLOCKED = "BLOCKED",
}

export enum TaskPriority {
  HIGH = "HIGH",
  MEDIUM = "MEDIUM",
  LOW = "LOW",
}

export interface Attachment {
  name: string;
  url: string;
  type: string; // MIME type
  size: number;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDateTime: string; // ISO string
  createdAt: string;
  updatedAt: string;
  caseId?: string;
  attachments?: Attachment[];
}

export interface CreateTaskDTO {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDateTime: string;
  caseId?: string;
  attachments?: Attachment[];
}

export interface UpdateTaskDTO extends Partial<CreateTaskDTO> {}