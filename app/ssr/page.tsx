import AddTaskForm from './AddTaskForm';
import { createClerkSupabaseClientSsr } from './client';
import TaskRow from './TaskRow';

export default async function Home() {
  // Use the custom Supabase client you created
  const client = createClerkSupabaseClientSsr();

  // Query the 'tasks' table to render the list of tasks
  const { data, error } = await client.from('tasks').select();
  if (error) {
    throw error;
  }
  const tasks = data;

  return (
    <div>
      <h1>Tasks</h1>

      <div>
        {tasks?.map((task: any) => (
          <TaskRow key={task.id} task={task} />
        ))}
      </div>

      <AddTaskForm />
    </div>
  );
}
