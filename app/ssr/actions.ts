'use server';

import { createClerkSupabaseClientSsr } from './client';

const client = createClerkSupabaseClientSsr();

export async function addTask(name: string) {
  try {
    const response = await client.from('tasks').insert({
      name,
    });

    console.log('Task successfully added!', response);
  } catch (error: any) {
    console.error('Error adding task:', error.message);
    throw new Error('Failed to add task');
  }
}

export async function deleteTask(taskId: number) {
  await client.from('tasks').delete().eq('id', taskId);
}

export async function setTaskState(taskId: number, isDone: boolean) {
  await client
    .from('tasks')
    .update({
      is_done: isDone,
    })
    .eq('id', taskId);
}
