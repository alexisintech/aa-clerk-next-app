'use client';
import React, { useState } from 'react';
import { addTask } from './actions';
import { useRouter } from 'next/navigation';

function AddTaskForm() {
  const [taskName, setTaskName] = useState('');
  const router = useRouter();

  async function onSubmit() {
    await addTask(taskName);
    setTaskName('');
    router.refresh();
  }

  return (
    <form action={onSubmit} className="flex gap-2">
      <input
        autoFocus
        type="text"
        name="name"
        onChange={(e) => setTaskName(e.target.value)}
        value={taskName}
        placeholder="What do you need to do?"
      />
      <button type="submit" className="disabled:cursor-not-allowed">
        Add
      </button>
    </form>
  );
}
export default AddTaskForm;
