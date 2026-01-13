import { Task, TaskStatus } from "../../types";
import { TaskCard } from "./TaskCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface Props {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
}

// Updated colors to be more neutral/zinc based for better compatibility with pure black mode
const COLUMNS = [
  { id: TaskStatus.NEW, label: "To Do", color: "bg-zinc-100 dark:bg-zinc-900/50" },
  { id: TaskStatus.IN_PROGRESS, label: "In Progress", color: "bg-blue-50/80 dark:bg-blue-950/20" },
  { id: TaskStatus.BLOCKED, label: "Blocked", color: "bg-red-50/80 dark:bg-red-950/20" },
  { id: TaskStatus.COMPLETED, label: "Done", color: "bg-green-50/80 dark:bg-green-950/20" },
];

export function KanbanBoard({ tasks, onEdit, onDelete, onStatusChange }: Props) {
  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter((task) => task.status === status);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 h-[calc(100vh-220px)] min-h-[500px]">
      {COLUMNS.map((column) => {
        const columnTasks = getTasksByStatus(column.id);
        
        return (
          <div 
            key={column.id} 
            className={`flex flex-col h-full rounded-xl border border-zinc-200 dark:border-zinc-800 ${column.color}`}
          >
            <div className="p-3 border-b border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 rounded-t-xl flex items-center justify-between backdrop-blur-sm">
              <h3 className="font-semibold text-sm">{column.label}</h3>
              <Badge variant="secondary" className="text-xs">
                {columnTasks.length}
              </Badge>
            </div>
            
            <ScrollArea className="flex-1 p-3">
              <div className="flex flex-col gap-3">
                {columnTasks.length === 0 ? (
                    <div className="h-24 flex items-center justify-center text-xs text-muted-foreground border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg bg-white/20 dark:bg-black/20">
                        No tasks
                    </div>
                ) : (
                    columnTasks.map((task) => (
                    <TaskCard
                        key={task.id}
                        task={task}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onStatusChange={onStatusChange}
                    />
                    ))
                )}
              </div>
            </ScrollArea>
          </div>
        );
      })}
    </div>
  );
}