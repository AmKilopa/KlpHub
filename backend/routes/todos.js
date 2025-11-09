const express = require('express');
const nanoid = require('nanoid'); // <-- ИСПРАВЛЕНИЕ ЗДЕСЬ
const { isAuthenticated } = require('../middleware/auth');
const router = express.Router();

router.use(isAuthenticated);

router.get('/todos', async (req, res) => {
  const { data, error } = await req.supabase
    .from('todos')
    .select('*')
    .eq('user_id', req.user.id);
    
  if (error) return res.status(500).json({ error: error.message });
  return res.json(data);
});

router.post('/todos', async (req, res) => {
  const id = nanoid(8); // Теперь эта строка будет работать
  const { title, description = "" } = req.body;
  
  const { data, error } = await req.supabase
    .from('todos')
    .insert([{ id, user_id: req.user.id, title, columnname: 'todo', description }])
    .select()
    .single();
    
  if (error) return res.status(500).json({ error: error.message });
  return res.status(201).json(data);
});

router.patch('/todos/:id', async (req, res) => {
  const { title, description, columnname } = req.body;
  
  const updateData = {};
  if (title !== undefined) updateData.title = title;
  if (description !== undefined) updateData.description = description;
  if (columnname !== undefined) updateData.columnname = columnname;

  const { data, error } = await req.supabase
    .from('todos')
    .update(updateData)
    .eq('id', req.params.id)
    .eq('user_id', req.user.id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  return res.json(data);
});

router.delete('/todos/:id', async (req, res) => {
  const { error } = await req.supabase
    .from('todos')
    .delete()
    .eq('id', req.params.id)
    .eq('user_id', req.user.id);
    
  if (error) return res.status(500).json({ error: error.message });
  return res.sendStatus(204);
});

module.exports = router;