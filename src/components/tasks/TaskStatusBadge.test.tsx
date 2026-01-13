import { render, screen } from '@testing-library/react';
import TaskStatusBadge from './TaskStatusBadge';
import { TaskStatus } from '../../types';
import { describe, test, expect } from 'vitest';

describe('TaskStatusBadge', () => {
  test('renders NEW status with correct label', () => {
    render(<TaskStatusBadge status={TaskStatus.NEW} />);
    expect(screen.getByText('NEW')).toBeInTheDocument();
  });

  test('renders IN_PROGRESS status with correct label', () => {
    render(<TaskStatusBadge status={TaskStatus.IN_PROGRESS} />);
    expect(screen.getByText('IN PROGRESS')).toBeInTheDocument();
  });

  test('renders COMPLETED status with green variant', () => {
    const { container } = render(<TaskStatusBadge status={TaskStatus.COMPLETED} />);
    expect(screen.getByText('COMPLETED')).toBeInTheDocument();
    // Check for Tailwind green class
    expect(container.firstChild).toHaveClass('bg-green-600');
  });

  test('renders BLOCKED status with red variant', () => {
    const { container } = render(<TaskStatusBadge status={TaskStatus.BLOCKED} />);
    expect(screen.getByText('BLOCKED')).toBeInTheDocument();
    // Check for Tailwind red class
    expect(container.firstChild).toHaveClass('bg-red-600');
  });
});