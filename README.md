# 🚀 Sai Koushik - Ultra-Modern Glassmorphic Portfolio

An advanced, responsive, and animated personal portfolio website built with pure **HTML5**, **Modern CSS3 Glassmorphism**, **Vanilla JavaScript (ES6+)**, and direct client-side **Supabase (PostgreSQL BaaS)** database integration — with zero backend servers required!

---

## ✨ Key Features & Effects

- 🌌 **Interactive HTML5 Particle Constellation Canvas**: Real-time floating physics with mouse attraction & repulsion.
- 🔮 **Modern Glassmorphism Design System**: Layered `backdrop-filter: blur()`, glowing borders, and neon gradient palettes (Cyan, Magenta, Purple, Rose).
- ⌨️ **Dynamic Typewriter Header**: Smooth multi-title typing and backspacing animation.
- 🎴 **3D Perspective Tilt Cards**: Dynamic mouse-tracking card tilts with specular highlight effects.
- 📊 **Dynamic Skill Bars & Interactive Tabs**: Tabbed navigation across *Skills*, *Education*, and *Experience* with animated proficiency meters.
- 💼 **Project Filter & Modal System**: Category filter pills (*AI & ML*, *Algorithms*, *Web Apps*) with detail popup dialogs.
- 💻 **Interactive Developer Terminal**: Command-line shell widget with built-in commands (`about`, `skills`, `education`, `contact`, `github`, `help`, `clear`).
- ⚡ **Direct Client-to-Supabase Integration**:
  - Automatically captures contact inquiries into the Supabase `messages` table in real-time.
  - Dynamically fetches projects, skills, and timeline data from Supabase.
  - Built-in graceful offline/demo fallback mode.
- 🍞 **Modern Toast Notification System**: Real-time feedback for messages and system states.
- 📱 **100% Responsive & Accessible**: Optimized for mobile, tablet, and widescreen desktop monitors.

---

## 🛠️ Tech Stack

- **Frontend**: HTML5, Modern CSS3 (Custom properties, Grid, Flexbox, Keyframes), JavaScript (ES6+)
- **Icons & Typography**: FontAwesome 6, Google Fonts (*Space Grotesk*, *Outfit*, *JetBrains Mono*)
- **Database & Backend**: Supabase (PostgreSQL, Row Level Security, Client JS SDK v2 via CDN)
- **Deployment**: Any static host (GitHub Pages, Vercel, Netlify, Cloudflare Pages)

---

## ⚡ Connecting Your Supabase Database (2-Minute Setup)

### Step 1: Create a Free Supabase Project
1. Go to [https://supabase.com](https://supabase.com) and create a free account.
2. Click **"New project"**, name your database (e.g. `koushik-portfolio`), and set a database password.

### Step 2: Run the SQL Schema Script
1. In your Supabase Dashboard, click the **SQL Editor** icon on the left navigation bar.
2. Click **"New query"**.
3. Open [`supabase_schema.sql`](file:///e:/Portfolio/portfolio/supabase_schema.sql), copy all the SQL code, paste it into the editor, and click **"Run"**.
4. This will instantly create:
   - `messages` table (with public INSERT permission for your contact form)
   - `projects` table (with sample AI/ML, Algorithms & Web projects)
   - `skills` table (with categorized skill ratings)
   - `timeline` table (with Education & Experience records)

### Step 3: Add Your Credentials to `supabase-config.js`
1. In your Supabase Dashboard, go to **Project Settings** (gear icon) -> **API**.
2. Copy your **Project URL** and **anon public** API key.
3. Open [`supabase-config.js`](file:///e:/Portfolio/portfolio/supabase-config.js) and paste them:

```javascript
const SUPABASE_CONFIG = {
    url: 'https://your-project-id.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
};
```

4. Refresh your browser! The status badge in the top-right navbar will turn green (**Supabase Connected**) and all messages submitted via the contact form will appear directly in your Supabase dashboard under `messages`!

---

## 📁 Project Structure

```
Portfolio/
├── index.html            # Main semantic webpage with canvas, hero, about, projects, terminal, contact
├── style.css             # Glassmorphism design system, neon gradients & animations
├── script.js             # Interactive canvas, typewriter, tilt effects, tabs, modal, terminal
├── supabase-config.js    # Supabase client initializer and database query helpers
├── supabase_schema.sql   # Ready-to-run PostgreSQL schema and seed data for Supabase
├── images/               # Images and profile photo
│   ├── img.jpeg          # Profile picture
│   ├── back.jpeg
│   ├── lap.jpeg
│   └── mobile.jpeg
└── README.md             # Project documentation & setup guide
```

---

## 👤 Author

**Sai Koushik**  
- Email: [saikoushik.2108@gmail.com](mailto:saikoushik.2108@gmail.com)  
- LinkedIn: [linkedin.com/in/palthi-sai-koushik-711778369](https://www.linkedin.com/in/palthi-sai-koushik-711778369)  
- GitHub: [github.com/saikoushik2108](https://github.com/saikoushik2108)  
- X / Twitter: [@koushik_sa14436](https://x.com/koushik_sa14436)  