/**
 * UI utility module for Therapy AI Demo
 * Shared UI components: toasts, modals, form handling, templates
 */

// Toast management
export function showToast(message, variant = 'primary') {
    const toastContainer = document.getElementById('toastContainer');
    
    const toastId = 'toast-' + Date.now();
    const toastHtml = `
        <div class="toast" role="alert" aria-live="assertive" aria-atomic="true" id="${toastId}">
            <div class="toast-header">
                <div class="rounded me-2 ${getToastIconClass(variant)}" style="width: 20px; height: 20px;"></div>
                <strong class="me-auto">${getToastTitle(variant)}</strong>
                <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
                ${message}
            </div>
        </div>
    `;
    
    toastContainer.insertAdjacentHTML('beforeend', toastHtml);
    const toastElement = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastElement, {
        autohide: true,
        delay: 5000
    });
    
    // Remove element after hiding
    toastElement.addEventListener('hidden.bs.toast', () => {
        toastElement.remove();
    });
    
    toast.show();
}

function getToastIconClass(variant) {
    const classes = {
        'primary': 'bg-primary',
        'success': 'bg-success',
        'danger': 'bg-danger',
        'warning': 'bg-warning',
        'info': 'bg-info'
    };
    return classes[variant] || 'bg-primary';
}

function getToastTitle(variant) {
    const titles = {
        'primary': 'Info',
        'success': 'Success',
        'danger': 'Error',
        'warning': 'Warning',
        'info': 'Information'
    };
    return titles[variant] || 'Notification';
}

// Confirmation modal
export function confirmModal({ title, body, confirmText = 'Confirm', confirmVariant = 'danger', onConfirm }) {
    // Remove existing confirm modal if any
    const existingModal = document.getElementById('confirmModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    const modalHtml = `
        <div class="modal fade" id="confirmModal" tabindex="-1" aria-labelledby="confirmModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="confirmModalLabel">${title}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        ${body}
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-${confirmVariant}" id="confirmModalBtn">${confirmText}</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    const modalElement = document.getElementById('confirmModal');
    const modal = new bootstrap.Modal(modalElement);
    
    // Handle confirm button
    document.getElementById('confirmModalBtn').addEventListener('click', () => {
        modal.hide();
        if (onConfirm) onConfirm();
    });
    
    // Clean up after modal is hidden
    modalElement.addEventListener('hidden.bs.modal', () => {
        modalElement.remove();
    });
    
    modal.show();
}

// Form handling with Bootstrap validation
export function bindForm(formElement, submitHandler) {
    if (!formElement) {
        console.error('bindForm: formElement is null or undefined');
        return;
    }
    
    console.log('Binding form:', formElement.id || 'unnamed form');
    
    formElement.addEventListener('submit', async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (formElement.checkValidity()) {
            const formData = new FormData(formElement);
            const data = Object.fromEntries(formData.entries());
            
            try {
                // Add loading state
                const submitBtn = formElement.querySelector('button[type="submit"]');
                if (!submitBtn) {
                    console.warn(`No submit button found in form: ${formElement.id || 'unnamed'}`);
                }
                const originalText = submitBtn ? submitBtn.innerHTML : '';
                if (submitBtn) {
                    submitBtn.classList.add('loading');
                    submitBtn.disabled = true;
                }
                
                await submitHandler(data);
                
                // Reset form and validation
                formElement.reset();
                formElement.classList.remove('was-validated');
                
                // Remove loading state
                if (submitBtn) {
                    submitBtn.classList.remove('loading');
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                }
                
            } catch (error) {
                console.error('Form submission error:', error);
                showToast(error.message || 'An error occurred', 'danger');
                
                // Remove loading state
                const submitBtn = formElement.querySelector('button[type="submit"]');
                if (submitBtn) {
                    submitBtn.classList.remove('loading');
                    submitBtn.disabled = false;
                }
            }
        }
        
        formElement.classList.add('was-validated');
    });
}

// Date formatters
export function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

export function formatDateTime(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

export function formatTimeAgo(dateStr) {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffHours < 1) {
        return 'Just now';
    } else if (diffHours < 24) {
        return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
    } else if (diffDays < 7) {
        return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
    } else {
        return formatDate(dateStr);
    }
}

// Sidebar template
export function createSidebarNav(items, currentPage) {
    return `
        <nav class="nav flex-column">
            ${items.map(item => `
                <a class="nav-link ${item.page === currentPage ? 'active' : ''}" 
                   href="${item.href || '#'}" 
                   ${item.onclick ? `onclick="${item.onclick}"` : ''}
                   ${item.modal ? `data-bs-toggle="modal" data-bs-target="${item.modal}"` : ''}
                   aria-label="${item.label}">
                    <i class="${item.icon}"></i>
                    ${item.label}
                </a>
            `).join('')}
        </nav>
    `;
}

// Table row templates
export function createTableRow(data, template) {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
        return data[key] || '';
    });
}

// Empty state template
export function createEmptyState(icon, title, description, actionButton = null) {
    return `
        <div class="empty-state">
            <i class="${icon}"></i>
            <h5>${title}</h5>
            <p class="text-muted">${description}</p>
            ${actionButton ? actionButton : ''}
        </div>
    `;
}

// Loading state
export function showLoading(element, show = true) {
    if (show) {
        element.innerHTML = `
            <div class="d-flex justify-content-center align-items-center" style="min-height: 200px;">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
        `;
    }
}

// Escape HTML
export function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Random generators for demo purposes
export function generateRandomPassword(length = 10) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// Keyboard navigation helpers
export function setupKeyboardNavigation() {
    // Close modals with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            // Close any open modals
            const openModals = document.querySelectorAll('.modal.show');
            openModals.forEach(modal => {
                const modalInstance = bootstrap.Modal.getInstance(modal);
                if (modalInstance) modalInstance.hide();
            });
            
            // Close any open offcanvas
            const openOffcanvas = document.querySelectorAll('.offcanvas.show');
            openOffcanvas.forEach(offcanvas => {
                const offcanvasInstance = bootstrap.Offcanvas.getInstance(offcanvas);
                if (offcanvasInstance) offcanvasInstance.hide();
            });
        }
    });
}

// Initialize UI utilities
document.addEventListener('DOMContentLoaded', () => {
    setupKeyboardNavigation();
    
    // Auto-focus first input in modals
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('shown.bs.modal', () => {
            const firstInput = modal.querySelector('input, textarea, select');
            if (firstInput) firstInput.focus();
        });
    });
});