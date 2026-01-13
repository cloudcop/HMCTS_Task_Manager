import { supabase } from "../lib/supabase";
import { Task, CreateTaskDTO, UpdateTaskDTO } from "../types";

export const taskService = {
  getAll: async (): Promise<Task[]> => {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("due_date_time", { ascending: true });

    if (error) throw error;
    
    return data.map(mapToTask);
  },

  getById: async (id: string): Promise<Task | null> => {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("id", id)
      .single();

    if (error) return null;
    return mapToTask(data);
  },

  create: async (data: CreateTaskDTO): Promise<Task> => {
    const { data: created, error } = await supabase
      .from("tasks")
      .insert({
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
        due_date_time: data.dueDateTime,
        case_id: data.caseId,
        attachments: data.attachments || [],
      })
      .select()
      .single();

    if (error) throw error;
    return mapToTask(created);
  },

  update: async (id: string, data: UpdateTaskDTO): Promise<Task> => {
    const updatePayload: any = {
      ...data,
      updated_at: new Date().toISOString(),
    };
    
    if (data.dueDateTime) {
        updatePayload.due_date_time = data.dueDateTime;
        delete updatePayload.dueDateTime;
    }

    if (data.caseId !== undefined) {
        updatePayload.case_id = data.caseId;
        delete updatePayload.caseId;
    }
    
    // Attachments are passed through directly as they match the DB column name if present

    const { data: updated, error } = await supabase
      .from("tasks")
      .update(updatePayload)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return mapToTask(updated);
  },

  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },
};

const mapToTask = (dbRecord: any): Task => ({
  id: dbRecord.id,
  title: dbRecord.title,
  description: dbRecord.description,
  status: dbRecord.status,
  priority: dbRecord.priority,
  dueDateTime: dbRecord.due_date_time,
  createdAt: dbRecord.created_at,
  updatedAt: dbRecord.updated_at,
  caseId: dbRecord.case_id,
  attachments: dbRecord.attachments || [],
});