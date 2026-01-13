import { useState } from "react";
import { Link } from "react-router-dom";
import { format, isPast, isToday } from "date-fns";
import { Edit, Trash2, Calendar, Link as LinkIcon } from "lucide-react";
import { Task, TaskStatus } from "../../types";
import TaskStatusBadge from "./TaskStatusBadge";
import TaskPriorityBadge from "./TaskPriorityBadge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";

interface Props {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
}

export function TaskList({ tasks, onEdit, onDelete, onStatusChange }: Props) {
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const isOverdue = (task: Task) => {
    return isPast(new Date(task.dueDateTime)) && task.status !== TaskStatus.COMPLETED;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isToday(date)) {
      return `Today at ${format(date, "HH:mm")}`;
    }
    return format(date, "dd MMM yyyy, HH:mm");
  };

  const copyLink = (taskId: string) => {
    const url = `${window.location.origin}/task/${taskId}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard");
  };

  return (
    <div className="rounded-md border bg-white shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[30%]">Title</TableHead>
            <TableHead>Case ID</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                No tasks found. Create one to get started.
              </TableCell>
            </TableRow>
          ) : (
            tasks.map((task) => (
              <TableRow key={task.id} className="group hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                <TableCell className="font-medium">
                  <div className="flex flex-col gap-1">
                    <Link 
                      to={`/task/${task.id}`}
                      className="text-base text-primary hover:underline flex items-center gap-2 w-fit"
                    >
                      {task.title}
                    </Link>
                    {task.description && (
                      <span className="text-sm text-muted-foreground line-clamp-1">
                        {task.description}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                    {task.caseId ? (
                        <Badge variant="outline" className="font-mono text-xs">
                            {task.caseId}
                        </Badge>
                    ) : (
                        <span className="text-muted-foreground text-xs italic">-</span>
                    )}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
                        <TaskStatusBadge status={task.status} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      {(Object.values(TaskStatus) as TaskStatus[]).map((status) => (
                        <DropdownMenuItem
                          key={status}
                          onClick={() => onStatusChange(task.id, status)}
                        >
                          {status.replace("_", " ")}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
                <TableCell>
                  <TaskPriorityBadge priority={task.priority} />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className={isOverdue(task) ? "text-red-600 font-medium" : ""}>
                      {formatDate(task.dueDateTime)}
                    </span>
                    {isOverdue(task) && (
                      <Badge variant="destructive" className="ml-2 text-xs">
                        OVERDUE
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => copyLink(task.id)}
                      title="Copy Link"
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    >
                      <LinkIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onEdit(task)}
                      title="Edit Task"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                      onClick={() => setDeleteId(task.id)}
                      title="Delete Task"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the task.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => {
                if (deleteId) onDelete(deleteId);
                setDeleteId(null);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}