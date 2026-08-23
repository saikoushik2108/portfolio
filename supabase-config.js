/**
 * ==============================================================================
 * SUPABASE CLIENT CONFIGURATION & DATA LAYER (SERVERLESS)
 * ==============================================================================
 * To connect your Supabase database:
 * 1. Create a free project at https://supabase.com
 * 2. Run the SQL in `supabase_schema.sql` via Supabase SQL Editor
 * 3. Replace the placeholder values below with your Project URL & Anon Key
 * ==============================================================================
 */

const SUPABASE_CONFIG = {
    // Supabase Project URL
    url: 'https://upltiupezppaqiilskiw.supabase.co',
    
    // Supabase Public Anon Key
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwbHRpdXBlenBwYXFpaWxza2l3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc0NzMyNTIsImV4cCI6MjEwMzA0OTI1Mn0.RLS57d_uKfOa-iWrS8UKkyNV7111UN5Tl6H-vhahosQ'
};

// Global Supabase Client instance (initialized if keys are valid)
let supabaseClient = null;

function isSupabaseConfigured() {
    return (
        SUPABASE_CONFIG.url &&
        SUPABASE_CONFIG.url !== 'YOUR_SUPABASE_URL' &&
        SUPABASE_CONFIG.url.startsWith('https://') &&
        SUPABASE_CONFIG.anonKey &&
        SUPABASE_CONFIG.anonKey !== 'YOUR_SUPABASE_ANON_KEY'
    );
}

try {
    if (isSupabaseConfigured() && window.supabase) {
        supabaseClient = window.supabase.createClient(
            SUPABASE_CONFIG.url,
            SUPABASE_CONFIG.anonKey
        );
        console.log('⚡ Supabase Client initialized successfully.');
    } else {
        console.info(
            'ℹ️ Supabase credentials not set or placeholder detected. Operating in high-speed local fallback mode.'
        );
    }
} catch (err) {
    console.warn('⚠️ Could not initialize Supabase client:', err.message);
}

/* -------------------------------------------------------------------------- */
/* INITIAL DEFAULT DATA (Seeded automatically into Supabase on first run)      */
/* -------------------------------------------------------------------------- */

const FALLBACK_PROJECTS = [
    {
        id: 'p1',
        title: 'AI-Powered Predictive Analytics Engine',
        category: 'ai_ml',
        short_description: 'High-throughput Machine Learning pipeline for automated predictive modeling, feature engineering, and neural evaluation.',
        full_description: 'An advanced end-to-end Machine Learning system developed in Python. Leverages TensorFlow, Scikit-learn, and Pandas to clean raw multidimensional datasets, perform automated hyperparameter optimization, and expose high-throughput inference endpoints.',
        image_url: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=800&q=80',
        tags: ['Python', 'TensorFlow', 'Scikit-Learn', 'FastAPI', 'Pandas'],
        github_url: 'https://github.com/saikoushik2108',
        live_url: 'https://github.com/saikoushik2108',
        featured: true
    },
    {
        id: 'p2',
        title: 'Smart Vision & Object Recognition System',
        category: 'ai_ml',
        short_description: 'Computer vision framework powered by convolutional neural networks for accurate real-time classification and tracking.',
        full_description: 'Engineered a Deep Learning computer vision model using OpenCV and PyTorch. Includes custom data augmentation pipelines, fine-tuned transfer learning backbones (ResNet/MobileNet), and live video frame stream inferencing with low latency.',
        image_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
        tags: ['PyTorch', 'OpenCV', 'Deep Learning', 'Computer Vision', 'Python'],
        github_url: 'https://github.com/saikoushik2108',
        live_url: 'https://github.com/saikoushik2108',
        featured: true
    },
    {
        id: 'p3',
        title: 'Algorithmic Graph & Optimization Suite',
        category: 'algorithms',
        short_description: 'High-efficiency C++ & Java implementation of complex graph theories, dynamic programming, and data structures.',
        full_description: 'A comprehensive algorithmic library featuring optimized implementations of shortest paths (Dijkstra, A*, Floyd-Warshall), disjoint set union, AVL/Segment trees, and network flow algorithms with verified mathematical complexity guarantees.',
        image_url: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=800&q=80',
        tags: ['C++', 'Java', 'Data Structures', 'Graph Theory', 'Algorithms'],
        github_url: 'https://github.com/saikoushik2108',
        live_url: 'https://github.com/saikoushik2108',
        featured: false
    },
    {
        id: 'p4',
        title: 'Cyberpunk Portfolio & Supabase Cloud App',
        category: 'web',
        short_description: 'Ultra-modern glassmorphism portfolio with interactive 3D effects, canvas particles, and direct serverless database sync.',
        full_description: 'Built with pure HTML5, modern CSS3 animations, vanilla JavaScript ES6+, and direct client-side Supabase database integration. Demonstrates zero-server architecture with Row Level Security (RLS).',
        image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
        tags: ['HTML5', 'CSS3 Glassmorphism', 'JavaScript ES6+', 'Supabase', 'Canvas'],
        github_url: 'https://github.com/saikoushik2108',
        live_url: 'https://github.com/saikoushik2108',
        featured: true
    }
];

const FALLBACK_SKILLS = [
    { id: 's1', category: 'AI & ML', skill_name: 'Machine Learning Algorithms', proficiency_percentage: 88, icon_class: 'fa-solid fa-brain' },
    { id: 's2', category: 'AI & ML', skill_name: 'Deep Learning & Neural Nets', proficiency_percentage: 82, icon_class: 'fa-solid fa-network-wired' },
    { id: 's3', category: 'AI & ML', skill_name: 'Computer Vision & OpenCV', proficiency_percentage: 80, icon_class: 'fa-solid fa-eye' },
    { id: 's4', category: 'AI & ML', skill_name: 'Data Science (Pandas, NumPy)', proficiency_percentage: 86, icon_class: 'fa-solid fa-chart-line' },

    { id: 's5', category: 'Languages', skill_name: 'Java', proficiency_percentage: 90, icon_class: 'fa-brands fa-java' },
    { id: 's6', category: 'Languages', skill_name: 'C++', proficiency_percentage: 88, icon_class: 'fa-solid fa-code' },
    { id: 's7', category: 'Languages', skill_name: 'Python', proficiency_percentage: 85, icon_class: 'fa-brands fa-python' },
    { id: 's8', category: 'Languages', skill_name: 'JavaScript (ES6+)', proficiency_percentage: 82, icon_class: 'fa-brands fa-js' },

    { id: 's9', category: 'Core CS', skill_name: 'Data Structures & Algorithms', proficiency_percentage: 92, icon_class: 'fa-solid fa-sitemap' },
    { id: 's10', category: 'Core CS', skill_name: 'Object-Oriented Programming (OOP)', proficiency_percentage: 90, icon_class: 'fa-solid fa-cubes' },
    { id: 's11', category: 'Core CS', skill_name: 'Database Systems & SQL', proficiency_percentage: 84, icon_class: 'fa-solid fa-database' },
    { id: 's12', category: 'Core CS', skill_name: 'Problem Solving & Optimization', proficiency_percentage: 89, icon_class: 'fa-solid fa-gears' },

    { id: 's13', category: 'Web Development', skill_name: 'Modern Responsive HTML5 & CSS3', proficiency_percentage: 92, icon_class: 'fa-brands fa-html5' },
    { id: 's14', category: 'Web Development', skill_name: 'Supabase BaaS & Cloud DB', proficiency_percentage: 86, icon_class: 'fa-solid fa-bolt' },
    { id: 's15', category: 'Web Development', skill_name: 'Asynchronous APIs & JSON', proficiency_percentage: 85, icon_class: 'fa-solid fa-plug' },
    { id: 's16', category: 'Web Development', skill_name: 'Git & GitHub Version Control', proficiency_percentage: 88, icon_class: 'fa-brands fa-github' }
];

const FALLBACK_TIMELINE = [
    {
        id: 'tl1',
        type: 'education',
        title: 'B.E. Computer Science & Engineering (AI & ML)',
        institution: 'Chaitanya Bharathi Institute of Technology (CBIT), Hyderabad',
        period: '2024 - 2028',
        description: 'Undergraduate engineering student specializing in Artificial Intelligence, Machine Learning, Data Structures, and Scalable Software Systems.',
        highlights: [
            'Core focus: Deep Learning, Neural Network architectures, Data Structures & Algorithms',
            'Active contributor to collegiate coding hackathons and AI research projects'
        ]
    },
    {
        id: 'tl2',
        type: 'education',
        title: 'Intermediate (MPC - Mathematics, Physics, Chemistry)',
        institution: 'Narayana Junior College',
        period: '2022 - 2024',
        description: 'Completed higher secondary education with distinction in advanced mathematics, physics, and analytical problem-solving.',
        highlights: [
            'Extensive focus on analytical calculus, algebraic structures, and mechanics',
            'Strong performance in competitive engineering admission exams'
        ]
    },
    {
        id: 'tl3',
        type: 'education',
        title: 'Secondary School Certificate (SSC)',
        institution: 'Geetha High School',
        period: '2021 - 2022',
        description: 'Completed secondary education with top honors in academics and leadership in STEM initiatives.',
        highlights: [
            'Distinction in Mathematics and Science foundations',
            'Awarded for academic excellence and quiz competitions'
        ]
    },
    {
        id: 'tl4',
        type: 'experience',
        title: 'AI & Software Developer (Independent)',
        institution: 'Projects & Competitive Programming',
        period: '2024 - Present',
        description: 'Building practical Artificial Intelligence models, modern frontend web interfaces, and solving complex algorithmic challenges.',
        highlights: [
            'Designed and trained machine learning pipelines for real-world datasets',
            'Practicing advanced Data Structures and Algorithms on competitive platforms'
        ]
    }
];

/* -------------------------------------------------------------------------- */
/* DATABASE API FUNCTIONS (Direct Client-to-Supabase)                         */
/* -------------------------------------------------------------------------- */

/**
 * Saves a contact message directly into the Supabase `messages` table.
 * If Supabase is not configured, saves to browser localStorage and simulates success.
 */
async function submitContactMessage(messageData) {
    if (supabaseClient) {
        try {
            const { data, error } = await supabaseClient
                .from('messages')
                .insert([
                    {
                        name: messageData.name,
                        email: messageData.email,
                        subject: messageData.subject || 'Portfolio Inquiry',
                        message: messageData.message
                    }
                ]);

            if (error) throw error;
            return { success: true, mode: 'supabase', data };
        } catch (err) {
            console.error('Supabase insert error:', err);
            storeMessageLocally(messageData);
            return {
                success: true,
                mode: 'fallback',
                warning: 'Saved locally. Supabase insert failed: ' + err.message
            };
        }
    } else {
        storeMessageLocally(messageData);
        return {
            success: true,
            mode: 'demo',
            warning: 'Demo mode: Supabase keys not set yet. Message stored locally in your browser!'
        };
    }
}

function storeMessageLocally(msg) {
    try {
        const stored = JSON.parse(localStorage.getItem('portfolio_messages') || '[]');
        stored.push({ ...msg, timestamp: new Date().toISOString() });
        localStorage.setItem('portfolio_messages', JSON.stringify(stored));
    } catch (e) {
        console.warn('LocalStorage error:', e);
    }
}

/**
 * Fetches project list directly from Supabase Cloud DB
 * (Supabase is the single source of truth across all devices)
 */
async function fetchProjectsData() {
    if (supabaseClient) {
        try {
            const { data, error } = await supabaseClient
                .from('projects')
                .select('*')
                .order('created_at', { ascending: false });

            if (!error && Array.isArray(data)) {
                return data;
            }
            if (error) {
                console.warn('Supabase projects fetch error:', error.message);
            }
        } catch (err) {
            console.warn('Could not fetch projects from Supabase:', err);
        }
    }

    const localData = localStorage.getItem('portfolio_custom_projects');
    if (localData) {
        try {
            return JSON.parse(localData);
        } catch (e) {}
    }

    return FALLBACK_PROJECTS;
}

/**
 * Fetches skills data directly from Supabase Cloud DB
 * (Supabase is the single source of truth across all devices)
 */
async function fetchSkillsData() {
    if (supabaseClient) {
        try {
            const { data, error } = await supabaseClient
                .from('skills')
                .select('*')
                .order('proficiency_percentage', { ascending: false });

            if (!error && Array.isArray(data)) {
                return data;
            }
            if (error) {
                console.warn('Supabase skills fetch error:', error.message);
            }
        } catch (err) {
            console.warn('Could not fetch skills from Supabase:', err);
        }
    }

    const localData = localStorage.getItem('portfolio_custom_skills');
    if (localData) {
        try {
            return JSON.parse(localData);
        } catch (e) {}
    }

    return FALLBACK_SKILLS;
}

/**
 * Fetches timeline data directly from Supabase Cloud DB
 * (Supabase is the single source of truth across all devices)
 */
async function fetchTimelineData() {
    if (supabaseClient) {
        try {
            const { data, error } = await supabaseClient
                .from('timeline')
                .select('*')
                .order('created_at', { ascending: false });

            if (!error && Array.isArray(data)) {
                return data;
            }
            if (error) {
                console.warn('Supabase timeline fetch error:', error.message);
            }
        } catch (err) {
            console.warn('Could not fetch timeline from Supabase:', err);
        }
    }

    const localData = localStorage.getItem('portfolio_custom_timeline');
    if (localData) {
        try {
            return JSON.parse(localData);
        } catch (e) {}
    }

    return FALLBACK_TIMELINE;
}

// Export functions to global scope
window.PortfolioAPI = {
    getClient: () => supabaseClient,
    getSupabaseConfig: () => SUPABASE_CONFIG,
    isSupabaseConfigured,
    submitContactMessage,
    fetchProjectsData,
    fetchSkillsData,
    fetchTimelineData,
    FALLBACK_PROJECTS,
    FALLBACK_SKILLS,
    FALLBACK_TIMELINE
};
