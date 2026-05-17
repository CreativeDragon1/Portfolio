// Check if already logged in
window.addEventListener('load', () => {
    loadAwards();
    initAdminClock();
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
