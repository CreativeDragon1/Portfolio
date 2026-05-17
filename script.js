// ===== GLOBAL VARIABLES =====
let isLoading = true;
let musicPlaying = false;
let draggedElement = null;
let offsetX = 0;
let offsetY = 0;

// ===== LOADING SCREEN =====
window.addEventListener('load', () => {
    const loadingScreen = document.getElementById('loadingScreen');
    const loadingBar = document.getElementById('loadingBar');
    const loadingPercentage = document.getElementById('loadingPercentage');
    const mainContent = document.getElementById('mainContent');
    
    let progress = 0;
    const loadingInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 100) progress = 100;
        
        loadingBar.style.width = progress + '%';
        loadingPercentage.textContent = Math.floor(progress) + '%';
        
        if (progress >= 100) {
            clearInterval(loadingInterval);
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                mainContent.classList.add('visible');
                isLoading = false;
                initializeAnimations();
            }, 500);
        }
    }, 100);
});

// ===== INITIALIZE ALL ANIMATIONS =====
function initializeAnimations() {
    initClock();
    initHitCounter();
    initFallingLeaves();
    initCursorTrail();
    initMusicPlayer();
    animateStatBars();
    initThemeSwitcher();
    loadDynamicAwards();
}

// ===== CLOCK =====
function initClock() {
    function updateTime() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        document.getElementById('currentTime').textContent = `${hours}:${minutes}:${seconds}`;
    }
    updateTime();
    setInterval(updateTime, 1000);
}

// ===== HIT COUNTER =====
function initHitCounter() {
    const hitCounter = document.getElementById('hitCounter');
    let count = parseInt(localStorage.getItem('hitCount')) || 42;
    count++;
    localStorage.setItem('hitCount', count);
    hitCounter.textContent = String(count).padStart(6, '0');
}

// ===== FALLING LEAVES =====
function initFallingLeaves() {
    const container = document.getElementById('leavesContainer');
    const leafTypes = ['🍃', '🍂', '🌿'];
    const numLeaves = 15;
    
    for (let i = 0; i < numLeaves; i++) {
        createLeaf();
    }
    
    function createLeaf() {
        const leaf = document.createElement('div');
        leaf.className = 'leaf';
        leaf.textContent = leafTypes[Math.floor(Math.random() * leafTypes.length)];
        leaf.style.left = Math.random() * 100 + '%';
        leaf.style.animationDuration = (Math.random() * 10 + 15) + 's';
        leaf.style.animationDelay = Math.random() * 5 + 's';
        leaf.style.fontSize = (Math.random() * 10 + 15) + 'px';
        
        container.appendChild(leaf);
        
        // Remove and recreate after animation
        setTimeout(() => {
            leaf.remove();
            createLeaf();
        }, (parseFloat(leaf.style.animationDuration) + parseFloat(leaf.style.animationDelay)) * 1000);
    }
}

// ===== CURSOR TRAIL =====
function initCursorTrail() {
    const canvas = document.getElementById('cursorCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const maxParticles = 20;
    
    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 3 + 2;
            this.speedX = Math.random() * 2 - 1;
            this.speedY = Math.random() * 2 - 1;
            this.life = 1;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.life -= 0.02;
            this.size *= 0.97;
        }
        
        draw() {
            ctx.fillStyle = `rgba(157, 255, 157, ${this.life * 0.5})`;
            ctx.fillRect(this.x, this.y, this.size, this.size);
        }
    }
    
    document.addEventListener('mousemove', (e) => {
        if (Math.random() > 0.8) {
            particles.push(new Particle(e.clientX, e.clientY));
            if (particles.length > maxParticles) {
                particles.shift();
            }
        }
    });
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = particles.length - 1; i >= 0; i--) {
            particles[i].update();
            particles[i].draw();
            
            if (particles[i].life <= 0) {
                particles.splice(i, 1);
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    animate();
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// ===== THEME SWITCHER =====
function initThemeSwitcher() {
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const themePicker = document.getElementById('themePicker');
    const themeOptions = document.querySelectorAll('.theme-option');
    const html = document.documentElement;
    
    // Load saved theme
    const savedTheme = localStorage.getItem('portfolioTheme') || 'yellow';
    html.setAttribute('data-theme', savedTheme);
    updateActiveTheme(savedTheme);
    
    // Toggle theme picker
    themeToggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        themePicker.classList.toggle('active');
    });
    
    // Close picker when clicking outside
    document.addEventListener('click', (e) => {
        if (!themePicker.contains(e.target) && !themeToggleBtn.contains(e.target)) {
            themePicker.classList.remove('active');
        }
    });
    
    // Theme selection
    themeOptions.forEach(option => {
        option.addEventListener('click', () => {
            const theme = option.getAttribute('data-theme');
            html.setAttribute('data-theme', theme);
            localStorage.setItem('portfolioTheme', theme);
            updateActiveTheme(theme);
        });
    });
    
    function updateActiveTheme(theme) {
        themeOptions.forEach(opt => {
            opt.classList.remove('active');
            if (opt.getAttribute('data-theme') === theme) {
                opt.classList.add('active');
            }
        });
    }
}

// ===== MUSIC PLAYER =====
function initMusicPlayer() {
    const musicToggle = document.getElementById('musicToggle');
    const bgMusic = document.getElementById('bgMusic');
    const equalizer = document.getElementById('equalizer');
    const reelLeft = document.getElementById('reelLeft');
    const reelRight = document.getElementById('reelRight');
    
    musicToggle.addEventListener('click', () => {
        if (musicPlaying) {
            bgMusic.pause();
            musicPlaying = false;
            equalizer.classList.remove('playing');
            reelLeft.classList.remove('spinning');
            reelRight.classList.remove('spinning');
        } else {
            bgMusic.play().catch(err => {
                console.log('Audio play failed:', err);
            });
            musicPlaying = true;
            equalizer.classList.add('playing');
            reelLeft.classList.add('spinning');
            reelRight.classList.add('spinning');
        }
    });
    
    // Handle audio end
    bgMusic.addEventListener('ended', () => {
        musicPlaying = false;
        equalizer.classList.remove('playing');
        reelLeft.classList.remove('spinning');
        reelRight.classList.remove('spinning');
    });
}

// ===== DRAGGABLE WINDOWS =====
function initDraggableWindows() {
    const draggableWindows = document.querySelectorAll('.draggable');
    
    draggableWindows.forEach(window => {
        const titlebar = window.querySelector('.window-titlebar[data-window]');
        if (!titlebar) return;
        
        titlebar.addEventListener('mousedown', startDragging);
    });
    
    function startDragging(e) {
        const titlebar = e.currentTarget;
        const windowId = titlebar.getAttribute('data-window');
        draggedElement = document.getElementById(windowId);
        
        if (!draggedElement) return;
        
        // Get initial position
        const rect = draggedElement.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        
        // Make position absolute for dragging
        draggedElement.style.position = 'absolute';
        draggedElement.style.left = rect.left + 'px';
        draggedElement.style.top = rect.top + 'px';
        draggedElement.style.zIndex = '1000';
        
        document.addEventListener('mousemove', dragWindow);
        document.addEventListener('mouseup', stopDragging);
        
        draggedElement.style.cursor = 'grabbing';
    }
    
    function dragWindow(e) {
        if (!draggedElement) return;
        
        let newX = e.clientX - offsetX;
        let newY = e.clientY - offsetY;
        
        // Boundary checking
        const maxX = window.innerWidth - draggedElement.offsetWidth;
        const maxY = window.innerHeight - draggedElement.offsetHeight;
        
        newX = Math.max(0, Math.min(newX, maxX));
        newY = Math.max(0, Math.min(newY, maxY));
        
        draggedElement.style.left = newX + 'px';
        draggedElement.style.top = newY + 'px';
    }
    
    function stopDragging() {
        if (draggedElement) {
            draggedElement.style.cursor = '';
        }
        draggedElement = null;
        document.removeEventListener('mousemove', dragWindow);
        document.removeEventListener('mouseup', stopDragging);
    }
}

// ===== ANIMATE STAT BARS =====
function animateStatBars() {
    const statBars = document.querySelectorAll('.stat-fill');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const width = entry.target.style.width;
                entry.target.style.width = '0%';
                setTimeout(() => {
                    entry.target.style.width = width;
                }, 100);
            }
        });
    }, { threshold: 0.5 });
    
    statBars.forEach(bar => observer.observe(bar));
}

// ===== HOVER EFFECTS FOR INTERACTIVE ELEMENTS =====
document.addEventListener('DOMContentLoaded', () => {
    // Add pixel spark effect to awards on hover
    const awardSlots = document.querySelectorAll('.award-slot');
    awardSlots.forEach(slot => {
        slot.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 0 20px rgba(157, 255, 157, 0.4)';
        });
        slot.addEventListener('mouseleave', function() {
            this.style.boxShadow = '';
        });
    });
    
    // Add hover effect to project items
    const projectItems = document.querySelectorAll('.project-item');
    projectItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 4px 15px rgba(157, 255, 157, 0.2)';
        });
        item.addEventListener('mouseleave', function() {
            this.style.boxShadow = '';
        });
    });
    
    // Window button interactions
    const windowBtns = document.querySelectorAll('.window-btn');
    windowBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            // Add click feedback
            btn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                btn.style.transform = '';
            }, 100);
        });
    });
});

// ===== PARALLAX EFFECT =====
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const header = document.querySelector('.retro-header');
    if (header) {
        header.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
});

// ===== EASTER EGG: KONAMI CODE =====
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        activateEasterEgg();
    }
});

function activateEasterEgg() {
    // Create a special visual effect
    const body = document.body;
    const originalFilter = body.style.filter;
    
    body.style.filter = 'hue-rotate(180deg) saturate(2)';
    
    // Create notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(180deg, #c9b896 0%, #6b5d48 100%);
        border: 4px solid #9dff9d;
        padding: 30px;
        font-family: var(--font-pixel);
        font-size: 14px;
        color: #000;
        z-index: 10001;
        box-shadow: 0 0 40px rgba(157, 255, 157, 0.8);
        text-align: center;
    `;
    notification.innerHTML = '🎮 CHEAT CODE ACTIVATED! 🎮<br><span style="font-size: 10px;">MATRIX MODE ENABLED</span>';
    document.body.appendChild(notification);
    
    setTimeout(() => {
        body.style.filter = originalFilter;
        notification.remove();
    }, 3000);
}

// ===== PERFORMANCE OPTIMIZATION =====
// Throttle function for scroll and resize events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Apply throttling to scroll event
window.addEventListener('scroll', throttle(() => {
    // Scroll-based animations handled here
}, 100));

// ===== DYNAMIC AWARDS LOADING =====
function loadDynamicAwards() {
    let awards = [];
    const savedAwards = localStorage.getItem('portfolioAwards');
    
    if (savedAwards) {
        awards = JSON.parse(savedAwards);
    } else {
        // Initialize with default awards if none exist
        awards = [
            // Clubs & Organizations
            { id: 1, icon: "►", title: "Technology Head", desc: "Robotics Club - Leadership position" },
            { id: 2, icon: "►", title: "Secretary", desc: "GIIS Chess Club - Leadership position" },
            { id: 3, icon: "►", title: "Head of Design and Marketing", desc: "GIIS Pulse Club - Leadership position" },
            { id: 4, icon: "◆", title: "Design and Marketing", desc: "GIIS Sports Club" },
            { id: 5, icon: "◆", title: "Technology Department", desc: "GIIS Tech Club" },
            { id: 6, icon: "►", title: "Technology Head", desc: "Blueprint - Hackathon with 79 participants" },
            { id: 7, icon: "►", title: "Technology Head", desc: "Robotics Stall - Mechanum wheel car project" },
            { id: 8, icon: "►", title: "Head of Sound and Lighting & MARCOM", desc: "Drama Night - Leadership position" },
            { id: 9, icon: "◆", title: "Event Photographer", desc: "Photography Club" },
            // Hackathons Organized
            { id: 10, icon: "[★]", title: "Organiser - Educathon Hackathon", desc: "$31,000 in prizes, 450+ global participants" },
            { id: 11, icon: "[★]", title: "Organiser - Sandcodes", desc: "$3,500 in funds, 340+ participants" },
            // Internships & Jobs
            { id: 12, icon: "▲", title: "Chief Technical Officer", desc: "The QU4DCOACH - Startup, Jatayu V1.0 flight controller" },
            // Certificates & Awards
            { id: 13, icon: "★★★", title: "Winner", desc: "GIIS 2K25 Hackathon - Advanced" },
            { id: 14, icon: "[1ST]", title: "First Place", desc: "Campfire Singapore - HackClub 48hr game jam" },
            { id: 15, icon: "[3RD]", title: "3rd Place", desc: "Lift Off" },
            { id: 16, icon: "[WIN]", title: "Swimmer OSINT CTF", desc: "Cybersecurity competition - Score: 216/688" },
            { id: 17, icon: "[★]", title: "Winner", desc: "Participated in 78 online hackathons, won 10" },
            // Academics
            { id: 18, icon: "▼", title: "Participation", desc: "CSMC Canadian Math Exam" },
            { id: 19, icon: "▼", title: "Aerospace Engineering Course", desc: "IIT Madras online course" },
            // Volunteering
            { id: 20, icon: "◄", title: "Volunteer", desc: "Medcon" },
            { id: 21, icon: "◄", title: "Photographer", desc: "Conference" },
            { id: 22, icon: "◄", title: "Photographer", desc: "TOK Fest" },
            { id: 23, icon: "◄", title: "Cleaner", desc: "Beach Clean Up @ Pasir Ris" }
        ];
    }
    
    const awardsGrid = document.querySelector('.awards-grid');
    
    if (awardsGrid && awards.length > 0) {
        awardsGrid.innerHTML = awards.map(award => `
            <div class="award-slot">
                <div class="award-icon award-icon-text">${award.icon}</div>
                <div class="award-info">
                    <div class="award-title">${award.title}</div>
                    <div class="award-desc">${award.desc}</div>
                </div>
            </div>
        `).join('');
    }
}

// ===== ROLE SELECTOR & CURATED CONTENT =====
const roleContent = {
    'fullstack': {
        title: 'Full-Stack Creator',
        description: 'Creative and ambitious tech enthusiast passionate about building end-to-end solutions. From UI/UX design to backend architecture, from robotics hardware to AI algorithms.',
        content: `
            <div class="stats-block">
                <strong>▸ SKILL AREAS:</strong><br>
                • Web Development (JavaScript, TypeScript, HTML/CSS, Next.js)<br>
                • Game Development (Sprig, Web Games)<br>
                • CAD Design (72+ hours in Construct)<br>
                • Robotics & Embedded Systems<br>
                • AI & Machine Learning<br>
                • Video Production & Marketing<br>
                • Entrepreneurship & Leadership<br>
                • Hardware Design (PCB, Electronics)<br>
            </div>
            <p class="role-description">Currently exploring CFD analysis for STEM Racing. Always building, learning, and pushing creative boundaries.</p>
        `
    },
    'video-editing': {
        title: 'Video Editing Professional',
        description: 'Experienced in creating engaging marketing content, event documentation, and promotional videos.',
        projects: [
            {
                name: 'GIIS Drama Night 2025',
                desc: 'Marketing & promotional videos for drama night event',
                links: [
                    { text: 'View Instagram', url: 'https://www.instagram.com/giisdramanight2025/', type: 'external' }
                ]
            }
        ],
        footer: 'Specialized in creating compelling video content for events, brands, and social media.'
    },
    'cadding': {
        title: 'CAD Designer',
        description: 'Proficient in 3D modeling and mechanical design.',
        content: `
            <div class="stats-block">
                <strong>▸ EXPERIENCE:</strong><br>
                • <strong>72+ hours</strong> of CAD design work<br>
                • Focus: Construct (HackClub)<br>
                • Experience with mechanical and structural designs<br>
                • 3D modeling for robotics projects<br>
            </div>
            <p class="role-description">All 3D models and designs available on my Printables page.</p>
        `,
        projects: [
            {
                name: '3D Models & Designs',
                desc: 'Complete collection of CAD projects and 3D printable models',
                links: [
                    { text: 'View Printables Profile', url: 'https://www.printables.com/@RaahiChheda_3569909/models', type: 'external' }
                ]
            }
        ]
    },
    'pcb-design': {
        title: 'PCB Designer',
        description: 'Exploring hardware design and PCB development.',
        content: `
            <div class="stats-block">
                <strong>▸ STATUS: WORK IN PROGRESS</strong><br>
                Currently developing PCB design skills through various projects.<br>
                Experience with circuit design and hardware integration.
            </div>
            <p class="role-description">More projects coming soon as part of ongoing hardware development work.</p>
        `
    },
    'web-dev': {
        title: 'Web Developer',
        description: 'Full-stack web development with focus on interactive, user-friendly applications.',
        projects: [
            {
                name: 'SmartCare',
                desc: 'Integrated AI Healthcare Ecosystem - Complete client-side healthcare platform with Firebase auth, doctor consultations, virtual meetings, symptom checker, pharmacy ordering, and wellness community.',
                links: [
                    { text: '🎮 TRY DEMO', url: 'https://creativedragon1.github.io/SmartCare-/', type: 'demo' },
                    { text: '💻 VIEW CODE', url: 'https://github.com/CreativeDragon1/SmartCare-', type: 'github' }
                ]
            },
            {
                name: 'Portfolio (This Site)',
                desc: 'Personal portfolio with admin panel, awards management, and interactive features. Retro terminal theme.',
                links: [
                    { text: '🎮 VIEW LIVE', url: 'https://creativedragon1.github.io/Portfolio/', type: 'demo' },
                    { text: '💻 VIEW CODE', url: 'https://github.com/CreativeDragon1/Portfolio', type: 'github' }
                ]
            },
            {
                name: 'Horror-Ext',
                desc: 'Creative browser extension that transforms websites into spooky experiences',
                links: [
                    { text: '💻 VIEW CODE', url: 'https://github.com/CreativeDragon1/Horror-Ext', type: 'github' }
                ]
            },
            {
                name: 'Safeclick',
                desc: 'Full-stack Next.js application - TypeScript powered modern web app',
                links: [
                    { text: '💻 VIEW CODE', url: 'https://github.com/CreativeDragon1/Safeclick', type: 'github' }
                ]
            },
            {
                name: 'CSL to English Translator',
                desc: 'Interactive web app for translating Chinese Sign Language to English',
                links: [
                    { text: '💻 VIEW CODE', url: 'https://github.com/CreativeDragon1/CSL_to_English', type: 'github' }
                ]
            },
            {
                name: 'Photography Club Website',
                desc: 'Club portfolio and member showcase platform',
                links: [
                    { text: '💻 VIEW CODE', url: 'https://github.com/CreativeDragon1/photography-club', type: 'github' }
                ]
            }
        ]
    },
    'game-dev': {
        title: 'Game Developer',
        description: 'Creating interactive gaming experiences from retro-style arcade games to educational game platforms.',
        projects: [
            {
                name: 'Sprig Game Editor',
                desc: 'Learn to code by making games. Forked from hackclub/sprig - modified educational game platform',
                links: [
                    { text: '💻 VIEW CODE', url: 'https://github.com/CreativeDragon1/sprig', type: 'github' }
                ]
            },
            {
                name: 'Retro Web Game',
                desc: 'Arcade-style web game with pixel art and engaging gameplay',
                links: [
                    { text: '💻 VIEW CODE', url: 'https://github.com/CreativeDragon1/Game', type: 'github' }
                ]
            }
        ]
    },
    'leader': {
        title: 'Leader & Organizer',
        description: 'Organized and led multiple hackathons, clubs, and events with significant impact.',
        content: `
            <div class="stats-block">
                <strong>▸ MAJOR HACKATHONS ORGANIZED:</strong><br>
                <strong>Educathon Hackathon</strong> - $31,000+ in prizes, 450+ global participants<br>
                <strong>Sandcodes Hackathon</strong> - $3,500+ in funds, 340+ participants<br>
                <strong>Blueprint</strong> - GIIS Robotics Club hackathon with 79 participants<br>
            </div>
            <div class="stats-block">
                <strong>▸ CLUB LEADERSHIP ROLES:</strong><br>
                • <strong>Technology Head</strong> - Robotics Club, Robotics Stall<br>
                • <strong>Secretary</strong> - GIIS Chess Club<br>
                • <strong>Head of Design & Marketing</strong> - GIIS Pulse Club<br>
                • <strong>Head of Sound & Lighting + MARCOM</strong> - Drama Night<br>
            </div>
            <p class="role-description">Passionate about creating opportunities, fostering innovation, and building engaged communities.</p>
        `
    },
    'entrepreneur': {
        title: 'Entrepreneur',
        description: 'Co-founder of startup focused on drone flight controller technology.',
        projects: [
            {
                name: 'The QU4DCOACH',
                desc: 'Startup co-founded to develop and sell drone flight controllers. Served as Chief Technical Officer. Led R&D of Jatayu V1.0 flight controller and maintained company website.',
                links: [
                    { text: '🌐 VISIT WEBSITE', url: 'https://thequadcoach.xyz', type: 'external' },
                    { text: '📖 LEARN MORE', url: 'https://thequadcoach.xyz', type: 'external' }
                ]
            }
        ],
        footer: 'Experienced in product development, R&D, website maintenance, and startup operations.'
    },
    'robotics': {
        title: 'Robotics Enthusiast',
        description: 'Building innovative robotic systems from autonomous vehicles to remote-controlled projects.',
        content: `
            <div class="stats-block">
                <strong>▸ ROBOTICS PROJECTS:</strong><br>
                <strong>Mechanum Wheel RC Car</strong> - PS4 Dualshock Controller controlled vehicle<br>
                • Built from scratch with precise mechanics<br>
                • Wireless PS4 controller integration<br>
                <strong>Maze-Solving Vehicle</strong> - Autonomous robot that solves mazes automatically<br>
                • AI-based pathfinding<br>
                • Sensor integration & obstacle avoidance<br>
            </div>
            <div class="stats-block">
                <strong>▸ ROBOTICS ROLES:</strong><br>
                • Technology Head - Robotics Club & Robotics Stall<br>
                • HackClub Construct - 72+ hours CAD for robotics projects<br>
                • Drone Flight Controller Development (Jatayu V1.0)<br>
            </div>
        `,
        footer: 'Combining mechanical engineering, electronics, and programming to bring robotic innovations to life.'
    },
    'cfd': {
        title: 'CFD Analyst',
        description: 'Exploring computational fluid dynamics for performance optimization.',
        content: `
            <div class="stats-block">
                <strong>▸ CURRENT FOCUS:</strong><br>
                Participating in <strong>STEM Racing</strong> - Formula racing competition<br>
                Developing CFD analysis skills for aerodynamic optimization<br>
                Applying computational simulations for vehicle performance<br>
            </div>
            <p class="role-description">CFD expertise coming soon as part of STEM Racing competition work. Stay tuned for exciting aerodynamic projects!</p>
        `
    }
};

// Initialize role selector
document.addEventListener('DOMContentLoaded', () => {
    const roleSelector = document.getElementById('roleSelector');
    if (roleSelector) {
        roleSelector.addEventListener('change', (e) => {
            renderRoleContent(e.target.value);
        });
        // Load default role
        renderRoleContent('fullstack');
    }
});

function renderRoleContent(role) {
    const contentDiv = document.getElementById('curatedContent');
    const roleData = roleContent[role];
    
    if (!roleData || !contentDiv) return;
    
    let html = `
        <div class="role-section">
            <div class="role-title">▸ ${roleData.title.toUpperCase()}</div>
            <p class="role-description">${roleData.description}</p>
    `;
    
    if (roleData.content) {
        html += roleData.content;
    }
    
    if (roleData.projects && roleData.projects.length > 0) {
        html += '<div class="role-projects">';
        roleData.projects.forEach(project => {
            html += `
                <div class="project-card">
                    <div class="project-card-title">★ ${project.name}</div>
                    <div class="project-card-desc">${project.desc}</div>
                    <div class="project-card-links">
            `;
            project.links.forEach(link => {
                html += `<a href="${link.url}" target="_blank" rel="noopener noreferrer" class="project-link">${link.text}</a>`;
            });
            html += `
                    </div>
                </div>
            `;
        });
        html += '</div>';
    }
    
    if (roleData.footer) {
        html += `<p class="role-description" style="margin-top: 15px; font-style: italic;">${roleData.footer}</p>`;
    }
    
    html += '</div>';
    contentDiv.innerHTML = html;
}

// ===== CONSOLE EASTER EGG =====
console.log('%c🎮 PORTFOLIO.EXE 🎮', 'font-size: 20px; color: #9dff9d; font-weight: bold;');
console.log('%cWelcome to my retro portfolio!', 'font-size: 14px; color: #c9b896;');
console.log('%cTry the Konami Code: ↑ ↑ ↓ ↓ ← → ← → B A', 'font-size: 12px; color: #8ba888;');
console.log('%cBuilt with love and pixels 💚', 'font-size: 10px; color: #6b5d48;');
