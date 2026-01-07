// ===== ADMIN AUTHENTICATION =====
const ADMIN_PASSWORD = "Raahi%123"; // Change this to your secure password
let isAuthenticated = false;

// Check if already logged in
window.addEventListener('load', () => {
    const savedAuth = sessionStorage.getItem('adminAuth');
    if (savedAuth === 'true') {
        showDashboard();
    }
    initAdminClock();
});

// Login functionality
document.getElementById('loginBtn').addEventListener('click', login);
document.getElementById('adminPassword').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') login();
});

function login() {
    const password = document.getElementById('adminPassword').value;
    const errorDiv = document.getElementById('loginError');
    
    if (password === ADMIN_PASSWORD) {
        sessionStorage.setItem('adminAuth', 'true');
        isAuthenticated = true;
        errorDiv.textContent = '';
        showDashboard();
    } else {
        errorDiv.textContent = '✕ ACCESS DENIED - INVALID PASSWORD';
        document.getElementById('adminPassword').value = '';
    }
}

function showDashboard() {
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('adminDashboard').classList.remove('hidden');
    loadAwards();
}

// Logout functionality
document.getElementById('logoutBtn').addEventListener('click', () => {
    sessionStorage.removeItem('adminAuth');
    isAuthenticated = false;
    document.getElementById('adminDashboard').classList.add('hidden');
    document.getElementById('loginScreen').classList.remove('hidden');
    document.getElementById('adminPassword').value = '';
});

// ===== ADMIN CLOCK =====
function initAdminClock() {
    function updateTime() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const timeElement = document.getElementById('adminTime');
        if (timeElement) {
            timeElement.textContent = `${hours}:${minutes}:${seconds}`;
        }
    }
    updateTime();
    setInterval(updateTime, 1000);
}

// ===== AWARDS MANAGEMENT =====
let awards = [];
let editingAwardId = null;

// Load awards from localStorage
function loadAwards() {
    const savedAwards = localStorage.getItem('portfolioAwards');
    if (savedAwards) {
        awards = JSON.parse(savedAwards);
    } else {
        // Initialize with default awards if none exist
        awards = [
            { id: 1, icon: "★★★", title: "GIIS 2K25", desc: "Overall Winner" },
            { id: 2, icon: "[1ST]", title: "InnovateHacks 2.0", desc: "Top placement for innovative build" },
            { id: 3, icon: "▲▲▲", title: "Learn 2 Build 2024", desc: "Winner – XYZ Domain & Interview Cake License" },
            { id: 4, icon: "[2ND]", title: "CyberHacks", desc: "Second Place (Winner Track)" },
            { id: 5, icon: "◆◆◆", title: "GIA Hacks 2", desc: "Winner track recognition" },
            { id: 6, icon: "►►►", title: "CSPSC Hacks", desc: "Winner – Honorable Mention" },
            { id: 7, icon: "[3RD]", title: "Lift Off", desc: "2nd Runner Up" },
            { id: 8, icon: "★★★", title: "Valentine Hacks by EduLearn", desc: "Winner – First Place" },
            { id: 9, icon: "■■■", title: "EduCathor", desc: "Winner – 1st" }
        ];
        saveAwards();
    }
    renderAwardsList();
}

// Save awards to localStorage
function saveAwards() {
    localStorage.setItem('portfolioAwards', JSON.stringify(awards));
    renderAwardsList();
}

// Render awards list in admin
function renderAwardsList() {
    const listContainer = document.getElementById('awardsList');
    const countElement = document.getElementById('awardsCount');
    
    countElement.textContent = awards.length.toString().padStart(3, '0');
    
    if (awards.length === 0) {
        listContainer.innerHTML = '<div class="empty-state">NO AWARDS FOUND. ADD YOUR FIRST ACHIEVEMENT!</div>';
        return;
    }
    
    listContainer.innerHTML = awards.map(award => `
        <div class="admin-award-item" data-id="${award.id}">
            <div class="admin-award-icon award-icon-text">${award.icon}</div>
            <div class="admin-award-content">
                <div class="admin-award-title">${award.title}</div>
                <div class="admin-award-desc">${award.desc}</div>
            </div>
            <div class="admin-award-actions">
                <button class="admin-icon-btn edit-btn" onclick="editAward(${award.id})">
                    <span class="pixel-emoji">✏️</span>
                </button>
                <button class="admin-icon-btn delete-btn" onclick="deleteAward(${award.id})">
                    <span class="pixel-emoji">🗑️</span>
                </button>
            </div>
        </div>
    `).join('');
}

// Add/Update award form submission
document.getElementById('addAwardForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const icon = document.getElementById('awardIcon').value;
    const title = document.getElementById('awardTitle').value.trim();
    const desc = document.getElementById('awardDesc').value.trim();
    const editId = document.getElementById('editAwardId').value;
    
    if (!title || !desc) return;
    
    if (editId) {
        // Update existing award
        const index = awards.findIndex(a => a.id == editId);
        if (index !== -1) {
            awards[index] = { ...awards[index], icon, title, desc };
        }
        cancelEdit();
    } else {
        // Add new award
        const newId = awards.length > 0 ? Math.max(...awards.map(a => a.id)) + 1 : 1;
        awards.push({ id: newId, icon, title, desc });
    }
    
    saveAwards();
    e.target.reset();
    
    // Show success message
    showNotification('✓ AWARD SAVED SUCCESSFULLY', 'success');
});

// Edit award
function editAward(id) {
    const award = awards.find(a => a.id === id);
    if (!award) return;
    
    document.getElementById('awardIcon').value = award.icon;
    document.getElementById('awardTitle').value = award.title;
    document.getElementById('awardDesc').value = award.desc;
    document.getElementById('editAwardId').value = award.id;
    document.getElementById('cancelEditBtn').style.display = 'inline-block';
    
    // Scroll to form
    document.querySelector('.admin-form').scrollIntoView({ behavior: 'smooth' });
}

// Cancel edit
document.getElementById('cancelEditBtn').addEventListener('click', cancelEdit);

function cancelEdit() {
    document.getElementById('addAwardForm').reset();
    document.getElementById('editAwardId').value = '';
    document.getElementById('cancelEditBtn').style.display = 'none';
}

// Delete award
function deleteAward(id) {
    if (confirm('⚠️ DELETE THIS AWARD?\n\nThis action cannot be undone.')) {
        awards = awards.filter(a => a.id !== id);
        saveAwards();
        showNotification('✓ AWARD DELETED', 'success');
    }
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `admin-notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Sidebar navigation (for future sections)
document.querySelectorAll('.sidebar-btn[data-section]').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.sidebar-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});
