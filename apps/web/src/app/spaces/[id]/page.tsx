"use client";
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import { List, Space, Task, TaskStatus, TaskPriority } from '@ghl-task/types';
import Sidebar from '@/components/Sidebar';
import Board from '@/components/Board';
import Table from '@/components/Table';
import TaskDrawer from '@/components/TaskDrawer';
import { listsApi, spacesApi, tasksApi } from '@/lib/api';
import { useTaskStore } from '@/store/tasks';
type TaskWithAssignee = Task & { assignee?: { full_name?: string; email?: string } };
type ListWithTasks = List & { tasks?: TaskWithAssignee[] };

export default function SpacePage() {
  const params = useParams();
  const spaceId = params?.id as string;

  const [space, setSpace] = useState<Space | null>(null);
  const [lists, setLists] = useState<ListWithTasks[]>([]);
  const [selectedList, setSelectedList] = useState<ListWithTasks | null>(null);
  const [tab, setTab] = useState<'board' | 'table'>('board');
  const [loadingLists, setLoadingLists] = useState(true);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [creatingList, setCreatingList] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [creatingTask, setCreatingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const { tasks, setTasks, updateTask, selectedTask, setSelectedTask } = useTaskStore();

  const loadTasks = useCallback(
    async (list: ListWithTasks, hasPrefetched?: boolean) => {
      try {
        setLoadingTasks(true);
        if (hasPrefetched && list.tasks) {
          setTasks(list.tasks as Task[]);
          return;
        }
        const res = await tasksApi.getByList(list.id);
        setTasks(res.data as Task[]);
      } catch (error) {
        toast.error('Failed to load tasks');
        setTasks([]);
      } finally {
        setLoadingTasks(false);
      }
    },
    [setTasks]
  );

  useEffect(() => {
    const loadSpace = async () => {
      try {
        const res = await spacesApi.getById(spaceId);
        setSpace(res.data as Space);
      } catch (error) {
        toast.error('Failed to load space');
      }
    };

    if (spaceId) {
      loadSpace();
    }
  }, [spaceId]);

  useEffect(() => {
    if (!spaceId) return;

    const loadLists = async () => {
      try {
        setLoadingLists(true);
        const res = await listsApi.getBySpace(spaceId);
        const data: ListWithTasks[] = res.data || [];
        setLists(data);
        const first = data[0] || null;
        setSelectedList(first);
        if (first) {
          await loadTasks(first, true);
        } else {
          setTasks([]);
        }
      } catch (error) {
        toast.error('Failed to load lists for this space');
        setLists([]);
        setTasks([]);
      } finally {
        setLoadingLists(false);
      }
    };

    loadLists();
  }, [spaceId, setTasks, loadTasks]);

  const boardTasks = useMemo(
    () =>
      tasks.map((taskItem) => {
        const typed = taskItem as TaskWithAssignee;
        return {
          id: typed.id,
          title: typed.title,
          status: (typed.status as TaskStatus) || TaskStatus.OPEN,
          priority: (typed.priority as TaskPriority) || TaskPriority.NORMAL,
          dueDate: typed.due_date ? new Date(typed.due_date).toLocaleDateString() : undefined,
          assigneeName: typed.assignee?.full_name || typed.assignee?.email,
        };
      }),
    [tasks]
  );

  const tableTasks = useMemo(
    () =>
      tasks.map((taskItem) => {
        const typed = taskItem as TaskWithAssignee;
        return {
          id: typed.id,
          title: typed.title,
          assignee: typed.assignee?.full_name || typed.assignee?.email,
          dueDate: typed.due_date ? new Date(typed.due_date).toLocaleDateString() : undefined,
          status: typed.status as TaskStatus,
          priority: (typed.priority as TaskPriority) || TaskPriority.NORMAL,
        };
      }),
    [tasks]
  );

  const handleMove = async (id: string, status: TaskStatus) => {
    const previous = tasks.find((t) => t.id === id)?.status;
    updateTask(id, { status });
    try {
      await tasksApi.update(id, { status });
    } catch (error) {
      if (previous) {
        updateTask(id, { status: previous });
      }
      toast.error('Unable to move task');
    }
  };

  const createList = async () => {
    if (!newListName.trim()) return;
    try {
      setCreatingList(true);
      const res = await listsApi.createInSpace(spaceId, {
        name: newListName.trim(),
        view_type: 'board',
      });
      const created = res.data as ListWithTasks;
      setLists((prev) => [created, ...prev]);
      setSelectedList(created);
      setTasks(created.tasks || []);
      setNewListName('');
      toast.success('List created');
    } catch (error) {
      toast.error('Failed to create list');
    } finally {
      setCreatingList(false);
    }
  };

  const createTask = async () => {
    if (!selectedList) {
      toast.error('Select a list first');
      return;
    }
    if (!newTaskTitle.trim()) return;
    try {
      setCreatingTask(true);
      const res = await tasksApi.create({
        list_id: selectedList.id,
        title: newTaskTitle.trim(),
      });
      const created = res.data as TaskWithAssignee;
      setTasks([created, ...tasks]);
      setNewTaskTitle('');
      toast.success('Task created');
    } catch (error) {
      toast.error('Failed to create task');
    } finally {
      setCreatingTask(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      <div className="flex-1">
        <header className="bg-white border-b">
          <div className="px-6 py-4 flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{space?.name || 'Space'}</h1>
              {space?.description && <p className="text-sm text-gray-600">{space.description}</p>}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setTab('board')}
                className={`px-3 py-1.5 rounded ${tab === 'board' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                Board
              </button>
              <button
                onClick={() => setTab('table')}
                className={`px-3 py-1.5 rounded ${tab === 'table' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                Table
              </button>
            </div>
          </div>
        </header>

        <main className="p-6 space-y-6">
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Lists</h2>
              <div className="flex items-center gap-2">
                <input
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  placeholder="New list name"
                  className="h-9 rounded-lg border px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={createList}
                  disabled={!newListName.trim() || creatingList}
                  className="px-3 py-1.5 text-sm bg-gray-900 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {creatingList ? 'Creating...' : '+ New List'}
                </button>
              </div>
            </div>

            {loadingLists ? (
              <div className="flex gap-2">
                {[1, 2, 3].map((k) => (
                  <div key={k} className="h-9 w-24 bg-gray-200 rounded animate-pulse" />
                ))}
              </div>
            ) : lists.length === 0 ? (
              <div className="border border-dashed rounded-lg p-6 text-center text-gray-600 bg-white">No lists yet. Create one to start planning.</div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {lists.map((list) => (
                  <button
                    key={list.id}
                    onClick={() => {
                      setSelectedList(list);
                      loadTasks(list);
                    }}
                    className={`px-3 py-1.5 rounded-full border ${
                      selectedList?.id === list.id ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 bg-white text-gray-800'
                    }`}
                  >
                    {list.name}
                  </button>
                ))}
              </div>
            )}
          </section>

          <section>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <input
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder={selectedList ? `Add task to ${selectedList.name}` : 'Select a list first'}
                  className="h-10 w-full max-w-md rounded-lg border px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={!selectedList}
                />
                <button
                  onClick={createTask}
                  disabled={!selectedList || !newTaskTitle.trim() || creatingTask}
                  className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {creatingTask ? 'Adding...' : 'Add Task'}
                </button>
              </div>
              {selectedList && (
                <span className="text-sm text-gray-600">Active list: {selectedList.name}</span>
              )}
            </div>

            {loadingTasks ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((k) => (
                  <div key={k} className="bg-white border rounded-lg p-4 space-y-3 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="h-3 bg-gray-200 rounded w-full" />
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                  </div>
                ))}
              </div>
            ) : tab === 'board' ? (
              <Board
                tasks={boardTasks}
                onMove={handleMove}
                onSelect={(id) => setSelectedTask(tasks.find((t) => t.id === id) || null)}
              />
            ) : (
              <Table
                tasks={tableTasks}
                onSelect={(id) => setSelectedTask(tasks.find((t) => t.id === id) || null)}
              />
            )}
          </section>
        </main>
      </div>

      <TaskDrawer taskId={selectedTask?.id || null} onClose={() => setSelectedTask(null)} />
    </div>
  );
}
