'use server';

import { createClerkSupabaseClientSsr } from './client';

const client = createClerkSupabaseClientSsr();

export async function addTask(name: string) {
  const { error } = await client.from('tasks').insert({
    name,
  });
  if (error) {
    console.error('Error adding task:', error.message);
    throw new Error('Failed to add task');
  }
}

export async function deleteTask(taskId: number) {
  try {
    const response = await client
      .from('tasks')
      .delete()
      .eq('id', taskId)
      .select();
    console.log(response);
  } catch (error: any) {
    console.error('Error deleting task:', error.message);
    throw new Error('Failed to delete task');
  }

  // const { error } = await client.from('tasks').delete().eq('id', taskId);
  // if (error) {
  //   console.error('Error deleting task:', error.message);
  //   throw new Error('Failed to delete task');
  // }
}

export async function setTaskState(taskId: number, isDone: boolean) {
  const { error } = await client
    .from('tasks')
    .update({
      is_done: isDone,
    })
    .eq('id', taskId);

  if (error) {
    console.error('Error updating task state:', error.message);
    throw new Error('Failed to update task state');
  }
}
