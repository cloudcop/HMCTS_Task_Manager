import { Link } from "react-router-dom";
import { format, isToday, isTomorrow, addDays, isPast } from "date-fns";
import { ArrowRight, Calendar } from "lucide-react";
import { Task, TaskStatus } from "../../types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Props {
  tasks: Task[];
}

export function UpcomingDeadlines({ tasks }: Props) {
  // Filter for tasks due in the next 7 days that are not completed
  const upcomingTasks = tasks
    .filter(t => {
      if (t.status === TaskStatus.COMPLETED) return false;
      const date = new Date(t.dueDateTime);
      const today = new Date();
      const nextWeek = addDays(today, 7);
      return (date >= today && date <= nextWeek) || (isPast(date) && !isToday(date)); // Include overdue
    })
    .sort((a, b) => new Date(a.dueDateTime).getTime() - new Date(b.dueDateTime).getTime())
    .slice(0, 5); // Show only top 5

  const getDateLabel = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isPast(date) && !isToday(date)) return "Overdue";
    if (isToday(date)) return "Today";
    if (isTomorrow(date)) return "Tomorrow";
    return format(date, "EEE, MMM d");
  };

  const getLabelColor = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isPast(date) && !isToday(date)) return "text-red-600 bg-red-50 dark:bg-red-900/20";
    if (isToday(date)) return "text-amber-600 bg-amber-50 dark:bg-amber-900/20";
    return "text-blue-600 bg-blue-50 dark:bg-blue-900/20";
  };

  return (
    <Card className="shadow-sm h-full flex flex-col">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <Calendar className="h-4 w-4 text-primary" />
          Upcoming Deadlines
        </CardTitle>
        <Badge variant="outline" className="font-normal text-muted-foreground">
          Next 7 Days
        </Badge>
      </CardHeader>
      <CardContent className="flex-1">
        {upcomingTasks.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-4 text-muted-foreground min-h-[150px]">
            <div className="rounded-full bg-green-50 dark:bg-green-900/20 p-3 mb-2">
              <Calendar className="h-6 w-6 text-green-500" />
            </div>
            <p className="text-sm">No immediate deadlines.</p>
            <p className="text-xs opacity-70">You're all caught up!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingTasks.map(task => (
              <div key={task.id} className="flex items-start justify-between group">
                <div className="space-y-1 min-w-0 pr-2">
                  <Link 
                    to={`/task/${task.id}`}
                    className="block font-medium text-sm truncate hover:text-primary transition-colors"
                  >
                    {task.title}
                  </Link>
                  <div className="flex items-center gap-2 text-xs">
                    {task.caseId && (
                      <span className="font-mono text-muted-foreground bg-muted px-1 rounded">
                        {task.caseId}
                      </span>
                    )}
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium uppercase ${getLabelColor(task.dueDateTime)}`}>
                      {getDateLabel(task.dueDateTime)}
                    </span>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" asChild>
                  <Link to={`/task/${task.id}`}>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}