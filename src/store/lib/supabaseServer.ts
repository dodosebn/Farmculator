// lib/supabaseServer.ts
import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL!;
const serviceRoleKey = import.meta.env.VITE_SUPABAE_SERVICE_KEY!;

if (!url || !serviceRoleKey) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
}

export const supabaseAdmin = createClient(url, serviceRoleKey, {
  auth: { persistSession: false }
});
