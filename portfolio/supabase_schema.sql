-- ==============================================================================
-- SAI KOUSHIK'S PORTFOLIO - COMPLETE SUPABASE POSTGRESQL SCHEMA & SECURITY RULES
-- ==============================================================================
-- Run this entire script in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/upltiupezppaqiilskiw/sql
-- ==============================================================================

-- 1. MESSAGES TABLE (Contact form inquiries)
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT DEFAULT 'Portfolio Message',
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT false,
    archived BOOLEAN DEFAULT false
);

-- Enable RLS for messages
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Drop old policies if they exist to avoid duplication
DROP POLICY IF EXISTS "Allow public insert into messages" ON public.messages;
DROP POLICY IF EXISTS "Allow authenticated read messages" ON public.messages;
DROP POLICY IF EXISTS "Allow authenticated update messages" ON public.messages;
DROP POLICY IF EXISTS "Allow authenticated delete messages" ON public.messages;

-- RLS: Anyone can submit a message (public contact form)
CREATE POLICY "Allow public insert into messages"
    ON public.messages
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- RLS: ONLY logged-in Admin can view/read messages
CREATE POLICY "Allow authenticated read messages"
    ON public.messages
    FOR SELECT
    TO authenticated
    USING (true);

-- RLS: ONLY logged-in Admin can update messages (e.g. mark as read)
CREATE POLICY "Allow authenticated update messages"
    ON public.messages
    FOR UPDATE
    TO authenticated
    USING (true);

-- RLS: ONLY logged-in Admin can delete messages
CREATE POLICY "Allow authenticated delete messages"
    ON public.messages
    FOR DELETE
    TO authenticated
    USING (true);


-- 2. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.projects (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('ai_ml', 'algorithms', 'web')),
    short_description TEXT NOT NULL,
    full_description TEXT,
    tags TEXT[] DEFAULT '{}',
    image_url TEXT,
    github_url TEXT DEFAULT '#',
    live_url TEXT DEFAULT '#',
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to projects" ON public.projects;
DROP POLICY IF EXISTS "Allow authenticated full access to projects" ON public.projects;

-- Public can view projects
CREATE POLICY "Allow public read access to projects"
    ON public.projects
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- Admin can add, update, delete projects
CREATE POLICY "Allow authenticated full access to projects"
    ON public.projects
    FOR ALL
    TO authenticated
    USING (true);


-- 3. SKILLS TABLE
CREATE TABLE IF NOT EXISTS public.skills (
    id TEXT PRIMARY KEY,
    category TEXT NOT NULL,
    skill_name TEXT NOT NULL,
    proficiency_percentage INTEGER NOT NULL CHECK (proficiency_percentage BETWEEN 1 AND 100),
    icon_class TEXT DEFAULT 'fa-solid fa-code',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to skills" ON public.skills;
DROP POLICY IF EXISTS "Allow authenticated full access to skills" ON public.skills;

-- Public can view skills
CREATE POLICY "Allow public read access to skills"
    ON public.skills
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- Admin can add, update, delete skills
CREATE POLICY "Allow authenticated full access to skills"
    ON public.skills
    FOR ALL
    TO authenticated
    USING (true);


-- 4. TIMELINE TABLE (Education & Experience)
CREATE TABLE IF NOT EXISTS public.timeline (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL CHECK (type IN ('education', 'experience')),
    title TEXT NOT NULL,
    institution TEXT NOT NULL,
    period TEXT NOT NULL,
    description TEXT,
    highlights TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.timeline ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to timeline" ON public.timeline;
DROP POLICY IF EXISTS "Allow authenticated full access to timeline" ON public.timeline;

-- Public can view timeline
CREATE POLICY "Allow public read access to timeline"
    ON public.timeline
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- Admin can add, update, delete timeline entries
CREATE POLICY "Allow authenticated full access to timeline"
    ON public.timeline
    FOR ALL
    TO authenticated
    USING (true);


-- ==============================================================================
-- INITIAL SEED DATA FOR SAI KOUSHIK
-- ==============================================================================

-- Projects Seed
INSERT INTO public.projects (id, title, category, short_description, full_description, tags, image_url, github_url, live_url, featured)
VALUES
(
    'p1',
    'AI Image Segmentation & Object Tracking',
    'ai_ml',
    'Computer vision system for real-time multi-class object detection and spatial boundary segmentation.',
    'Built an end-to-end computer vision pipeline utilizing modern deep learning architectures. It identifies and tracks dynamic entities across live camera feeds with high frame-rate performance and spatial segmentation overlays.',
    ARRAY['Python', 'PyTorch', 'OpenCV', 'YOLO', 'Deep Learning'],
    'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=600&auto=format&fit=crop&q=80',
    'https://github.com/saikoushik2108',
    '#',
    true
),
(
    'p2',
    'Algorithmic Route Optimization Engine',
    'algorithms',
    'Graph-based route discovery tool implementing Dijkstra, A*, and Bellman-Ford algorithms.',
    'Engineered an interactive route simulation engine that models complex multi-node transit networks. Features benchmark visualizers that compare time complexity, memory allocation, and shortest paths in real-time.',
    ARRAY['C++', 'Data Structures', 'Graph Algorithms', 'Complexity Analysis'],
    'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80',
    'https://github.com/saikoushik2108',
    '#',
    false
),
(
    'p3',
    'Cloud-Powered Serverless Portfolio',
    'web',
    'Modern glassmorphism responsive portfolio with client-side Supabase database integration.',
    'Designed a high-performance web experience featuring fluid canvas waves, matrix decrypt animations, dark/light styling, and serverless direct Supabase persistence with zero backend server overhead.',
    ARRAY['HTML5', 'CSS3', 'JavaScript', 'Supabase', 'SQL'],
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80',
    'https://github.com/saikoushik2108',
    '#',
    true
)
ON CONFLICT (id) DO NOTHING;

-- Skills Seed
INSERT INTO public.skills (id, category, skill_name, proficiency_percentage, icon_class)
VALUES
('s1', 'Programming Languages', 'Python (AI/ML & Automation)', 90, 'fa-brands fa-python'),
('s2', 'Programming Languages', 'C / C++ (Algorithms & Core CS)', 88, 'fa-solid fa-code'),
('s3', 'Programming Languages', 'Java (OOP & DSA)', 82, 'fa-brands fa-java'),
('s4', 'Programming Languages', 'JavaScript / TypeScript', 85, 'fa-brands fa-js'),

('s5', 'AI, ML & Data Science', 'Deep Learning & Neural Networks', 84, 'fa-solid fa-brain'),
('s6', 'AI, ML & Data Science', 'Computer Vision (OpenCV)', 80, 'fa-solid fa-eye'),
('s7', 'AI, ML & Data Science', 'NumPy, Pandas & Scikit-Learn', 88, 'fa-solid fa-chart-line'),

('s8', 'Core CS & Databases', 'Data Structures & Algorithms', 92, 'fa-solid fa-network-wired'),
('s9', 'Core CS & Databases', 'PostgreSQL / Supabase (Serverless)', 86, 'fa-solid fa-database'),
('s10', 'Core CS & Databases', 'Object Oriented Programming (OOP)', 90, 'fa-solid fa-cubes')
ON CONFLICT (id) DO NOTHING;

-- Timeline Seed
INSERT INTO public.timeline (id, type, title, institution, period, description, highlights)
VALUES
(
    't1',
    'education',
    'B.E. Computer Science & Engineering (AI & ML)',
    'Chaitanya Bharathi Institute of Technology (CBIT), Hyderabad',
    '2024 - 2028',
    'Pursuing undergraduate studies with strong focus on Artificial Intelligence, Deep Learning architectures, and foundational computer science algorithms.',
    ARRAY['Consistent top-tier academic score (9.5+ CGPA)', 'Active technical contributor in college computing and AI societies', 'Specialized coursework: Data Structures, Advanced Algorithms, Neural Networks']
),
(
    't2',
    'education',
    'Intermediate (MPC - Maths, Physics, Chemistry)',
    'Narayana Junior College, Hyderabad',
    '2022 - 2024',
    'Completed higher secondary education with top honors in competitive mathematics and physical sciences.',
    ARRAY['Graduated with high distinction (95%+)', 'Deep mathematical problem solving and calculus foundation']
),
(
    't3',
    'education',
    'Secondary School Certificate (SSC)',
    'Geetha High School, Hyderabad',
    '2021 - 2022',
    'Graduated with distinction and academic excellence awards.',
    ARRAY['Grade: 10.0 / 10.0 GPA', 'Participated in regional science exhibitions and mathematics Olympiads']
)
ON CONFLICT (id) DO NOTHING;
