/**
 * Therapist page logic for Therapy AI Demo
 * Handles child/client management, CRUD operations, and chat history
 */

import { requireTherapist, getCurrentUser } from './auth.js';
import { 
    getChildrenByTherapist,
    addChild,
    updateChild,
    deleteChild,
    getChats,
    nowISO
} from './storage.js';
import { 
    showToast, 
    confirmModal, 
    bindForm, 
    formatDate,
    formatTimeAgo,
    createSidebarNav,
    createEmptyState,
    escapeHtml
} from './ui.js?v=1.1';

// Therapist sidebar navigation
const therapistNavItems = [
    { page: 'clients', href: '#', label: 'My Clients', icon: 'bi bi-people' },
    { page: 'add-child', modal: '#addChildModal', label: 'Add Child', icon: 'bi bi-person-plus' },
    { page: 'chat-history', href: '#chatHistory', label: 'Chat History', icon: 'bi bi-chat-dots' },
    { page: 'logout', onclick: 'logout()', label: 'Logout', icon: 'bi bi-box-arrow-right' }
];

let currentUser = null;

// Initialize therapist page
function initTherapist() {
    // Check therapist permissions
    if (!requireTherapist()) return;
    
    currentUser = getCurrentUser();
    
    // Setup sidebar navigation
    setupSidebar();
    
    // Setup forms
    setupForms();
    
    // Load initial data
    loadChildren();
    loadChatHistory();
    
    // Setup event listeners
    setupEventListeners();
}

function setupSidebar() {
    const sidebarContent = document.querySelectorAll('.sidebar-content');
    const navHtml = createSidebarNav(therapistNavItems, 'clients');
    
    sidebarContent.forEach(el => {
        el.innerHTML = navHtml;
    });
    
    // Add event handlers for sidebar navigation
    setupSidebarHandlers();
}

function setupSidebarHandlers() {
    // Handle My Clients click
    const clientsLinks = document.querySelectorAll('.sidebar-content a[href="#"]');
    clientsLinks.forEach(link => {
        if (link.textContent.trim().includes('My Clients')) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                scrollToTop();
                updateSidebarActive('clients');
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

function updateSidebarActive(activePage) {
    document.querySelectorAll('.sidebar-content .nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    if (activePage === 'clients') {
        document.querySelectorAll('.sidebar-content .nav-link').forEach(link => {
            if (link.textContent.trim().includes('My Clients')) {
                link.classList.add('active');
            }
        });
    }
}

function scrollToChatHistory() {
    const chatHistorySection = document.getElementById('chatHistorySection');
    if (chatHistorySection) {
        chatHistorySection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
        
        // Update active state
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelectorAll('a[href="#chatHistory"]').forEach(link => {
            link.classList.add('active');
        });
    }
}

function setupForms() {
    // Add child form
    const addForm = document.getElementById('addChildForm');
    if (addForm) {
        bindForm(addForm, handleAddChild);
    }
    
    // Edit child form
    const editForm = document.getElementById('editChildForm');
    if (editForm) {
        bindForm(editForm, handleEditChild);
    }
}

function setupEventListeners() {
    // Any additional event listeners can go here
}

async function handleAddChild(formData) {
    try {
        const child = {
            therapistId: currentUser.id,
            name: formData.childId,
            dob: formData.childYob + '-01-01',
            category: formData.childCategory,
            concern: formData.childConcern,
            guardian: '',
            notes: formData.childNotes || ''
        };
        
        const newChild = addChild(child);
        
        // Close modal and refresh table
        const modal = bootstrap.Modal.getInstance(document.getElementById('addChildModal'));
        modal.hide();
        
        loadChildren();
        showToast(`${newChild.name} has been added to your clients!`, 'success');
        
    } catch (error) {
        throw error;
    }
}

async function handleEditChild(formData) {
    try {
        const childId = formData.editChildId;
        
        const updatedChild = updateChild(childId, {
            name: formData.editChildIdField,
            dob: formData.editChildYob + '-01-01',
            category: formData.editChildCategory,
            concern: formData.editChildConcern,
            guardian: '',
            notes: formData.editChildNotes || ''
        });
        
        if (!updatedChild) {
            throw new Error('Child not found');
        }
        
        // Close modal and refresh table
        const modal = bootstrap.Modal.getInstance(document.getElementById('editChildModal'));
        modal.hide();
        
        loadChildren();
        showToast(`${updatedChild.name}'s information has been updated!`, 'success');
        
    } catch (error) {
        throw error;
    }
}

function loadChildren() {
    const children = getChildrenByTherapist(currentUser.id);
    const tableBody = document.getElementById('childrenTable');
    
    if (!tableBody) return;
    
    if (children.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center py-4">
                    ${createEmptyState(
                        'bi bi-people', 
                        'No Clients Yet', 
                        'Add your first child to start therapy sessions.',
                        '<button class="btn btn-primary mt-2" data-bs-toggle="modal" data-bs-target="#addChildModal">Add Child</button>'
                    )}
                </td>
            </tr>
        `;
        return;
    }
    
    tableBody.innerHTML = children.map(child => {
        return `
            <tr>
                <td>
                    <a href="child.html?id=${child.id}" class="text-decoration-none fw-semibold">
                        ${escapeHtml(child.name)}
                    </a>
                </td>
                <td>
                    <span class="text-muted">${child.ageYears} years</span>
                </td>
                <td>
                    <span class="badge bg-secondary">${escapeHtml(child.category || 'Not Set')}</span>
                </td>
                <td>
                    <span class="text-truncate d-inline-block" style="max-width: 200px;" 
                          title="${escapeHtml(child.concern)}">
                        ${escapeHtml(child.concern)}
                    </span>
                </td>
                <td>
                    <small class="text-muted">${formatTimeAgo(child.updatedAt)}</small>
                </td>
                <td class="text-center">
                    <div class="btn-group btn-group-sm" role="group">
                        <button type="button" class="btn btn-outline-primary" 
                                onclick="editChild('${child.id}')"
                                aria-label="Edit child ${escapeHtml(child.name)}">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button type="button" class="btn btn-outline-danger"
                                onclick="deleteChildConfirm('${child.id}', '${escapeHtml(child.name)}')"
                                aria-label="Delete child ${escapeHtml(child.name)}">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function loadChatHistory() {
    const children = getChildrenByTherapist(currentUser.id);
    const chatHistorySection = document.getElementById('chatHistorySection');
    
    if (!chatHistorySection) return;
    
    if (children.length === 0) {
        chatHistorySection.innerHTML = createEmptyState(
            'bi bi-chat-dots',
            'No Chat History',
            'Chat history will appear here once you start conversations with the AI assistant.'
        );
        return;
    }
    
    const chatSummaries = children.map(child => {
        const chats = getChats(child.id);
        const lastChat = chats.length > 0 ? chats[chats.length - 1] : null;
        
        return {
            child,
            messageCount: chats.length,
            lastMessage: lastChat
        };
    }).filter(summary => summary.messageCount > 0);
    
    if (chatSummaries.length === 0) {
        chatHistorySection.innerHTML = createEmptyState(
            'bi bi-chat-dots',
            'No Chat History',
            'Start a conversation with the AI assistant to see chat history here.'
        );
        return;
    }
    
    chatHistorySection.innerHTML = `
        <div class="accordion" id="chatHistoryAccordion">
            ${chatSummaries.map((summary, index) => `
                <div class="accordion-item">
                    <h2 class="accordion-header" id="heading${index}">
                        <button class="accordion-button ${index === 0 ? '' : 'collapsed'}" type="button" 
                                data-bs-toggle="collapse" data-bs-target="#collapse${index}"
                                aria-expanded="${index === 0 ? 'true' : 'false'}" 
                                aria-controls="collapse${index}">
                            <div class="d-flex justify-content-between w-100 me-3">
                                <div>
                                    <strong>${escapeHtml(summary.child.name)}</strong>
                                    <small class="text-muted ms-2">${summary.messageCount} message${summary.messageCount === 1 ? '' : 's'}</small>
                                </div>
                                <small class="text-muted">
                                    ${summary.lastMessage ? formatTimeAgo(summary.lastMessage.ts) : ''}
                                </small>
                            </div>
                        </button>
                    </h2>
                    <div id="collapse${index}" class="accordion-collapse collapse ${index === 0 ? 'show' : ''}"
                         aria-labelledby="heading${index}" data-bs-parent="#chatHistoryAccordion">
                        <div class="accordion-body">
                            <div class="d-flex justify-content-between align-items-center mb-3">
                                <p class="mb-0 text-muted">Recent conversation snippets</p>
                                <a href="child.html?id=${summary.child.id}" class="btn btn-sm btn-outline-primary">
                                    <i class="bi bi-arrow-right me-1"></i>
                                    Open Workspace
                                </a>
                            </div>
                            ${renderChatPreview(summary.child.id)}
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function renderChatPreview(childId) {
    const chats = getChats(childId);
    const recentChats = chats.slice(-3); // Show last 3 messages
    
    return `
        <div class="chat-preview">
            ${recentChats.map(chat => `
                <div class="d-flex ${chat.from === 'therapist' ? 'justify-content-end' : 'justify-content-start'} mb-2">
                    <div class="chat-bubble ${chat.from}" style="max-width: 70%;">
                        <div>${escapeHtml(chat.text)}</div>
                        <div class="chat-timestamp">
                            ${formatTimeAgo(chat.ts)}
                        </div>
                    </div>
                </div>
            `).join('')}
            ${chats.length > 3 ? '<small class="text-muted">... and more messages</small>' : ''}
        </div>
    `;
}

// Global functions for onclick handlers
window.editChild = function(childId) {
    const children = getChildrenByTherapist(currentUser.id);
    const child = children.find(c => c.id === childId);
    
    if (!child) {
        showToast('Child not found', 'danger');
        return;
    }
    
    // Populate edit form
    document.getElementById('editChildId').value = child.id;
    document.getElementById('editChildIdField').value = child.name;
    document.getElementById('editChildYob').value = child.dob.split('-')[0];
    document.getElementById('editChildCategory').value = child.category || '';
    document.getElementById('editChildConcern').value = child.concern;
    document.getElementById('editChildNotes').value = child.notes || '';
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('editChildModal'));
    modal.show();
};

window.deleteChildConfirm = function(childId, childName) {
    confirmModal({
        title: 'Delete Child',
        body: `Are you sure you want to delete <strong>${escapeHtml(childName)}</strong>? This will also delete all chat history. This action cannot be undone.`,
        confirmText: 'Delete',
        confirmVariant: 'danger',
        onConfirm: () => {
            try {
                deleteChild(childId);
                loadChildren();
                loadChatHistory();
                showToast(`${childName} has been deleted`, 'success');
                
            } catch (error) {
                showToast('Error deleting child: ' + error.message, 'danger');
            }
        }
    });
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initTherapist);