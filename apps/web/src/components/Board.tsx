"use client";
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { TaskPriority, TaskStatus } from '@ghl-task/types';

export interface BoardTask {
  id: string;
  title: string;
  status: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
  assigneeName?: string;
}

interface Props {
  tasks: BoardTask[];
  onMove?: (id: string, status: TaskStatus) => void;
  onSelect?: (id: string) => void;
}

export default function Board({ tasks, onMove, onSelect }: Props) {
  const columns = [
    { key: TaskStatus.OPEN, name: 'Backlog' },
    { key: TaskStatus.IN_PROGRESS, name: 'In Progress' },
    { key: TaskStatus.IN_REVIEW, name: 'In Review' },
    { key: TaskStatus.DONE, name: 'Done' },
  ];

  const grouped: Record<TaskStatus, BoardTask[]> = {
    [TaskStatus.OPEN]: [],
    [TaskStatus.IN_PROGRESS]: [],
    [TaskStatus.IN_REVIEW]: [],
    [TaskStatus.DONE]: [],
    [TaskStatus.ARCHIVED]: [],
  } as Record<TaskStatus, BoardTask[]>;

  tasks.forEach((t) => {
    const bucket = grouped[t.status] ?? grouped[TaskStatus.OPEN];
    bucket.push(t);
  });

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const status = result.destination.droppableId as TaskStatus;
    const id = result.draggableId;
    onMove?.(id, status);
  };

  const priorityClasses: Record<TaskPriority, string> = {
    [TaskPriority.URGENT]: 'bg-red-100 text-red-700',
    [TaskPriority.HIGH]: 'bg-orange-100 text-orange-700',
    [TaskPriority.NORMAL]: 'bg-blue-100 text-blue-700',
    [TaskPriority.LOW]: 'bg-gray-100 text-gray-700',
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {columns.map((col) => (
          <Droppable key={col.key} droppableId={col.key}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="bg-white border rounded-lg p-3 min-h-[320px] shadow-sm"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{col.name}</h3>
                  <span className="text-xs text-gray-500">{grouped[col.key]?.length || 0}</span>
                </div>
                {grouped[col.key]?.map((t, idx) => (
                  <Draggable key={t.id} draggableId={t.id} index={idx}>
                    {(prov) => (
                      <div
                        ref={prov.innerRef}
                        {...prov.draggableProps}
                        {...prov.dragHandleProps}
                        className="p-3 mb-2 rounded border bg-white shadow-sm hover:border-blue-400 cursor-pointer"
                        onClick={() => onSelect?.(t.id)}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-medium text-gray-900 leading-snug">{t.title}</p>
                          {t.priority && (
                            <span className={`text-[11px] px-2 py-0.5 rounded-full ${priorityClasses[t.priority]}`}>
                              {t.priority}
                            </span>
                          )}
                        </div>
                        <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
                          {t.dueDate && <span>Due {t.dueDate}</span>}
                          {t.assigneeName && <span className="truncate">{t.assigneeName}</span>}
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}
