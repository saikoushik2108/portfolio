/**
 * ==============================================================================
 * SAI KOUSHIK'S ADMIN DASHBOARD - CMS LOGIC & SECURE SUPABASE AUTH ENGINE
 * ==============================================================================
 */

// Authorized Admin Email (Ensures only Sai Koushik can access)
const AUTHORIZED_ADMIN_EMAIL = 'saikoushik.2108@gmail.com';

document.addEventListener('DOMContentLoaded', async () => {
    initAuthAndSession();
    initTabNavigation();
    initModals();
    initSearchAndFilters();
    initSyncCloudButton();
});

let currentSession = null;
let allAdminMessages = [];
let allAdminProjects = [];
let allAdminSkills = [];
let allAdminTimeline = [];

function getSupabase() {
    let client = window.PortfolioAPI ? window.PortfolioAPI.getClient() : null;
    if (!client && window.supabase && window.PortfolioAPI) {
        const config = window.PortfolioAPI.getSupabaseConfig();
        client = window.supabase.createClient(config.url, config.anonKey);
    }
    return client;
}

/* -------------------------------------------------------------------------- */
/* 1. AUTHENTICATION & SESSION MANAGEMENT                                     */
/* -------------------------------------------------------------------------- */
function initAuthAndSession() {
    const loginForm = document.getElementById('login-form');
    const logoutBtn = document.getElementById('logout-btn');

    const supabase = getSupabase();
    if (!supabase) {
        showToast('Supabase client could not be initialized.', 'error');
        return;
    }

    // Check existing session
    supabase.auth.getSession().then(({ data, error }) => {
        if (data && data.session) {
            validateAndHandleSession(data.session);
        } else {
            showLoginScreen();
        }
    }).catch((err) => {
        console.error('Session check error:', err);
        showLoginScreen();
    });

    // Listen to auth changes
    supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' && session) {
            validateAndHandleSession(session);
        } else if (event === 'SIGNED_OUT') {
            showLoginScreen();
        }
    });

    // Password Visibility Toggle
    const togglePassBtn = document.getElementById('toggle-password-btn');
    const passInput = document.getElementById('login-password');
    if (togglePassBtn && passInput) {
        togglePassBtn.addEventListener('click', () => {
            const isPassword = passInput.getAttribute('type') === 'password';
            passInput.setAttribute('type', isPassword ? 'text' : 'password');
            togglePassBtn.innerHTML = isPassword ? '<i class="fa-regular fa-eye-slash"></i>' : '<i class="fa-regular fa-eye"></i>';
        });
    }

    // Interactive 3D Tilt on Login Card
    const loginCard = document.querySelector('.login-card');
    if (loginCard) {
        loginCard.addEventListener('mousemove', (e) => {
            const rect = loginCard.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -6;
            const rotateY = ((x - centerX) / centerX) * 6;
            loginCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });

        loginCard.addEventListener('mouseleave', () => {
            loginCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        });
    }

    // Form submit (Sign In)
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value.trim();
            const password = document.getElementById('login-password').value;
            const loginBtn = document.getElementById('login-btn');

            if (!email || !password) {
                showToast('Please enter your admin email and password.', 'error');
                return;
            }

            loginBtn.disabled = true;
            loginBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Authenticating...';

            try {
                const { data, error } = await supabase.auth.signInWithPassword({
                    email: email,
                    password: password
                });

                if (error) {
                    showToast('Sign in failed: ' + error.message, 'error');
                } else if (data.session) {
                    validateAndHandleSession(data.session);
                }
            } catch (err) {
                showToast('Authentication error: ' + err.message, 'error');
            } finally {
                loginBtn.disabled = false;
                loginBtn.innerHTML = '<i class="fa-solid fa-arrow-right-to-bracket"></i> Sign In to Dashboard';
            }
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            await supabase.auth.signOut();
            showToast('Signed out successfully.', 'info');
        });
    }
}

function validateAndHandleSession(session) {
    if (!session || !session.user) {
        showLoginScreen();
        return;
    }

    const userEmail = session.user.email ? session.user.email.toLowerCase() : '';
    
    // Strict admin email check
    if (userEmail !== AUTHORIZED_ADMIN_EMAIL.toLowerCase()) {
        const supabase = getSupabase();
        if (supabase) supabase.auth.signOut();
        showToast('Access Denied: This account is not authorized as Admin.', 'error');
        showLoginScreen();
        return;
    }

    currentSession = session;
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('admin-dashboard').style.display = 'grid';

    const emailEl = document.getElementById('admin-user-email');
    if (emailEl) {
        emailEl.textContent = session.user.email;
    }

    showToast('Welcome, Sai Koushik!', 'success');
    loadAllDashboardData();
}

function showLoginScreen() {
    currentSession = null;
    document.getElementById('login-screen').style.display = 'flex';
    document.getElementById('admin-dashboard').style.display = 'none';
}

/* -------------------------------------------------------------------------- */
/* 2. TAB NAVIGATION & SIDEBAR                                               */
/* -------------------------------------------------------------------------- */
function initTabNavigation() {
    const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
    const tabPanes = document.querySelectorAll('.admin-tab-pane');
    const pageTitle = document.getElementById('page-title');
    const sidebar = document.querySelector('.admin-sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');

    const titles = {
        'tab-overview': 'Dashboard Overview',
        'tab-messages': 'Messages Inbox',
        'tab-projects': 'Portfolio Projects Manager',
        'tab-skills': 'Skills & Profile Manager',
        'tab-experience': 'Experience & Education Timeline'
    };

    function switchTab(tabId) {
        navItems.forEach((item) => {
            if (item.getAttribute('data-tab') === tabId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        tabPanes.forEach((pane) => {
            if (pane.id === tabId) {
                pane.classList.add('active');
            } else {
                pane.classList.remove('active');
            }
        });

        if (pageTitle && titles[tabId]) {
            pageTitle.textContent = titles[tabId];
        }

        if (sidebar && window.innerWidth <= 900) {
            sidebar.classList.remove('open');
        }
    }

    navItems.forEach((btn) => {
        btn.addEventListener('click', () => {
            switchTab(btn.getAttribute('data-tab'));
        });
    });

    document.addEventListener('click', (e) => {
        const switchBtn = e.target.closest('.switch-tab-btn');
        if (switchBtn) {
            const targetTab = switchBtn.getAttribute('data-tab');
            if (targetTab) switchTab(targetTab);
        }
    });

    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    }
}

/* -------------------------------------------------------------------------- */
/* 3. FETCH & HYDRATE DASHBOARD DATA                                         */
/* -------------------------------------------------------------------------- */
async function loadAllDashboardData() {
    await Promise.all([
        loadMessages(),
        loadProjects(),
        loadSkills(),
        loadTimeline()
    ]);
    updateOverviewCounters();
}

async function loadMessages() {
    const supabase = getSupabase();
    const container = document.getElementById('messages-list-container');
    const recentContainer = document.getElementById('overview-recent-messages');
    if (!container) return;

    try {
        if (supabase) {
            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .order('created_at', { ascending: false });

            if (!error && Array.isArray(data)) {
                allAdminMessages = data;
                renderMessages(allAdminMessages);
                renderRecentMessages(allAdminMessages.slice(0, 4), recentContainer);
                return;
            }
        }
    } catch (err) {
        console.warn('Supabase messages query error:', err.message);
    }

    // Local fallback
    try {
        allAdminMessages = JSON.parse(localStorage.getItem('portfolio_messages') || '[]');
        renderMessages(allAdminMessages);
        renderRecentMessages(allAdminMessages.slice(0, 4), recentContainer);
    } catch (e) {
        container.innerHTML = '<p class="empty-state">No messages received yet.</p>';
    }
}

function renderMessages(messages) {
    const container = document.getElementById('messages-list-container');
    if (!container) return;

    if (!messages || messages.length === 0) {
        container.innerHTML = '<p class="empty-state">No messages in inbox yet.</p>';
        return;
    }

    container.innerHTML = messages.map((m) => {
        const dateStr = m.created_at ? new Date(m.created_at).toLocaleString([], {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }) : (m.timestamp ? new Date(m.timestamp).toLocaleDateString() : 'Recent');

        const initial = (m.name || 'U').charAt(0).toUpperCase();

        return `
            <div class="message-item-card glass-card ${m.read ? '' : 'unread'}" data-id="${m.id || ''}">
                <div class="msg-header">
                    <div class="msg-sender-info">
                        <div class="sender-avatar">${initial}</div>
                        <div>
                            <h4>${escapeHTML(m.name)}</h4>
                            <a href="mailto:${escapeHTML(m.email)}">${escapeHTML(m.email)}</a>
                        </div>
                    </div>
                    <div class="msg-meta">
                        <span><i class="fa-regular fa-clock"></i> ${dateStr}</span>
                        ${!m.read ? '<span class="badge-pill">NEW</span>' : ''}
                    </div>
                </div>
                <div class="msg-subject"><i class="fa-solid fa-tag"></i> ${escapeHTML(m.subject || 'Portfolio Message')}</div>
                <div class="msg-body">${escapeHTML(m.message)}</div>
                <div class="msg-actions">
                    <a href="mailto:${escapeHTML(m.email)}?subject=Re: ${encodeURIComponent(m.subject || 'Portfolio Inquiry')}" class="btn btn-outline btn-sm">
                        <i class="fa-solid fa-reply"></i> Reply
                    </a>
                    ${!m.read && m.id ? `
                        <button class="btn btn-outline btn-sm mark-read-btn" data-id="${m.id}">
                            <i class="fa-solid fa-check"></i> Mark Read
                        </button>
                    ` : ''}
                    ${m.id ? `
                    <button class="btn-danger-sm delete-msg-btn" data-id="${m.id}">
                        <i class="fa-solid fa-trash-can"></i> Delete
                    </button>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');

    attachMessageActionListeners();
}

function renderRecentMessages(messages, container) {
    if (!container) return;
    if (!messages || messages.length === 0) {
        container.innerHTML = '<p class="empty-state">No inquiries received yet.</p>';
        return;
    }

    container.innerHTML = messages.map((m) => `
        <div class="mini-item" style="padding: 10px 0; border-bottom: 1px solid var(--border-glass);">
            <div style="display: flex; justify-content: space-between; font-weight: 600; font-size: 0.9rem;">
                <span>${escapeHTML(m.name)}</span>
                <span style="font-size: 0.78rem; color: var(--text-muted);">${m.created_at ? new Date(m.created_at).toLocaleDateString() : 'Recent'}</span>
            </div>
            <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${escapeHTML(m.message)}</p>
        </div>
    `).join('');
}

function attachMessageActionListeners() {
    document.querySelectorAll('.mark-read-btn').forEach((btn) => {
        btn.addEventListener('click', async () => {
            const msgId = btn.getAttribute('data-id');
            const supabase = getSupabase();
            try {
                if (supabase) {
                    await supabase.from('messages').update({ read: true }).eq('id', msgId);
                }
                const idx = allAdminMessages.findIndex((m) => m.id === msgId);
                if (idx >= 0) allAdminMessages[idx].read = true;
                showToast('Marked as read', 'success');
                renderMessages(allAdminMessages);
                updateOverviewCounters();
            } catch (err) {
                showToast('Failed to update: ' + err.message, 'error');
            }
        });
    });

    document.querySelectorAll('.delete-msg-btn').forEach((btn) => {
        btn.addEventListener('click', async () => {
            if (!confirm('Are you sure you want to delete this message?')) return;
            const msgId = btn.getAttribute('data-id');
            const supabase = getSupabase();
            try {
                if (supabase) {
                    await supabase.from('messages').delete().eq('id', msgId);
                }
                allAdminMessages = allAdminMessages.filter((m) => m.id !== msgId);
                showToast('Message deleted', 'info');
                renderMessages(allAdminMessages);
                updateOverviewCounters();
            } catch (err) {
                showToast('Failed to delete: ' + err.message, 'error');
            }
        });
    });
}

/* -------------------------------------------------------------------------- */
/* 4. PROJECTS CRUD (DIRECT SUPABASE CLOUD SYNC & PERMANENT DELETIONS)         */
/* -------------------------------------------------------------------------- */
async function loadProjects() {
    const supabase = getSupabase();
    const container = document.getElementById('admin-projects-grid');
    if (!container) return;

    const isCustomized = localStorage.getItem('portfolio_projects_customized') === 'true';

    if (supabase) {
        try {
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .order('created_at', { ascending: false });

            if (!error && Array.isArray(data)) {
                if (data.length === 0 && !isCustomized && window.PortfolioAPI && window.PortfolioAPI.FALLBACK_PROJECTS) {
                    console.log('Seeding initial projects into Supabase Cloud DB...');
                    for (const p of window.PortfolioAPI.FALLBACK_PROJECTS) {
                        await supabase.from('projects').upsert(p);
                    }
                    const res = await supabase.from('projects').select('*').order('created_at', { ascending: false });
                    allAdminProjects = res.data || window.PortfolioAPI.FALLBACK_PROJECTS;
                } else {
                    allAdminProjects = data;
                }

                localStorage.setItem('portfolio_custom_projects', JSON.stringify(allAdminProjects));
                renderProjects(allAdminProjects);
                updateOverviewCounters();
                return;
            }
        } catch (err) {
            console.warn('Could not fetch projects from Supabase:', err.message);
        }
    }

    const localData = localStorage.getItem('portfolio_custom_projects');
    if (localData) {
        try {
            allAdminProjects = JSON.parse(localData);
        } catch (e) {
            allAdminProjects = window.PortfolioAPI ? window.PortfolioAPI.FALLBACK_PROJECTS : [];
        }
    } else {
        allAdminProjects = window.PortfolioAPI ? window.PortfolioAPI.FALLBACK_PROJECTS : [];
    }

    renderProjects(allAdminProjects);
}

function renderProjects(projects) {
    const container = document.getElementById('admin-projects-grid');
    if (!container) return;

    if (!projects || projects.length === 0) {
        container.innerHTML = '<p class="empty-state">No projects found. Click "+ Add Project" to create one.</p>';
        return;
    }

    container.innerHTML = projects.map((p) => `
        <div class="admin-project-card glass-card">
            <img src="${p.image_url || 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=500'}" alt="${p.title}" class="admin-proj-img">
            <div class="admin-proj-header">
                <span class="category-tag">${p.category}</span>
                ${p.featured ? '<span style="font-size:0.75rem; color:var(--magenta); font-weight:700;"><i class="fa-solid fa-star"></i> Featured</span>' : ''}
            </div>
            <h3>${escapeHTML(p.title)}</h3>
            <p class="admin-proj-desc">${escapeHTML(p.short_description)}</p>
            <div class="admin-proj-actions">
                <button class="btn btn-outline btn-sm edit-proj-btn" data-id="${p.id}">
                    <i class="fa-solid fa-pen-to-square"></i> Edit
                </button>
                <button class="btn-danger-sm delete-proj-btn" data-id="${p.id}">
                    <i class="fa-solid fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `).join('');

    attachProjectActionListeners();
}

function attachProjectActionListeners() {
    document.querySelectorAll('.edit-proj-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            const project = allAdminProjects.find((p) => p.id === id);
            if (project) openProjectModalForEdit(project);
        });
    });

    document.querySelectorAll('.delete-proj-btn').forEach((btn) => {
        btn.addEventListener('click', async () => {
            if (!confirm('Are you sure you want to permanently delete this project?')) return;
            const id = btn.getAttribute('data-id');
            const supabase = getSupabase();
            try {
                if (supabase) {
                    const { error } = await supabase.from('projects').delete().eq('id', id);
                    if (error) throw error;
                }
                allAdminProjects = allAdminProjects.filter((p) => p.id !== id);

                localStorage.setItem('portfolio_projects_customized', 'true');
                localStorage.setItem('portfolio_custom_projects', JSON.stringify(allAdminProjects));
                window.dispatchEvent(new Event('storage'));

                showToast('Project deleted permanently from Supabase!', 'success');
                renderProjects(allAdminProjects);
                updateOverviewCounters();
            } catch (err) {
                showToast('Error deleting project from cloud: ' + err.message, 'error');
            }
        });
    });
}

/* -------------------------------------------------------------------------- */
/* 5. SKILLS CRUD (DIRECT SUPABASE CLOUD SYNC & PERMANENT DELETIONS)           */
/* -------------------------------------------------------------------------- */
async function loadSkills() {
    const supabase = getSupabase();
    const container = document.getElementById('admin-skills-container');
    if (!container) return;

    const isCustomized = localStorage.getItem('portfolio_skills_customized') === 'true';

    if (supabase) {
        try {
            const { data, error } = await supabase
                .from('skills')
                .select('*')
                .order('proficiency_percentage', { ascending: false });

            if (!error && Array.isArray(data)) {
                if (data.length === 0 && !isCustomized && window.PortfolioAPI && window.PortfolioAPI.FALLBACK_SKILLS) {
                    console.log('Seeding initial skills into Supabase Cloud DB...');
                    for (const s of window.PortfolioAPI.FALLBACK_SKILLS) {
                        await supabase.from('skills').upsert(s);
                    }
                    const res = await supabase.from('skills').select('*').order('proficiency_percentage', { ascending: false });
                    allAdminSkills = res.data || window.PortfolioAPI.FALLBACK_SKILLS;
                } else {
                    allAdminSkills = data;
                }

                localStorage.setItem('portfolio_custom_skills', JSON.stringify(allAdminSkills));
                renderSkills(allAdminSkills);
                updateOverviewCounters();
                return;
            }
        } catch (err) {
            console.warn('Could not fetch skills from Supabase:', err.message);
        }
    }

    const localData = localStorage.getItem('portfolio_custom_skills');
    if (localData) {
        try {
            allAdminSkills = JSON.parse(localData);
        } catch (e) {
            allAdminSkills = window.PortfolioAPI ? window.PortfolioAPI.FALLBACK_SKILLS : [];
        }
    } else {
        allAdminSkills = window.PortfolioAPI ? window.PortfolioAPI.FALLBACK_SKILLS : [];
    }

    renderSkills(allAdminSkills);
}

function renderSkills(skills) {
    const container = document.getElementById('admin-skills-container');
    if (!container) return;

    if (!skills || skills.length === 0) {
        container.innerHTML = '<p class="empty-state">No skills configured yet.</p>';
        return;
    }

    container.innerHTML = skills.map((s) => `
        <div class="admin-skill-card glass-card">
            <div class="skill-card-info">
                <h4><i class="${s.icon_class || 'fa-solid fa-code'}" style="color:var(--primary); margin-right:6px;"></i> ${escapeHTML(s.skill_name)}</h4>
                <span>${escapeHTML(s.category)} • <strong>${s.proficiency_percentage}%</strong></span>
            </div>
            <div class="skill-card-actions">
                <button class="btn-danger-sm delete-skill-btn" data-id="${s.id}">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');

    attachSkillActionListeners();
}

function attachSkillActionListeners() {
    document.querySelectorAll('.delete-skill-btn').forEach((btn) => {
        btn.addEventListener('click', async () => {
            if (!confirm('Are you sure you want to permanently delete this skill?')) return;
            const id = btn.getAttribute('data-id');
            const supabase = getSupabase();
            try {
                if (supabase) {
                    const { error } = await supabase.from('skills').delete().eq('id', id);
                    if (error) throw error;
                }
                allAdminSkills = allAdminSkills.filter((s) => s.id !== id);

                localStorage.setItem('portfolio_skills_customized', 'true');
                localStorage.setItem('portfolio_custom_skills', JSON.stringify(allAdminSkills));
                window.dispatchEvent(new Event('storage'));

                showToast('Skill deleted permanently from Supabase!', 'success');
                renderSkills(allAdminSkills);
                updateOverviewCounters();
            } catch (err) {
                showToast('Error deleting skill from cloud: ' + err.message, 'error');
            }
        });
    });
}

/* -------------------------------------------------------------------------- */
/* 6. EXPERIENCE & EDUCATION CRUD (DIRECT SUPABASE CLOUD SYNC & DELETIONS)    */
/* -------------------------------------------------------------------------- */
async function loadTimeline() {
    const supabase = getSupabase();
    const container = document.getElementById('admin-timeline-container');
    if (!container) return;

    const isCustomized = localStorage.getItem('portfolio_timeline_customized') === 'true';

    if (supabase) {
        try {
            const { data, error } = await supabase
                .from('timeline')
                .select('*')
                .order('created_at', { ascending: false });

            if (!error && Array.isArray(data)) {
                if (data.length === 0 && !isCustomized && window.PortfolioAPI && window.PortfolioAPI.FALLBACK_TIMELINE) {
                    console.log('Seeding initial timeline milestones into Supabase Cloud DB...');
                    for (const t of window.PortfolioAPI.FALLBACK_TIMELINE) {
                        await supabase.from('timeline').upsert(t);
                    }
                    const res = await supabase.from('timeline').select('*').order('created_at', { ascending: false });
                    allAdminTimeline = res.data || window.PortfolioAPI.FALLBACK_TIMELINE;
                } else {
                    allAdminTimeline = data;
                }

                localStorage.setItem('portfolio_custom_timeline', JSON.stringify(allAdminTimeline));
                renderTimeline(allAdminTimeline);
                updateOverviewCounters();
                return;
            }
        } catch (err) {
            console.warn('Could not fetch timeline from Supabase:', err.message);
        }
    }

    const localData = localStorage.getItem('portfolio_custom_timeline');
    if (localData) {
        try {
            allAdminTimeline = JSON.parse(localData);
        } catch (e) {
            allAdminTimeline = window.PortfolioAPI ? window.PortfolioAPI.FALLBACK_TIMELINE : [];
        }
    } else {
        allAdminTimeline = window.PortfolioAPI ? window.PortfolioAPI.FALLBACK_TIMELINE : [];
    }

    renderTimeline(allAdminTimeline);
}

function renderTimeline(items) {
    const container = document.getElementById('admin-timeline-container');
    if (!container) return;

    if (!items || items.length === 0) {
        container.innerHTML = '<p class="empty-state">No milestones found. Click "+ Add Milestone" to create one.</p>';
        return;
    }

    container.innerHTML = items.map((t) => {
        const itemType = t.type || 'experience';
        const highlights = Array.isArray(t.highlights) ? t.highlights : [];

        return `
            <div class="admin-timeline-card glass-card type-${itemType}" data-id="${t.id}">
                <div class="admin-timeline-header">
                    <span class="timeline-type-badge">${itemType}</span>
                    <span class="timeline-period-badge"><i class="fa-regular fa-calendar"></i> ${escapeHTML(t.period)}</span>
                </div>
                <h3>${escapeHTML(t.title)}</h3>
                <div class="timeline-inst"><i class="fa-solid fa-building-columns"></i> ${escapeHTML(t.institution)}</div>
                ${t.description ? `<p class="timeline-desc-text">${escapeHTML(t.description)}</p>` : ''}
                ${highlights.length > 0 ? `
                    <ul class="timeline-highlights-mini">
                        ${highlights.map((h) => `<li><i class="fa-solid fa-check"></i> ${escapeHTML(h)}</li>`).join('')}
                    </ul>
                ` : ''}
                <div class="admin-timeline-actions">
                    <button class="btn btn-outline btn-sm edit-timeline-btn" data-id="${t.id}">
                        <i class="fa-solid fa-pen-to-square"></i> Edit
                    </button>
                    <button class="btn-danger-sm delete-timeline-btn" data-id="${t.id}">
                        <i class="fa-solid fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `;
    }).join('');

    attachTimelineActionListeners();
}

function attachTimelineActionListeners() {
    document.querySelectorAll('.edit-timeline-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            const item = allAdminTimeline.find((t) => t.id === id);
            if (item) openTimelineModalForEdit(item, id);
        });
    });

    document.querySelectorAll('.delete-timeline-btn').forEach((btn) => {
        btn.addEventListener('click', async () => {
            if (!confirm('Are you sure you want to permanently delete this timeline milestone?')) return;
            const id = btn.getAttribute('data-id');
            const supabase = getSupabase();
            try {
                if (supabase) {
                    const { error } = await supabase.from('timeline').delete().eq('id', id);
                    if (error) throw error;
                }
                allAdminTimeline = allAdminTimeline.filter((t) => t.id !== id);

                localStorage.setItem('portfolio_timeline_customized', 'true');
                localStorage.setItem('portfolio_custom_timeline', JSON.stringify(allAdminTimeline));
                window.dispatchEvent(new Event('storage'));

                showToast('Milestone deleted permanently from Supabase!', 'success');
                renderTimeline(allAdminTimeline);
                updateOverviewCounters();
            } catch (err) {
                showToast('Error deleting milestone from cloud: ' + err.message, 'error');
            }
        });
    });
}

/* -------------------------------------------------------------------------- */
/* 7. ONE-CLICK SYNC DEFAULTS TO CLOUD SUPABASE                               */
/* -------------------------------------------------------------------------- */
function initSyncCloudButton() {
    const syncBtn = document.getElementById('sync-cloud-btn');
    if (!syncBtn) return;

    syncBtn.addEventListener('click', async () => {
        const supabase = getSupabase();
        if (!supabase) {
            showToast('Supabase client is not connected.', 'error');
            return;
        }

        syncBtn.disabled = true;
        syncBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Syncing to Cloud...';

        try {
            // Upload current admin projects
            for (const p of allAdminProjects) {
                await supabase.from('projects').upsert(p);
            }

            // Upload current admin skills
            for (const s of allAdminSkills) {
                await supabase.from('skills').upsert(s);
            }

            // Upload current admin timeline
            for (const t of allAdminTimeline) {
                await supabase.from('timeline').upsert(t);
            }

            showToast('🎉 All changes synced directly to your live Supabase cloud database!', 'success');
            loadAllDashboardData();
        } catch (err) {
            console.error('Sync error:', err);
            showToast('Sync notice: ' + err.message, 'info');
        } finally {
            syncBtn.disabled = false;
            syncBtn.innerHTML = '<i class="fa-solid fa-cloud-arrow-up" style="color: var(--primary);"></i> Sync All to Supabase';
        }
    });
}

/* -------------------------------------------------------------------------- */
/* 8. MODALS & FORMS                                                         */
/* -------------------------------------------------------------------------- */
function initModals() {
    const projectModal = document.getElementById('project-modal');
    const skillModal = document.getElementById('skill-modal');
    const timelineModal = document.getElementById('timeline-modal');

    // Open Project Modal
    const openAddProj = document.getElementById('open-add-project-modal');
    const overviewAddProj = document.getElementById('overview-add-proj-btn');
    const tileAddProj = document.getElementById('tile-add-project');
    [openAddProj, overviewAddProj, tileAddProj].forEach((btn) => {
        if (btn) btn.addEventListener('click', () => openProjectModalForAdd());
    });

    // Close Project Modal
    const closeProjModal = document.getElementById('close-project-modal');
    const cancelProjBtn = document.getElementById('cancel-project-btn');
    [closeProjModal, cancelProjBtn].forEach((btn) => {
        if (btn) btn.addEventListener('click', () => projectModal.classList.remove('open'));
    });

    // Open Skill Modal
    const openAddSkill = document.getElementById('open-add-skill-modal');
    const tileAddSkill = document.getElementById('tile-add-skill');
    [openAddSkill, tileAddSkill].forEach((btn) => {
        if (btn) btn.addEventListener('click', () => openSkillModalForAdd());
    });

    // Close Skill Modal
    const closeSkillModal = document.getElementById('close-skill-modal');
    const cancelSkillBtn = document.getElementById('cancel-skill-btn');
    [closeSkillModal, cancelSkillBtn].forEach((btn) => {
        if (btn) btn.addEventListener('click', () => skillModal.classList.remove('open'));
    });

    // Open Timeline Modal
    const openAddTimeline = document.getElementById('open-add-timeline-modal');
    const tileAddTimeline = document.getElementById('tile-add-timeline');
    [openAddTimeline, tileAddTimeline].forEach((btn) => {
        if (btn) btn.addEventListener('click', () => openTimelineModalForAdd());
    });

    // Close Timeline Modal
    const closeTimelineModal = document.getElementById('close-timeline-modal');
    const cancelTimelineBtn = document.getElementById('cancel-timeline-btn');
    [closeTimelineModal, cancelTimelineBtn].forEach((btn) => {
        if (btn) btn.addEventListener('click', () => timelineModal.classList.remove('open'));
    });

    // Project Form Submit
    const projectForm = document.getElementById('project-form');
    if (projectForm) {
        projectForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('proj-id').value || 'proj_' + Date.now();
            const title = document.getElementById('proj-title').value.trim();
            const category = document.getElementById('proj-category').value;
            const short_description = document.getElementById('proj-short-desc').value.trim();
            const full_description = document.getElementById('proj-full-desc').value.trim();
            const tagsStr = document.getElementById('proj-tags').value.trim();
            const image_url = document.getElementById('proj-image').value.trim() || 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=600';
            const github_url = document.getElementById('proj-github').value.trim() || 'https://github.com/saikoushik2108';
            const live_url = document.getElementById('proj-live').value.trim() || '#';
            const featured = document.getElementById('proj-featured').checked;

            const tags = tagsStr ? tagsStr.split(',').map((t) => t.trim()).filter(Boolean) : [];

            const saveBtn = document.getElementById('save-project-btn');
            saveBtn.disabled = true;
            saveBtn.textContent = 'Saving...';

            const projectObj = {
                id,
                title,
                category,
                short_description,
                full_description,
                tags,
                image_url,
                github_url,
                live_url,
                featured
            };

            const supabase = getSupabase();
            try {
                if (supabase) {
                    const { error } = await supabase.from('projects').upsert(projectObj);
                    if (error) throw error;
                }
                const existingIdx = allAdminProjects.findIndex((p) => p.id === id);
                if (existingIdx >= 0) {
                    allAdminProjects[existingIdx] = projectObj;
                } else {
                    allAdminProjects.unshift(projectObj);
                }

                localStorage.setItem('portfolio_projects_customized', 'true');
                localStorage.setItem('portfolio_custom_projects', JSON.stringify(allAdminProjects));
                window.dispatchEvent(new Event('storage'));

                showToast('Project saved permanently to Supabase!', 'success');
                projectModal.classList.remove('open');
                renderProjects(allAdminProjects);
                updateOverviewCounters();
            } catch (err) {
                showToast('Error saving project to cloud: ' + err.message, 'error');
                renderProjects(allAdminProjects);
            } finally {
                saveBtn.disabled = false;
                saveBtn.textContent = 'Save Project';
            }
        });
    }

    // Skill Form Submit
    const skillForm = document.getElementById('skill-form');
    if (skillForm) {
        skillForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('skill-id').value || 'skill_' + Date.now();
            const category = document.getElementById('skill-category').value.trim();
            const skill_name = document.getElementById('skill-name').value.trim();
            const proficiency_percentage = parseInt(document.getElementById('skill-percent').value, 10);
            const icon_class = document.getElementById('skill-icon').value.trim() || 'fa-solid fa-code';

            const saveBtn = document.getElementById('save-skill-btn');
            saveBtn.disabled = true;
            saveBtn.textContent = 'Saving...';

            const skillObj = {
                id,
                category,
                skill_name,
                proficiency_percentage,
                icon_class
            };

            const supabase = getSupabase();
            try {
                if (supabase) {
                    const { error } = await supabase.from('skills').upsert(skillObj);
                    if (error) throw error;
                }
                const existingIdx = allAdminSkills.findIndex((s) => s.id === id);
                if (existingIdx >= 0) {
                    allAdminSkills[existingIdx] = skillObj;
                } else {
                    allAdminSkills.unshift(skillObj);
                }

                localStorage.setItem('portfolio_skills_customized', 'true');
                localStorage.setItem('portfolio_custom_skills', JSON.stringify(allAdminSkills));
                window.dispatchEvent(new Event('storage'));

                showToast('Skill saved permanently to Supabase!', 'success');
                skillModal.classList.remove('open');
                renderSkills(allAdminSkills);
                updateOverviewCounters();
            } catch (err) {
                showToast('Error saving skill to cloud: ' + err.message, 'error');
            } finally {
                saveBtn.disabled = false;
                saveBtn.textContent = 'Save Skill';
            }
        });
    }

    // Timeline Form Submit
    const timelineForm = document.getElementById('timeline-form');
    if (timelineForm) {
        timelineForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('timeline-id').value || 'tl_' + Date.now();
            const type = document.getElementById('timeline-type').value;
            const period = document.getElementById('timeline-period').value.trim();
            const title = document.getElementById('timeline-title').value.trim();
            const institution = document.getElementById('timeline-institution').value.trim();
            const description = document.getElementById('timeline-desc').value.trim();
            const highlightsRaw = document.getElementById('timeline-highlights').value.trim();

            const highlights = highlightsRaw ? highlightsRaw.split('\n').map((h) => h.trim()).filter(Boolean) : [];

            const saveBtn = document.getElementById('save-timeline-btn');
            saveBtn.disabled = true;
            saveBtn.textContent = 'Saving...';

            const timelineObj = {
                id,
                type,
                period,
                title,
                institution,
                description,
                highlights
            };

            const supabase = getSupabase();
            try {
                if (supabase) {
                    const { error } = await supabase.from('timeline').upsert(timelineObj);
                    if (error) throw error;
                }
                const existingIdx = allAdminTimeline.findIndex((t) => t.id === id);
                if (existingIdx >= 0) {
                    allAdminTimeline[existingIdx] = timelineObj;
                } else {
                    allAdminTimeline.unshift(timelineObj);
                }

                localStorage.setItem('portfolio_timeline_customized', 'true');
                localStorage.setItem('portfolio_custom_timeline', JSON.stringify(allAdminTimeline));
                window.dispatchEvent(new Event('storage'));

                showToast('Milestone saved permanently to Supabase!', 'success');
                timelineModal.classList.remove('open');
                renderTimeline(allAdminTimeline);
                updateOverviewCounters();
            } catch (err) {
                showToast('Error saving milestone to cloud: ' + err.message, 'error');
                renderTimeline(allAdminTimeline);
            } finally {
                saveBtn.disabled = false;
                saveBtn.textContent = 'Save Milestone';
            }
        });
    }
}

function openProjectModalForAdd() {
    const modal = document.getElementById('project-modal');
    document.getElementById('project-modal-title').textContent = 'Add New Project';
    document.getElementById('proj-id').value = '';
    document.getElementById('project-form').reset();
    modal.classList.add('open');
}

function openProjectModalForEdit(p) {
    const modal = document.getElementById('project-modal');
    document.getElementById('project-modal-title').textContent = 'Edit Project: ' + p.title;
    document.getElementById('proj-id').value = p.id;
    document.getElementById('proj-title').value = p.title || '';
    document.getElementById('proj-category').value = p.category || 'ai_ml';
    document.getElementById('proj-short-desc').value = p.short_description || '';
    document.getElementById('proj-full-desc').value = p.full_description || '';
    document.getElementById('proj-tags').value = (p.tags || []).join(', ');
    document.getElementById('proj-image').value = p.image_url || '';
    document.getElementById('proj-github').value = p.github_url || '';
    document.getElementById('proj-live').value = p.live_url || '';
    document.getElementById('proj-featured').checked = !!p.featured;
    modal.classList.add('open');
}

function openSkillModalForAdd() {
    const modal = document.getElementById('skill-modal');
    document.getElementById('skill-modal-title').textContent = 'Add New Skill';
    document.getElementById('skill-id').value = '';
    document.getElementById('skill-form').reset();
    modal.classList.add('open');
}

function openTimelineModalForAdd() {
    const modal = document.getElementById('timeline-modal');
    document.getElementById('timeline-modal-title').textContent = 'Add Milestone';
    document.getElementById('timeline-id').value = '';
    document.getElementById('timeline-form').reset();
    modal.classList.add('open');
}

function openTimelineModalForEdit(t, fallbackId) {
    const modal = document.getElementById('timeline-modal');
    document.getElementById('timeline-modal-title').textContent = 'Edit Milestone: ' + t.title;
    document.getElementById('timeline-id').value = t.id || fallbackId;
    document.getElementById('timeline-type').value = t.type || 'experience';
    document.getElementById('timeline-period').value = t.period || '';
    document.getElementById('timeline-title').value = t.title || '';
    document.getElementById('timeline-institution').value = t.institution || '';
    document.getElementById('timeline-desc').value = t.description || '';
    document.getElementById('timeline-highlights').value = (t.highlights || []).join('\n');
    modal.classList.add('open');
}

/* -------------------------------------------------------------------------- */
/* 9. SEARCH & STATS COUNTERS                                                */
/* -------------------------------------------------------------------------- */
function initSearchAndFilters() {
    const searchInput = document.getElementById('messages-search');
    const refreshBtn = document.getElementById('refresh-messages-btn');

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const filtered = allAdminMessages.filter(
                (m) =>
                    (m.name && m.name.toLowerCase().includes(query)) ||
                    (m.email && m.email.toLowerCase().includes(query)) ||
                    (m.message && m.message.toLowerCase().includes(query)) ||
                    (m.subject && m.subject.toLowerCase().includes(query))
            );
            renderMessages(filtered);
        });
    }

    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            loadMessages();
            showToast('Messages refreshed', 'info');
        });
    }
}

function updateOverviewCounters() {
    const totalMsgEl = document.getElementById('stat-total-messages');
    const unreadMsgEl = document.getElementById('stat-unread-messages');
    const totalProjEl = document.getElementById('stat-total-projects');
    const totalSkillEl = document.getElementById('stat-total-skills');
    const totalTimelineEl = document.getElementById('stat-total-timeline');
    const unreadPill = document.getElementById('unread-pill');

    const totalMessages = allAdminMessages.length;
    const unreadMessages = allAdminMessages.filter((m) => !m.read).length;
    const totalProjects = allAdminProjects.length;
    const totalSkills = allAdminSkills.length;
    const totalTimeline = allAdminTimeline.length;

    if (totalMsgEl) totalMsgEl.textContent = totalMessages;
    if (unreadMsgEl) unreadMsgEl.textContent = unreadMessages;
    if (totalProjEl) totalProjEl.textContent = totalProjects;
    if (totalSkillEl) totalSkillEl.textContent = totalSkills;
    if (totalTimelineEl) totalTimelineEl.textContent = totalTimeline;

    if (unreadPill) {
        if (unreadMessages > 0) {
            unreadPill.textContent = unreadMessages;
            unreadPill.style.display = 'inline-block';
        } else {
            unreadPill.style.display = 'none';
        }
    }
}

/* -------------------------------------------------------------------------- */
/* 10. TOAST NOTIFICATIONS UTILITY                                            */
/* -------------------------------------------------------------------------- */
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast-card toast-${type}`;
    toast.innerHTML = `
        <div class="toast-msg">${message}</div>
        <button onclick="this.parentElement.remove()" style="background:none;border:none;cursor:pointer;font-size:1.1rem;color:var(--text-muted);">&times;</button>
    `;
    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 5500);
}

function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, (tag) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
    }[tag] || tag));
}
