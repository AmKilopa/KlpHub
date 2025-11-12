import { Request, Response } from 'express';
import pool from '../config/supabaseClient';

export const getTodos = async (req: any, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT id, user_id, title, description, column_name, priority, created_at, updated_at, completed_at, deadline, position FROM todos WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err: any) {
    console.error('Ошибка получения задач:', err.message);
    res.status(500).json({ error: 'Ошибка получения задач' });
  }
};

export const createTodo = async (req: any, res: Response) => {
  const { title, column_name = 'planned', description = '', priority = 'medium' } = req.body;
  if (!title) return res.status(400).json({ error: 'Требуется название' });
  
  try {
    const result = await pool.query(
      'INSERT INTO todos (id, user_id, title, column_name, description, priority, created_at) VALUES (gen_random_uuid()::text, $1, $2, $3, $4, $5, NOW()) RETURNING *',
      [req.user.id, title, column_name, description, priority]
    );
    res.json(result.rows[0]);
  } catch (err: any) {
    console.error('Ошибка создания задачи:', err.message);
    res.status(500).json({ error: 'Ошибка создания задачи' });
  }
};

export const updateTodo = async (req: any, res: Response) => {
  const { id } = req.params;
  const { title, description, column_name, priority } = req.body;
  
  try {
    const result = await pool.query(
      'UPDATE todos SET title = COALESCE($1, title), description = COALESCE($2, description), column_name = COALESCE($3, column_name), priority = COALESCE($4, priority) WHERE id = $5 AND user_id = $6 RETURNING *',
      [title, description, column_name, priority, id, req.user.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Задача не найдена' });
    }
    
    res.json(result.rows[0]);
  } catch (err: any) {
    console.error('Ошибка обновления задачи:', err.message);
    res.status(500).json({ error: 'Ошибка обновления' });
  }
};

export const deleteTodo = async (req: any, res: Response) => {
  const { id } = req.params;
  
  try {
    const result = await pool.query(
      'DELETE FROM todos WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, req.user.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Задача не найдена' });
    }
    
    res.json({ message: 'Задача удалена' });
  } catch (err: any) {
    console.error('Ошибка удаления задачи:', err.message);
    res.status(500).json({ error: 'Ошибка удаления' });
  }
};
