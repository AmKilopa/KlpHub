import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Загружаем переменные окружения
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ SUPABASE_URL и SUPABASE_ANON_KEY обязательны!');
  process.exit(1);
}

console.log('✅ Supabase подключен:', supabaseUrl);

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
