// ============================================
// CONFIGURATION
// ============================================

// EmailJS Configuration
const EMAILJS_CONFIG = {
    SERVICE_ID: "service_bluepure",
    TEMPLATE_ID: "template_bluepure_labels",
    PUBLIC_KEY: "user_YOUR_PUBLIC_KEY_HERE",
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
        color: "#D4AF37",
        previewColor: "linear-gradient(135deg, #D4AF37, #B8860B)"
    },
    {
        id: "eco-friendly",
        name: "Eco-Friendly Labels",
        tag: "Sustainable",
        description: "Biodegradable labels made from recycled materials for environmentally conscious brands.",
        features: ["Recycled materials", "Biodegradable", "Eco-friendly ink", "Natural adhesive"],
        color: "#48BB78",
        previewColor: "linear-gradient(135deg, #48BB78, #38A169)"
    },
    {
        id: "transparent-clear",
        name: "Transparent Clear Labels",
        tag: "Modern",
        description: "Crystal clear labels that blend seamlessly with any product packaging.",
        features: ["100% transparent", "UV resistant", "Scratch-proof", "No background"],
        color: "#4299E1",
        previewColor: "linear-gradient(135deg, #4299E1, #3182CE)"
    },
    {
        id: "metallic-silver",
        name: "Metallic Silver Labels",
        tag: "Professional",
        description: "Silver metallic labels for a sleek, professional look on industrial and tech products.",
        features: ["Metallic finish", "Industrial grade", "Weather resistant", "Long-lasting"],
        color: "#A0AEC0",
        previewColor: "linear-gradient(135deg, #A0AEC0, #718096)"
    },
    {
        id: "colorful-print",
        name: "Colorful Print Labels",
        tag: "Vibrant",
        description: "Full-color printed labels with vibrant graphics for food, beverage, and retail products.",
        features: ["Full-color printing", "High-resolution", "Food-safe", "Custom artwork"],
        color: "#ED8936",
        previewColor: "linear-gradient(135deg, #ED8936, #9F7AEA, #4299E1)"
    },
    {
        id: "waterproof-industrial",
        name: "Waterproof Industrial Labels",
        tag: "Durable",
        description: "Heavy-duty waterproof labels designed for industrial use and outdoor applications.",
        features: ["100% waterproof", "Chemical resistant", "High temperature", "Extra adhesive"],
        color: "#2D3748",
        previewColor: "linear-gradient(135deg, #2D3748, #1A202C)"
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
    deferredPrompt: null,
    isPreviewOpen: false,
    isMobileMenuOpen: false,
    isFABOpen: false
};

// ============================================
// DOM ELEMENTS
// ============================================
const dom = {
    // Core elements
    themeGrid: document.getElementById('themeGrid'),
    formModal: document.getElementById('formModal'),
    userForm: document.getElementById('userForm'),
    userName: document.getElementById('userName'),
    userPhone: document.getElementById('userPhone'),
    cancelBtn: document.getElementById('cancelBtn'),
    submitBtn: document.getElementById('submitBtn'),
    successToast: document.getElementById('successToast'),
    selectedThemePreview: document.getElementById('selectedThemePreview'),
    
    // Preview modal elements
    imagePreviewModal: document.getElementById('imagePreviewModal'),
    previewClose: document.getElementById('previewClose'),
    previewImage: document.getElementById('previewImage'),
    previewTitle: document.getElementById('previewTitle'),
    previewThemeName: document.getElementById('previewThemeName'),
    previewDescription: document.getElementById('previewDescription'),
    previewFeatures: document.getElementById('previewFeatures'),
    selectFromPreview: document.getElementById('selectFromPreview'),
    
    // Mobile navigation
    mobileMenuBtn: document.getElementById('mobileMenuBtn'),
    mobileNav: document.getElementById('mobileNav'),
    mobileNavClose: document.getElementById('mobileNavClose'),
    mobileInstallBtn: document.getElementById('mobileInstallBtn'),
    
    // PWA elements
    installButton: document.getElementById('installButton'),
    pwaToast: document.getElementById('pwaToast'),
    pwaClose: document.getElementById('pwaClose'),
    fabMain: document.getElementById('fabMain'),
    fabInstall: document.getElementById('fabInstall'),
    
    // Misc
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
    
    // Add mobile touch improvements
    improveMobileTouch();
    
    // Log startup
    console.log('%c📱 BluePure Mobile Optimized v2.0', 'color: #3A8DFF; font-weight: bold; font-size: 14px;');
}

// ============================================
// MOBILE TOUCH IMPROVEMENTS
// ============================================
function improveMobileTouch() {
    // Prevent zoom on double tap
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function(event) {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
    
    // Add touch feedback to buttons
    const buttons = document.querySelectorAll('button, .btn-choose, .preview-btn');
    buttons.forEach(btn => {
        btn.addEventListener('touchstart', function() {
            this.style.opacity = '0.8';
        });
        btn.addEventListener('touchend', function() {
            this.style.opacity = '1';
        });
    });
}

// ============================================
// THEME RENDERING WITH PREVIEW BUTTONS
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
    
    const patternStyle = `background: ${theme.color};`;
    
    card.innerHTML = `
        <div class="theme-image" style="${patternStyle}">
            <div class="theme-badge">${theme.tag}</div>
            <button class="preview-btn" data-theme-id="${theme.id}" aria-label="Preview ${theme.name}">
                <i class="fas fa-expand-alt"></i>
            </button>
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
// IMAGE PREVIEW FUNCTIONALITY
// ============================================
function openImagePreview(theme) {
    if (!theme || !dom.imagePreviewModal) return;
    
    currentState.selectedTheme = theme;
    currentState.isPreviewOpen = true;
    
    // Update preview content
    dom.previewTitle.textContent = `${theme.name} Preview`;
    dom.previewThemeName.textContent = theme.name;
    dom.previewDescription.textContent = theme.description;
    
    // Set preview image background
    dom.previewImage.innerHTML = `
        <div class="preview-image-content" style="background: ${theme.previewColor};"></div>
    `;
    
    // Update features
    dom.previewFeatures.innerHTML = '';
    theme.features.forEach(feature => {
        const featureEl = document.createElement('span');
        featureEl.className = 'preview-feature';
        featureEl.textContent = feature;
        dom.previewFeatures.appendChild(featureEl);
    });
    
    // Show preview modal
    dom.imagePreviewModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Add animation class for smooth transition
    setTimeout(() => {
        dom.imagePreviewModal.style.opacity = '1';
    }, 10);
}

function closeImagePreview() {
    currentState.isPreviewOpen = false;
    dom.imagePreviewModal.classList.remove('active');
    document.body.style.overflow = 'auto';
    
    // Reset animation
    dom.imagePreviewModal.style.opacity = '0';
}

// ============================================
// MOBILE NAVIGATION
// ============================================
function openMobileMenu() {
    currentState.isMobileMenuOpen = true;
    dom.mobileNav.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
    currentState.isMobileMenuOpen = false;
    dom.mobileNav.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// ============================================
// FLOATING ACTION BUTTON
// ============================================
function toggleFAB() {
    currentState.isFABOpen = !currentState.isFABOpen;
    const fabMenu = document.querySelector('.fab-menu');
    
    if (currentState.isFABOpen) {
        dom.fabMain.classList.add('active');
        fabMenu.classList.add('active');
    } else {
        dom.fabMain.classList.remove('active');
        fabMenu.classList.remove('active');
    }
}

// ============================================
// PHONE NUMBER FORMATTING
// ============================================
function formatIndianPhoneNumber(input) {
    let numbers = input.replace(/\D/g, '');
    
    if (numbers.startsWith('91')) {
        numbers = numbers.substring(2);
    }
    
    numbers = numbers.substring(0, 10);
    
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
    const cleanPhone = phone.replace(/\D/g, '');
    
    if (cleanPhone.length !== 12) return false;
    if (!cleanPhone.startsWith('91')) return false;
    
    const subscriberNumber = cleanPhone.substring(2);
    const validStart = ['6', '7', '8', '9'];
    return validStart.includes(subscriberNumber.charAt(0));
}

// ============================================
// EVENT HANDLERS SETUP
// ============================================
function setupEventListeners() {
    // Theme selection (card click)
    document.addEventListener('click', function(e) {
        const themeCard = e.target.closest('.theme-card');
        if (themeCard) {
            const themeId = themeCard.getAttribute('data-theme-id');
            const theme = THEMES.find(t => t.id === themeId);
            if (theme) {
                if (window.innerWidth <= 768) {
                    // On mobile, open preview instead of immediate selection
                    openImagePreview(theme);
                } else {
                    handleThemeSelection(theme);
                }
            }
        }
    });
    
    // Preview button click
    document.addEventListener('click', function(e) {
        const previewBtn = e.target.closest('.preview-btn');
        if (previewBtn) {
            e.preventDefault();
            e.stopPropagation();
            
            const themeId = previewBtn.getAttribute('data-theme-id');
            const theme = THEMES.find(t => t.id === themeId);
            if (theme) {
                openImagePreview(theme);
            }
        }
    });
    
    // Select from preview button
    if (dom.selectFromPreview) {
        dom.selectFromPreview.addEventListener('click', function(e) {
            e.preventDefault();
            if (currentState.selectedTheme) {
                closeImagePreview();
                handleThemeSelection(currentState.selectedTheme);
            }
        });
    }
    
    // Close preview modal
    if (dom.previewClose) {
        dom.previewClose.addEventListener('click', closeImagePreview);
    }
    
    // Close preview on outside click
    dom.imagePreviewModal.addEventListener('click', function(e) {
        if (e.target === dom.imagePreviewModal) {
            closeImagePreview();
        }
    });
    
    // Escape key to close preview
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && currentState.isPreviewOpen) {
            closeImagePreview();
        }
        if (e.key === 'Escape' && currentState.isMobileMenuOpen) {
            closeMobileMenu();
        }
        if (e.key === 'Escape' && currentState.isFormVisible) {
            hideForm();
        }
    });
    
    // Mobile menu
    if (dom.mobileMenuBtn) {
        dom.mobileMenuBtn.addEventListener('click', openMobileMenu);
    }
    
    if (dom.mobileNavClose) {
        dom.mobileNavClose.addEventListener('click', closeMobileMenu);
    }
    
    // FAB
    if (dom.fabMain) {
        dom.fabMain.addEventListener('click', toggleFAB);
    }
    
    // Close FAB when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.fab-container') && currentState.isFABOpen) {
            toggleFAB();
        }
    });
    
    // Form submission and other event listeners...
    // (Include all your existing form and phone formatting event listeners here)
    setupFormEventListeners();
    setupPWAEventListeners();
    setupPhoneFormatting();
}

function handleThemeSelection(theme) {
    if (currentState.userData) {
        // Returning user
        const userData = {
            ...currentState.userData,
            selectedLabel: theme.name,
            labelId: theme.id,
            lastSelection: new Date().toISOString(),
            isReturning: true,
            previousTheme: currentState.userData.selectedLabel || 'None'
        };
        
        saveUserData(userData);
        sendNotification(userData, theme);
        showToast(`Updated to ${theme.name}! We'll contact you soon.`);
        
    } else {
        // New user
        showForm(theme);
    }
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
        
        // Add active class for animation
        setTimeout(() => {
            dom.formModal.classList.add('active');
        }, 10);
    }
    
    if (!currentState.userData && dom.userForm) {
        dom.userForm.reset();
    }
    
    // Set placeholder for Indian phone
    if (dom.userPhone) {
        dom.userPhone.value = '+91 ';
        dom.userPhone.setSelectionRange(4, 4);
    }
    
    setTimeout(() => {
        if (dom.userName) {
            dom.userName.focus();
            // Scroll to input on mobile
            if (window.innerWidth <= 768) {
                dom.userName.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }, 300);
}

function hideForm() {
    currentState.isFormVisible = false;
    if (dom.formModal) {
        dom.formModal.classList.remove('active');
        setTimeout(() => {
            dom.formModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 300);
    }
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
            business_name: "BluePure Labels Inquiry",
            user_type: userData.isReturning ? 'Returning Customer' : 'New Customer',
            previous_theme: userData.previousTheme || 'First Selection'
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
        location: "India",
        device: getDeviceInfo()
    };
    
    localStorage.setItem('bluepure_user', JSON.stringify(dataToSave));
    currentState.userData = dataToSave;
    console.log('💾 User data saved');
}

function getDeviceInfo() {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const isTablet = /iPad|Android(?!.*Mobile)/i.test(navigator.userAgent);
    const isPWA = window.matchMedia('(display-mode: standalone)').matches;
    
    return {
        mobile: isMobile,
        tablet: isTablet,
        pwa: isPWA,
        userAgent: navigator.userAgent.substring(0, 100)
    };
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

function setupPWAEventListeners() {
    // PWA Install Prompt
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        currentState.deferredPrompt = e;
        
        if (dom.installButton) {
            dom.installButton.style.display = 'flex';
        }
        
        if (dom.mobileInstallBtn) {
            dom.mobileInstallBtn.style.display = 'flex';
        }
        
        // Show toast after 5 seconds
        setTimeout(() => {
            if (dom.pwaToast && !currentState.isPWAInstalled) {
                dom.pwaToast.style.display = 'flex';
            }
        }, 5000);
    });
    
    // Install button click
    if (dom.installButton) {
        dom.installButton.addEventListener('click', async () => {
            await triggerPWAInstall();
        });
    }
    
    // Mobile install button
    if (dom.mobileInstallBtn) {
        dom.mobileInstallBtn.addEventListener('click', async () => {
            await triggerPWAInstall();
            closeMobileMenu();
        });
    }
    
    // FAB install button
    if (dom.fabInstall) {
        dom.fabInstall.addEventListener('click', async () => {
            await triggerPWAInstall();
            toggleFAB();
        });
    }
    
    // PWA toast close
    if (dom.pwaClose) {
        dom.pwaClose.addEventListener('click', () => {
            if (dom.pwaToast) dom.pwaToast.style.display = 'none';
        });
    }
}

async function triggerPWAInstall() {
    if (!currentState.deferredPrompt) {
        showToast('Install option not available on this device', 3000);
        return;
    }
    
    currentState.deferredPrompt.prompt();
    const { outcome } = await currentState.deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
        console.log('✅ BluePure PWA installed');
        showToast('BluePure installed successfully!', 3000);
        
        // Update UI
        if (dom.installButton) {
            dom.installButton.innerHTML = '<i class="fas fa-check"></i><span>Installed</span>';
            dom.installButton.style.background = '#48BB78';
            dom.installButton.disabled = true;
        }
        
        if (dom.mobileInstallBtn) {
            dom.mobileInstallBtn.innerHTML = '<i class="fas fa-check"></i><span>Installed</span>';
            dom.mobileInstallBtn.style.background = '#48BB78';
            dom.mobileInstallBtn.disabled = true;
        }
        
        if (dom.pwaToast) dom.pwaToast.style.display = 'none';
        currentState.isPWAInstalled = true;
    } else {
        console.log('❌ User dismissed install prompt');
        showToast('You can install later from browser menu', 3000);
    }
    
    currentState.deferredPrompt = null;
    if (dom.installButton) dom.installButton.style.display = 'none';
    if (dom.mobileInstallBtn) dom.mobileInstallBtn.style.display = 'none';
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
        // Add subtle animation
        dom.offlineIndicator.style.animation = 'pulse 2s infinite';
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
    
    // Try to sync any pending data
    syncPendingData();
});

window.addEventListener('offline', () => {
    showOfflineIndicator();
    showToast('Offline mode - Working with saved data', 3000);
});

async function syncPendingData() {
    const pending = JSON.parse(localStorage.getItem('bluepure_notifications') || '[]');
    const unsynced = pending.filter(item => !item.synced);
    
    if (unsynced.length > 0) {
        console.log(`🔄 Syncing ${unsynced.length} pending notifications`);
        
        for (const item of unsynced) {
            try {
                const success = await sendNotification(item.userData, item.theme);
                if (success) {
                    item.synced = true;
                }
            } catch (error) {
                console.error('Failed to sync:', error);
            }
        }
        
        localStorage.setItem('bluepure_notifications', JSON.stringify(pending));
    }
}

// ============================================
// PHONE FORMATTING EVENT LISTENERS
// ============================================
function setupPhoneFormatting() {
    if (!dom.userPhone) return;
    
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
    
    // Focus on phone field when clicking country code
    const countryCode = document.querySelector('.country-code');
    if (countryCode) {
        countryCode.addEventListener('click', () => {
            dom.userPhone.focus();
        });
    }
}

// ============================================
// FORM EVENT LISTENERS
// ============================================
function setupFormEventListeners() {
    // Form submission
    if (dom.userForm) {
        dom.userForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const name = dom.userName?.value.trim() || '';
            const phone = dom.userPhone?.value.trim() || '';
            
            // Validation
            if (name.length < 2) {
                showFormError('Please enter your full name (minimum 2 characters)');
                return;
            }
            
            if (!validateIndianPhone(phone)) {
                showFormError('Please enter a valid Indian phone number (10 digits after +91)\nExample: +91 12345 67890');
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
                isPWA: currentState.isPWAInstalled,
                device: getDeviceInfo().mobile ? 'Mobile' : 'Desktop'
            };
            
            // Button loading state
            const originalText = dom.submitBtn?.innerHTML || '';
            const originalDisabled = dom.submitBtn?.disabled || false;
            
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
                if (navigator.vibrate && getDeviceInfo().mobile) {
                    navigator.vibrate([100, 50, 100]);
                }
                
                // Add to recent submissions
                addToRecentSubmissions(userData);
                
            } catch (error) {
                console.error('Submission error:', error);
                showToast('Something went wrong. Please try again or contact us directly at +91 6261491292', 5000);
                
                // Fallback: Show error but still save locally
                saveLocalNotification(userData, currentState.selectedTheme);
                showToast('Saved offline. We\'ll contact you when back online.', 4000);
                hideForm();
                
            } finally {
                // Restore button
                if (dom.submitBtn) {
                    dom.submitBtn.innerHTML = originalText;
                    dom.submitBtn.disabled = originalDisabled;
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
    
    // Close modal on outside click
    if (dom.formModal) {
        dom.formModal.addEventListener('click', function(e) {
            if (e.target === dom.formModal) {
                hideForm();
            }
        });
    }
}

function showFormError(message) {
    // Create error toast
    const errorToast = document.createElement('div');
    errorToast.className = 'toast';
    errorToast.style.borderLeft = '5px solid #ED8936';
    errorToast.innerHTML = `
        <div class="toast-icon" style="color: #ED8936;">
            <i class="fas fa-exclamation-triangle"></i>
        </div>
        <div class="toast-content">
            <h4>Please Check</h4>
            <p>${message}</p>
        </div>
        <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
    `;
    
    // Add to body
    document.body.appendChild(errorToast);
    errorToast.style.display = 'flex';
    errorToast.style.animation = 'slideInUp 0.5s ease';
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        errorToast.style.animation = 'slideOutDown 0.5s ease forwards';
        setTimeout(() => errorToast.remove(), 500);
    }, 5000);
    
    // Add click listener to close button
    errorToast.querySelector('.toast-close').addEventListener('click', function() {
        errorToast.style.animation = 'slideOutDown 0.5s ease forwards';
        setTimeout(() => errorToast.remove(), 500);
    });
}

function addToRecentSubmissions(userData) {
    const recent = JSON.parse(localStorage.getItem('bluepure_recent') || '[]');
    recent.unshift({
        ...userData,
        timestamp: new Date().toLocaleString()
    });
    
    // Keep only last 10 submissions
    if (recent.length > 10) {
        recent.pop();
    }
    
    localStorage.setItem('bluepure_recent', JSON.stringify(recent));
}

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
    dom.successToast.style.animation = 'slideInUp 0.5s ease';
    
    // Auto hide
    setTimeout(() => {
        dom.successToast.style.animation = 'slideOutDown 0.5s ease forwards';
        setTimeout(() => {
            dom.successToast.style.display = 'none';
            dom.successToast.style.animation = '';
        }, 500);
    }, duration);
    
    // Add close button functionality
    const closeBtn = dom.successToast.querySelector('.toast-close');
    if (closeBtn) {
        const originalClick = closeBtn.onclick;
        closeBtn.onclick = function() {
            dom.successToast.style.animation = 'slideOutDown 0.5s ease forwards';
            setTimeout(() => {
                dom.successToast.style.display = 'none';
                dom.successToast.style.animation = '';
            }, 500);
        };
    }
}

function suppressTidioWarnings() {
    const originalWarn = console.warn;
    console.warn = function(...args) {
        if (typeof args[0] === 'string' && args[0].includes('code.tidio.co')) {
            return;
        }
        originalWarn.apply(console, args);
    };
}

// ============================================
// MOBILE SPECIFIC UTILITIES
// ============================================
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function setupMobileGestures() {
    // Swipe to close preview on mobile
    let touchStartX = 0;
    let touchStartY = 0;
    
    dom.imagePreviewModal.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    });
    
    dom.imagePreviewModal.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].screenX;
        const touchEndY = e.changedTouches[0].screenY;
        
        // Check for swipe down to close (mobile pattern)
        if (touchEndY - touchStartY > 100 && Math.abs(touchEndX - touchStartX) < 50) {
            closeImagePreview();
        }
    });
}

// ============================================
// STARTUP MESSAGE AND INITIALIZATION
// ============================================
function showStartupMessage() {
    const userData = currentState.userData;
    const userName = userData ? userData.name : 'Guest';
    const themeCount = userData ? (userData.selectionCount || 0) : 0;
    
    console.log(`%c
╔══════════════════════════════════════════════════════╗
║             BLUEPURE LABELS - v2.0 MOBILE            ║
╠══════════════════════════════════════════════════════╣
║ 👤 User: ${userName.padEnd(35)} ║
║ 📱 Device: ${isMobileDevice() ? 'Mobile' : 'Desktop'.padEnd(32)} ║
║ 🏷️ Themes Selected: ${themeCount.toString().padEnd(28)} ║
║ 📞 Contact: +91 6261491292                          ║
║ 📧 Email: bluepureindia@gmail.com                   ║
║ 🚀 PWA: ${currentState.isPWAInstalled ? 'Installed ✓'.padEnd(33) : 'Ready to Install'.padEnd(33)} ║
╚══════════════════════════════════════════════════════╝
    `, 'color: #3A8DFF; font-family: monospace;');
    
    // Show welcome message for returning users
    if (userData) {
        setTimeout(() => {
            showToast(`Welcome back ${userName}!`, 2000);
        }, 1000);
    }
}

// Initialize mobile gestures after DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        if (isMobileDevice()) {
            setupMobileGestures();
            console.log('📱 Mobile gestures enabled');
        }
    }, 1000);
});

// Auto-show PWA install prompt after delay
setTimeout(() => {
    if (!currentState.isPWAInstalled && currentState.deferredPrompt) {
        if (dom.pwaToast) {
            dom.pwaToast.style.display = 'flex';
        }
    }
}, 8000);

// Final initialization call
window.addEventListener('load', function() {
    showStartupMessage();
    
    // Check if we should show any pending notifications
    const pending = JSON.parse(localStorage.getItem('bluepure_notifications') || '[]');
    const unsynced = pending.filter(item => !item.synced);
    
    if (unsynced.length > 0 && navigator.onLine) {
        console.log(`📊 ${unsynced.length} pending submissions to sync`);
    }
});

// ============================================
// EXPORT FOR DEBUGGING (Optional)
// ============================================
if (typeof window !== 'undefined') {
    window.BluePure = {
        state: currentState,
        themes: THEMES,
        showPreview: openImagePreview,
        showForm: showForm,
        sendTestNotification: () => {
            const testData = {
                id: 'test_' + Date.now(),
                name: 'Test User',
                phone: '+91 98765 43210',
                selectedLabel: 'Test Theme',
                labelId: 'test-id'
            };
            const testTheme = THEMES[0];
            return sendNotification(testData, testTheme);
        },
        clearData: () => {
            localStorage.removeItem('bluepure_user');
            localStorage.removeItem('bluepure_notifications');
            localStorage.removeItem('bluepure_recent');
            currentState.userData = null;
            location.reload();
        },
        viewSubmissions: () => {
            const submissions = JSON.parse(localStorage.getItem('bluepure_notifications') || '[]');
            console.table(submissions.map(s => ({
                Name: s.userData.name,
                Phone: s.userData.phone,
                Theme: s.theme.name,
                Time: new Date(s.timestamp).toLocaleString(),
                Synced: s.synced ? '✓' : '✗'
            })));
            return submissions;
        }
    };
    
    console.log('%c🔧 BluePure Debug Tools Available', 'color: #48BB78; font-weight: bold;');
    console.log('%cType BluePure. in console to access debug functions', 'color: #718096;');
}
// ============================================
// REST OF YOUR EXISTING FUNCTIONS
// ============================================
// Include all your existing functions here:
// - showForm, hideForm
// - sendNotification, saveLocalNotification
// - loadUserData, saveUserData
// - checkPWAStatus, setupPWAEventListeners
// - updateNetworkStatus, showOfflineIndicator, hideOfflineIndicator
// - showToast, suppressTidioWarnings
// - setupFormEventListeners, setupPhoneFormatting
// - formatIndianPhoneNumber, validateIndianPhone

// ... (Include all your existing functions from previous script.js)
