import { format, isPast } from "date-fns";
import { Edit, Trash2, Calendar, Link as LinkIcon } from "lucide-react";
import { Task, TaskStatus, TaskPriority } from "../../types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Props {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
}

export function TaskCard({ task, onEdit, onDelete, onStatusChange }: Props) {
  const isOverdue = isPast(new Date(task.dueDateTime)) && task.status !== TaskStatus.COMPLETED;

  const copyLink = () => {
    const url = `${window.location.origin}/task/${task.id}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied");
  };

  return (
    <Card className={`group hover:shadow-md transition-all duration-200 border-l-4 ${
      task.priority === TaskPriority.HIGH ? 'border-l-red-500' : 
      task.priority === TaskPriority.MEDIUM ? 'border-l-amber-500' : 'border-l-slate-300'
    }`}>
      <CardHeader className="p-4 pb-2 space-y-2">
        <div className="flex justify-between items-start gap-2">
          <Link to={`/task/${task.id}`} className="font-semibold text-sm hover:underline line-clamp-2 leading-tight">
            {task.title}
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6 -mr-2 text-muted-foreground">
                <span className="sr-only">Open menu</span>
                <span className="text-xs">•••</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(task)}>
                <Edit className="mr-2 h-3.5 w-3.5" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={copyLink}>
                <LinkIcon className="mr-2 h-3.5 w-3.5" /> Copy Link
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(task.id)}
                className="text-red-600 focus:text-red-600 focus:bg-red-50"
              >
                <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex flex-wrap gap-2">
           {task.caseId && (
            <Badge variant="secondary" className="text-[10px] px-1.5 h-5 font-mono text-muted-foreground">
              {task.caseId}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 py-2">
        {task.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
            {task.description}
          </p>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-2 flex items-center justify-between border-t bg-muted/20 mt-2">
        <div className={`flex items-center gap-1.5 text-xs ${isOverdue ? "text-red-600 font-medium" : "text-muted-foreground"}`}>
          <Calendar className="h-3.5 w-3.5" />
          <span>{format(new Date(task.dueDateTime), "MMM d")}</span>
        </div>
        
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-6 px-2 text-[10px] hover:bg-transparent p-0">
                   <Badge variant="outline" className="font-normal">
                      {task.status.replace("_", " ")}
                   </Badge>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
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
      </CardFooter>
    </Card>
  );
}