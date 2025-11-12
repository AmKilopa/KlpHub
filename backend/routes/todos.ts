import express from 'express';
import supabase from '../config/supabaseClient';
import { authMiddleware } from '../middleware/auth';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// GET все задачи пользователя
router.get('/', authMiddleware, async (req: any, res) => {
  try {
    console.log('🔵 Получение задач для пользователя:', req.user.id);
    
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Ошибка получения задач:', error);
      throw error;
    }

    console.log('✅ Задачи получены:', data?.length || 0);
    res.json(data);
  } catch (err: any) {
    console.error('❌ Ошибка получения задач:', err.message);
    res.status(500).json({ error: 'Ошибка получения задач' });
  }
});

// POST создать задачу
router.post('/', authMiddleware, async (req: any, res) => {
  const { title, column_name = 'planned', description = '', priority = 'medium' } = req.body;
  
  if (!title) {
    console.error('❌ Отсутствует название задачи');
    return res.status(400).json({ error: 'Требуется название' });
  }
  
  try {
    const taskId = uuidv4();
    
    console.log('🔵 Создание задачи:', { taskId, title, column_name, user_id: req.user.id });
    
    const { data, error } = await supabase
      .from('todos')
      .insert([{
        id: taskId,
        user_id: req.user.id,
        title,
        column_name,
        description,
        priority,
      }])
      .select()
      .single();

    if (error) {
      console.error('❌ Ошибка создания задачи:', error);
      console.error('Детали:', JSON.stringify(error, null, 2));
      throw error;
    }

    console.log('✅ Задача создана:', data);
    res.json(data);
  } catch (err: any) {
    console.error('❌ Ошибка создания задачи:', err.message);
    res.status(500).json({ error: 'Ошибка создания задачи', details: err.message });
  }
});

// PUT обновить задачу
router.put('/:id', authMiddleware, async (req: any, res) => {
  const { id } = req.params;
  const { title, description, column_name, priority } = req.body;
  
  try {
    console.log('🔵 Обновление задачи:', { id, updates: req.body });
    
    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (column_name !== undefined) updateData.column_name = column_name;
    if (priority !== undefined) updateData.priority = priority;

    const { data, error } = await supabase
      .from('todos')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', req.user.id)
      .select()
      .single();

    if (error) {
      console.error('❌ Ошибка обновления задачи:', error);
      throw error;
    }
    
    if (!data) {
      console.error('❌ Задача не найдена');
      return res.status(404).json({ error: 'Задача не найдена' });
    }

    console.log('✅ Задача обновлена:', data);
    res.json(data);
  } catch (err: any) {
    console.error('❌ Ошибка обновления задачи:', err.message);
    res.status(500).json({ error: 'Ошибка обновления' });
  }
});

// DELETE удалить задачу
router.delete('/:id', authMiddleware, async (req: any, res) => {
  const { id } = req.params;
  
  try {
    console.log('🔵 Удаление задачи:', id);
    
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id)
      .eq('user_id', req.user.id);

    if (error) {
      console.error('❌ Ошибка удаления задачи:', error);
      throw error;
    }

    console.log('✅ Задача удалена');
    res.json({ message: 'Задача удалена' });
  } catch (err: any) {
    console.error('❌ Ошибка удаления задачи:', err.message);
    res.status(500).json({ error: 'Ошибка удаления' });
  }
});

export default router;
