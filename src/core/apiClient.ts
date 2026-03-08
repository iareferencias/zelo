/**
 * CRUD direto via Supabase Client.
 * Sem API Layer intermediária.
 */
import { supabase } from "@/integrations/supabase/client";

export async function list(table, params) {
  let query = supabase.from(table).select("*");
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) query = query.eq(key, value);
    }
  }
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function get(table, id) {
  const { data, error } = await supabase.from(table).select("*").eq("id", id).single();
  if (error) throw new Error(error.message);
  return data;
}

export async function create(table, data) {
  const { data: result, error } = await supabase.from(table).insert(data).select().single();
  if (error) throw new Error(error.message);
  return result;
}

export async function update(table, id, data) {
  const { data: result, error } = await supabase.from(table).update(data).eq("id", id).select().single();
  if (error) throw new Error(error.message);
  return result;
}

export async function remove(table, id) {
  const { error } = await supabase.from(table).delete().eq("id", id);
  if (error) throw new Error(error.message);
}
