/**
 * Authentication module for Therapy AI Demo
 * Handles login, logout, role-based routing and guards
 */

import { getUsers, getCurrentUser, setCurrentUser, clearCurrentUser } from './storage.js';

// Re-export storage functions for convenience
export { getCurrentUser, setCurrentUser, clearCurrentUser };

// Login function
export function login(email, password) {
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
        throw new Error('Invalid email or password');
    }
    
    setCurrentUser(user);
    return user;
}

// Logout function
export function logout() {
    clearCurrentUser();
    window.location.href = 'index.html';
}

// Role guards
export function requireAdmin() {
    const user = getCurrentUser();
    if (!user || user.role !== 'admin') {
        window.location.href = 'index.html';
        return false;
    }
    return true;
}

export function requireTherapist() {
    const user = getCurrentUser();
    if (!user || user.role !== 'therapist') {
        window.location.href = 'index.html';
        return false;
    }
    return true;
}

export function requireAuth() {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = 'index.html';
        return false;
    }
    return true;
}

// Check if user owns a child (for therapist role)
export async function canAccessChild(childId) {
    const user = getCurrentUser();
    if (!user) return false;
    
    if (user.role === 'admin') return true;
    
    if (user.role === 'therapist') {
        // Import here to avoid circular dependency
        const { getChildById } = await import('./storage.js');
        const child = getChildById(childId);
        return child && child.therapistId === user.id;
    }
    
    return false;
}

// Redirect to appropriate dashboard based on role
export function redirectToDashboard() {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = 'index.html';
        return;
    }
    
    if (user.role === 'admin') {
        window.location.href = 'admin.html';
    } else if (user.role === 'therapist') {
        window.location.href = 'therapist.html';
    } else {
        window.location.href = 'index.html';
    }
}

// Auto-redirect if already logged in (for login page)
export function autoRedirectIfLoggedIn() {
    const user = getCurrentUser();
    if (user) {
        redirectToDashboard();
    }
}

// Initialize auth guards and setup
document.addEventListener('DOMContentLoaded', () => {
    // Setup logout buttons (navbar dropdown)
    const logoutBtns = document.querySelectorAll('#logoutBtn, [data-action="logout"]');
    logoutBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    });
    
    // Update current user name in UI
    const user = getCurrentUser();
    if (user) {
        const userNameElements = document.querySelectorAll('#currentUserName');
        userNameElements.forEach(el => {
            el.textContent = user.name;
        });
    }
});