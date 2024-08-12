const { createClient } = require('@supabase/supabase-js');

// Replace with your Supabase project URL and anonymous key
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function processLongRunningTasks() {
  while (true) {
    try {
      // Fetch pending tasks
      const { data: tasks, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('status', 'pending')
        .limit(1)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching tasks:', error);
        await delay(5000); // Wait before retrying
        continue;
      }

      if (tasks.length === 0) {
        await delay(5000); // No tasks, wait before polling again
        continue;
      }

      const task = tasks[0];

      console.log(`Processing task ${task.id}`);

      // Update task status to processing
      await supabase
        .from('tasks')
        .update({ status: 'processing' })
        .eq('id', task.id);

      // Simulate task processing (replace this with your logic)
      await performLongRunningTask(task.payload);

      // Mark task as completed
      await supabase
        .from('tasks')
        .update({ status: 'completed' })
        .eq('id', task.id);

      console.log(`Task ${task.id} completed`);
    } catch (err) {
      console.error('Error processing tasks:', err);
      await delay(5000); // Wait before retrying in case of errors
    }
  }
}

async function performLongRunningTask(payload) {
  // Simulate a long-running task (3-4 minutes)
  return new Promise((resolve) => setTimeout(resolve, 3 * 60 * 1000));
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Start processing tasks
processLongRunningTasks();
