-- 🗄️ Supabase Database Schema Setup
-- Script untuk membuat semua tables yang dibutuhkan aplikasi

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create ENUM types
CREATE TYPE role AS ENUM ('admin', 'pengawas');
CREATE TYPE task_category AS ENUM ('Perencanaan', 'Pendampingan', 'Pelaporan');
CREATE TYPE supervision_type AS ENUM ('Akademik', 'Manajerial');

-- 👤 Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role role NOT NULL DEFAULT 'pengawas',
    nip TEXT,
    rank TEXT, -- Pangkat/Golongan/Ruang
    office_name TEXT, -- Nama Kantor
    office_address TEXT, -- Alamat Kantor
    home_address TEXT, -- Alamat Rumah
    phone TEXT, -- Nomor Telepon
    photo_url TEXT, -- Foto Profil
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 🏫 Schools table
CREATE TABLE schools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    contact TEXT NOT NULL,
    principal_name TEXT,
    principal_nip TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 📋 Tasks table
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    category task_category NOT NULL,
    description TEXT,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    photo1 TEXT,
    photo2 TEXT,
    date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 📅 Events table
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    school_id UUID REFERENCES schools(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    time TEXT NOT NULL,
    description TEXT,
    reminded BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 🔍 Supervisions table
CREATE TABLE supervisions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    type supervision_type NOT NULL,
    date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    teacher_name TEXT,
    teacher_nip TEXT,
    findings TEXT NOT NULL,
    recommendations TEXT,
    photo1 TEXT,
    photo2 TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- ➕ Additional Tasks table
CREATE TABLE additional_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    location TEXT NOT NULL,
    organizer TEXT NOT NULL,
    description TEXT NOT NULL,
    photo1 TEXT,
    photo2 TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 📊 Create indexes for better performance
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_schools_user_id ON schools(user_id);
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_date ON tasks(date);
CREATE INDEX idx_events_user_id ON events(user_id);
CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_supervisions_user_id ON supervisions(user_id);
CREATE INDEX idx_supervisions_school_id ON supervisions(school_id);
CREATE INDEX idx_supervisions_date ON supervisions(date);
CREATE INDEX idx_additional_tasks_user_id ON additional_tasks(user_id);
CREATE INDEX idx_additional_tasks_date ON additional_tasks(date);

-- 🔐 Row Level Security (RLS) - Optional but recommended
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE supervisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE additional_tasks ENABLE ROW LEVEL SECURITY;

-- Create policies (users can only access their own data)
-- Users policy
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid()::text = id::text);

-- Schools policy
CREATE POLICY "Users can manage own schools" ON schools
    FOR ALL USING (auth.uid()::text = user_id::text);

-- Tasks policy
CREATE POLICY "Users can manage own tasks" ON tasks
    FOR ALL USING (auth.uid()::text = user_id::text);

-- Events policy
CREATE POLICY "Users can manage own events" ON events
    FOR ALL USING (auth.uid()::text = user_id::text);

-- Supervisions policy
CREATE POLICY "Users can manage own supervisions" ON supervisions
    FOR ALL USING (auth.uid()::text = user_id::text);

-- Additional tasks policy
CREATE POLICY "Users can manage own additional tasks" ON additional_tasks
    FOR ALL USING (auth.uid()::text = user_id::text);

-- 👨‍💼 Create admin user (password: admin)
-- Note: Hash for 'admin' password using bcrypt
INSERT INTO users (username, password, full_name, role) VALUES 
('admin', '$2b$10$K7L1OJ45/4Y2nIvL0DXbu.b7Q5Qr4WzO.BhHb9gYRt5h8K9L0DXbu', 'Administrator', 'admin');

-- ✅ Schema setup complete!
-- Next: Import existing data from Neon database