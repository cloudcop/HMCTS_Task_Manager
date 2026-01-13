# API Documentation & Data Model

## Database Schema (Supabase/Postgres)

The application uses a single table `tasks` in the `public` schema.

### Table: `tasks`

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | UUID | No | `gen_random_uuid()` | Primary Key |
| `title` | TEXT | No | - | Task title |
| `description` | TEXT | Yes | - | Detailed description |
| `status` | TEXT | No | `'NEW'` | Enum: NEW, IN_PROGRESS, COMPLETED, BLOCKED |
| `priority` | TEXT | No | `'MEDIUM'` | Enum: HIGH, MEDIUM, LOW |
| `due_date_time` | TIMESTAMP | No | - | ISO 8601 Date string |
| `case_id` | TEXT | Yes | - | Associated Case ID (e.g., CASE-123) |
| `created_at` | TIMESTAMP | Yes | `now()` | Creation timestamp |
| `updated_at` | TIMESTAMP | Yes | `now()` | Last update timestamp |

## Validation

Input validation is handled on the client-side using **Zod** schema validation before sending data to the backend.

### Rules
- **Title**: Required, min 3 characters, max 100 characters.
- **Status**: Must be a valid `TaskStatus` enum value.
- **Priority**: Must be a valid `TaskPriority` enum value.
- **Due Date**: Required, must be a valid ISO date string.
- **Case ID**: Optional string.
- **Description**: Optional string.

## Service Layer API (`src/services/taskService.ts`)

The frontend communicates with Supabase via the `taskService` object. All methods return Promises.

### `getAll()`
Retrieves all tasks ordered by `dueDateTime` ascending.
- **Returns**: `Promise<Task[]>`
- **Errors**: Throws if database query fails.

### `getById(id: string)`
Retrieves a single task by its UUID.
- **Params**: `id` (string)
- **Returns**: `Promise<Task | null>`
- **Errors**: Returns `null` if not found.

### `create(data: CreateTaskDTO)`
Creates a new task.
- **Params**:
  ```typescript
  {
    title: string;
    description?: string;
    status?: TaskStatus;     // Default: NEW
    priority?: TaskPriority; // Default: MEDIUM
    dueDateTime: string;
    caseId?: string;
  }
  ```
- **Returns**: `Promise<Task>` (The created task)

### `update(id: string, data: UpdateTaskDTO)`
Updates an existing task. Handles mapping camelCase DTO properties to snake_case database columns.
- **Params**: `id` (string), `data` (Partial task properties)
- **Returns**: `Promise<Task>`
- **Errors**: Throws if update fails.

### `delete(id: string)`
Permanently deletes a task.
- **Params**: `id` (string)
- **Returns**: `Promise<void>`

## Error Handling

- **Service Level**: Database errors are caught and re-thrown or returned as null depending on the method context.
- **UI Level**: 
  - `try/catch` blocks wrap service calls.
  - User feedback is provided via `sonner` toast notifications (Success/Error).
  - `console.error` is used for debugging logs.