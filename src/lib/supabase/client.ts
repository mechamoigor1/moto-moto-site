import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";
import { supabaseAnonKey, supabaseUrl } from "./env";

export function createClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Supabase não configurado. Defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY em .env.local."
    );
  }
  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
}
