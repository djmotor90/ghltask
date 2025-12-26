"use client";
import { useEffect, useState } from 'react';
import { Task, TaskStatus, TaskPriority } from '@ghl-task/types';
import { tasksApi, commentsApi } from '@/lib/api';
import { toast } from 'sonner';

interface CommentItem {
  id: string;
  content: string;
  createdAt?: string;
  user?: { full_name?: string; email?: string };
}

interface Props {
  taskId: string | null;
  onClose: () => void;
}

export default function TaskDrawer({ taskId, onClose }: Props) {
  const [task, setTask] = useState<Task | null>(null);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [commentInput, setCommentInput] = useState('');

  useEffect(() => {
    if (!taskId) return;

    const load = async () => {
      try {
        setLoading(true);
        const [taskRes, commentsRes] = await Promise.all([
          tasksApi.getById(taskId),
          commentsApi.getByTask(taskId),
        ]);
        setTask(taskRes.data as Task);
        setComments(commentsRes.data || []);
      } catch (error) {
        toast.error('Failed to load task details');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [taskId]);

  const addComment = async () => {
    if (!taskId || !commentInput.trim()) return;
    try {
      const res = await commentsApi.create(taskId, { content: commentInput.trim() });
      setComments((prev) => [...prev, res.data]);
      setCommentInput('');
    } catch (error) {
      toast.error('Failed to add comment');
    }
  };

  const statusLabel: Record<TaskStatus, string> = {
    [TaskStatus.OPEN]: 'Open',
    [TaskStatus.IN_PROGRESS]: 'In Progress',
    [TaskStatus.IN_REVIEW]: 'In Review',
    [TaskStatus.DONE]: 'Done',
    [TaskStatus.ARCHIVED]: 'Archived',
  };

  const priorityLabel: Record<TaskPriority, string> = {
    [TaskPriority.URGENT]: 'Urgent',
    [TaskPriority.HIGH]: 'High',
    [TaskPriority.NORMAL]: 'Normal',
    [TaskPriority.LOW]: 'Low',
  };

  const statusClass: Record<TaskStatus, string> = {
    [TaskStatus.OPEN]: 'bg-gray-100 text-gray-700',
    [TaskStatus.IN_PROGRESS]: 'bg-blue-100 text-blue-700',
    [TaskStatus.IN_REVIEW]: 'bg-yellow-100 text-yellow-700',
    [TaskStatus.DONE]: 'bg-green-100 text-green-700',
    [TaskStatus.ARCHIVED]: 'bg-gray-200 text-gray-600',
  };

  const priorityClass: Record<TaskPriority, string> = {
    [TaskPriority.URGENT]: 'bg-red-100 text-red-700',
    [TaskPriority.HIGH]: 'bg-orange-100 text-orange-700',
    [TaskPriority.NORMAL]: 'bg-blue-100 text-blue-700',
    [TaskPriority.LOW]: 'bg-gray-100 text-gray-700',
  };

  if (!taskId) return null;

  return (
    <div className="fixed inset-0 z-40 flex">
      <div className="flex-1 bg-black/30" onClick={onClose} />
      <div className="w-full max-w-xl bg-white h-full shadow-2xl overflow-y-auto">
        <div className="p-5 border-b flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500">Task</p>
            <h2 className="text-xl font-semibold text-gray-900 leading-tight">{task?.title || 'Loading...'}</h2>
            <div className="mt-2 flex items-center gap-2 text-xs">
              {task?.status && (
                <span className={`px-2 py-1 rounded-full ${statusClass[task.status]}`}>
                  {statusLabel[task.status]}
                </span>
              )}
              {task?.priority && (
                <span className={`px-2 py-1 rounded-full ${priorityClass[task.priority]}`}>
                  {priorityLabel[task.priority]}
                </span>
              )}
              {task?.due_date && (
                <span className="text-gray-600">Due {new Date(task.due_date).toLocaleDateString()}</span>
              )}
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">✕</button>
        </div>

        <div className="p-5 space-y-6">
          <section>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Description</h3>
            {loading ? (
              <div className="animate-pulse space-y-2">
                <div className="h-3 bg-gray-200 rounded" />
                <div className="h-3 bg-gray-200 rounded w-4/5" />
              </div>
            ) : (
              <p className="text-sm text-gray-700 whitespace-pre-line">{task?.description || 'No description yet.'}</p>
            )}
          </section>

          <section>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Comments</h3>
            <div className="space-y-3">
              {comments.map((c) => (
                <div key={c.id} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span>{c.user?.full_name || c.user?.email || 'User'}</span>
                    {c.createdAt && <span>{new Date(c.createdAt).toLocaleString()}</span>}
                  </div>
                  <p className="text-sm text-gray-800">{c.content}</p>
                </div>
              ))}
              {comments.length === 0 && <p className="text-sm text-gray-500">No comments yet.</p>}
            </div>
            <div className="mt-3 flex gap-2">
              <textarea
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="Add a comment"
                className="flex-1 border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
              />
              <button
                onClick={addComment}
                className="h-fit px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Post
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
