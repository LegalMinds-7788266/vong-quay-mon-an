import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Chỉ khởi tạo client nếu có đủ biến môi trường, để app vẫn chạy được
// (dùng fallback localStorage) khi chưa cấu hình Supabase.
export const supabase =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null
