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

// ===== CONSOLE EASTER EGG =====
console.log('%c🎮 PORTFOLIO.EXE 🎮', 'font-size: 20px; color: #9dff9d; font-weight: bold;');
console.log('%cWelcome to my retro portfolio!', 'font-size: 14px; color: #c9b896;');
console.log('%cTry the Konami Code: ↑ ↑ ↓ ↓ ← → ← → B A', 'font-size: 12px; color: #8ba888;');
console.log('%cBuilt with love and pixels 💚', 'font-size: 10px; color: #6b5d48;');
