import { TaskPriority } from "../../types";
import { Badge } from "@/components/ui/badge";

interface Props {
  priority: TaskPriority;
}

const TaskPriorityBadge = ({ priority }: Props) => {
  const getVariant = (p: TaskPriority) => {
    switch (p) {
      case TaskPriority.HIGH:
        return "bg-red-100 text-red-700 hover:bg-red-200 border-red-200";
      case TaskPriority.MEDIUM:
        return "bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-200";
      case TaskPriority.LOW:
        return "bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <Badge variant="outline" className={`${getVariant(priority)} border`}>
      {priority}
    </Badge>
  );
};

export default TaskPriorityBadge;