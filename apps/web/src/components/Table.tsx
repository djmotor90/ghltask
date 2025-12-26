import { TaskStatus, TaskPriority } from '@ghl-task/types';

export interface TableTask {
  id: string;
  title: string;
  assignee?: string;
  dueDate?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
}

interface Props {
  tasks: TableTask[];
  onSelect?: (id: string) => void;
}

export default function Table({ tasks, onSelect }: Props) {
  const statusLabel: Record<TaskStatus, string> = {
    [TaskStatus.OPEN]: 'Open',
    [TaskStatus.IN_PROGRESS]: 'In Progress',
    [TaskStatus.IN_REVIEW]: 'In Review',
    [TaskStatus.DONE]: 'Done',
    [TaskStatus.ARCHIVED]: 'Archived',
  };

  const statusClass: Record<TaskStatus, string> = {
    [TaskStatus.OPEN]: 'bg-gray-100 text-gray-700',
    [TaskStatus.IN_PROGRESS]: 'bg-blue-100 text-blue-700',
    [TaskStatus.IN_REVIEW]: 'bg-yellow-100 text-yellow-700',
    [TaskStatus.DONE]: 'bg-green-100 text-green-700',
    [TaskStatus.ARCHIVED]: 'bg-gray-200 text-gray-600',
  };

  return (
    <div className="overflow-x-auto bg-white border rounded-lg">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-gray-50 text-gray-600">
            <th className="px-3 py-2 text-left">Title</th>
            <th className="px-3 py-2 text-left">Assignee</th>
            <th className="px-3 py-2 text-left">Due Date</th>
            <th className="px-3 py-2 text-left">Priority</th>
            <th className="px-3 py-2 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((t) => (
            <tr
              key={t.id}
              className="border-t hover:bg-gray-50 cursor-pointer"
              onClick={() => onSelect?.(t.id)}
            >
              <td className="px-3 py-2 font-medium text-gray-900">{t.title}</td>
              <td className="px-3 py-2 text-gray-700">{t.assignee || '-'}</td>
              <td className="px-3 py-2 text-gray-700">{t.dueDate || '-'}</td>
              <td className="px-3 py-2 text-gray-700">{t.priority || '-'}</td>
              <td className="px-3 py-2">
                {t.status ? (
                  <span className={`text-xs px-2 py-1 rounded-full ${statusClass[t.status]}`}>
                    {statusLabel[t.status]}
                  </span>
                ) : (
                  '-'
                )}
              </td>
            </tr>
          ))}
          {tasks.length === 0 && (
            <tr>
              <td colSpan={5} className="px-3 py-8 text-center text-gray-500">No tasks yet</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
