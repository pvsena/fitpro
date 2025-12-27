-- ============================================
-- FitPro MVP - Initial Database Schema
-- ============================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLES
-- ============================================

-- User Profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Basic info
    gender VARCHAR(20) NOT NULL CHECK (gender IN ('masculino', 'feminino', 'outro')),
    age INTEGER NOT NULL CHECK (age >= 10 AND age <= 120),
    weight DECIMAL(5,2) NOT NULL CHECK (weight > 0 AND weight < 500), -- kg
    height DECIMAL(5,2) NOT NULL CHECK (height > 0 AND height < 300), -- cm

    -- Fitness goals
    goal VARCHAR(50) NOT NULL CHECK (goal IN ('hipertrofia', 'emagrecimento', 'fortalecimento')),
    experience_level VARCHAR(20) NOT NULL CHECK (experience_level IN ('iniciante', 'intermediario', 'avancado')),
    training_days_per_week INTEGER NOT NULL CHECK (training_days_per_week >= 2 AND training_days_per_week <= 6),

    -- Equipment
    equipment VARCHAR(50) NOT NULL CHECK (equipment IN ('academia_completa', 'casa', 'halteres', 'elasticos')),

    -- Optional fields
    restrictions TEXT,
    body_measurements JSONB,
    bioimpedance JSONB,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(user_id)
);

-- Exercises table (reference data)
CREATE TABLE IF NOT EXISTS exercises (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    name_en VARCHAR(200),
    muscle_group VARCHAR(50) NOT NULL,
    secondary_muscles TEXT[],
    equipment VARCHAR(50) NOT NULL,
    difficulty VARCHAR(20) NOT NULL CHECK (difficulty IN ('iniciante', 'intermediario', 'avancado')),
    instructions TEXT,
    youtube_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workout Plans table
CREATE TABLE IF NOT EXISTS workout_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Plan metadata
    name VARCHAR(200) NOT NULL,
    description TEXT,

    -- Plan configuration (snapshot from user_profile at generation time)
    goal VARCHAR(50) NOT NULL,
    experience_level VARCHAR(20) NOT NULL,
    training_days_per_week INTEGER NOT NULL,
    equipment VARCHAR(50) NOT NULL,

    -- The actual plan (JSONB for flexibility)
    plan_data JSONB NOT NULL,

    -- Status
    is_active BOOLEAN DEFAULT TRUE,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Waitlist table
CREATE TABLE IF NOT EXISTS waitlist (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    email VARCHAR(255) NOT NULL,

    -- Interests (what premium features they're interested in)
    interests JSONB,

    -- Status
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'invited', 'converted')),

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(email)
);

-- Events table (for tracking/analytics)
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,

    -- Event info
    event_name VARCHAR(100) NOT NULL,
    event_data JSONB,

    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_workout_plans_user_id ON workout_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_workout_plans_created_at ON workout_plans(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_workout_plans_is_active ON workout_plans(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_exercises_muscle_group ON exercises(muscle_group);
CREATE INDEX IF NOT EXISTS idx_exercises_equipment ON exercises(equipment);
CREATE INDEX IF NOT EXISTS idx_events_user_id ON events(user_id);
CREATE INDEX IF NOT EXISTS idx_events_created_at ON events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_name ON events(event_name);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- User Profiles: Users can only access their own profile
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own profile" ON user_profiles
    FOR DELETE USING (auth.uid() = user_id);

-- Workout Plans: Users can only access their own plans
CREATE POLICY "Users can view own plans" ON workout_plans
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own plans" ON workout_plans
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own plans" ON workout_plans
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own plans" ON workout_plans
    FOR DELETE USING (auth.uid() = user_id);

-- Exercises: Public read, service role write
CREATE POLICY "Anyone can view exercises" ON exercises
    FOR SELECT USING (true);

-- Waitlist: Anyone can insert (for non-logged users), select restricted
CREATE POLICY "Anyone can join waitlist" ON waitlist
    FOR INSERT WITH CHECK (true);

-- Events: Users can insert their own events
CREATE POLICY "Users can insert own events" ON events
    FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to tables with updated_at
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workout_plans_updated_at
    BEFORE UPDATE ON workout_plans
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
