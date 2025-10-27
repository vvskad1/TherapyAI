/**
 * Child workspace page logic for Therapy AI Demo
 * Handles child profile, milestones, strategies, and AI chat functionality
 */

import { requireTherapist, getCurrentUser, canAccessChild } from './auth.js';
import { 
    getChildById,
    updateChild,
    deleteChild,
    getChats,
    addChatMessage,
    calcAgeYears
} from './storage.js';
import { 
    showToast, 
    confirmModal, 
    bindForm, 
    formatDate,
    formatTimeAgo,
    escapeHtml
} from './ui.js?v=1.1';

let currentUser = null;
let currentChild = null;
let childId = null;

// Mock data for milestones and strategies
const sampleMilestones = [
    "Follow one-step directions consistently",
    "Label 20+ familiar objects spontaneously", 
    "Maintain shared attention for 3+ minutes",
    "Use gestures to communicate needs",
    "Imitate simple actions and sounds",
    "Respond to name when called",
    "Show interest in social games",
    "Use eye contact during interactions",
    "Produce target sounds in isolation with 80% accuracy",
    "Use 2-word combinations spontaneously",
    "Follow 2-step directions in structured settings",
    "Maintain topic for 3+ conversational turns",
    "Use appropriate volume and rate of speech",
    "Demonstrate understanding of basic concepts (big/small, in/out)",
    "Initiate communication for requesting and commenting",
    "Use polite forms (please, thank you) appropriately",
    "Answer simple wh-questions (who, what, where)",
    "Participate in group activities for 10+ minutes",
    "Use functional communication in daily routines",
    "Demonstrate turn-taking skills in play",
    "Express basic emotions verbally",
    "Follow classroom routines independently",
    "Use appropriate pragmatic skills (greetings, eye contact)",
    "Demonstrate phonological awareness skills"
];

const sampleStrategies = [
    "Model short phrases during play activities",
    "Use gestures combined with verbal prompts", 
    "Expand child's utterances by adding one word",
    "Wait for child's response before continuing",
    "Use visual supports to aid comprehension",
    "Create opportunities for requesting",
    "Follow child's interests during therapy",
    "Provide immediate positive reinforcement",
    "Use environmental arrangement to encourage communication",
    "Implement naturalistic teaching strategies",
    "Practice target skills in multiple contexts",
    "Use peer modeling during group activities",
    "Incorporate movement and sensory activities",
    "Use technology and apps for engagement",
    "Practice social scripts for common situations",
    "Use video modeling for skill demonstration",
    "Implement choice-making throughout sessions",
    "Use music and rhythm for speech timing",
    "Practice skills during preferred activities",
    "Use systematic prompting and fading procedures",
    "Incorporate family priorities and routines",
    "Use positive behavior support strategies",
    "Practice generalization across settings and people",
    "Use data collection for progress monitoring"
];

// Initialize child page
function initChild() {
    // Check therapist permissions
    if (!requireTherapist()) return;
    
    currentUser = getCurrentUser();
    
    // Get child ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    childId = urlParams.get('id');
    
    if (!childId) {
        showToast('Child ID not found', 'danger');
        setTimeout(() => window.location.href = 'therapist.html', 2000);
        return;
    }
    
    // Load child data
    loadChild();
    
    // Setup forms and event listeners
    setupForms();
    setupEventListeners();
}

async function loadChild() {
    currentChild = getChildById(childId);
    
    if (!currentChild) {
        showToast('Child not found', 'danger');
        setTimeout(() => window.location.href = 'therapist.html', 2000);
        return;
    }
    
    // Check if user can access this child
    const canAccess = await canAccessChild(childId);
    if (!canAccess) {
        showToast('Access denied', 'danger');
        setTimeout(() => window.location.href = 'therapist.html', 2000);
        return;
    }
    
    // Update page header
    updateHeader();
    
    // Load child details
    loadChildDetails();
    
    // Load milestones and strategies
    loadMilestones();
    loadStrategies();
    
    // Load chat messages
    loadChatMessages();
}

function updateHeader() {
    const nameHeader = document.getElementById('childNameHeader');
    const ageHeader = document.getElementById('childAgeHeader');
    
    if (nameHeader) {
        nameHeader.textContent = currentChild.name;
    }
    
    if (ageHeader) {
        ageHeader.textContent = `Age: ${currentChild.ageYears} years`;
    }
}

function loadChildDetails() {
    const detailsSection = document.getElementById('childDetailsSection');
    
    if (!detailsSection) return;
    
    detailsSection.innerHTML = `
        <div class="col-md-6">
            <div class="mb-3">
                <label class="form-label fw-semibold">Year of Birth</label>
                <p class="form-control-plaintext">${currentChild.dob.split('-')[0]}</p>
            </div>
            <div class="mb-3">
                <label class="form-label fw-semibold">Development Category</label>
                <p class="form-control-plaintext">
                    <span class="badge bg-secondary">${escapeHtml(currentChild.category || 'Not Set')}</span>
                </p>
            </div>
            <div class="mb-3">
                <label class="form-label fw-semibold">Primary Concern</label>
                <p class="form-control-plaintext">${escapeHtml(currentChild.concern)}</p>
            </div>
        </div>
        <div class="col-md-6">
            <div class="mb-3">
                <label class="form-label fw-semibold">Last Updated</label>
                <p class="form-control-plaintext">${formatTimeAgo(currentChild.updatedAt)}</p>
            </div>
        </div>
        ${currentChild.notes ? `
            <div class="col-12">
                <div class="mb-3">
                    <label class="form-label fw-semibold">Notes</label>
                    <p class="form-control-plaintext">${escapeHtml(currentChild.notes)}</p>
                </div>
            </div>
        ` : ''}
    `;
}

function loadMilestones() {
    const milestonesList = document.getElementById('milestonesList');
    
    if (!milestonesList) return;
    
    // Get stored milestones or use defaults
    const milestones = currentChild.milestones || sampleMilestones.slice(0, 3);
    
    milestonesList.innerHTML = milestones.map((milestone, index) => `
        <li class="list-group-item d-flex align-items-center">
            <i class="bi bi-check-circle text-success me-3"></i>
            <span>${escapeHtml(milestone)}</span>
        </li>
    `).join('');
}

function loadStrategies() {
    const strategiesList = document.getElementById('strategiesList');
    
    if (!strategiesList) return;
    
    // Get stored strategies or use defaults
    const strategies = currentChild.strategies || sampleStrategies.slice(0, 3);
    
    strategiesList.innerHTML = strategies.map((strategy, index) => `
        <li class="list-group-item d-flex align-items-center">
            <i class="bi bi-lightbulb text-warning me-3"></i>
            <span>${escapeHtml(strategy)}</span>
        </li>
    `).join('');
}

function loadChatMessages() {
    const chatMessages = document.getElementById('chatMessages');
    
    if (!chatMessages) return;
    
    const chats = getChats(childId);
    
    if (chats.length === 0) {
        chatMessages.innerHTML = `
            <div class="text-center text-muted py-4">
                <i class="bi bi-chat-dots-fill fs-1 mb-3 d-block opacity-50"></i>
                <p>No messages yet. Start a conversation with the AI assistant!</p>
            </div>
        `;
        return;
    }
    
    chatMessages.innerHTML = chats.map(chat => `
        <div class="chat-message ${chat.from}">
            <div class="chat-bubble ${chat.from}">
                <div>${escapeHtml(chat.text)}</div>
                <div class="chat-timestamp">${formatTimeAgo(chat.ts)}</div>
            </div>
        </div>
    `).join('');
    
    // Scroll to bottom
    const messagesArea = document.getElementById('chatMessagesArea');
    if (messagesArea) {
        messagesArea.scrollTop = messagesArea.scrollHeight;
    }
}

function setupForms() {
    // Edit child form
    const editForm = document.getElementById('editChildForm');
    if (editForm) {
        bindForm(editForm, handleEditChild);
    }
    
    // Chat form
    const chatForm = document.getElementById('chatForm');
    if (chatForm) {
        bindForm(chatForm, handleSendMessage);
    }
}

function setupEventListeners() {
    // Delete child button
    const deleteBtn = document.getElementById('deleteChildBtn');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', handleDeleteChild);
    }
    
    // Regenerate buttons
    const regenerateTargetsBtn = document.getElementById('regenerateTargetsBtn');
    if (regenerateTargetsBtn) {
        regenerateTargetsBtn.addEventListener('click', () => regenerateContent('milestones'));
    }
    
    const regenerateStrategiesBtn = document.getElementById('regenerateStrategiesBtn');
    if (regenerateStrategiesBtn) {
        regenerateStrategiesBtn.addEventListener('click', () => regenerateContent('strategies'));
    }
    
    // Pre-populate edit form when modal opens
    const editModal = document.getElementById('editChildModal');
    if (editModal) {
        editModal.addEventListener('show.bs.modal', populateEditForm);
    }
}

function populateEditForm() {
    document.getElementById('editChildId').value = currentChild.id;
    document.getElementById('editChildIdField').value = currentChild.name;
    document.getElementById('editChildYob').value = currentChild.dob.split('-')[0];
    document.getElementById('editChildCategory').value = currentChild.category || '';
    document.getElementById('editChildConcern').value = currentChild.concern;
    document.getElementById('editChildNotes').value = currentChild.notes || '';
}

async function handleEditChild(formData) {
    try {
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
        
        // Update current child data
        currentChild = updatedChild;
        
        // Close modal and refresh display
        const modal = bootstrap.Modal.getInstance(document.getElementById('editChildModal'));
        modal.hide();
        
        updateHeader();
        loadChildDetails();
        showToast(`${updatedChild.name}'s information has been updated!`, 'success');
        
    } catch (error) {
        throw error;
    }
}

function handleDeleteChild() {
    confirmModal({
        title: 'Delete Child',
        body: `Are you sure you want to delete <strong>${escapeHtml(currentChild.name)}</strong>? This will also delete all chat history and therapy data. This action cannot be undone.`,
        confirmText: 'Delete',
        confirmVariant: 'danger',
        onConfirm: () => {
            try {
                deleteChild(childId);
                showToast(`${currentChild.name} has been deleted`, 'success');
                setTimeout(() => window.location.href = 'therapist.html', 2000);
                
            } catch (error) {
                showToast('Error deleting child: ' + error.message, 'danger');
            }
        }
    });
}

async function handleSendMessage(formData) {
    const messageText = formData.chatInput.trim();
    
    if (!messageText) {
        throw new Error('Please enter a message');
    }
    
    try {
        // Add therapist message
        addChatMessage(childId, 'therapist', messageText);
        
        // Reload messages
        loadChatMessages();
        
        // Generate AI response after a short delay
        setTimeout(() => {
            const aiResponse = generateAIResponse(messageText, currentChild);
            addChatMessage(childId, 'ai', aiResponse);
            loadChatMessages();
        }, 500);
        
    } catch (error) {
        throw error;
    }
}

function generateAIResponse(userMessage, child) {
    // Simple AI response generator for demo purposes
    const responses = [
        `For ${child.name}, I recommend focusing on their primary concern: ${child.concern}. Try incorporating play-based activities that target this specific area.`,
        
        `Based on ${child.name}'s age (${child.ageYears} years), here are some developmentally appropriate strategies you could try...`,
        
        `Consider using visual supports and hands-on activities with ${child.name}. Children at this age respond well to multi-sensory approaches.`,
        
        `It's great that you're working on this with ${child.name}. Remember to follow their lead and build on their interests to maintain engagement.`,
        
        `For speech and language development, try the 'wait time' strategy with ${child.name}. Give them extra time to process and respond.`,
        
        `Have you tried using songs or rhythmic activities with ${child.name}? Music can be very effective for speech and language goals.`,
        
        `Consider breaking down complex tasks into smaller steps for ${child.name}. This can help reduce frustration and increase success.`
    ];
    
    // Select a random response
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    // Add some variation based on keywords in the user message
    if (userMessage.toLowerCase().includes('articulation') || userMessage.toLowerCase().includes('speech')) {
        return `For articulation work with ${child.name}, try these techniques: 1) Use a mirror for visual feedback, 2) Practice target sounds in isolation first, 3) Move to syllables, then words, 4) Use fun games and activities to maintain motivation.`;
    }
    
    if (userMessage.toLowerCase().includes('behavior') || userMessage.toLowerCase().includes('attention')) {
        return `For attention and behavior with ${child.name}, consider: 1) Establishing clear routines and expectations, 2) Using visual schedules, 3) Providing frequent breaks, 4) Incorporating movement breaks, 5) Using positive reinforcement strategies.`;
    }
    
    if (userMessage.toLowerCase().includes('language') || userMessage.toLowerCase().includes('vocabulary')) {
        return `To support language development with ${child.name}: 1) Model expanded language, 2) Use the 'comment, don't command' approach, 3) Read books together, 4) Narrate daily activities, 5) Give choices to encourage communication.`;
    }
    
    return randomResponse;
}

function regenerateContent(type) {
    const isTargets = type === 'milestones';
    const sourceArray = isTargets ? sampleMilestones : sampleStrategies;
    
    // Shuffle and pick 3 new items
    const shuffled = sourceArray.sort(() => 0.5 - Math.random());
    const newItems = shuffled.slice(0, 3);
    
    // Update child record
    const updates = {};
    updates[type] = newItems;
    
    const updatedChild = updateChild(childId, updates);
    
    if (updatedChild) {
        currentChild = updatedChild;
        
        if (isTargets) {
            loadMilestones();
        } else {
            loadStrategies();
        }
        
        showToast(`Updated ${isTargets ? 'targets' : 'strategies'} for ${currentChild.name}!`, 'success');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initChild);