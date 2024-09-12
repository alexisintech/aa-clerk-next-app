// This must be a separate file because useRouter() can't be used in server components
'use client';

import { useRouter } from 'next/navigation';
import { deleteTask, setTaskState } from './actions';

export default function TaskRow({ task }: { task: any }) {
  const router = useRouter();

  async function onCheckClicked(taskId: number, isDone: boolean) {
    // Update a task when its completed
    await setTaskState(taskId, isDone);
    router.refresh();
  }

  async function onDeleteClicked(taskId: number) {
    // Delete a task from the database
    await deleteTask(taskId);
    router.refresh();
  }

  return (
    <div key={task.id}>
      <p>{task.name}</p>
      <input
        type="checkbox"
        checked={task.is_done}
        onChange={(e) => onCheckClicked(task.id, e.target.checked)}
      />
      <button onClick={() => onDeleteClicked(task.id)}>Delete</button>
    </div>
  );
}
