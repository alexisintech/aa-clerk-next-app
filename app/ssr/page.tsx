import { createClerkSupabaseClientSsr } from './client';
import AddTaskForm from './AddTaskForm';
import TaskRow from './TaskRow';

// Register the `Clerk` object on the global window to fix TypeScript errors
declare global {
  interface Window {
    Clerk: any;
  }
}

export default async function Home() {
  const client = createClerkSupabaseClientSsr();
  // Query the 'tasks' table to render the page
  const { data, error } = await client.from('tasks').select();
  if (error) {
    throw error;
  }
  const tasks = data;
  console.log(tasks);

  return (
    <div className="flex flex-col">
      <AddTaskForm />
      <div className="flex flex-col gap-2 p-2">
        {tasks?.map((task: any) => (
          <TaskRow
            key={task.id}
            id={task.id}
            name={task.name}
            is_done={task.is_done}
          />
        ))}
      </div>
    </div>
  );
}
