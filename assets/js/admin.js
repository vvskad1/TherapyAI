/**
 * Admin page logic for Therapy AI Demo
 * Handles therapist management, CRUD operations, and UI interactions
 */

import { requireAdmin } from './auth.js';
import { 
    getTherapists, 
    addTherapist, 
    updateTherapist, 
    deleteTherapist,
    getUsers,
    setUsers,
    getChildren,
    genId,
    nowISO
} from './storage.js';
import { 
    showToast, 
    confirmModal, 
    bindForm, 
    formatDate, 
    createSidebarNav,
    createEmptyState,
    generateRandomPassword,
    escapeHtml
} from './ui.js?v=1.1';

// Admin sidebar navigation
const adminNavItems = [
    { page: 'dashboard', href: '#', label: 'Dashboard', icon: 'bi bi-speedometer2' },
    { page: 'add-therapist', modal: '#addTherapistModal', label: 'Add Therapist', icon: 'bi bi-person-plus' },
    { page: 'manage', href: '#', label: 'Manage Therapists', icon: 'bi bi-people' },
    { page: 'logout', onclick: 'logout()', label: 'Logout', icon: 'bi bi-box-arrow-right' }
];

// Initialize admin page
function initAdmin() {
    // Check admin permissions
    if (!requireAdmin()) return;
    
    // Setup sidebar navigation
    setupSidebar();
    
    // Setup forms
    setupForms();
    
    // Load initial data
    loadTherapists();
    
    // Setup event listeners
    setupEventListeners();
}

function setupSidebar() {
    const sidebarContent = document.querySelectorAll('.sidebar-content');
    const navHtml = createSidebarNav(adminNavItems, 'dashboard');
    
    sidebarContent.forEach(el => {
        el.innerHTML = navHtml;
    });
    
    // Add event handlers for sidebar navigation
    setupSidebarHandlers();
}

function setupSidebarHandlers() {
    // Handle Therapists click
    const therapistLinks = document.querySelectorAll('.sidebar-content a[href="#"]');
    therapistLinks.forEach(link => {
        if (link.textContent.trim().includes('Therapists')) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                scrollToTop();
                updateSidebarActive('therapists');
            });
        }
    });
    
    // Handle Chat History click
    const chatHistoryLinks = document.querySelectorAll('a[href="#chatHistory"]');
    chatHistoryLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            scrollToChatHistory();
        });
    });
    
    // Handle Logout click  
    const logoutLinks = document.querySelectorAll('a[onclick="logout()"]');
    logoutLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            import('./auth.js').then(auth => {
                auth.logout();
            });
        });
    });
}

function scrollToTop() {
    window.scrollTo({ 
        top: 0, 
        behavior: 'smooth' 
    });
}

function scrollToChatHistory() {
    const chatSection = document.getElementById('chatHistory');
    if (chatSection) {
        chatSection.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }
}

function updateSidebarActive(activePage) {
    document.querySelectorAll('.sidebar-content .nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    if (activePage === 'therapists') {
        document.querySelectorAll('.sidebar-content .nav-link').forEach(link => {
            if (link.textContent.trim().includes('Therapists')) {
                link.classList.add('active');
            }
        });
    }
}

function setupForms() {
    // Add therapist form
    const addForm = document.getElementById('addTherapistForm');
    if (addForm) {
        bindForm(addForm, handleAddTherapist);
    }
    
    // Edit therapist form
    const editForm = document.getElementById('editTherapistForm');
    if (editForm) {
        bindForm(editForm, handleEditTherapist);
    }
}

function setupEventListeners() {
    // Reset password button
    const resetPasswordBtn = document.getElementById('resetPasswordBtn');
    if (resetPasswordBtn) {
        resetPasswordBtn.addEventListener('click', handleResetPassword);
    }
}

async function handleAddTherapist(formData) {
    try {
        // Create therapist record
        const therapist = {
            name: formData.therapistName,
            email: formData.therapistEmail
        };
        
        // Check if email already exists
        const users = getUsers();
        if (users.some(u => u.email === therapist.email)) {
            throw new Error('A user with this email already exists');
        }
        
        const newTherapist = addTherapist(therapist);
        
        // Create corresponding user account
        const newUser = {
            id: newTherapist.id, // Use same ID
            role: 'therapist',
            name: formData.therapistName,
            email: formData.therapistEmail,
            password: formData.therapistPassword,
            createdAt: nowISO()
        };
        
        users.push(newUser);
        setUsers(users);
        
        // Close modal and refresh table
        const modal = bootstrap.Modal.getInstance(document.getElementById('addTherapistModal'));
        modal.hide();
        
        loadTherapists();
        showToast(`Therapist ${newTherapist.name} added successfully!`, 'success');
        
    } catch (error) {
        throw error;
    }
}

async function handleEditTherapist(formData) {
    try {
        const therapistId = formData.editTherapistId;
        
        // Update therapist record
        const updatedTherapist = updateTherapist(therapistId, {
            name: formData.editTherapistName,
            email: formData.editTherapistEmail
        });
        
        if (!updatedTherapist) {
            throw new Error('Therapist not found');
        }
        
        // Update corresponding user
        const users = getUsers();
        const userIndex = users.findIndex(u => u.id === therapistId);
        if (userIndex !== -1) {
            users[userIndex].name = formData.editTherapistName;
            users[userIndex].email = formData.editTherapistEmail;
            setUsers(users);
        }
        
        // Close modal and refresh table
        const modal = bootstrap.Modal.getInstance(document.getElementById('editTherapistModal'));
        modal.hide();
        
        loadTherapists();
        showToast(`Therapist ${updatedTherapist.name} updated successfully!`, 'success');
        
    } catch (error) {
        throw error;
    }
}

function handleResetPassword() {
    const therapistId = document.getElementById('editTherapistId').value;
    const newPassword = generateRandomPassword();
    
    // Update user password
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === therapistId);
    
    if (userIndex !== -1) {
        users[userIndex].password = newPassword;
        setUsers(users);
        
        showToast(`New password generated: ${newPassword}`, 'warning');
    } else {
        showToast('Unable to reset password', 'danger');
    }
}

function loadTherapists() {
    const therapists = getTherapists();
    const children = getChildren();
    const tableBody = document.getElementById('therapistsTable');
    
    if (!tableBody) return;
    
    if (therapists.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center py-4">
                    ${createEmptyState(
                        'bi bi-people', 
                        'No Therapists Found', 
                        'Add your first therapist to get started.',
                        '<button class="btn btn-primary mt-2" data-bs-toggle="modal" data-bs-target="#addTherapistModal">Add Therapist</button>'
                    )}
                </td>
            </tr>
        `;
        return;
    }
    
    tableBody.innerHTML = therapists.map(therapist => {
        const clientCount = children.filter(c => c.therapistId === therapist.id).length;
        
        return `
            <tr>
                <td>
                    <div class="fw-semibold">${escapeHtml(therapist.name)}</div>
                </td>
                <td>
                    <span class="text-muted">${escapeHtml(therapist.email)}</span>
                </td>
                <td>
                    <span class="badge bg-primary rounded-pill">${clientCount}</span>
                </td>
                <td>
                    <small class="text-muted">${formatDate(therapist.createdAt)}</small>
                </td>
                <td class="text-center">
                    <div class="btn-group btn-group-sm" role="group">
                        <button type="button" class="btn btn-outline-primary" 
                                onclick="editTherapist('${therapist.id}')"
                                aria-label="Edit therapist ${escapeHtml(therapist.name)}">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button type="button" class="btn btn-outline-danger"
                                onclick="deleteTherapistConfirm('${therapist.id}', '${escapeHtml(therapist.name)}', ${clientCount})"
                                aria-label="Delete therapist ${escapeHtml(therapist.name)}">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// Global functions for onclick handlers
window.editTherapist = function(therapistId) {
    const therapists = getTherapists();
    const therapist = therapists.find(t => t.id === therapistId);
    
    if (!therapist) {
        showToast('Therapist not found', 'danger');
        return;
    }
    
    // Populate edit form
    document.getElementById('editTherapistId').value = therapist.id;
    document.getElementById('editTherapistName').value = therapist.name;
    document.getElementById('editTherapistEmail').value = therapist.email;
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('editTherapistModal'));
    modal.show();
};

window.deleteTherapistConfirm = function(therapistId, therapistName, clientCount) {
    if (clientCount > 0) {
        showToast(
            `Cannot delete ${therapistName}. This therapist has ${clientCount} assigned client${clientCount === 1 ? '' : 's'}.`,
            'danger'
        );
        return;
    }
    
    confirmModal({
        title: 'Delete Therapist',
        body: `Are you sure you want to delete <strong>${escapeHtml(therapistName)}</strong>? This action cannot be undone.`,
        confirmText: 'Delete',
        confirmVariant: 'danger',
        onConfirm: () => {
            try {
                // Delete therapist record
                deleteTherapist(therapistId);
                
                // Delete corresponding user account
                const users = getUsers();
                const filteredUsers = users.filter(u => u.id !== therapistId);
                setUsers(filteredUsers);
                
                loadTherapists();
                showToast(`${therapistName} has been deleted`, 'success');
                
            } catch (error) {
                showToast('Error deleting therapist: ' + error.message, 'danger');
            }
        }
    });
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initAdmin);