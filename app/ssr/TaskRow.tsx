'use client';
import React from 'react';
import { deleteTask, setTaskState } from './actions';
import { useRouter } from 'next/navigation';

type Props = {
  id: number;
  name: string;
  is_done: boolean;
};

function TaskRow({ id, name, is_done }: Props) {
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
    <div
      className={`group flex items-center transition-all w-full${
        is_done ? 'text-slate-500' : ''
      }`}
    >
      <input
        type="checkbox"
        checked={is_done}
        onChange={() => onCheckClicked(id, !is_done)}
      />
      {name}
      <button
        className="text-lg text-inherit hover:text-red-500"
        onClick={() => onDeleteClicked(id)}
      >
        Delete
      </button>
    </div>
  );
}

export default TaskRow;
