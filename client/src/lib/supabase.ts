import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://fmxeboullgcewzjpqlsupabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZteGVib3VsbGdjZXd6anBxbCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzM0NTk5NzI4LCJleHAiOjIwNTAxNzU3Mjh9.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface User {
  id: string;
  username: string;
  password: string;
  role: 'admin' | 'user';
  name: string;
  nip?: string;
  position?: string;
  photo?: string;
  created_at?: string;
}

export interface School {
  id: string;
  name: string;
  address: string;
  principal: string;
  phone?: string;
  email?: string;
  created_at?: string;
}

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  date: string;
  completed: boolean;
  photo?: string;
  created_at?: string;
}

export interface Supervision {
  id: string;
  user_id: string;
  school_id: string;
  type: 'academic' | 'managerial';
  date: string;
  findings?: string;
  recommendations?: string;
  photo?: string;
  created_at?: string;
}

export interface AdditionalTask {
  id: string;
  user_id: string;
  school_id: string;
  title: string;
  description?: string;
  date: string;
  status: 'pending' | 'completed';
  photo?: string;
  created_at?: string;
}