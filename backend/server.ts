import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import session from 'express-session';
import cors from 'cors';
import authRoutes from './routes/auth';
import todosRoutes from './routes/todos';

const app = express();
const PORT = process.env.PORT || 5000;

// CORS (с credentials)
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true, // ⬅️ Важно!
}));

app.use(express.json());

// Session (с правильными настройками)
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // ⬅️ Для localhost должно быть false
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    sameSite: 'lax', // ⬅️ Добавьте это
  },
}));

// Роуты
app.use('/auth', authRoutes);
app.use('/api/todos', todosRoutes);

app.get('/', (req, res) => {
  res.send('KlpHub API работает! ✅');
});

app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
});
