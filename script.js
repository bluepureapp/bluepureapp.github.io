// ============================================
// CONFIGURATION
// ============================================

const EMAILJS_CONFIG = {
    SERVICE_ID: "Bluepureapp",
    TEMPLATE_ID: "template_xtkxr3h",
    PUBLIC_KEY: "WwjEVbDtQjkRZqBWq",
    YOUR_EMAIL: "bluepureindia@gmail.com"
};

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
    isPreviewOpen: false
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
    offlineIndicator: document.querySelector('.offline-indicator'),
    // Preview modal elements
    imagePreviewModal: document.getElementById('imagePreviewModal'),
    previewClose: document.getElementById('previewClose'),
    previewImage: document.getElementById('previewImage'),
    previewTitle: document.getElementById('previewTitle'),
    previewThemeName: document.getElementById('previewThemeName'),
    previewDescription: document.getElementById('previewDescription'),
    previewFeatures: document.getElementById('previewFeatures'),
    selectFromPreview: document.getElementById('selectFromPreview')
};

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    if (EMAILJS_CONFIG.PUBLIC_KEY && EMAILJS_CONFIG.PUBLIC_KEY !== "user_YOUR_PUBLIC_KEY_HERE") {
        try {
            emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
            console.log('✅ EmailJS initialized');
        } catch (error) {
            console.warn('⚠️ EmailJS initialization failed:', error);
        }
    }
    
    loadUserData();
    renderThemes();
    setupEventListeners();
    updateNetworkStatus();
}

// ============================================
// THEME RENDERING WITH PREVIEW BUTTON
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
            <div class="theme-buttons">
                <button class="preview-btn-small" data-theme-id="${theme.id}">
                    <i class="fas fa-eye"></i>
                    Preview
                </button>
                <button class="btn-choose" data-theme-id="${theme.id}">
                    <i class="fas fa-tags"></i>
                    Select This Label
                </button>
            </div>
        </div>
    `;
    
    return card;
}

// ============================================
// PREVIEW MODAL FUNCTIONS
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
}

function closeImagePreview() {
    currentState.isPreviewOpen = false;
    dom.imagePreviewModal.classList.remove('active');
    document.body.style.overflow = 'auto';
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
    
    if (dom.userPhone) {
        dom.userPhone.value = '+91 ';
        dom.userPhone.setSelectionRange(4, 4);
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
// EVENT HANDLERS
// ============================================
function setupEventListeners() {
    // Theme selection (Select button)
    document.addEventListener('click', function(e) {
        const chooseBtn = e.target.closest('.btn-choose');
        if (chooseBtn) {
            e.preventDefault();
            e.stopPropagation();
            
            const themeId = chooseBtn.getAttribute('data-theme-id');
            const theme = THEMES.find(t => t.id === themeId);
            
            if (theme) {
                if (currentState.userData) {
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
                    showForm(theme);
                }
            }
        }
    });
    
    // Preview button click
    document.addEventListener('click', function(e) {
        const previewBtn = e.target.closest('.preview-btn-small');
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
                if (currentState.userData) {
                    const userData = {
                        ...currentState.userData,
                        selectedLabel: currentState.selectedTheme.name,
                        labelId: currentState.selectedTheme.id,
                        lastSelection: new Date().toISOString(),
                        isReturning: true,
                        previousTheme: currentState.userData.selectedLabel || 'None'
                    };
                    
                    saveUserData(userData);
                    sendNotification(userData, currentState.selectedTheme);
                    showToast(`Updated to ${currentState.selectedTheme.name}! We'll contact you soon.`);
                } else {
                    showForm(currentState.selectedTheme);
                }
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
        if (e.key === 'Escape' && currentState.isFormVisible) {
            hideForm();
        }
    });
    
    // Existing form and phone event listeners
    setupFormEventListeners();
    setupPhoneFormatting();
}

// ============================================
// EXISTING FUNCTIONS (Keep your original code)
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

async function sendNotification(userData, theme) {
    console.log('📨 Sending label quote request...');
    
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
    
    const savedNotifications = JSON.parse(localStorage.getItem('bluepure_notifications') || '[]');
    savedNotifications.push(notification);
    localStorage.setItem('bluepure_notifications', JSON.stringify(savedNotifications));
    
    console.log('📝 Notification saved locally:', notification);
}

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

function setupFormEventListeners() {
    if (dom.userForm) {
        dom.userForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const name = dom.userName?.value.trim() || '';
            const phone = dom.userPhone?.value.trim() || '';
            
            if (name.length < 2) {
                alert('Please enter your full name (minimum 2 characters)');
                return;
            }
            
            if (!validateIndianPhone(phone)) {
                alert('Please enter a valid Indian phone number (10 digits after +91)\nExample: +91 12345 67890');
                return;
            }
            
            const userData = {
                id: 'bluepure_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
                name: name,
                phone: phone,
                selectedLabel: currentState.selectedTheme.name,
                labelId: currentState.selectedTheme.id,
                inquiryDate: new Date().toISOString(),
                source: 'BluePure Website',
                isPWA: currentState.isPWAInstalled
            };
            
            const originalText = dom.submitBtn?.innerHTML || '';
            if (dom.submitBtn) {
                dom.submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
                dom.submitBtn.disabled = true;
            }
            
            try {
                saveUserData(userData);
                const notificationSent = await sendNotification(userData, currentState.selectedTheme);
                
                hideForm();
                
                if (notificationSent) {
                    showToast(`Thank you ${name}! We'll contact you soon for your ${currentState.selectedTheme.name} labels.`);
                } else {
                    showToast(`Request saved! We'll contact you at ${phone} for ${currentState.selectedTheme.name} labels.`);
                }
                
                if (navigator.vibrate) {
                    navigator.vibrate(100);
                }
                
            } catch (error) {
                console.error('Submission error:', error);
                showToast('Something went wrong. Please try again or contact us directly.', 5000);
            } finally {
                if (dom.submitBtn) {
                    dom.submitBtn.innerHTML = originalText;
                    dom.submitBtn.disabled = false;
                }
            }
        });
    }
    
    if (dom.cancelBtn) {
        dom.cancelBtn.addEventListener('click', function(e) {
            e.preventDefault();
            hideForm();
        });
    }
    
    if (dom.formModal) {
        dom.formModal.addEventListener('click', function(e) {
            if (e.target === dom.formModal) {
                hideForm();
            }
        });
    }
}

function setupPhoneFormatting() {
    if (!dom.userPhone) return;
    
    dom.userPhone.addEventListener('input', function(e) {
        const cursorPosition = e.target.selectionStart;
        const oldValue = e.target.value;
        const newValue = formatIndianPhoneNumber(oldValue);
        
        e.target.value = newValue;
        const diff = newValue.length - oldValue.length;
        e.target.setSelectionRange(cursorPosition + diff, cursorPosition + diff);
    });
    
    dom.userPhone.addEventListener('keydown', function(e) {
        const cursorPosition = e.target.selectionStart;
        
        if ((e.key === 'Backspace' || e.key === 'Delete') && cursorPosition <= 4) {
            e.preventDefault();
            return false;
        }
        
        if (cursorPosition > 3 && !/\d/.test(e.key) && e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            return false;
        }
    });
    
    dom.userPhone.addEventListener('blur', function(e) {
        if (e.target.value && !e.target.value.startsWith('+91')) {
            e.target.value = formatIndianPhoneNumber(e.target.value);
        }
    });
}

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
    showToast('Offline mode - Working with saved data', 3000);
});
