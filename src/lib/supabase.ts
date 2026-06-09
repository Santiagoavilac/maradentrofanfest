import { createClient } from "@supabase/supabase-js";

export type RegistrationStatus = "registered" | "checked_in";

export type Registration = {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string | null;
  document_id: string | null;
  companions: number;
  qr_code: string;
  status: RegistrationStatus;
  created_at: string;
  checked_in_at: string | null;
};

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;
