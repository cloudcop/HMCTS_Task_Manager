import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TaskForm } from './TaskForm';
import { describe, it, expect, vi } from 'vitest';

// Mock the AttachmentUpload component since it uses Supabase
vi.mock('./AttachmentUpload', () => ({
  AttachmentUpload: () => <div data-testid="attachment-upload">Upload Component</div>
}));

describe('TaskForm', () => {
  it('renders all form fields', () => {
    render(
      <TaskForm 
        onSubmit={vi.fn()} 
        onCancel={vi.fn()} 
      />
    );

    expect(screen.getByLabelText(/Title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Case ID/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    expect(screen.getByText(/Due Date/i)).toBeInTheDocument();
    expect(screen.getByText(/Save Task/i)).toBeInTheDocument();
  });

  it('displays validation error when title is empty and form is submitted', async () => {
    const onSubmit = vi.fn();
    render(
      <TaskForm 
        onSubmit={onSubmit} 
        onCancel={vi.fn()} 
      />
    );

    const submitBtn = screen.getByText('Save Task');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Title must be at least 3 characters/i)).toBeInTheDocument();
    });
    
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('calls onCancel when cancel button is clicked', () => {
    const onCancel = vi.fn();
    render(
      <TaskForm 
        onSubmit={vi.fn()} 
        onCancel={onCancel} 
      />
    );

    const cancelBtn = screen.getByText('Cancel');
    fireEvent.click(cancelBtn);
    expect(onCancel).toHaveBeenCalled();
  });
});