import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { BarChart3 } from "lucide-react";
import { Task, TaskPriority } from "../../types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  tasks: Task[];
}

const COLORS = {
  [TaskPriority.HIGH]: "#ef4444",   // red-500
  [TaskPriority.MEDIUM]: "#f59e0b", // amber-500
  [TaskPriority.LOW]: "#64748b",    // slate-500
};

export function PriorityChart({ tasks }: Props) {
  const data = useMemo(() => {
    const counts = tasks.reduce((acc, task) => {
      acc[task.priority] = (acc[task.priority] || 0) + 1;
      return acc;
    }, {} as Record<TaskPriority, number>);

    return [
      { name: "High", value: counts[TaskPriority.HIGH] || 0, priority: TaskPriority.HIGH },
      { name: "Medium", value: counts[TaskPriority.MEDIUM] || 0, priority: TaskPriority.MEDIUM },
      { name: "Low", value: counts[TaskPriority.LOW] || 0, priority: TaskPriority.LOW },
    ];
  }, [tasks]);

  if (tasks.length === 0) {
    return (
      <Card className="shadow-sm h-full flex flex-col">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Tasks by Priority</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col items-center justify-center text-muted-foreground min-h-[200px]">
          <BarChart3 className="h-10 w-10 mb-3 opacity-20" />
          <p className="text-sm">No data to display</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Tasks by Priority</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <XAxis type="number" hide />
              <YAxis 
                dataKey="name" 
                type="category" 
                tick={{ fontSize: 12 }} 
                width={50}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                cursor={{ fill: 'transparent' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={32}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.priority]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}