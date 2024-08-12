import { createClient } from '@supabase/supabase-js';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { payload } = req.body;

    const { error } = await supabase
      .from('tasks')
      .insert([{ payload, status: 'pending' }]);

    if (error) {
      res.status(500).json({ error: 'Failed to submit task' });
    } else {
      res.status(200).json({ message: 'Task submitted successfully' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
