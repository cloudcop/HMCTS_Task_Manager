import { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { PieChart as PieChartIcon } from "lucide-react";
import { Task, TaskStatus } from "../../types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  tasks: Task[];
}

const COLORS = {
  [TaskStatus.NEW]: "#94a3b8", // slate-400
  [TaskStatus.IN_PROGRESS]: "#3b82f6", // blue-500
  [TaskStatus.COMPLETED]: "#22c55e", // green-500
  [TaskStatus.BLOCKED]: "#ef4444", // red-500
};

const STATUS_LABELS = {
  [TaskStatus.NEW]: "New",
  [TaskStatus.IN_PROGRESS]: "In Progress",
  [TaskStatus.COMPLETED]: "Completed",
  [TaskStatus.BLOCKED]: "Blocked",
};

export function TaskDistributionChart({ tasks }: Props) {
  const data = useMemo(() => {
    const counts = tasks.reduce((acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    }, {} as Record<TaskStatus, number>);

    return Object.values(TaskStatus)
      .filter((status) => counts[status] > 0)
      .map((status) => ({
        name: STATUS_LABELS[status],
        value: counts[status],
        color: COLORS[status],
      }));
  }, [tasks]);

  if (tasks.length === 0) {
    return (
      <Card className="col-span-1 shadow-sm h-full flex flex-col">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Task Distribution</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col items-center justify-center text-muted-foreground min-h-[200px]">
          <PieChartIcon className="h-10 w-10 mb-3 opacity-20" />
          <p className="text-sm">No data to display</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-1 shadow-sm h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Task Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}