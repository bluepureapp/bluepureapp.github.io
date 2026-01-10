// ============================================
// CONFIGURATION
// ============================================

// EmailJS Configuration - REPLACE WITH YOUR OWN
const EMAILJS_CONFIG = {
    SERVICE_ID: "Bluepureapp",
    TEMPLATE_ID: "template_xtkxr3h",
    PUBLIC_KEY: "WwjEVbDtQjkRZqBWq",
    YOUR_EMAIL: "bluepureindia@gmail.com"
};

// BluePure Label Themes
const THEMES = [
    {
        id: "premium-gold",
        name: "Premium Gold Labels",
        tag: "Luxury",
        description: "Gold foil labels with elegant design for luxury products and high-end packaging.",
        features: ["Gold foil finishing", "Water-resistant", "Premium adhesive", "Custom shapes"],
        color: "#D4AF37"
    },
    {
        id: "eco-friendly",
        name: "Eco-Friendly Labels",
        tag: "Sustainable",
        description: "Biodegradable labels made from recycled materials for environmentally conscious brands.",
        features: ["Recycled materials", "Biodegradable", "Eco-friendly ink", "Natural adhesive"],
        color: "#48BB78"
    },
    {
        id: "transparent-clear",
        name: "Transparent Clear Labels",
        tag: "Modern",
        description: "Crystal clear labels that blend seamlessly with any product packaging.",
        features: ["100% transparent", "UV resistant", "Scratch-proof", "No background"],
        color: "#4299E1"
    },
    {
        id: "metallic-silver",
        name: "Metallic Silver Labels",
        tag: "Professional",
        description: "Silver metallic labels for a sleek, professional look on industrial and tech products.",
        features: ["Metallic finish", "Industrial grade", "Weather resistant", "Long-lasting"],
        color: "#A0AEC0"
    },
    {
        id: "colorful-print",
        name: "Colorful Print Labels",
        tag: "Vibrant",
        description: "Full-color printed labels with vibrant graphics for food, beverage, and retail products.",
        features: ["Full-color printing", "High-resolution", "Food-safe", "Custom artwork"],
        color: "linear-gradient(135deg, #ED8936, #9F7AEA, #4299E1)"
    },
    {
        id: "waterproof-industrial",
        name: "Waterproof Industrial Labels",
        tag: "Durable",
        description: "Heavy-duty waterproof labels designed for industrial use and outdoor applications.",
        features: ["100% waterproof", "Chemical resistant", "High temperature", "Extra adhesive"],
        color: "#2D3748"
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
    if (EMAILJS_CONFIG.PUBLIC_KEY && EMAILJS_CONFIG.PUBLIC_KEY !== "user_YOUR_PUBLIC_KEY_HERE") {
        try {
            emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
            console.log('✅ EmailJS initialized');
        } catch (error) {
            console.warn('⚠️ EmailJS initialization failed:', error);
        }
    }
    
    // Load user data
    loadUserData();
    
    // Check PWA status
    checkPWAStatus();
    
    // Render theme cards
    renderThemes();
    
    // Setup event listeners
    setupEventListeners();
    
    // Initialize network status
    updateNetworkStatus();
    
    // Suppress Tidio font warnings
    suppressTidioWarnings();
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
        <div class="theme-image" style="${patternStyle}">
            <div class="theme-badge">Label Sample</div>
        </div>
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
                <i class="fas fa-tags"></i>
                Select This Label
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
    
    if (dom.selectedThemePreview) {
        dom.selectedThemePreview.innerHTML = `
            <h4>Selected: ${theme.name}</h4>
            <p>You've selected "${theme.name}" labels. Share your details for a custom quote.</p>
        `;
    }
    
    if (dom.formModal) {
        dom.formModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
    
    if (!currentState.userData && dom.userForm) {
        dom.userForm.reset();
    }
    
    // Set placeholder for Indian phone
    if (dom.userPhone) {
        dom.userPhone.value = '+91 ';
        dom.userPhone.setSelectionRange(4, 4); // Place cursor after +91
    }
    
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
// PHONE NUMBER FORMATTING
// ============================================
function formatIndianPhoneNumber(input) {
    // Remove all non-digits
    let numbers = input.replace(/\D/g, '');
    
    // Remove the country code (91) if user typed it
    if (numbers.startsWith('91')) {
        numbers = numbers.substring(2);
    }
    
    // Keep only first 10 digits
    numbers = numbers.substring(0, 10);
    
    // Format: +91 XXXXX XXXXX (5-5 format)
    let formatted = '+91';
    if (numbers.length > 0) {
        formatted += ' ' + numbers.substring(0, 5);
    }
    if (numbers.length > 5) {
        formatted += ' ' + numbers.substring(5, 10);
    }
    
    return formatted;
}

function validateIndianPhone(phone) {
    // Remove formatting and spaces
    const cleanPhone = phone.replace(/\D/g, '');
    
    // Should have country code + 10 digits = 12 digits total
    if (cleanPhone.length !== 12) {
        return false;
    }
    
    // Should start with 91 (India country code)
    if (!cleanPhone.startsWith('91')) {
        return false;
    }
    
    // Check if it's a valid Indian number (after 91)
    const subscriberNumber = cleanPhone.substring(2);
    
    // Indian mobile numbers start with 6,7,8,9
    const validStart = ['6', '7', '8', '9'];
    if (!validStart.includes(subscriberNumber.charAt(0))) {
        return false;
    }
    
    return true;
}

// ============================================
// NOTIFICATION SYSTEM
// ============================================
async function sendNotification(userData, theme) {
    console.log('📨 Sending label quote request...');
    
    // Check if EmailJS is configured
    if (!EMAILJS_CONFIG.PUBLIC_KEY || EMAILJS_CONFIG.PUBLIC_KEY === "user_YOUR_PUBLIC_KEY_HERE") {
        console.log('📝 EmailJS not configured - saving locally');
        saveLocalNotification(userData, theme);
        return false;
    }
    
    try {
        const templateParams = {
            to_email: EMAILJS_CONFIG.YOUR_EMAIL,
            user_name: userData.name,
            user_phone: userData.phone,
            label_type: theme.name,
            label_id: theme.id,
            timestamp: new Date().toLocaleString('en-IN', { 
                timeZone: 'Asia/Kolkata',
                dateStyle: 'full',
                timeStyle: 'short' 
            }),
            user_id: userData.id || 'N/A',
            business_name: "BluePure Labels Inquiry"
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
        saveLocalNotification(userData, theme);
        return false;
    }
}

function saveLocalNotification(userData, theme) {
    const notification = {
        id: Date.now(),
        userData,
        theme,
        timestamp: new Date().toISOString(),
        synced: false
    };
    
    // Save to localStorage as fallback
    const savedNotifications = JSON.parse(localStorage.getItem('bluepure_notifications') || '[]');
    savedNotifications.push(notification);
    localStorage.setItem('bluepure_notifications', JSON.stringify(savedNotifications));
    
    console.log('📝 Notification saved locally:', notification);
    
    // Show admin link in console
    console.log('%c📋 ADMIN: View all submissions:', 'color: #3A8DFF; font-weight: bold;');
    console.log('%ccopy(JSON.parse(localStorage.getItem(\'bluepure_notifications\')))', 
        'background: #2D3748; color: white; padding: 5px; border-radius: 3px;');
}

// ============================================
// LOCALSTORAGE MANAGEMENT
// ============================================
function loadUserData() {
    const savedData = localStorage.getItem('bluepure_user');
    if (savedData) {
        try {
            currentState.userData = JSON.parse(savedData);
            console.log('👤 Returning user loaded');
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
        isPWA: currentState.isPWAInstalled,
        location: "India"
    };
    
    localStorage.setItem('bluepure_user', JSON.stringify(dataToSave));
    currentState.userData = dataToSave;
    console.log('💾 User data saved');
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
    }
}

// PWA Install Prompt
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    currentState.deferredPrompt = e;
    
    if (dom.installButton) {
        dom.installButton.style.display = 'flex';
    }
    
    // Show toast after 5 seconds
    setTimeout(() => {
        if (dom.pwaToast && !currentState.isPWAInstalled) {
            dom.pwaToast.style.display = 'flex';
        }
    }, 5000);
});

if (dom.installButton) {
    dom.installButton.addEventListener('click', async () => {
        if (!currentState.deferredPrompt) return;
        
        currentState.deferredPrompt.prompt();
        const { outcome } = await currentState.deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
            console.log('✅ BluePure PWA installed');
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

// ============================================
// NETWORK STATUS
// ============================================
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
    showToast('Back online! Submitting your request...', 2000);
});

window.addEventListener('offline', () => {
    showOfflineIndicator();
    showToast('Offline mode - Your data will sync when back online', 3000);
});

// ============================================
// UTILITY FUNCTIONS
// ============================================
function generateUserId() {
    return 'bluepure_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
}

function showToast(message, duration = 4000) {
    if (!dom.successToast) return;
    
    const toastContent = dom.successToast.querySelector('.toast-content h4');
    if (toastContent) {
        toastContent.textContent = message;
    }
    
    dom.successToast.style.display = 'flex';
    dom.successToast.style.animation = 'slideInRight 0.5s ease';
    
    setTimeout(() => {
        dom.successToast.style.animation = 'slideOutRight 0.5s ease forwards';
        setTimeout(() => {
            dom.successToast.style.display = 'none';
            dom.successToast.style.animation = '';
        }, 500);
    }, duration);
}

function suppressTidioWarnings() {
    const originalWarn = console.warn;
    console.warn = function(...args) {
        if (typeof args[0] === 'string' && args[0].includes('code.tidio.co')) {
            return; // Suppress Tidio warnings
        }
        originalWarn.apply(console, args);
    };
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
                        selectedLabel: theme.name,
                        lastSelection: new Date().toISOString()
                    };
                    
                    saveUserData(userData);
                    sendNotification(userData, theme);
                    showToast(`Updated selection: ${theme.name} labels`);
                    
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
                alert('Please enter your full name (minimum 2 characters)');
                return;
            }
            
            if (!validateIndianPhone(phone)) {
                alert('Please enter a valid Indian phone number (10 digits after +91)\nExample: +91 98765 43210');
                return;
            }
            
            // Create user data
            const userData = {
                id: generateUserId(),
                name: name,
                phone: phone,
                selectedLabel: currentState.selectedTheme.name,
                labelId: currentState.selectedTheme.id,
                inquiryDate: new Date().toISOString(),
                source: 'BluePure Website',
                isPWA: currentState.isPWAInstalled
            };
            
            // Button loading state
            const originalText = dom.submitBtn?.innerHTML || '';
            if (dom.submitBtn) {
                dom.submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
                dom.submitBtn.disabled = true;
            }
            
            try {
                // Save user data
                saveUserData(userData);
                
                // Send notification
                const notificationSent = await sendNotification(userData, currentState.selectedTheme);
                
                // Hide form
                hideForm();
                
                // Show success message
                if (notificationSent) {
                    showToast(`Thank you ${name}! We'll contact you soon for your ${currentState.selectedTheme.name} labels.`);
                } else {
                    showToast(`Request saved! We'll contact you at ${phone} for ${currentState.selectedTheme.name} labels.`);
                }
                
                // Mobile vibration feedback
                if (navigator.vibrate) {
                    navigator.vibrate(100);
                }
                
            } catch (error) {
                console.error('Submission error:', error);
                showToast('Something went wrong. Please try again or contact us directly.', 5000);
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
    
    // Phone number input formatting
    if (dom.userPhone) {
        // Format on input
        dom.userPhone.addEventListener('input', function(e) {
            const cursorPosition = e.target.selectionStart;
            const oldValue = e.target.value;
            const newValue = formatIndianPhoneNumber(oldValue);
            
            e.target.value = newValue;
            
            // Maintain cursor position
            const diff = newValue.length - oldValue.length;
            e.target.setSelectionRange(cursorPosition + diff, cursorPosition + diff);
        });
        
        // Prevent deleting +91
        dom.userPhone.addEventListener('keydown', function(e) {
            const cursorPosition = e.target.selectionStart;
            
            // If trying to delete +91 or characters before it
            if ((e.key === 'Backspace' || e.key === 'Delete') && cursorPosition <= 4) {
                e.preventDefault();
                return false;
            }
            
            // Prevent typing non-digits after +91
            if (cursorPosition > 3 && !/\d/.test(e.key) && e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
                e.preventDefault();
                return false;
            }
        });
        
        // Ensure +91 stays when field loses focus
        dom.userPhone.addEventListener('blur', function(e) {
            if (e.target.value && !e.target.value.startsWith('+91')) {
                e.target.value = formatIndianPhoneNumber(e.target.value);
            }
        });
    }
    
    // Close modal on outside click
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
    
    // Prevent form resubmission on refresh
    if (window.history.replaceState) {
        window.history.replaceState(null, null, window.location.href);
    }
}

// ============================================
// STARTUP MESSAGE
// ============================================
console.log(`
%c===================================================
       BLUEPURE - CUSTOM LABELS PRODUCER
===================================================
📍 Location: Dubey Colony Padawa, Khandwa MP India
📧 Email: bluepureindia@gmail.com
⭐ Rating: 9.3/10 Client Satisfaction
📱 Phone Format: +91 XXXXX XXXXX
🚀 PWA: ${currentState.isPWAInstalled ? 'Installed ✓' : 'Ready to Install'}
💾 Storage: ${localStorage.getItem('bluepure_user') ? 'User data found' : 'New session'}
===================================================
`,
'color: #3A8DFF; font-weight: bold;'
);

// Auto-show PWA install prompt after 10 seconds
setTimeout(() => {
    if (!currentState.isPWAInstalled && dom.installButton && dom.installButton.style.display !== 'none') {
        if (dom.pwaToast) {
            dom.pwaToast.style.display = 'flex';
        }
    }
}, 10000);