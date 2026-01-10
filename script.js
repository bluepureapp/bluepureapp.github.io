// ============================================
// CONFIGURATION - CHANGE THESE VALUES
// ============================================

// EmailJS Configuration
const EMAILJS_CONFIG = {
    SERVICE_ID: "YOUR_SERVICE_ID",     // Replace with your service ID
    TEMPLATE_ID: "YOUR_TEMPLATE_ID",   // Replace with your template ID
    PUBLIC_KEY: "YOUR_PUBLIC_KEY",     // Replace with your public key
    YOUR_EMAIL: "bluepureapp@gmail.com"
};

// Theme Data
const THEMES = [
    {
        id: "ocean-blue",
        name: "Ocean Blue",
        tag: "Popular",
        description: "Calm blue theme with wave animations perfect for corporate websites.",
        features: ["Smooth wave animations", "Blue gradient backgrounds", "Modern card design"],
        color: "#3A8DFF"
    },
    {
        id: "forest-green",
        name: "Forest Green",
        tag: "Eco-Friendly",
        description: "Nature-inspired theme with leaf animations and earthy tones.",
        features: ["Leaf particle effects", "Natural color palette", "Organic shapes"],
        color: "#48BB78"
    },
    {
        id: "sunset-orange",
        name: "Sunset Orange",
        tag: "Energetic",
        description: "Warm and vibrant theme with glowing effects and smooth transitions.",
        features: ["Glow animations", "Warm color scheme", "Dynamic shadows"],
        color: "#ED8936"
    },
    {
        id: "midnight-purple",
        name: "Midnight Purple",
        tag: "Premium",
        description: "Dark theme with neon accents and星空 effects for a premium look.",
        features: ["Star field background", "Neon glow effects", "Dark mode optimized"],
        color: "#9F7AEA"
    },
    {
        id: "minimal-white",
        name: "Minimal White",
        tag: "Clean",
        description: "Ultra-clean design with subtle animations and maximum readability.",
        features: ["Minimal animations", "High contrast", "Focus on typography"],
        color: "#2D3748"
    },
    {
        id: "gradient-mix",
        name: "Gradient Mix",
        tag: "Colorful",
        description: "Dynamic gradient theme that changes colors based on user interaction.",
        features: ["Color-changing gradients", "Interactive elements", "Smooth transitions"],
        color: "linear-gradient(135deg, #3A8DFF, #48BB78, #ED8936)"
    }
];

// ============================================
// APPLICATION STATE
// ============================================
let currentState = {
    selectedTheme: null,
    userData: null,
    isFormVisible: false,
    isPWAInstalled: false,
    deferredPrompt: null
};

// ============================================
// DOM ELEMENTS
// ============================================
const dom = {
    themeGrid: document.getElementById('themeGrid'),
    formModal: document.getElementById('formModal'),
    userForm: document.getElementById('userForm'),
    userName: document.getElementById('userName'),
    userPhone: document.getElementById('userPhone'),
    cancelBtn: document.getElementById('cancelBtn'),
    submitBtn: document.getElementById('submitBtn'),
    successToast: document.getElementById('successToast'),
    selectedThemePreview: document.getElementById('selectedThemePreview'),
    installButton: document.getElementById('installButton'),
    pwaToast: document.getElementById('pwaToast'),
    pwaClose: document.getElementById('pwaClose'),
    offlineIndicator: document.querySelector('.offline-indicator')
};

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Initialize EmailJS
    if (EMAILJS_CONFIG.PUBLIC_KEY && EMAILJS_CONFIG.PUBLIC_KEY !== "YOUR_PUBLIC_KEY") {
        emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
    }
    
    // Load user data from localStorage
    loadUserData();
    
    // Check PWA status
    checkPWAStatus();
    
    // Render theme cards
    renderThemes();
    
    // Setup event listeners
    setupEventListeners();
    
    // Add no-select class to elements
    addNoSelectClasses();
    
    // Initialize network status
    updateNetworkStatus();
    
    // Show PWA install prompt after delay
    setTimeout(showPWAInstallPrompt, 3000);
}

// ============================================
// PWA FUNCTIONALITY
// ============================================
function checkPWAStatus() {
    currentState.isPWAInstalled = window.matchMedia('(display-mode: standalone)').matches || 
                                  window.navigator.standalone ||
                                  document.referrer.includes('android-app://');
    
    if (currentState.isPWAInstalled) {
        if (dom.installButton) dom.installButton.style.display = 'none';
        if (dom.pwaToast) dom.pwaToast.style.display = 'none';
        console.log('📱 Running as installed PWA');
    }
}

function showPWAInstallPrompt() {
    if (currentState.isPWAInstalled || !dom.pwaToast) return;
    
    // Show toast after 3 seconds if not installed
    setTimeout(() => {
        if (dom.pwaToast && !currentState.isPWAInstalled) {
            dom.pwaToast.style.display = 'flex';
        }
    }, 3000);
}

// PWA Install Prompt Handler
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    currentState.deferredPrompt = e;
    
    if (dom.installButton) {
        dom.installButton.style.display = 'flex';
    }
});

if (dom.installButton) {
    dom.installButton.addEventListener('click', async () => {
        if (!currentState.deferredPrompt) return;
        
        currentState.deferredPrompt.prompt();
        const { outcome } = await currentState.deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
            console.log('✅ PWA installed');
            if (dom.installButton) {
                dom.installButton.innerHTML = '<i class="fas fa-check"></i><span>Installed</span>';
                dom.installButton.style.background = '#48BB78';
            }
            if (dom.pwaToast) dom.pwaToast.style.display = 'none';
            currentState.isPWAInstalled = true;
        }
        
        currentState.deferredPrompt = null;
        if (dom.installButton) dom.installButton.style.display = 'none';
    });
}

if (dom.pwaClose) {
    dom.pwaClose.addEventListener('click', () => {
        if (dom.pwaToast) dom.pwaToast.style.display = 'none';
    });
}

// Network Status
function updateNetworkStatus() {
    if (!navigator.onLine) {
        showOfflineIndicator();
    }
}

function showOfflineIndicator() {
    if (dom.offlineIndicator) {
        dom.offlineIndicator.style.display = 'flex';
    }
}

function hideOfflineIndicator() {
    if (dom.offlineIndicator) {
        dom.offlineIndicator.style.display = 'none';
    }
}

window.addEventListener('online', () => {
    hideOfflineIndicator();
    showToast('Back online!', 2000);
});

window.addEventListener('offline', () => {
    showOfflineIndicator();
    showToast('Offline mode - some features limited', 3000);
});

// ============================================
// LOCALSTORAGE MANAGEMENT
// ============================================
function loadUserData() {
    const savedData = localStorage.getItem('bluepure_user');
    if (savedData) {
        try {
            currentState.userData = JSON.parse(savedData);
            console.log('✅ User data loaded');
        } catch (e) {
            console.error('Error parsing saved data:', e);
            localStorage.removeItem('bluepure_user');
        }
    }
}

function saveUserData(userData) {
    const dataToSave = {
        ...userData,
        lastUpdated: new Date().toISOString(),
        isPWA: currentState.isPWAInstalled
    };
    
    localStorage.setItem('bluepure_user', JSON.stringify(dataToSave));
    currentState.userData = dataToSave;
    console.log('💾 User data saved');
    
    // Save to IndexedDB for PWA offline capability
    if ('indexedDB' in window) {
        saveToIndexedDB(dataToSave);
    }
}

async function saveToIndexedDB(data) {
    // Simple IndexedDB for PWA offline storage
    if (!window.indexedDB) return;
    
    const request = indexedDB.open('BluePureDB', 1);
    
    request.onupgradeneeded = function(event) {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('submissions')) {
            db.createObjectStore('submissions', { keyPath: 'id' });
        }
    };
    
    request.onsuccess = function(event) {
        const db = event.target.result;
        const transaction = db.transaction(['submissions'], 'readwrite');
        const store = transaction.objectStore('submissions');
        store.put({ ...data, synced: false, timestamp: Date.now() });
    };
}

// ============================================
// THEME RENDERING
// ============================================
function renderThemes() {
    if (!dom.themeGrid) return;
    
    dom.themeGrid.innerHTML = '';
    
    THEMES.forEach(theme => {
        const themeCard = createThemeCard(theme);
        dom.themeGrid.appendChild(themeCard);
    });
}

function createThemeCard(theme) {
    const card = document.createElement('div');
    card.className = 'theme-card no-select';
    card.setAttribute('data-theme-id', theme.id);
    
    const patternStyle = typeof theme.color === 'string' 
        ? `background: ${theme.color};`
        : `background: ${theme.color};`;
    
    card.innerHTML = `
        <div class="theme-image" style="${patternStyle}"></div>
        <div class="theme-content">
            <div class="theme-name">
                <span>${theme.name}</span>
                <span class="theme-tag">${theme.tag}</span>
            </div>
            <p class="theme-desc">${theme.description}</p>
            <ul class="theme-features">
                ${theme.features.map(feature => `
                    <li><i class="fas fa-check"></i> ${feature}</li>
                `).join('')}
            </ul>
            <button class="btn-choose no-select" data-theme-id="${theme.id}">
                <i class="fas fa-magic"></i>
                Choose This Design
            </button>
        </div>
    `;
    
    return card;
}

// ============================================
// FORM MANAGEMENT
// ============================================
function showForm(theme) {
    currentState.selectedTheme = theme;
    currentState.isFormVisible = true;
    
    // Update preview
    if (dom.selectedThemePreview) {
        dom.selectedThemePreview.innerHTML = `
            <h4>Selected: ${theme.name}</h4>
            <p>You're about to select the "${theme.name}" theme. Please provide your details below.</p>
        `;
    }
    
    // Show modal
    if (dom.formModal) {
        dom.formModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
    
    // Clear form if needed
    if (!currentState.userData && dom.userForm) {
        dom.userForm.reset();
    }
    
    // Auto-focus name field
    setTimeout(() => {
        if (dom.userName) dom.userName.focus();
    }, 300);
}

function hideForm() {
    currentState.isFormVisible = false;
    if (dom.formModal) {
        dom.formModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// ============================================
// NOTIFICATION SYSTEM
// ============================================
async function sendNotification(userData, theme) {
    console.log('📤 Sending notification...');
    
    // Check if EmailJS is configured
    if (!EMAILJS_CONFIG.PUBLIC_KEY || EMAILJS_CONFIG.PUBLIC_KEY === "YOUR_PUBLIC_KEY") {
        console.log('📝 EmailJS not configured - using fallback');
        return showFallbackNotification(userData, theme);
    }
    
    try {
        const templateParams = {
            to_email: EMAILJS_CONFIG.YOUR_EMAIL,
            user_name: userData.name,
            user_phone: userData.phone,
            theme_name: theme.name,
            theme_id: theme.id,
            timestamp: new Date().toLocaleString(),
            user_id: userData.id || 'N/A',
            is_pwa: currentState.isPWAInstalled
        };
        
        const response = await emailjs.send(
            EMAILJS_CONFIG.SERVICE_ID,
            EMAILJS_CONFIG.TEMPLATE_ID,
            templateParams
        );
        
        console.log('✅ Email sent successfully');
        return true;
        
    } catch (error) {
        console.error('❌ EmailJS error:', error);
        return showFallbackNotification(userData, theme);
    }
}

function showFallbackNotification(userData, theme) {
    const notification = `
    🎨 BLUEPURE - NEW THEME SELECTION
    ================================
    👤 Name: ${userData.name}
    📞 Phone: ${userData.phone}
    🎯 Theme: ${theme.name}
    ⏰ Time: ${new Date().toLocaleString()}
    📱 PWA: ${currentState.isPWAInstalled ? 'Yes' : 'No'}
    ================================
    `;
    
    console.log(notification);
    
    // Save for offline sync
    if ('indexedDB' in window) {
        saveOfflineNotification(userData, theme);
    }
    
    return false;
}

function saveOfflineNotification(userData, theme) {
    const request = indexedDB.open('BluePureDB', 1);
    
    request.onsuccess = function(event) {
        const db = event.target.result;
        const transaction = db.transaction(['notifications'], 'readwrite');
        const store = transaction.objectStore('notifications');
        
        const notification = {
            id: Date.now(),
            userData,
            theme,
            timestamp: new Date().toISOString(),
            synced: false
        };
        
        store.put(notification);
    };
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
function generateUserId() {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function validatePhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    const cleaned = phone.replace(/[\s\-\(\)\.\+]/g, '');
    return phoneRegex.test(cleaned);
}

function showToast(message, duration = 5000) {
    if (!dom.successToast) return;
    
    const toastContent = dom.successToast.querySelector('.toast-content h4');
    if (toastContent) {
        toastContent.textContent = message;
    }
    
    dom.successToast.style.display = 'flex';
    
    // Auto hide
    setTimeout(() => {
        dom.successToast.style.animation = 'slideOutRight 0.5s ease forwards';
        setTimeout(() => {
            dom.successToast.style.display = 'none';
            dom.successToast.style.animation = '';
        }, 500);
    }, duration);
}

function addNoSelectClasses() {
    const noSelectElements = document.querySelectorAll(
        'button, .theme-card, .stat-card, .logo, .tagline, .pwa-install'
    );
    
    noSelectElements.forEach(el => {
        el.classList.add('no-select');
    });
}

// ============================================
// EVENT HANDLERS
// ============================================
function setupEventListeners() {
    // Theme selection
    document.addEventListener('click', function(e) {
        const chooseBtn = e.target.closest('.btn-choose');
        if (chooseBtn) {
            e.preventDefault();
            e.stopPropagation();
            
            const themeId = chooseBtn.getAttribute('data-theme-id');
            const theme = THEMES.find(t => t.id === themeId);
            
            if (theme) {
                if (currentState.userData) {
                    // Returning user
                    const userData = {
                        ...currentState.userData,
                        selectedTheme: theme.name,
                        selectionTime: new Date().toISOString()
                    };
                    
                    saveUserData(userData);
                    sendNotification(userData, theme);
                    showToast(`Updated! ${theme.name} theme selected`);
                    
                } else {
                    // New user
                    showForm(theme);
                }
            }
        }
    });
    
    // Form submission
    if (dom.userForm) {
        dom.userForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const name = dom.userName?.value.trim() || '';
            const phone = dom.userPhone?.value.trim() || '';
            
            // Validation
            if (name.length < 2) {
                alert('Please enter a valid name (at least 2 characters)');
                return;
            }
            
            if (!validatePhone(phone)) {
                alert('Please enter a valid phone number');
                return;
            }
            
            // Create user data
            const userData = {
                id: generateUserId(),
                name: name,
                phone: phone,
                selectedTheme: currentState.selectedTheme.name,
                themeId: currentState.selectedTheme.id,
                firstSelectionTime: new Date().toISOString(),
                device: navigator.userAgent,
                isPWA: currentState.isPWAInstalled
            };
            
            // Disable button and show loading
            const originalText = dom.submitBtn?.innerHTML || '';
            if (dom.submitBtn) {
                dom.submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
                dom.submitBtn.disabled = true;
            }
            
            try {
                // Save to localStorage
                saveUserData(userData);
                
                // Send notification
                const notificationSent = await sendNotification(userData, currentState.selectedTheme);
                
                // Hide form
                hideForm();
                
                // Show success
                if (notificationSent) {
                    showToast(`Perfect! ${currentState.selectedTheme.name} theme selected`);
                } else {
                    showToast(`Theme selected! (Saved offline)`);
                }
                
                // Vibrate on mobile if available
                if (navigator.vibrate) {
                    navigator.vibrate(100);
                }
                
            } catch (error) {
                console.error('Error:', error);
                alert('Something went wrong. Please try again.');
            } finally {
                // Restore button
                if (dom.submitBtn) {
                    dom.submitBtn.innerHTML = originalText;
                    dom.submitBtn.disabled = false;
                }
            }
        });
    }
    
    // Cancel button
    if (dom.cancelBtn) {
        dom.cancelBtn.addEventListener('click', function(e) {
            e.preventDefault();
            hideForm();
        });
    }
    
    // Toast close button
    const toastClose = document.querySelector('.toast-close');
    if (toastClose) {
        toastClose.addEventListener('click', function() {
            if (dom.successToast) {
                dom.successToast.style.display = 'none';
            }
        });
    }
    
    // Close modal when clicking outside
    if (dom.formModal) {
        dom.formModal.addEventListener('click', function(e) {
            if (e.target === dom.formModal) {
                hideForm();
            }
        });
    }
    
    // Escape key to close modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && currentState.isFormVisible) {
            hideForm();
        }
    });
    
    // Phone number formatting
    if (dom.userPhone) {
        dom.userPhone.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length > 0) {
                if (value.length <= 3) {
                    value = '+' + value;
                } else if (value.length <= 6) {
                    value = '+' + value.slice(0, 3) + ' ' + value.slice(3);
                } else if (value.length <= 10) {
                    value = '+' + value.slice(0, 3) + ' ' + value.slice(3, 6) + ' ' + value.slice(6);
                } else {
                    value = '+' + value.slice(0, 3) + ' ' + value.slice(3, 6) + ' ' + value.slice(6, 10) + ' ' + value.slice(10, 14);
                }
            }
            
            e.target.value = value;
        });
    }
    
    // Prevent form resubmission on refresh
    if (window.history.replaceState) {
        window.history.replaceState(null, null, window.location.href);
    }
}

// ============================================
// STARTUP LOG
// ============================================
console.log(`
================================
   BLUEPURE THEME SELECTOR
================================
Version: 2.0.0
PWA: ${currentState.isPWAInstalled ? 'Installed ✓' : 'Not installed'}
User: ${currentState.userData ? currentState.userData.name : 'New visitor'}
EmailJS: ${EMAILJS_CONFIG.PUBLIC_KEY !== "YOUR_PUBLIC_KEY" ? 'Configured ✓' : 'Not configured'}
================================
`);

// Service Worker registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js').then(() => {
            console.log('🔧 Service Worker registered');
        });
    });
}
