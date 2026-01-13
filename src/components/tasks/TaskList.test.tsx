import { render, screen, fireEvent } from '@testing-library/react';
import { TaskList } from './TaskList';
import { Task, TaskStatus, TaskPriority } from '../../types';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';

// Wrapper for router context
const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Test Task 1',
    description: 'Description 1',
    status: TaskStatus.NEW,
    priority: TaskPriority.HIGH,
    dueDateTime: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    caseId: 'CASE-1',
  },
  {
    id: '2',
    title: 'Test Task 2',
    description: '',
    status: TaskStatus.COMPLETED,
    priority: TaskPriority.LOW,
    dueDateTime: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    caseId: undefined,
  },
];

describe('TaskList', () => {
  it('renders "No tasks found" when list is empty', () => {
    renderWithRouter(
      <TaskList 
        tasks={[]} 
        onEdit={vi.fn()} 
        onDelete={vi.fn()} 
        onStatusChange={vi.fn()} 
      />
    );
    expect(screen.getByText(/No tasks found/i)).toBeInTheDocument();
  });

  it('renders a list of tasks', () => {
    renderWithRouter(
      <TaskList 
        tasks={mockTasks} 
        onEdit={vi.fn()} 
        onDelete={vi.fn()} 
        onStatusChange={vi.fn()} 
      />
    );
    expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    expect(screen.getByText('Test Task 2')).toBeInTheDocument();
    expect(screen.getByText('CASE-1')).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', () => {
    const onEdit = vi.fn();
    renderWithRouter(
      <TaskList 
        tasks={[mockTasks[0]]} 
        onEdit={onEdit} 
        onDelete={vi.fn()} 
        onStatusChange={vi.fn()} 
      />
    );
    
    // Find the edit button (using title attribute added in component)
    const editButton = screen.getByTitle('Edit Task');
    fireEvent.click(editButton);
    expect(onEdit).toHaveBeenCalledWith(mockTasks[0]);
  });
});