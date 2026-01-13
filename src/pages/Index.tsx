import { useEffect, useState } from "react";
import { Plus, Loader2, FilterX, Search, LayoutList, Kanban } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { Task, TaskStatus, TaskPriority, CreateTaskDTO } from "../types";
import { taskService } from "../services/taskService";
import { TaskList } from "../components/tasks/TaskList";
import { KanbanBoard } from "../components/tasks/KanbanBoard";
import { TaskForm } from "../components/tasks/TaskForm";
import { StatsCards } from "../components/dashboard/StatsCards";
import { TaskDistributionChart } from "../components/dashboard/TaskDistributionChart";
import { PriorityChart } from "../components/dashboard/PriorityChart";
import { UpcomingDeadlines } from "../components/dashboard/UpcomingDeadlines";
import { ModeToggle } from "../components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  // Filters
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [filterPriority, setFilterPriority] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  const loadTasks = async () => {
    try {
      const data = await taskService.getAll();
      setTasks(data);
    } catch (error) {
      console.error("Failed to load tasks:", error);
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, () => {
        loadTasks();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleCreate = async (data: CreateTaskDTO) => {
    try {
      const newTask = await taskService.create(data);
      setTasks((prev) => [...prev, newTask]); // Immediate update
      toast.success("Task created successfully");
      setIsDialogOpen(false);
    } catch (error) {
      toast.error("Failed to create task");
    }
  };

  const handleUpdate = async (data: CreateTaskDTO) => {
    if (!editingTask) return;
    try {
      const updatedTask = await taskService.update(editingTask.id, data);
      setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))); // Immediate update
      toast.success("Task updated successfully");
      setIsDialogOpen(false);
      setEditingTask(undefined);
    } catch (error) {
      toast.error("Failed to update task");
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await taskService.delete(deleteId);
      setTasks((prev) => prev.filter((t) => t.id !== deleteId)); // Immediate update
      toast.success("Task deleted successfully");
    } catch (error) {
      toast.error("Failed to delete task");
    } finally {
      setDeleteId(null);
    }
  };

  const handleStatusChange = async (id: string, status: TaskStatus) => {
    try {
      // Optimistic update
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
      await taskService.update(id, { status });
      toast.success("Status updated");
    } catch (error) {
      toast.error("Failed to update status");
      loadTasks(); // Revert on error
    }
  };

  const openCreateDialog = () => {
    setEditingTask(undefined);
    setIsDialogOpen(true);
  };

  const openEditDialog = (task: Task) => {
    setEditingTask(task);
    setIsDialogOpen(true);
  };

  const clearFilters = () => {
    setFilterStatus("ALL");
    setFilterPriority("ALL");
    setSearchTerm("");
  };

  const filteredTasks = tasks.filter((task) => {
    const statusMatch = filterStatus === "ALL" || task.status === filterStatus;
    const priorityMatch = filterPriority === "ALL" || task.priority === filterPriority;
    
    const searchLower = searchTerm.toLowerCase();
    const searchMatch = searchTerm === "" || 
      task.title.toLowerCase().includes(searchLower) ||
      (task.description && task.description.toLowerCase().includes(searchLower)) ||
      (task.caseId && task.caseId.toLowerCase().includes(searchLower));

    return statusMatch && priorityMatch && searchMatch;
  });

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 transition-colors duration-300 flex flex-col">
      <div className="max-w-[1400px] mx-auto space-y-8 flex-1 w-full">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              HMCTS Task Manager
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your tasks and track progress effectively.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <ModeToggle />
            <Button onClick={openCreateDialog} className="bg-primary hover:bg-primary/90 shadow-sm">
              <Plus className="mr-2 h-4 w-4" /> New Task
            </Button>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Row 1: Key Stats (Full Width) */}
            <div className="col-span-1 md:col-span-2 lg:col-span-4">
                <StatsCards tasks={tasks} />
            </div>

            {/* Row 2: Charts & Widgets */}
            <div className="col-span-1 lg:col-span-1 min-h-[300px]">
                <TaskDistributionChart tasks={tasks} />
            </div>
            <div className="col-span-1 lg:col-span-1 min-h-[300px]">
                <PriorityChart tasks={tasks} />
            </div>
            <div className="col-span-1 md:col-span-2 lg:col-span-2 min-h-[300px]">
                <UpcomingDeadlines tasks={tasks} />
            </div>
        </div>

        {/* Main Content */}
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 bg-card p-4 rounded-xl border shadow-sm">
            <div className="relative flex-1 w-full lg:w-auto">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search tasks..."
                className="pl-9 w-full bg-background border-border focus-visible:ring-offset-0"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[140px] bg-background border-border">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Status</SelectItem>
                  <SelectItem value={TaskStatus.NEW}>New</SelectItem>
                  <SelectItem value={TaskStatus.IN_PROGRESS}>In Progress</SelectItem>
                  <SelectItem value={TaskStatus.COMPLETED}>Completed</SelectItem>
                  <SelectItem value={TaskStatus.BLOCKED}>Blocked</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="w-[140px] bg-background border-border">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Priorities</SelectItem>
                  <SelectItem value={TaskPriority.HIGH}>High</SelectItem>
                  <SelectItem value={TaskPriority.MEDIUM}>Medium</SelectItem>
                  <SelectItem value={TaskPriority.LOW}>Low</SelectItem>
                </SelectContent>
              </Select>

              {(filterStatus !== "ALL" || filterPriority !== "ALL" || searchTerm !== "") && (
                <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearFilters} 
                    className="ml-auto lg:ml-0 text-muted-foreground hover:text-foreground"
                >
                  <FilterX className="mr-2 h-4 w-4" /> Clear
                </Button>
              )}
            </div>
          </div>

          <Tabs defaultValue="list" className="w-full">
            <div className="flex items-center justify-between mb-4">
                <TabsList className="grid w-[200px] grid-cols-2">
                    <TabsTrigger value="list" className="flex items-center gap-2">
                        <LayoutList className="h-4 w-4" /> List
                    </TabsTrigger>
                    <TabsTrigger value="board" className="flex items-center gap-2">
                        <Kanban className="h-4 w-4" /> Board
                    </TabsTrigger>
                </TabsList>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-24 space-y-4">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    <p className="text-muted-foreground animate-pulse">Loading workspace...</p>
                </div>
            ) : (
                <>
                    <TabsContent value="list" className="mt-0">
                        <TaskList
                            tasks={filteredTasks}
                            onEdit={openEditDialog}
                            onDelete={setDeleteId}
                            onStatusChange={handleStatusChange}
                        />
                    </TabsContent>
                    <TabsContent value="board" className="mt-0">
                        <KanbanBoard
                            tasks={filteredTasks}
                            onEdit={openEditDialog}
                            onDelete={setDeleteId}
                            onStatusChange={handleStatusChange}
                        />
                    </TabsContent>
                </>
            )}
          </Tabs>
        </div>
      </div>

      <footer className="mt-12 py-6 text-center text-sm text-muted-foreground border-t border-border/40">
        <p>Made with ❤️ for HMCTS caseworkers</p>
      </footer>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingTask ? "Edit Task" : "Create New Task"}</DialogTitle>
            <DialogDescription>
                Fill in the details below to {editingTask ? "update the" : "create a new"} task record.
            </DialogDescription>
          </DialogHeader>
          <TaskForm
            initialData={editingTask}
            onSubmit={editingTask ? handleUpdate : handleCreate}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

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
              onClick={confirmDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Index;