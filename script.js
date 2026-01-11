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
    // Initialize EmailJS with your credentials
    try {
        emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
        console.log('✅ EmailJS initialized with your credentials');
    } catch (error) {
        console.warn('⚠️ EmailJS initialization failed:', error);
    }
    
    loadUserData();
    renderThemes();
    setupEventListeners();
    updateNetworkStatus();
    
    // Add Chat With Us widget (like Browse Themes)
    addChatWidget();
}

// ============================================
// CHAT WITH US WIDGET (LIKE BROWSE THEMES)
// ============================================
function addChatWidget() {
    // Create chat widget HTML - styled like theme cards
    const chatWidgetHTML = `
        <section class="chat-widget-section">
            <h2 class="section-title">Need Help?</h2>
            <div class="chat-widget-card">
                <div class="chat-widget-icon">
                    <i class="fas fa-comments"></i>
                </div>
                <div class="chat-widget-content">
                    <h3>Chat With Us Instantly</h3>
                    <p>Have questions about our labels? Need custom designs? Our team is ready to help you in real-time.</p>
                    <div class="chat-features">
                        <div class="chat-feature">
                            <i class="fas fa-bolt"></i>
                            <span>Instant Response</span>
                        </div>
                        <div class="chat-feature">
                            <i class="fas fa-expert"></i>
                            <span>Expert Advice</span>
                        </div>
                        <div class="chat-feature">
                            <i class="fas fa-quote"></i>
                            <span>Free Quotes</span>
                        </div>
                    </div>
                    <a href="https://bluepureapp.github.io/#mobile-widget" target="_blank" class="chat-widget-button">
                        <i class="fas fa-comment-dots"></i>
                        Start Chat Now
                    </a>
                </div>
            </div>
        </section>
    `;
    
    // Insert after about section
    const aboutSection = document.querySelector('.about-section');
    if (aboutSection) {
        aboutSection.insertAdjacentHTML('afterend', chatWidgetHTML);
    } else {
        // Fallback: insert before footer
        const footer = document.querySelector('.footer');
        if (footer) {
            footer.insertAdjacentHTML('beforebegin', chatWidgetHTML);
        }
    }
    
    // Add CSS for chat widget
    const style = document.createElement('style');
    style.textContent = `
        .chat-widget-section {
            max-width: 1200px;
            margin: 4rem auto;
            padding: 0 2rem;
        }
        
        .chat-widget-card {
            background: linear-gradient(135deg, #3A8DFF 0%, #2B6CB0 100%);
            border-radius: 25px;
            padding: 3rem;
            display: flex;
            align-items: center;
            gap: 3rem;
            color: white;
            box-shadow: 0 20px 40px rgba(58, 141, 255, 0.3);
            position: relative;
            overflow: hidden;
        }
        
        .chat-widget-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 100" opacity="0.1"><path d="M0,50 Q250,0 500,50 T1000,50 V100 H0 Z" fill="white"/></svg>');
            background-size: cover;
            opacity: 0.1;
        }
        
        .chat-widget-icon {
            flex-shrink: 0;
        }
        
        .chat-widget-icon i {
            font-size: 5rem;
            color: white;
            filter: drop-shadow(0 5px 15px rgba(255, 255, 255, 0.3));
        }
        
        .chat-widget-content {
            flex: 1;
        }
        
        .chat-widget-content h3 {
            font-size: 2.2rem;
            margin-bottom: 1rem;
            color: white;
        }
        
        .chat-widget-content p {
            font-size: 1.1rem;
            line-height: 1.6;
            margin-bottom: 2rem;
            color: rgba(255, 255, 255, 0.9);
            max-width: 600px;
        }
        
        .chat-features {
            display: flex;
            gap: 2rem;
            margin-bottom: 2.5rem;
            flex-wrap: wrap;
        }
        
        .chat-feature {
            display: flex;
            align-items: center;
            gap: 10px;
            background: rgba(255, 255, 255, 0.15);
            padding: 0.8rem 1.5rem;
            border-radius: 50px;
            backdrop-filter: blur(10px);
        }
        
        .chat-feature i {
            font-size: 1.2rem;
        }
        
        .chat-feature span {
            font-weight: 600;
            font-size: 0.95rem;
        }
        
        .chat-widget-button {
            display: inline-flex;
            align-items: center;
            gap: 12px;
            background: white;
            color: #3A8DFF;
            padding: 1rem 2rem;
            border-radius: 50px;
            font-size: 1.1rem;
            font-weight: 700;
            text-decoration: none;
            transition: all 0.3s ease;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }
        
        .chat-widget-button:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
            background: #F7FAFC;
        }
        
        .chat-widget-button:active {
            transform: translateY(-2px);
        }
        
        @media (max-width: 768px) {
            .chat-widget-section {
                padding: 0 1.5rem;
                margin: 3rem auto;
            }
            
            .chat-widget-card {
                flex-direction: column;
                padding: 2rem;
                gap: 2rem;
                text-align: center;
            }
            
            .chat-widget-icon i {
                font-size: 4rem;
            }
            
            .chat-widget-content h3 {
                font-size: 1.8rem;
            }
            
            .chat-features {
                justify-content: center;
                gap: 1rem;
            }
            
            .chat-feature {
                padding: 0.6rem 1.2rem;
            }
            
            .chat-widget-button {
                width: 100%;
                justify-content: center;
            }
        }
        
        @media (max-width: 480px) {
            .chat-widget-card {
                padding: 1.5rem;
            }
            
            .chat-widget-content h3 {
                font-size: 1.5rem;
            }
            
            .chat-widget-content p {
                font-size: 1rem;
            }
            
            .chat-features {
                flex-direction: column;
                align-items: center;
            }
        }
    `;
    document.head.appendChild(style);
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
                handleThemeSelection(theme, false); // false = not from preview
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
                handleThemeSelection(currentState.selectedTheme, true); // true = from preview
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
// THEME SELECTION HANDLER
// ============================================
function handleThemeSelection(theme, fromPreview) {
    if (currentState.userData) {
        // Returning user - send email notification
        const userData = {
            ...currentState.userData,
            selectedLabel: theme.name,
            labelId: theme.id,
            lastSelection: new Date().toISOString(),
            isReturning: true,
            previousTheme: currentState.userData.selectedLabel || 'None',
            selectedFromPreview: fromPreview
        };
        
        saveUserData(userData);
        sendNotification(userData, theme);
        
        if (fromPreview) {
            showToast(`Selected ${theme.name} from preview! We'll contact you soon.`);
        } else {
            showToast(`Updated to ${theme.name}! We'll contact you soon.`);
        }
        
    } else {
        // New user
        showForm(theme);
    }
}

// ============================================
// PHONE FORMATTING FUNCTIONS
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
// EMAIL NOTIFICATION SYSTEM
// ============================================
async function sendNotification(userData, theme) {
    console.log('📨 Sending label quote request...');
    
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
            previous_theme: userData.previousTheme || 'First Selection',
            selected_from_preview: userData.selectedFromPreview ? 'Yes' : 'No'
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
        location: "India"
    };
    
    localStorage.setItem('bluepure_user', JSON.stringify(dataToSave));
    currentState.userData = dataToSave;
    console.log('💾 User data saved');
}
// ============================================
// FORM EVENT LISTENERS
// ============================================
function setupFormEventListeners() {
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
                alert('Please enter a valid Indian phone number (10 digits after +91)\nExample: +91 12345 67890');
                return;
            }
            
            // Create user data
            const userData = {
                id: 'bluepure_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
                name: name,
                phone: phone,
                selectedLabel: currentState.selectedTheme.name,
                labelId: currentState.selectedTheme.id,
                inquiryDate: new Date().toISOString(),
                source: 'BluePure Website',
                selectedFromPreview: false
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
                
                // Fallback: Save locally
                saveLocalNotification(userData, currentState.selectedTheme);
                showToast('Saved offline. We\'ll contact you when back online.', 4000);
                hideForm();
                
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
    
    // Close modal on outside click
    if (dom.formModal) {
        dom.formModal.addEventListener('click', function(e) {
            if (e.target === dom.formModal) {
                hideForm();
            }
        });
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
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
function showToast(message, duration = 4000) {
    if (!dom.successToast) return;
    
    const toastContent = dom.successToast.querySelector('.toast-content h4');
    if (toastContent) {
        toastContent.textContent = message;
    }
    
    dom.successToast.style.display = 'flex';
    dom.successToast.style.animation = 'slideInRight 0.5s ease';
    
    // Auto hide
    setTimeout(() => {
        dom.successToast.style.animation = 'slideOutRight 0.5s ease forwards';
        setTimeout(() => {
            dom.successToast.style.display = 'none';
            dom.successToast.style.animation = '';
        }, 500);
    }, duration);
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
    showToast('Offline mode - Working with saved data', 3000);
});

// ============================================
// STARTUP LOG
// ============================================
console.log(`
%c===================================================
       BLUEPURE - CUSTOM LABELS PRODUCER
===================================================
📍 Location: Dubey Colony Padawa, Khandwa MP India
📧 Email: bluepureindia@gmail.com
📞 Phone: +91 6261491292
⭐ Rating: 9.3/10 Client Satisfaction
🚀 Version: 2.1.0
===================================================
`,
'color: #3A8DFF; font-weight: bold;'
);
