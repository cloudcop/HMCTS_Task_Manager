import { TaskStatus } from "../../types";
import { Badge } from "@/components/ui/badge";

interface Props {
  status: TaskStatus;
}

const TaskStatusBadge = ({ status }: Props) => {
  const getVariant = (s: TaskStatus) => {
    switch (s) {
      case TaskStatus.COMPLETED:
        return "bg-green-600 hover:bg-green-700";
      case TaskStatus.IN_PROGRESS:
        return "bg-blue-600 hover:bg-blue-700";
      case TaskStatus.BLOCKED:
        return "bg-red-600 hover:bg-red-700";
      default:
        return "bg-slate-500 hover:bg-slate-600";
    }
  };

  const getLabel = (s: TaskStatus) => {
    return s.replace("_", " ");
  };

  return (
    <Badge className={`${getVariant(status)} text-white border-0`}>
      {getLabel(status)}
    </Badge>
  );
};

export default TaskStatusBadge;