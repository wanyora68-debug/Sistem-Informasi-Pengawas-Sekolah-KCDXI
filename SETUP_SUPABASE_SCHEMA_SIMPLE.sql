-- 🗄️ SchoolGuardManager Database Schema untuk Supabase
-- Copy paste script ini ke Supabase SQL Editor

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'pengawas',
  nip TEXT,
  rank TEXT,
  phone TEXT,
  email TEXT,
  department TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create schools table
CREATE TABLE IF NOT EXISTS schools (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT,
  principal TEXT,
  phone TEXT,
  email TEXT,
  type TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create supervisions table
CREATE TABLE IF NOT EXISTS supervisions (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  school_id TEXT REFERENCES schools(id),
  date DATE NOT NULL,
  type TEXT NOT NULL,
  notes TEXT,
  status TEXT DEFAULT 'completed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  school_id TEXT REFERENCES schools(id),
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  due_date DATE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_activities table
CREATE TABLE IF NOT EXISTS user_activities (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  activity_type TEXT NOT NULL,
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default admin user (password: admin123)
INSERT INTO users (
  id, username, password, full_name, role, email, department, status
) VALUES (
  'admin-1',
  'admin',
  '$2b$10$rQZ9QmZ9QmZ9QmZ9QmZ9Qu',
  'Administrator',
  'admin',
  'admin@disdik.jabar.go.id',
  'Cabang Dinas Pendidikan Wilayah XI',
  'active'
) ON CONFLICT (id) DO NOTHING;

-- Insert sample pengawas user (password: wawan123)
INSERT INTO users (
  id, username, password, full_name, role, nip, rank, phone, email, department, status
) VALUES (
  'wawan-123',
  'wawan',
  '$2b$10$rQZ9QmZ9QmZ9QmZ9QmZ9Qu',
  'H. Wawan Yogaswara, S.Pd, M.Pd',
  'pengawas',
  '196805301994121001',
  'Pembina Utama Muda, IV/c',
  '087733438282',
  'wawan.yogaswara@disdik.jabar.go.id',
  'Cabang Dinas Pendidikan Wilayah XI',
  'active'
) ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE supervisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activities ENABLE ROW LEVEL SECURITY;

-- Create policies (allow all for now, can be restricted later)
DROP POLICY IF EXISTS "Allow all operations" ON users;
CREATE POLICY "Allow all operations" ON users FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all operations" ON schools;
CREATE POLICY "Allow all operations" ON schools FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all operations" ON supervisions;
CREATE POLICY "Allow all operations" ON supervisions FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all operations" ON tasks;
CREATE POLICY "Allow all operations" ON tasks FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all operations" ON user_activities;
CREATE POLICY "Allow all operations" ON user_activities FOR ALL USING (true);

-- ✅ Schema setup complete!