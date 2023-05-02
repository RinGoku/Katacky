import { createServerComponentSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { headers, cookies } from "next/headers";

export const createClientServer = () =>
  createServerComponentSupabaseClient({
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    headers,
    cookies,
  });