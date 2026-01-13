import { Task, TaskStatus } from "../../types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Circle, Clock, AlertCircle } from "lucide-react";
import { isPast } from "date-fns";

interface Props {
  tasks: Task[];
}

export function StatsCards({ tasks }: Props) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === TaskStatus.COMPLETED).length;
  const inProgress = tasks.filter((t) => t.status === TaskStatus.IN_PROGRESS || t.status === TaskStatus.NEW).length;
  const overdue = tasks.filter((t) => isPast(new Date(t.dueDateTime)) && t.status !== TaskStatus.COMPLETED).length;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
          <Circle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{total}</div>
          <p className="text-xs text-muted-foreground">
            All tracked items
          </p>
        </CardContent>
      </Card>
      <Card className="shadow-sm hover:shadow-md transition-shadow border-blue-100 dark:border-blue-900/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending</CardTitle>
          <Clock className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{inProgress}</div>
          <p className="text-xs text-muted-foreground">
            New & In Progress
          </p>
        </CardContent>
      </Card>
      <Card className="shadow-sm hover:shadow-md transition-shadow border-green-100 dark:border-green-900/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completed</CardTitle>
          <CheckCircle2 className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{completed}</div>
          <p className="text-xs text-muted-foreground">
            {(total > 0 ? (completed / total * 100).toFixed(0) : 0)}% completion rate
          </p>
        </CardContent>
      </Card>
      <Card className="shadow-sm hover:shadow-md transition-shadow border-red-100 dark:border-red-900/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Overdue</CardTitle>
          <AlertCircle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">{overdue}</div>
          <p className="text-xs text-muted-foreground">
            Requires attention
          </p>
        </CardContent>
      </Card>
    </div>
  );
}