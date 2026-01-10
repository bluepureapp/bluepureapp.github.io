// ============================================
// CONFIGURATION - CHANGE THESE VALUES
// ============================================

// EmailJS Configuration
// You need to get these from EmailJS dashboard
const EMAILJS_CONFIG = {
    SERVICE_ID: "Bluepureapp",     // Replace with your service ID
    TEMPLATE_ID: "template_6fln34h",   // Replace with your template ID
    PUBLIC_KEY: "WwjEVbDtQjkRZqBWq",     // Replace with your public key
    YOUR_EMAIL: "bluepureapp@gmail.com" // Your email to receive notifications
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
    isFormVisible: false
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
    selectedThemePreview: document.getElementById('selectedThemePreview')
};

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Initialize EmailJS
    if (EMAILJS_CONFIG.PUBLIC_KEY !== "YOUR_PUBLIC_KEY") {
        emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
    }
    
    // Load user data from localStorage
    loadUserData();
    
    // Render theme cards
    renderThemes();
    
    // Setup event listeners
    setupEventListeners();
    
    // Add no-select class to elements that shouldn't be selectable
    addNoSelectClasses();
}

// ============================================
// LOCALSTORAGE MANAGEMENT
// ============================================
function loadUserData() {
    const savedData = localStorage.getItem('smoothgood_user');
    if (savedData) {
        currentState.userData = JSON.parse(savedData);
        console.log('User data loaded:', currentState.userData);
    }
}

function saveUserData(userData) {
    const dataToSave = {
        ...userData,
        lastUpdated: new Date().toISOString()
    };
    
    localStorage.setItem('smoothgood_user', JSON.stringify(dataToSave));
    currentState.userData = dataToSave;
    console.log('User data saved:', dataToSave);
}

// ============================================
// THEME RENDERING
// ============================================
function renderThemes() {
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
    
    // Generate random preview pattern
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
    dom.selectedThemePreview.innerHTML = `
        <h4>Selected: ${theme.name}</h4>
        <p>You're about to select the "${theme.name}" theme. Please provide your details below.</p>
    `;
    
    // Show modal with animation
    dom.formModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Clear form if needed
    if (!currentState.userData) {
        dom.userForm.reset();
    }
}

function hideForm() {
    currentState.isFormVisible = false;
    dom.formModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// ============================================
// NOTIFICATION SYSTEM
// ============================================
async function sendNotification(userData, theme) {
    console.log('Sending notification...', { userData, theme });
    
    // Check if EmailJS is configured
    if (EMAILJS_CONFIG.PUBLIC_KEY === "YOUR_PUBLIC_KEY") {
        console.warn('EmailJS not configured. Using console fallback.');
        showFallbackNotification(userData, theme);
        return;
    }
    
    try {
        // Prepare email template parameters
        const templateParams = {
            to_email: EMAILJS_CONFIG.YOUR_EMAIL,
            user_name: userData.name,
            user_phone: userData.phone,
            theme_name: theme.name,
            theme_id: theme.id,
            timestamp: new Date().toLocaleString(),
            user_id: userData.id || 'N/A'
        };
        
        // Send email via EmailJS
        const response = await emailjs.send(
            EMAILJS_CONFIG.SERVICE_ID,
            EMAILJS_CONFIG.TEMPLATE_ID,
            templateParams
        );
        
        console.log('Email sent successfully:', response);
        return true;
        
    } catch (error) {
        console.error('EmailJS error:', error);
        showFallbackNotification(userData, theme);
        return false;
    }
}

function showFallbackNotification(userData, theme) {
    // This runs if EmailJS fails or isn't configured
    const notification = `
    🎨 NEW THEME SELECTION (FALLBACK)
    ================================
    👤 Name: ${userData.name}
    📞 Phone: ${userData.phone}
    🎯 Theme: ${theme.name} (${theme.id})
    ⏰ Time: ${new Date().toLocaleString()}
    🔑 User ID: ${userData.id || 'N/A'}
    ================================
    
    Note: EmailJS is not configured. Configure it to receive real email notifications.
    Service ID: ${EMAILJS_CONFIG.SERVICE_ID}
    Template ID: ${EMAILJS_CONFIG.TEMPLATE_ID}
    `;
    
    console.log(notification);
    alert('Theme selected! (Email notification not configured - check console)');
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
function generateUserId() {
    return 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now().toString(36);
}

function validatePhone(phone) {
    // Simple phone validation - accepts various formats
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    const cleaned = phone.replace(/[\s\-\(\)\.\+]/g, '');
    return phoneRegex.test(cleaned);
}

function showToast(message, duration = 5000) {
    const toast = dom.successToast;
    const toastContent = toast.querySelector('.toast-content h4');
    
    toastContent.textContent = message;
    toast.style.display = 'flex';
    
    // Auto hide after duration
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.5s ease forwards';
        setTimeout(() => {
            toast.style.display = 'none';
            toast.style.animation = '';
        }, 500);
    }, duration);
}

function addNoSelectClasses() {
    // Add no-select class to buttons and other interactive elements
    const noSelectElements = document.querySelectorAll(
        'button, .theme-card, .stat-card, .logo, .tagline'
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
                // Check if user already exists
                if (currentState.userData) {
                    // User exists, skip form and send notification
                    const userData = {
                        ...currentState.userData,
                        selectedTheme: theme.name,
                        selectionTime: new Date().toISOString()
                    };
                    
                    saveUserData(userData);
                    sendNotification(userData, theme);
                    showToast(`Updated! You selected ${theme.name}`);
                    
                } else {
                    // New user, show form
                    showForm(theme);
                }
            }
        }
    });
    
    // Form submission
    dom.userForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form values
        const name = dom.userName.value.trim();
        const phone = dom.userPhone.value.trim();
        
        // Validation
        if (!name || name.length < 2) {
            alert('Please enter a valid name (at least 2 characters)');
            return;
        }
        
        if (!validatePhone(phone)) {
            alert('Please enter a valid phone number (digits only, country code optional)');
            return;
        }
        
        // Create user data
        const userData = {
            id: generateUserId(),
            name: name,
            phone: phone,
            selectedTheme: currentState.selectedTheme.name,
            themeId: currentState.selectedTheme.id,
            firstSelectionTime: new Date().toISOString()
        };
        
        // Disable button and show loading
        const originalText = dom.submitBtn.innerHTML;
        dom.submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        dom.submitBtn.disabled = true;
        
        try {
            // Save to localStorage
            saveUserData(userData);
            
            // Send notification
            const notificationSent = await sendNotification(userData, currentState.selectedTheme);
            
            // Hide form
            hideForm();
            
            // Show success message
            if (notificationSent) {
                showToast(`Perfect! ${currentState.selectedTheme.name} theme selected. We'll contact you soon!`);
            } else {
                showToast(`Theme selected! (Notification in console)`);
            }
            
        } catch (error) {
            console.error('Error during form submission:', error);
            alert('Something went wrong. Please try again.');
        } finally {
            // Restore button
            dom.submitBtn.innerHTML = originalText;
            dom.submitBtn.disabled = false;
        }
    });
    
    // Cancel button
    dom.cancelBtn.addEventListener('click', function(e) {
        e.preventDefault();
        hideForm();
        
        // Send cancellation notification (optional)
        if (currentState.selectedTheme) {
            console.log(`User cancelled selection of ${currentState.selectedTheme.name}`);
        }
    });
    
    // Toast close button
    const toastClose = document.querySelector('.toast-close');
    if (toastClose) {
        toastClose.addEventListener('click', function() {
            dom.successToast.style.animation = 'slideOutRight 0.5s ease forwards';
            setTimeout(() => {
                dom.successToast.style.display = 'none';
                dom.successToast.style.animation = '';
            }, 500);
        });
    }
    
    // Close modal when clicking outside
    dom.formModal.addEventListener('click', function(e) {
        if (e.target === dom.formModal) {
            hideForm();
        }
    });
    
    // Escape key to close modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && currentState.isFormVisible) {
            hideForm();
        }
    });
    
    // Phone number formatting
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

// ============================================
// INITIAL LOG
// ============================================
console.log(`
================================
   SMOOTHGOOD THEME SELECTOR
================================
Config Status: ${EMAILJS_CONFIG.PUBLIC_KEY !== "YOUR_PUBLIC_KEY" ? '✅ EmailJS Configured' : '⚠️ EmailJS NOT Configured'}

To configure EmailJS:
1. Sign up at https://www.emailjs.com
2. Add Gmail service
3. Create email template
4. Replace values in script.js:
   - SERVICE_ID
   - TEMPLATE_ID  
   - PUBLIC_KEY

Current User: ${currentState.userData ? currentState.userData.name : 'No user data'}
================================
`);
