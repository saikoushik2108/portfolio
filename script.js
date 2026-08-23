/**
 * ==============================================================================
 * SAI KOUSHIK'S PORTFOLIO - ULTRA MODERN FLUID INTERACTIVE ENGINE
 * ==============================================================================
 * Advanced Animations:
 * 1. Fluid Interactive Sine Wave & Floating Energy Nodes Canvas
 * 2. Cyber Matrix Decrypt & Hologram Text Decoder
 * 3. 3D Parallax Tilt with Cursor Light Follower
 * 4. Magnetic Physics for Buttons & Social Icons
 * 5. Interactive Click Ripple Waves
 * 6. Smooth Staggered Scroll-Reveal Animations
 * 7. Serverless Supabase Data & Message Integration
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    initCursorSpotlight();
    initFluidWaveCanvas();
    initMatrixTypewriter();
    initMagneticElements();
    initButtonRippleEffect();
    initNavbarAndScrollSpy();
    initAboutTabs();
    initDynamicData();
    initProjectFiltersAndModals();
    initDeveloperTerminal();
    initContactForm();
    initBackToTop();
    initScrollReveal();
});

/* -------------------------------------------------------------------------- */
/* 0. INTERACTIVE CURSOR SPOTLIGHT AURA                                       */
/* -------------------------------------------------------------------------- */
function initCursorSpotlight() {
    const spotlight = document.getElementById('cursor-spotlight');
    if (!spotlight) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        spotlight.style.opacity = '1';
    });

    window.addEventListener('mouseout', () => {
        spotlight.style.opacity = '0';
    });

    function animateSpotlight() {
        currentX += (mouseX - currentX) * 0.12;
        currentY += (mouseY - currentY) * 0.12;
        spotlight.style.left = `${currentX}px`;
        spotlight.style.top = `${currentY}px`;
        requestAnimationFrame(animateSpotlight);
    }

    animateSpotlight();
}

/* -------------------------------------------------------------------------- */
/* 1. FLUID SINE-WAVE & INTERACTIVE RIPPLE CANVAS ENGINE                      */
/* -------------------------------------------------------------------------- */
function initFluidWaveCanvas() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let step = 0;
    const mouse = { x: width / 2, y: height / 2, speed: 0, targetSpeed: 0 };
    let lastMouse = { x: width / 2, y: height / 2 };
    const ripples = [];

    // Floating Ambient Energy Nodes
    const nodes = [];
    const nodeCount = Math.min(Math.floor((width * height) / 14000), 45);
    const nodeColors = ['#4f46e5', '#0284c7', '#7c3aed', '#db2777', '#059669', '#2563eb'];

    for (let i = 0; i < nodeCount; i++) {
        nodes.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 3.5 + 1.5,
            color: nodeColors[Math.floor(Math.random() * nodeColors.length)],
            vx: (Math.random() - 0.5) * 0.6,
            vy: (Math.random() - 0.5) * 0.6,
            alpha: Math.random() * 0.5 + 0.25,
            pulse: Math.random() * Math.PI * 2
        });
    }

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    window.addEventListener('mousemove', (e) => {
        const dx = e.clientX - lastMouse.x;
        const dy = e.clientY - lastMouse.y;
        mouse.targetSpeed = Math.min(Math.sqrt(dx * dx + dy * dy) * 0.05, 3);
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        lastMouse = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('click', (e) => {
        ripples.push({
            x: e.clientX,
            y: e.clientY,
            radius: 5,
            maxRadius: 180,
            alpha: 0.8,
            color: nodeColors[Math.floor(Math.random() * nodeColors.length)]
        });
    });

    // Wave Layer Configurations
    const waves = [
        { color: 'rgba(79, 70, 229, 0.08)', length: 0.003, amplitude: 35, speed: 0.02, offset: 0 },
        { color: 'rgba(2, 132, 199, 0.07)', length: 0.004, amplitude: 45, speed: 0.015, offset: Math.PI / 3 },
        { color: 'rgba(219, 39, 119, 0.05)', length: 0.0025, amplitude: 30, speed: 0.025, offset: Math.PI / 1.5 },
        { color: 'rgba(124, 58, 237, 0.06)', length: 0.005, amplitude: 50, speed: 0.018, offset: Math.PI }
    ];

    function drawWaves() {
        waves.forEach((w, index) => {
            ctx.beginPath();
            ctx.fillStyle = w.color;
            ctx.moveTo(0, height);

            const baseY = height * 0.55 + index * 40;
            for (let x = 0; x <= width; x += 15) {
                // Interactive mouse repulsion wave distortion
                const distToMouse = Math.abs(x - mouse.x);
                let mouseInfluence = 0;
                if (distToMouse < 250) {
                    mouseInfluence = Math.sin((distToMouse / 250) * Math.PI) * (mouse.speed * 20);
                }

                const y = baseY + Math.sin(x * w.length + step * w.speed + w.offset) * (w.amplitude + mouseInfluence);
                ctx.lineTo(x, y);
            }

            ctx.lineTo(width, height);
            ctx.closePath();
            ctx.fill();
        });
    }

    function drawRipples() {
        for (let i = ripples.length - 1; i >= 0; i--) {
            const r = ripples[i];
            ctx.save();
            ctx.beginPath();
            ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
            ctx.strokeStyle = r.color;
            ctx.globalAlpha = r.alpha;
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.restore();

            r.radius += 3.5;
            r.alpha -= 0.018;

            if (r.alpha <= 0 || r.radius >= r.maxRadius) {
                ripples.splice(i, 1);
            }
        }
    }

    function drawNodes() {
        nodes.forEach((n) => {
            n.x += n.vx;
            n.y += n.vy;
            n.pulse += 0.03;

            if (n.x < 0 || n.x > width) n.vx *= -1;
            if (n.y < 0 || n.y > height) n.vy *= -1;

            const currentRadius = n.radius + Math.sin(n.pulse) * 0.8;
            const currentAlpha = n.alpha + Math.sin(n.pulse) * 0.15;

            ctx.save();
            ctx.globalAlpha = Math.max(0.1, Math.min(1, currentAlpha));
            ctx.beginPath();
            ctx.arc(n.x, n.y, currentRadius, 0, Math.PI * 2);
            ctx.fillStyle = n.color;
            ctx.shadowBlur = 10;
            ctx.shadowColor = n.color;
            ctx.fill();
            ctx.restore();

            // Connect nearby nodes
            nodes.forEach((other) => {
                const dx = n.x - other.x;
                const dy = n.y - other.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 110) {
                    ctx.save();
                    ctx.globalAlpha = (1 - dist / 110) * 0.22;
                    ctx.strokeStyle = n.color;
                    ctx.lineWidth = 0.8;
                    ctx.beginPath();
                    ctx.moveTo(n.x, n.y);
                    ctx.lineTo(other.x, other.y);
                    ctx.stroke();
                    ctx.restore();
                }
            });
        });
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        mouse.speed += (mouse.targetSpeed - mouse.speed) * 0.1;
        mouse.targetSpeed *= 0.92;
        step += 1;

        drawWaves();
        drawNodes();
        drawRipples();

        requestAnimationFrame(animate);
    }

    animate();
}

/* -------------------------------------------------------------------------- */
/* 2. CYBER MATRIX DECRYPT & HOLOGRAPHIC TEXT DECODER                         */
/* -------------------------------------------------------------------------- */
function initMatrixTypewriter() {
    const target = document.getElementById('typewriter-text');
    if (!target) return;

    const phrases = [
        'AI & Machine Learning Engineer',
        'CSE (AI & ML) Undergrad @ CBIT',
        'Data Structures & Algorithms Enthusiast',
        'Full Stack & Cloud Developer',
        'Passionate Problem Solver'
    ];

    const chars = '!<>-_\\/[]{}—=+*^?#________ABCDEF0123456789';
    let phraseIdx = 0;

    function scrambleText(newText) {
        let iteration = 0;
        const maxIterations = newText.length;
        clearInterval(target.interval);

        target.interval = setInterval(() => {
            target.innerText = newText
                .split('')
                .map((letter, index) => {
                    if (index < iteration) {
                        return letter;
                    }
                    return chars[Math.floor(Math.random() * chars.length)];
                })
                .join('');

            if (iteration >= maxIterations) {
                clearInterval(target.interval);
                setTimeout(nextPhrase, 2600);
            }

            iteration += 1 / 2.5;
        }, 30);
    }

    function nextPhrase() {
        phraseIdx = (phraseIdx + 1) % phrases.length;
        scrambleText(phrases[phraseIdx]);
    }

    // Start initial scramble
    scrambleText(phrases[0]);
}

/* -------------------------------------------------------------------------- */
/* 3. MAGNETIC BUTTONS & SOCIAL ICONS PHYSICS                                 */
/* -------------------------------------------------------------------------- */
function initMagneticElements() {
    const magnetics = document.querySelectorAll('.btn, .btn-icon, .filter-btn, .tab-btn');

    magnetics.forEach((el) => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            el.style.transform = `translate(${x * 0.22}px, ${y * 0.22}px) scale(1.04)`;
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = 'translate(0px, 0px) scale(1)';
        });
    });
}

/* -------------------------------------------------------------------------- */
/* 4. BUTTON CLICK RIPPLE EFFECT                                              */
/* -------------------------------------------------------------------------- */
function initButtonRippleEffect() {
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn, .btn-icon, .filter-btn');
        if (!btn) return;

        const circle = document.createElement('span');
        const diameter = Math.max(btn.clientWidth, btn.clientHeight);
        const radius = diameter / 2;
        const rect = btn.getBoundingClientRect();

        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${e.clientX - rect.left - radius}px`;
        circle.style.top = `${e.clientY - rect.top - radius}px`;
        circle.classList.add('btn-click-ripple');

        const ripple = btn.getElementsByClassName('btn-click-ripple')[0];
        if (ripple) ripple.remove();

        btn.appendChild(circle);
        setTimeout(() => circle.remove(), 600);
    });
}

/* -------------------------------------------------------------------------- */
/* 5. 3D CARD TILT & CURSOR LIGHT FOLLOWING                                   */
/* -------------------------------------------------------------------------- */
function initCardTilt() {
    const tiltElements = document.querySelectorAll('.tilt-element, .glass-card');

    tiltElements.forEach((el) => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Set CSS custom properties for dynamic light sheen
            el.style.setProperty('--mouse-x', `${x}px`);
            el.style.setProperty('--mouse-y', `${y}px`);

            if (el.classList.contains('tilt-element')) {
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -8;
                const rotateY = ((x - centerX) / centerX) * 8;

                el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
            }
        });

        el.addEventListener('mouseleave', () => {
            if (el.classList.contains('tilt-element')) {
                el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
            }
        });
    });
}

/* -------------------------------------------------------------------------- */
/* 6. NAVBAR, MOBILE DRAWER & SCROLLSPY                                       */
/* -------------------------------------------------------------------------- */
function initNavbarAndScrollSpy() {
    const navbar = document.getElementById('navbar');
    const menuToggle = document.getElementById('menu-toggle');
    const menuClose = document.getElementById('menu-close');
    const navLinksList = document.getElementById('nav-links');
    const navItems = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id], header[id]');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        let currentSection = '';
        sections.forEach((sec) => {
            const sectionTop = sec.offsetTop - 120;
            const sectionHeight = sec.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = sec.getAttribute('id');
            }
        });

        navItems.forEach((link) => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    });

    if (menuToggle && navLinksList) {
        menuToggle.addEventListener('click', () => {
            navLinksList.classList.add('open');
            document.body.style.overflow = 'hidden';
        });
    }

    const closeMobileMenu = () => {
        if (navLinksList) {
            navLinksList.classList.remove('open');
            document.body.style.overflow = '';
        }
    };

    if (menuClose) menuClose.addEventListener('click', closeMobileMenu);
    navItems.forEach((item) => item.addEventListener('click', closeMobileMenu));
}

/* -------------------------------------------------------------------------- */
/* 7. ABOUT TABS (SKILLS, EXPERIENCE, EDUCATION)                              */
/* -------------------------------------------------------------------------- */
function initAboutTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-tab');

            tabButtons.forEach((btn) => btn.classList.remove('active'));
            tabPanes.forEach((pane) => pane.classList.remove('active'));

            button.classList.add('active');
            const targetPane = document.getElementById(targetId);
            if (targetPane) {
                targetPane.classList.add('active');
                animateSkillBars(targetPane);
            }
        });
    });
}

function animateSkillBars(container) {
    const bars = container.querySelectorAll('.skill-progress-bar');
    bars.forEach((bar) => {
        const percent = bar.getAttribute('data-percent') || '85';
        bar.style.width = '0%';
        setTimeout(() => {
            bar.style.width = `${percent}%`;
        }, 120);
    });
}

/* -------------------------------------------------------------------------- */
/* 8. DYNAMIC DATA HYDRATION (SUPABASE / FALLBACK)                            */
/* -------------------------------------------------------------------------- */
async function initDynamicData() {
    try {
        const skills = await window.PortfolioAPI.fetchSkillsData();
        renderSkills(skills);

        const timeline = await window.PortfolioAPI.fetchTimelineData();
        renderTimeline(timeline);

        const projects = await window.PortfolioAPI.fetchProjectsData();
        renderProjects(projects);

        updateDbBadge();
    } catch (err) {
        console.error('Data hydration error:', err);
    }
}

// Live real-time sync when Admin CMS updates or deletes projects/skills
window.addEventListener('storage', (e) => {
    if (!e.key || e.key.startsWith('portfolio_')) {
        initDynamicData();
    }
});

function updateDbBadge() {
    const badge = document.getElementById('db-status-badge');
    if (!badge) return;
    if (window.PortfolioAPI.isSupabaseConfigured()) {
        badge.innerHTML = '<span class="status-dot online"></span> Supabase Connected';
        badge.classList.add('connected');
    } else {
        badge.innerHTML = '<span class="status-dot demo"></span> Ready for Supabase';
        badge.setAttribute('title', 'Add your Supabase URL & Anon Key in supabase-config.js to activate live cloud database');
    }
}

function renderSkills(skills) {
    const skillsGrid = document.getElementById('skills-grid');
    if (!skillsGrid) return;

    const categories = {};
    skills.forEach((s) => {
        if (!categories[s.category]) categories[s.category] = [];
        categories[s.category].push(s);
    });

    let html = '';
    for (const [catName, catSkills] of Object.entries(categories)) {
        html += `
            <div class="skill-category-group glass-card">
                <h3 class="category-title"><i class="fa-solid fa-layer-group"></i> ${catName}</h3>
                <div class="skills-list">
                    ${catSkills
                        .map(
                            (skill) => `
                        <div class="skill-item">
                            <div class="skill-info">
                                <div class="skill-name-wrap">
                                    <i class="${skill.icon_class || 'fa-solid fa-code'} skill-icon"></i>
                                    <span class="skill-name">${skill.skill_name}</span>
                                </div>
                                <span class="skill-percent">${skill.proficiency_percentage}%</span>
                            </div>
                            <div class="skill-progress-track">
                                <div class="skill-progress-bar" data-percent="${skill.proficiency_percentage}" style="width: ${skill.proficiency_percentage}%"></div>
                            </div>
                        </div>
                    `
                        )
                        .join('')}
                </div>
            </div>
        `;
    }

    skillsGrid.innerHTML = html;
    initCardTilt();
}

function renderTimeline(timelineItems) {
    const educationContainer = document.getElementById('education-timeline');
    const experienceContainer = document.getElementById('experience-timeline');

    const educationItems = timelineItems.filter((item) => item.type === 'education');
    const experienceItems = timelineItems.filter((item) => item.type === 'experience');

    if (educationContainer) {
        educationContainer.innerHTML = renderTimelineBlock(educationItems, 'fa-graduation-cap');
    }
    if (experienceContainer) {
        experienceContainer.innerHTML = renderTimelineBlock(experienceItems, 'fa-briefcase');
    }
    initCardTilt();
}

function renderTimelineBlock(items, iconClass) {
    if (!items || items.length === 0) {
        return '<p class="empty-msg">No entries found.</p>';
    }

    return items
        .map(
            (item) => `
        <div class="timeline-card glass-card">
            <div class="timeline-badge"><i class="fa-solid ${iconClass}"></i></div>
            <div class="timeline-header">
                <span class="timeline-period"><i class="fa-regular fa-calendar-days"></i> ${item.period}</span>
                <h4 class="timeline-title">${item.title}</h4>
                <p class="timeline-institution"><i class="fa-solid fa-building-columns"></i> ${item.institution}</p>
            </div>
            ${item.description ? `<p class="timeline-desc">${item.description}</p>` : ''}
            ${
                item.highlights && item.highlights.length > 0
                    ? `
                <ul class="timeline-highlights">
                    ${item.highlights.map((h) => `<li><i class="fa-solid fa-check"></i> ${h}</li>`).join('')}
                </ul>
            `
                    : ''
            }
        </div>
    `
        )
        .join('');
}

/* -------------------------------------------------------------------------- */
/* 9. PROJECTS FILTER & 3D TILT CARDS                                         */
/* -------------------------------------------------------------------------- */
let allProjectsData = [];

function renderProjects(projects) {
    allProjectsData = projects;
    const container = document.getElementById('projects-grid');
    if (!container) return;

    container.innerHTML = projects.map((p) => createProjectCardHTML(p)).join('');
    initCardTilt();
}

function createProjectCardHTML(p) {
    const tagsHTML = (p.tags || [])
        .map((tag) => `<span class="tech-badge">${tag}</span>`)
        .join('');

    return `
        <div class="project-card glass-card tilt-element" data-category="${p.category}" data-id="${p.id}">
            <div class="project-img-wrapper">
                <img src="${p.image_url}" alt="${p.title}" class="project-img" loading="lazy">
                <div class="project-overlay">
                    <button class="btn-icon view-project-btn" data-id="${p.id}" title="View Details">
                        <i class="fa-solid fa-expand"></i>
                    </button>
                    ${
                        p.github_url && p.github_url !== '#'
                            ? `<a href="${p.github_url}" target="_blank" rel="noopener noreferrer" class="btn-icon" title="GitHub Code"><i class="fa-brands fa-github"></i></a>`
                            : ''
                    }
                    ${
                        p.live_url && p.live_url !== '#'
                            ? `<a href="${p.live_url}" target="_blank" rel="noopener noreferrer" class="btn-icon" title="Live Demo"><i class="fa-solid fa-arrow-up-right-from-square"></i></a>`
                            : ''
                    }
                </div>
                ${p.featured ? '<span class="featured-badge"><i class="fa-solid fa-star"></i> Featured</span>' : ''}
            </div>
            <div class="project-content">
                <span class="project-cat-label">${formatCategory(p.category)}</span>
                <h3 class="project-title">${p.title}</h3>
                <p class="project-desc">${p.short_description}</p>
                <div class="project-tech-stack">${tagsHTML}</div>
                <div class="project-actions">
                    <button class="btn btn-outline btn-sm view-project-btn" data-id="${p.id}">
                        Details <i class="fa-solid fa-arrow-right"></i>
                    </button>
                    ${
                        p.github_url && p.github_url !== '#'
                            ? `<a href="${p.github_url}" target="_blank" rel="noopener noreferrer" class="link-github"><i class="fa-brands fa-github"></i> Source</a>`
                            : ''
                    }
                </div>
            </div>
        </div>
    `;
}

function formatCategory(cat) {
    if (cat === 'ai_ml') return 'AI & Machine Learning';
    if (cat === 'algorithms') return 'Algorithms & Core CS';
    if (cat === 'web') return 'Full Stack & Web Dev';
    return 'Project';
}

function initProjectFiltersAndModals() {
    const filterButtons = document.querySelectorAll('.filter-btn');

    filterButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            filterButtons.forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');
            const cards = document.querySelectorAll('.project-card');

            cards.forEach((card, index) => {
                const cardCat = card.getAttribute('data-category');
                if (filter === 'all' || cardCat === filter) {
                    card.classList.remove('hidden');
                    card.style.animation = `staggerFadeIn 0.45s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.08}s forwards`;
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    const modal = document.getElementById('project-modal');
    const modalClose = document.getElementById('modal-close');
    const modalBackdrop = document.getElementById('modal-backdrop');

    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.view-project-btn');
        if (btn) {
            const projId = btn.getAttribute('data-id');
            const project = allProjectsData.find((p) => p.id === projId);
            if (project) openProjectModal(project);
        }
    });

    const closeModal = () => {
        if (modal) modal.classList.remove('open');
        document.body.style.overflow = '';
    };

    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
}

function openProjectModal(p) {
    const modal = document.getElementById('project-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalCategory = document.getElementById('modal-category');
    const modalImg = document.getElementById('modal-img');
    const modalBody = document.getElementById('modal-body');
    const modalTags = document.getElementById('modal-tags');
    const modalGithub = document.getElementById('modal-github');
    const modalLive = document.getElementById('modal-live');

    if (!modal) return;

    modalTitle.textContent = p.title;
    modalCategory.textContent = formatCategory(p.category);
    modalImg.src = p.image_url;
    modalImg.alt = p.title;
    modalBody.textContent = p.full_description || p.short_description;

    modalTags.innerHTML = (p.tags || [])
        .map((tag) => `<span class="tech-badge">${tag}</span>`)
        .join('');

    if (modalGithub) {
        modalGithub.href = p.github_url || 'https://github.com/saikoushik2108';
    }
    if (modalLive) {
        if (p.live_url && p.live_url !== '#') {
            modalLive.href = p.live_url;
            modalLive.style.display = 'inline-flex';
        } else {
            modalLive.style.display = 'none';
        }
    }

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
}

/* -------------------------------------------------------------------------- */
/* 10. DEVELOPER TERMINAL WIDGET                                              */
/* -------------------------------------------------------------------------- */
function initDeveloperTerminal() {
    const input = document.getElementById('terminal-input');
    const output = document.getElementById('terminal-output');
    if (!input || !output) return;

    const commands = {
        help: 'Available commands: \n  • <span class="term-hl">about</span>: Brief summary about Sai Koushik\n  • <span class="term-hl">skills</span>: List top technical strengths\n  • <span class="term-hl">education</span>: Academic credentials\n  • <span class="term-hl">contact</span>: Direct contact info\n  • <span class="term-hl">github</span>: Open GitHub profile\n  • <span class="term-hl">clear</span>: Clear terminal window',
        about: 'Sai Koushik - Computer Science & Engineering (AI & ML) undergrad at CBIT Hyderabad. Passionate about machine learning pipelines, algorithmic problem solving, and modern full-stack web applications.',
        skills: 'Languages: Java, C++, Python, JavaScript\nAI/ML: Machine Learning, Deep Learning, OpenCV, Pandas, NumPy\nCore CS: Data Structures & Algorithms, OOP, Database Systems (SQL), Supabase',
        education: '• B.E. CSE (AI & ML) @ CBIT Hyderabad (2024 - 2028)\n• Intermediate (MPC) @ Narayana Junior College (2022 - 2024)\n• SSC @ Geetha High School (2021 - 2022)',
        contact: 'Email: saikoushik.2108@gmail.com\nPhone: +91 7331132108\nLocation: Hyderabad, India\nGitHub: https://github.com/saikoushik2108',
        github: 'Redirecting to GitHub: https://github.com/saikoushik2108',
        admin: '🔒 Redirecting to Private Admin Portal (admin.html)...',
        dashboard: '🔒 Redirecting to Private Admin Portal (admin.html)...',
        login: '🔒 Redirecting to Private Admin Portal (admin.html)...',
        whoami: 'visitor@koushik-portfolio ~'
    };

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const cmd = input.value.trim().toLowerCase();
            input.value = '';

            const cmdLine = document.createElement('div');
            cmdLine.className = 'terminal-row cmd-echo';
            cmdLine.innerHTML = `<span class="term-prompt">koushik@terminal:~$</span> <span>${escapeHTML(cmd)}</span>`;
            output.appendChild(cmdLine);

            if (cmd === 'clear') {
                output.innerHTML = '';
                return;
            }

            const response = document.createElement('div');
            response.className = 'terminal-row term-resp';

            if (cmd === '') {
                // Do nothing
            } else if (commands[cmd]) {
                response.innerHTML = commands[cmd].replace(/\n/g, '<br>');
                if (cmd === 'github') {
                    window.open('https://github.com/saikoushik2108', '_blank');
                } else if (cmd === 'admin' || cmd === 'dashboard' || cmd === 'login') {
                    setTimeout(() => {
                        window.location.href = 'admin.html';
                    }, 600);
                }
            } else {
                response.innerHTML = `Command not found: "${escapeHTML(cmd)}". Type <span class="term-hl">help</span> for a list of commands.`;
            }

            output.appendChild(response);
            output.scrollTop = output.scrollHeight;
        }
    });

    // Secret Admin Shortcut: Ctrl+Shift+A or Cmd+Shift+A
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
            e.preventDefault();
            window.location.href = 'admin.html';
        }
    });

    // Secret Admin Triple Click on Footer Brand
    let clickCount = 0;
    let clickTimer = null;
    const footerBrand = document.querySelector('.footer-brand');
    if (footerBrand) {
        footerBrand.style.cursor = 'pointer';
        footerBrand.addEventListener('click', () => {
            clickCount++;
            clearTimeout(clickTimer);
            if (clickCount >= 3) {
                clickCount = 0;
                window.location.href = 'admin.html';
            } else {
                clickTimer = setTimeout(() => { clickCount = 0; }, 700);
            }
        });
    }
}

function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, (tag) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
    }[tag] || tag));
}

/* -------------------------------------------------------------------------- */
/* 11. CONTACT FORM WITH DIRECT SUPABASE INSERT & TOAST NOTIFICATIONS         */
/* -------------------------------------------------------------------------- */
function initContactForm() {
    const form = document.getElementById('contact-form');
    const submitBtn = document.getElementById('contact-submit-btn');

    if (!form || !submitBtn) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = form.elements['name']?.value.trim();
        const email = form.elements['email']?.value.trim();
        const subject = form.elements['subject']?.value.trim() || 'Portfolio Message';
        const message = form.elements['message']?.value.trim();

        if (!name || !email || !message) {
            showToast('Please fill in all required fields.', 'warning');
            return;
        }

        const originalBtnHTML = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending message...';

        try {
            const result = await window.PortfolioAPI.submitContactMessage({
                name,
                email,
                subject,
                message
            });

            if (result.success) {
                if (result.mode === 'supabase') {
                    showToast('🎉 Thank you! Your message was delivered directly to Supabase.', 'success');
                } else {
                    showToast('✅ Message received! (Stored locally in demo mode - connect Supabase in config to sync online)', 'info');
                }
                form.reset();
            } else {
                showToast('❌ Could not send message. Please try again.', 'error');
            }
        } catch (err) {
            console.error('Submission failed:', err);
            showToast('⚠️ Something went wrong: ' + err.message, 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnHTML;
        }
    });
}

function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast-card toast-${type}`;

    let icon = 'fa-circle-info';
    if (type === 'success') icon = 'fa-circle-check';
    if (type === 'error') icon = 'fa-circle-xmark';
    if (type === 'warning') icon = 'fa-triangle-exclamation';

    toast.innerHTML = `
        <div class="toast-icon"><i class="fa-solid ${icon}"></i></div>
        <div class="toast-msg">${message}</div>
        <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => toast.remove(), 400);
    }, 5500);
}

/* -------------------------------------------------------------------------- */
/* 12. BACK TO TOP BUTTON WITH SCROLL PROGRESS                                */
/* -------------------------------------------------------------------------- */
function initBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    const progressCircle = document.getElementById('scroll-progress-circle');
    if (!backToTopBtn) return;

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

        if (scrollTop > 350) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }

        if (progressCircle) {
            const circumference = 2 * Math.PI * 18;
            const offset = circumference - (scrollPercent / 100) * circumference;
            progressCircle.style.strokeDashoffset = offset;
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* -------------------------------------------------------------------------- */
/* 13. SCROLL REVEAL (INTERSECTION OBSERVER)                                  */
/* -------------------------------------------------------------------------- */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal-on-scroll');

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-revealed');
                }
            });
        },
        { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
    );

    revealElements.forEach((el) => observer.observe(el));
}
