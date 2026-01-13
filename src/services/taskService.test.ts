import { describe, it, expect, vi, beforeEach } from 'vitest';
import { taskService } from './taskService';
import { supabase } from '../lib/supabase';
import { TaskStatus } from '../types';

// Mock the supabase client
vi.mock('../lib/supabase', () => ({
  supabase: {
    from: vi.fn(),
  },
}));

describe('taskService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAll', () => {
    it('should retrieve all tasks successfully', async () => {
      // Arrange
      const mockTasks = [
        {
          id: '1',
          title: 'Test Task 1',
          status: 'NEW',
          priority: 'HIGH',
          due_date_time: '2024-01-01T10:00:00Z',
          created_at: '2024-01-01T09:00:00Z',
          updated_at: '2024-01-01T09:00:00Z',
          case_id: 'CASE-001'
        },
        {
          id: '2',
          title: 'Test Task 2',
          status: 'COMPLETED',
          priority: 'LOW',
          due_date_time: '2024-01-02T10:00:00Z',
          created_at: '2024-01-01T09:00:00Z',
          updated_at: '2024-01-01T09:00:00Z',
          case_id: null
        }
      ];

      const orderMock = vi.fn().mockResolvedValue({ data: mockTasks, error: null });
      const selectMock = vi.fn().mockReturnValue({ order: orderMock });
      const fromMock = vi.fn().mockReturnValue({ select: selectMock });
      
      (supabase.from as any).mockImplementation(fromMock);

      // Act
      const result = await taskService.getAll();

      // Assert
      expect(supabase.from).toHaveBeenCalledWith('tasks');
      expect(selectMock).toHaveBeenCalledWith('*');
      expect(orderMock).toHaveBeenCalledWith('due_date_time', { ascending: true });
      
      expect(result).toHaveLength(2);
      expect(result[0].title).toBe('Test Task 1');
      expect(result[0].status).toBe(TaskStatus.NEW);
      expect(result[0].caseId).toBe('CASE-001');
      expect(result[1].title).toBe('Test Task 2');
    });

    it('should throw an error if retrieval fails', async () => {
      // Arrange
      const mockError = { message: 'Database connection failed' };
      
      const orderMock = vi.fn().mockResolvedValue({ data: null, error: mockError });
      const selectMock = vi.fn().mockReturnValue({ order: orderMock });
      const fromMock = vi.fn().mockReturnValue({ select: selectMock });
      
      (supabase.from as any).mockImplementation(fromMock);

      // Act & Assert
      await expect(taskService.getAll()).rejects.toEqual(mockError);
    });
  });

  describe('getById', () => {
    it('should retrieve a single task by ID successfully', async () => {
      // Arrange
      const mockTask = {
        id: '1',
        title: 'Test Task 1',
        status: 'NEW',
        priority: 'HIGH',
        due_date_time: '2024-01-01T10:00:00Z',
        created_at: '2024-01-01T09:00:00Z',
        updated_at: '2024-01-01T09:00:00Z',
        case_id: 'CASE-001'
      };

      const singleMock = vi.fn().mockResolvedValue({ data: mockTask, error: null });
      const eqMock = vi.fn().mockReturnValue({ single: singleMock });
      const selectMock = vi.fn().mockReturnValue({ eq: eqMock });
      const fromMock = vi.fn().mockReturnValue({ select: selectMock });
      
      (supabase.from as any).mockImplementation(fromMock);

      // Act
      const result = await taskService.getById('1');

      // Assert
      expect(supabase.from).toHaveBeenCalledWith('tasks');
      expect(selectMock).toHaveBeenCalledWith('*');
      expect(eqMock).toHaveBeenCalledWith('id', '1');
      
      expect(result).not.toBeNull();
      expect(result?.id).toBe('1');
      expect(result?.title).toBe('Test Task 1');
    });

    it('should return null if task not found', async () => {
      // Arrange
      const singleMock = vi.fn().mockResolvedValue({ data: null, error: { message: 'Not found' } });
      const eqMock = vi.fn().mockReturnValue({ single: singleMock });
      const selectMock = vi.fn().mockReturnValue({ eq: eqMock });
      const fromMock = vi.fn().mockReturnValue({ select: selectMock });
      
      (supabase.from as any).mockImplementation(fromMock);

      // Act
      const result = await taskService.getById('999');

      // Assert
      expect(result).toBeNull();
    });
  });
});