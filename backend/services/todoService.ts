import { SupabaseClient } from '@supabase/supabase-js';

export async function getTodos(userId: string, supabase: SupabaseClient) {
  const { data, error } = await supabase.from('todos').select('*').eq('user_id', userId);
  if (error) throw new Error(error.message);
  return data;
}

export async function createTodo(todo: any, supabase: SupabaseClient) {
  const { data, error } = await supabase.from('todos').insert([todo]).select().single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateTodo(id: string, userId: string, updates: any, supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from('todos')
    .update(updates)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteTodo(id: string, userId: string, supabase: SupabaseClient) {
  const { error } = await supabase.from('todos').delete().eq('id', id).eq('user_id', userId);
  if (error) throw new Error(error.message);
}
