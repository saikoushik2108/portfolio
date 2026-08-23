-- ==============================================================================
-- SUPABASE DATABASE SCHEMA FOR SAI KOUSHIK'S PORTFOLIO
-- Run this script in the Supabase SQL Editor (https://supabase.com/dashboard)
-- ==============================================================================

-- 1. MESSAGES TABLE (Stores contact form submissions)
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Allow any public visitor to insert a message into the messages table
CREATE POLICY "Allow public insert into messages" 
ON public.messages 
FOR INSERT 
WITH CHECK (true);

-- Allow authenticated users (admin) to read messages
CREATE POLICY "Allow admin read messages" 
ON public.messages 
FOR SELECT 
TO authenticated 
USING (true);


-- 2. PROJECTS TABLE (Stores portfolio project showcase)
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    category TEXT NOT NULL, -- 'ai_ml', 'web', 'algorithms', 'all'
    short_description TEXT NOT NULL,
    full_description TEXT,
    image_url TEXT,
    tags TEXT[] NOT NULL DEFAULT '{}',
    github_url TEXT,
    live_url TEXT,
    featured BOOLEAN DEFAULT false,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Allow public read access to projects
CREATE POLICY "Allow public read on projects" 
ON public.projects 
FOR SELECT 
USING (true);


-- 3. SKILLS TABLE (Stores technical skills & proficiency levels)
CREATE TABLE IF NOT EXISTS public.skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category TEXT NOT NULL, -- 'Languages', 'AI & ML', 'Web Development', 'Core CS'
    skill_name TEXT NOT NULL,
    proficiency_percentage INT DEFAULT 85,
    icon_class TEXT,
    display_order INT DEFAULT 0
);

-- Enable RLS
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;

-- Allow public read access to skills
CREATE POLICY "Allow public read on skills" 
ON public.skills 
FOR SELECT 
USING (true);


-- 4. TIMELINE TABLE (Stores Experience & Education milestones)
CREATE TABLE IF NOT EXISTS public.timeline (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL, -- 'education' or 'experience'
    title TEXT NOT NULL,
    institution TEXT NOT NULL,
    period TEXT NOT NULL,
    description TEXT,
    highlights TEXT[] DEFAULT '{}',
    display_order INT DEFAULT 0
);

-- Enable RLS
ALTER TABLE public.timeline ENABLE ROW LEVEL SECURITY;

-- Allow public read access to timeline
CREATE POLICY "Allow public read on timeline" 
ON public.timeline 
FOR SELECT 
USING (true);


-- ==============================================================================
-- INITIAL SEED DATA (Default Portfolio Content)
-- ==============================================================================

-- Seed Projects
INSERT INTO public.projects (title, category, short_description, full_description, image_url, tags, github_url, live_url, featured, display_order)
VALUES 
(
    'AI-Powered Predictive Analytics Engine', 
    'ai_ml', 
    'Machine learning pipeline for predictive modeling, automated feature extraction, and real-time inference.',
    'Built an end-to-end Machine Learning system using Python, Scikit-learn, and TensorFlow. Includes high-accuracy data preprocessing, automated feature scaling, cross-validation, and high-throughput model deployment.',
    'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=800&q=80',
    ARRAY['Python', 'TensorFlow', 'Scikit-Learn', 'FastAPI', 'Pandas'],
    'https://github.com/saikoushik2108',
    '#',
    true,
    1
),
(
    'Smart Vision & Object Classification System', 
    'ai_ml', 
    'Computer vision application utilizing convolutional neural networks for accurate real-time object classification.',
    'Engineered a Deep Learning computer vision model using OpenCV and PyTorch. Features transfer learning architectures, data augmentation pipelines, and real-time webcam video stream inferencing.',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    ARRAY['PyTorch', 'OpenCV', 'Deep Learning', 'Computer Vision'],
    'https://github.com/saikoushik2108',
    '#',
    true,
    2
),
(
    'Advanced High-Performance Algorithms Suite', 
    'algorithms', 
    'Optimized collection of Graph algorithms, Dynamic Programming solutions, and custom data structure implementations.',
    'Implemented complex algorithmic patterns including shortest path finders (Dijkstra, A*), advanced tree structures (AVL, Segment Trees), and high-efficiency sorting algorithms in C++ and Java with benchmarked time and space complexities.',
    'https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=800&q=80',
    ARRAY['C++', 'Java', 'Data Structures', 'Graph Theory', 'Optimization'],
    'https://github.com/saikoushik2108',
    '#',
    false,
    3
),
(
    'Modern Responsive Web Application', 
    'web', 
    'Interactive web platform with modern glassmorphism aesthetics, responsive layouts, and cloud database integration.',
    'Engineered a full-featured client-side web application featuring dynamic state management, asynchronous API integrations, real-time database reactivity with Supabase, and smooth 60fps CSS animations.',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    ARRAY['HTML5', 'CSS3', 'JavaScript (ES6+)', 'Supabase', 'REST API'],
    'https://github.com/saikoushik2108',
    '#',
    true,
    4
);

-- Seed Skills
INSERT INTO public.skills (category, skill_name, proficiency_percentage, icon_class, display_order)
VALUES
('Languages', 'Java', 90, 'fa-brands fa-java', 1),
('Languages', 'C++', 88, 'fa-solid fa-code', 2),
('Languages', 'Python', 85, 'fa-brands fa-python', 3),
('Languages', 'JavaScript (ES6+)', 82, 'fa-brands fa-js', 4),

('AI & ML', 'Machine Learning Algorithms', 85, 'fa-solid fa-brain', 1),
('AI & ML', 'Deep Learning & Neural Networks', 80, 'fa-solid fa-network-wired', 2),
('AI & ML', 'Computer Vision (OpenCV)', 78, 'fa-solid fa-eye', 3),
('AI & ML', 'Data Analysis (NumPy, Pandas)', 85, 'fa-solid fa-chart-line', 4),

('Core CS', 'Data Structures & Algorithms', 92, 'fa-solid fa-sitemap', 1),
('Core CS', 'Object-Oriented Programming (OOP)', 90, 'fa-solid fa-cubes', 2),
('Core CS', 'Database Design & SQL', 82, 'fa-solid fa-database', 3),
('Core CS', 'Operating Systems & Networking', 80, 'fa-solid fa-microchip', 4),

('Web Development', 'Modern HTML5 & CSS3', 90, 'fa-brands fa-html5', 1),
('Web Development', 'Supabase (BaaS & PostgreSQL)', 85, 'fa-solid fa-bolt', 2),
('Web Development', 'RESTful APIs & Asynchronous JS', 84, 'fa-solid fa-plug', 3),
('Web Development', 'Git & GitHub Version Control', 88, 'fa-brands fa-github', 4);

-- Seed Timeline (Education & Experience)
INSERT INTO public.timeline (type, title, institution, period, description, highlights, display_order)
VALUES
(
    'education',
    'B.E. in Computer Science & Engineering (AI & ML)',
    'Chaitanya Bharathi Institute of Technology (CBIT), Hyderabad',
    '2024 - 2028',
    'Pursuing specialized undergraduate studies in Artificial Intelligence, Machine Learning, Data Structures, Algorithms, and Core Computer Science fundamentals.',
    ARRAY['Focusing on AI/ML models, Advanced Data Structures, and Software Architecture', 'Active member of technical coding clubs and hackathon teams'],
    1
),
(
    'education',
    'Intermediate (MPC - Mathematics, Physics, Chemistry)',
    'Narayana Junior College',
    '2022 - 2024',
    'Completed higher secondary education with strong excellence in analytical mathematics, physics, and logical reasoning.',
    ARRAY['Deep foundation in calculus, coordinate geometry, and physical sciences', 'Excelled in state and national engineering entrance preparations'],
    2
),
(
    'education',
    'Secondary School Certificate (SSC)',
    'Geetha High School',
    '2021 - 2022',
    'Completed foundational schooling with outstanding academic distinction and leadership in science & mathematics competitions.',
    ARRAY['Academic topper with strong fundamentals in computing and mathematics', 'Participated in regional science exhibitions and quizzes'],
    3
),
(
    'experience',
    'Aspiring AI & Software Developer',
    'Independent Projects & Research',
    '2024 - Present',
    'Actively designing, implementing, and shipping real-world machine learning models, algorithmic solutions, and modern full-stack web applications.',
    ARRAY['Building end-to-end ML pipelines and intelligent data processing apps', 'Practicing advanced competitive programming on LeetCode & CodeChef'],
    1
);
