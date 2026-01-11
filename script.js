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
        tag: "Premium",
        description: "Gold foil labels with elegant design.",
        features: ["Gold foil finishing", "Water-resistant", "Premium adhesive"],
        color: "#D4AF37",
        previewColor: "linear-gradient(135deg, #D4AF37, #B8860B)",
        image: "theme1.jpg"
    },
    {
        id: "eco-friendly",
        name: "Eco-Friendly Labels",
        tag: "Premium",
        description: "Biodegradable labels from recycled materials.",
        features: ["Recycled materials", "Biodegradable", "Eco-friendly ink"],
        color: "#48BB78",
        previewColor: "linear-gradient(135deg, #48BB78, #38A169)",
        image: "theme2.jpg"
    },
    {
        id: "transparent-clear",
        name: "Transparent Clear Labels",
        tag: "Premium",
        description: "Crystal clear labels for any packaging.",
        features: ["100% transparent", "UV resistant", "Scratch-proof"],
        color: "#4299E1",
        previewColor: "linear-gradient(135deg, #4299E1, #3182CE)",
        image: "theme3.jpg"
    },
    {
        id: "metallic-silver",
        name: "Metallic Silver Labels",
        tag: "Premium",
        description: "Silver metallic for tech products.",
        features: ["Metallic finish", "Industrial grade", "Weather resistant"],
        color: "#A0AEC0",
        previewColor: "linear-gradient(135deg, #A0AEC0, #718096)",
        image: "theme4.jpg"
    },
    {
        id: "colorful-print",
        name: "Colorful Print Labels",
        tag: "Premium",
        description: "Full-color printed vibrant graphics.",
        features: ["Full-color printing", "High-resolution", "Food-safe"],
        color: "#ED8936",
        previewColor: "linear-gradient(135deg, #ED8936, #9F7AEA, #4299E1)",
        image: "theme5.jpg"
    },
    {
        id: "waterproof-industrial",
        name: "Waterproof Industrial Labels",
        tag: "Premium",
        description: "Heavy-duty waterproof for outdoor use.",
        features: ["100% waterproof", "Chemical resistant", "High temperature"],
        color: "#2D3748",
        previewColor: "linear-gradient(135deg, #2D3748, #1A202C)",
        image: "theme6.jpg"
    }
];

// ============================================
// APPLICATION STATE
// ============================================
let currentState = {
    selectedTheme: null,
    userData: null,
    isFormVisible: false,
    isPreviewOpen: false,
    availableImages: []
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
    selectFromPreview: document.getElementById('selectFromPreview'),
    // Chat instructions
    chatInstructionsModal: document.getElementById('chatInstructionsModal')
};

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

async function initializeApp() {
    // Initialize EmailJS with your credentials
    try {
        emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
        console.log('✅ EmailJS initialized with your credentials');
    } catch (error) {
        console.warn('⚠️ EmailJS initialization failed:', error);
    }
    
    // Check for available images first (fast loading)
    await checkAvailableImages();
    
    loadUserData();
    renderThemes();
    setupEventListeners();
    updateNetworkStatus();
    
    // Add Chat With Us widget
    addChatWidget();
    
    // Setup chat button after a delay to ensure Tidio is loaded
    setTimeout(setupChatButton, 2000);
}

// ============================================
// IMAGE OPTIMIZATION - FAST LOADING
// ============================================
async function checkAvailableImages() {
    console.log('🔍 Checking for available theme images...');
    
    // Create array of image checks
    const imageChecks = THEMES.map(async (theme, index) => {
        const imagePath = `assets/${theme.image}`;
        
        try {
            // Try to fetch the image (very fast check)
            const response = await fetch(imagePath, { method: 'HEAD' });
            if (response.ok) {
                console.log(`✅ Found image: ${theme.image}`);
                return {
                    themeId: theme.id,
                    imageUrl: imagePath,
                    available: true
                };
            }
        } catch (error) {
            // Image not found or error
            console.log(`❌ Image not found: ${theme.image}, using gradient`);
        }
        
        return {
            themeId: theme.id,
            imageUrl: null,
            available: false
        };
    });
    
    // Wait for all checks to complete
    const results = await Promise.allSettled(imageChecks);
    
    // Store available images
    currentState.availableImages = results
        .filter(result => result.status === 'fulfilled' && result.value.available)
        .map(result => result.value);
    
    console.log(`📊 ${currentState.availableImages.length} images available out of ${THEMES.length}`);
}

// Get theme image URL (returns gradient if image not available)
function getThemeImageUrl(theme) {
    const availableImage = currentState.availableImages.find(img => img.themeId === theme.id);
    
    if (availableImage && availableImage.available) {
        // Return image with fast loading technique
        return `url("${availableImage.imageUrl}")`;
    }
    
    // Fallback to gradient
    return theme.color;
}

// ============================================
// CHAT WIDGET FUNCTIONS - SIMPLIFIED
// ============================================
function addChatWidget() {
    const chatWidgetHTML = `
        <section class="chat-widget-section">
            <h2 class="section-title">Need Help?</h2>
            <div class="chat-widget-card">
                <div class="chat-widget-icon">
                    <i class="fas fa-comments"></i>
                </div>
                <div class="chat-widget-content">
                    <h3>Chat With Us Instantly</h3>
                    <p>Have questions about our labels? Our team is ready to help you.</p>
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
                    
                    <!-- Single Chat Button for all devices -->
                    <button class="chat-widget-button" id="openTidioChat">
                        <i class="fas fa-comment-dots"></i>
                        Start Chat Now
                    </button>
                </div>
            </div>
        </section>
    `;
    
    // Insert before footer (after business info section)
    const footer = document.querySelector('.footer');
    if (footer) {
        footer.insertAdjacentHTML('beforebegin', chatWidgetHTML);
    }
}

// Main function to open Tidio chat
function openTidioChat() {
    console.log('Opening Tidio chat...');
    
    // Method 1: Direct Tidio API
    if (window.tidioChatApi) {
        window.tidioChatApi.open();
        return true;
    }
    
    // Method 2: Look for Tidio button and click it
    const selectors = [
        '#button button',
        '.tidio-chat',
        '[data-testid="widgetButton"]',
        '[id*="tidio"]',
        '[class*="tidio"]'
    ];
    
    for (const selector of selectors) {
        const element = document.querySelector(selector);
        if (element) {
            element.click();
            return true;
        }
    }
    
    // Method 3: Show instructions
    showChatInstructions();
    return false;
}

// Show chat instructions modal
function showChatInstructions() {
    if (dom.chatInstructionsModal) {
        dom.chatInstructionsModal.classList.add('active');
    }
}

// Setup chat button event listener
function setupChatButton() {
    const chatBtn = document.getElementById('openTidioChat');
    if (chatBtn) {
        chatBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Try to open chat
            if (!openTidioChat()) {
                // If not opened, show instructions
                setTimeout(showChatInstructions, 300);
            }
        });
    }
}

// ============================================
// THEME RENDERING WITH IMAGE OPTIMIZATION
// ============================================
function renderThemes() {
    if (!dom.themeGrid) return;
    
    dom.themeGrid.innerHTML = '';
    
    THEMES.forEach((theme, index) => {
        const themeCard = createThemeCard(theme, index);
        dom.themeGrid.appendChild(themeCard);
    });
}

function createThemeCard(theme, index) {
    const card = document.createElement('div');
    card.className = 'theme-card no-select';
    card.setAttribute('data-theme-id', theme.id);
    
    // Use image if available, otherwise use gradient
    const backgroundStyle = getThemeImageUrl(theme);
    const isImage = backgroundStyle.includes('url');
    
    // Add loading class for images
    const imageClass = isImage ? 'theme-image-with-bg' : '';
    
    card.innerHTML = `
        <div class="theme-image ${imageClass}" style="background: ${backgroundStyle}; background-size: cover; background-position: center;">
            <div class="theme-badge">${theme.tag}</div>
        </div>
        <div class="theme-content">
            <div class="theme-name">
                <span>${theme.name}</span>
            </div>
            <p class="theme-desc">${theme.description}</p>
            <ul class="theme-features">
                ${theme.features.slice(0, 3).map(feature => `
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
                    Select
                </button>
            </div>
        </div>
    `;
    
    // Preload image if available
    if (isImage) {
        preloadImage(theme.image, index);
    }
    
    return card;
}

// Preload images for faster viewing
function preloadImage(imageName, index) {
    const img = new Image();
    img.src = `assets/${imageName}`;
    img.onload = function() {
        console.log(`✅ Preloaded: ${imageName}`);
    };
    img.onerror = function() {
        console.log(`❌ Failed to preload: ${imageName}`);
    };
}

// ============================================
// PREVIEW MODAL FUNCTIONS WITH IMAGE SUPPORT
// ============================================
function openImagePreview(theme) {
    if (!theme || !dom.imagePreviewModal) return;
    
    currentState.selectedTheme = theme;
    currentState.isPreviewOpen = true;
    
    // Update preview content
    dom.previewTitle.textContent = `${theme.name} Preview`;
    dom.previewThemeName.textContent = theme.name;
    dom.previewDescription.textContent = theme.description;
    
    // Check if image is available for preview
    const backgroundStyle = getThemeImageUrl(theme);
    const isImage = backgroundStyle.includes('url');
    
    // Set preview image with 3:4 aspect ratio
    dom.previewImage.innerHTML = `
        <div class="preview-image-content" style="
            background: ${isImage ? backgroundStyle : theme.previewColor};
            ${isImage ? 'background-size: cover; background-position: center;' : ''}
            width: 100%;
            padding-top: 133.33%;
            position: relative;
        ">
            ${!isImage ? `
            <div style="
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 1.2rem;
                font-weight: bold;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
            ">
                ${theme.name}
            </div>
            ` : ''}
        </div>
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
                handleThemeSelection(theme, false);
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
                handleThemeSelection(currentState.selectedTheme, true);
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
            showToast(`Selected ${theme.name} from preview!`);
        } else {
            showToast(`Updated to ${theme.name}!`);
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
                    showToast(`Thank you ${name}! We'll contact you soon.`);
                } else {
                    showToast(`Request saved! We'll contact you at ${phone}.`);
                }
                
                // Mobile vibration feedback
                if (navigator.vibrate) {
                    navigator.vibrate(100);
                }
                
            } catch (error) {
                console.error('Submission error:', error);
                showToast('Something went wrong. Please try again.', 5000);
                
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
    showToast('Back online!', 2000);
});

window.addEventListener('offline', () => {
    showOfflineIndicator();
    showToast('Offline mode', 3000);
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
🚀 Version: 2.2.0 (Image Optimized)
===================================================
`,
'color: #3A8DFF; font-weight: bold;'
);