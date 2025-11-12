import express from 'express';
import axios from 'axios';
import supabase from '../config/supabaseClient';

const router = express.Router();

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID!;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET!;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Redirect на GitHub авторизацию
router.get('/github', (req, res) => {
  console.log('🔵 Redirect на GitHub авторизацию');
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&scope=user`;
  res.redirect(githubAuthUrl);
});

// Получить GitHub access token
router.get('/github/callback', async (req, res) => {
  const { code } = req.query;
  if (!code) {
    console.error('❌ Отсутствует код авторизации');
    return res.status(400).send('Требуется код авторизации');
  }

  try {
    console.log('🔵 Обмен кода на access_token...');
    
    // Обмен code на access_token
    const tokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code,
      },
      { headers: { Accept: 'application/json' } }
    );

    const { access_token } = tokenResponse.data;
    if (!access_token) throw new Error('Не удалось получить токен доступа');

    console.log('✅ Access token получен');

    // Получить данные пользователя GitHub
    const userResponse = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const githubUser = userResponse.data;
    const userId = githubUser.id.toString();

    console.log('🔵 GitHub пользователь:', {
      id: userId,
      login: githubUser.login,
      name: githubUser.name,
    });

    // Проверяем, существует ли пользователь
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('github_id', userId)
      .maybeSingle(); // maybeSingle() не выдаст ошибку если не найдено

    console.log('🔵 Существующий пользователь:', existingUser ? 'Найден' : 'Не найден');

    if (!existingUser) {
      console.log('🔵 Создание нового пользователя...');
      
      // Создаём нового пользователя
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert([{
          id: userId,
          github_id: userId,
          display_name: githubUser.login || githubUser.name || 'User',
          photo: githubUser.avatar_url,
        }])
        .select()
        .single();

      if (insertError) {
        console.error('❌ Ошибка создания пользователя:', insertError);
        throw insertError;
      }

      console.log('✅ Пользователь создан:', newUser);
    } else {
      console.log('🔵 Обновление last_login...');
      
      // Обновляем last_login
      await supabase
        .from('users')
        .update({ last_login: new Date().toISOString() })
        .eq('github_id', userId);
    }

    // Устанавливаем сессию
    (req.session as any).userId = userId;
    
    console.log('✅ Сессия установлена, userId:', userId);
    console.log('✅ Редирект на frontend:', FRONTEND_URL);

    res.redirect(FRONTEND_URL);
  } catch (err: any) {
    console.error('❌ Ошибка авторизации GitHub:', err.message);
    console.error('Детали ошибки:', err.response?.data || err);
    res.status(500).send(`Ошибка авторизации: ${err.message}`);
  }
});

// Выход из системы
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ error: 'Не удалось выйти из системы' });
    res.clearCookie('connect.sid');
    res.json({ message: 'Выход выполнен' });
  });
});

// Получить текущего пользователя
router.get('/user', async (req, res) => {
  const userId = (req.session as any).userId;
  
  console.log('🔵 Проверка сессии, userId:', userId);
  
  if (!userId) {
    console.log('❌ Сессия не найдена');
    return res.status(401).json({ error: 'Не авторизован' });
  }

  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, github_id, display_name, photo, created_at, last_login')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('❌ Ошибка запроса пользователя:', error);
      throw error;
    }

    if (!data) {
      console.error('❌ Пользователь не найден в БД, userId:', userId);
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    console.log('✅ Пользователь найден:', data.display_name);
    res.json(data);
  } catch (err: any) {
    console.error('❌ Ошибка получения пользователя:', err.message);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

export default router;
