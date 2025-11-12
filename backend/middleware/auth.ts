import { Request, Response, NextFunction } from 'express';
import supabase from '../config/supabaseClient';

export const authMiddleware = async (req: any, res: Response, next: NextFunction) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ error: 'Не авторизован' });
  }

  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', req.session.userId)
      .single();

    if (error || !data) {
      return res.status(401).json({ error: 'Пользователь не найден' });
    }
    
    req.user = data;
    next();
  } catch (err: any) {
    console.error('Ошибка middleware авторизации:', err.message);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};
