```tsx
import React from 'react';
import { format } from 'date-fns';

interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority?: string;
  dueDate?: Date;
  createdDate: Date;
}

interface TaskDetailComponentProps {
  task: Task;
}

const TaskDetailComponent: React.FC<TaskDetailComponentProps> = ({ task }) => {
  const {
    title,
    description,
    status,
    priority,
    dueDate,
    createdDate,
  } = task;

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>
      <p className="text-gray-600 mb-2">
        <span className="font-semibold">Status:</span> {status}
      </p>
      {priority && (
        <p className="text-gray-600 mb-2">
          <span className="font-semibold">Priority:</span> {priority}
        </p>
      )}
      {description && (
        <p className="text-gray-600 mb-4">
          <span className="font-semibold">Description:</span> {description}
        </p>
      )}
      {dueDate && (
        <p className="text-gray-600 mb-2">
          <span className="font-semibold">Due Date:</span> {format(new Date(dueDate), 'PPP')}
        </p>
      )}
      <p className="text-gray-600">
        <span className="font-semibold">Created Date:</span> {format(new Date(createdDate), 'PPP')}
      </p>
    </div>
  );
};

export default TaskDetailComponent;
```