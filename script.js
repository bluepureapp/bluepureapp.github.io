// ============================================
// PWA FUNCTIONALITY
// ============================================

// Register Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('service-worker.js')
            .then(registration => {
                console.log('✅ ServiceWorker registered:', registration.scope);
                
                // Check for updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    console.log('🔄 New service worker found!');
                    
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            showUpdateToast();
                        }
                    });
                });
            })
            .catch(error => {
                console.log('❌ ServiceWorker registration failed:', error);
            });
    });
}

// PWA Install Prompt
let deferredPrompt;
const installButton = document.getElementById('installButton');
const pwaToast = document.getElementById('pwaToast');
const pwaClose = document.getElementById('pwaClose');

window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later
    deferredPrompt = e;
    
    // Show install button
    installButton.style.display = 'flex';
    
    // Show toast after 5 seconds
    setTimeout(() => {
        if (installButton.style.display !== 'none') {
            pwaToast.style.display = 'flex';
        }
    }, 5000);
});

// Install button click handler
installButton.addEventListener('click', () => {
    if (!deferredPrompt) return;
    
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
            console.log('✅ User accepted the install prompt');
            installButton.innerHTML = '<i class="fas fa-check"></i><span>Installed</span>';
            installButton.style.background = 'linear-gradient(135deg, #48BB78 0%, #38A169 100%)';
            pwaToast.style.display = 'none';
        } else {
            console.log('❌ User dismissed the install prompt');
        }
        
        // Clear the deferredPrompt variable
        deferredPrompt = null;
        
        // Hide the install button
        installButton.style.display = 'none';
    });
});

// Close PWA toast
if (pwaClose) {
    pwaClose.addEventListener('click', () => {
        pwaToast.style.display = 'none';
    });
}

// Show update toast
function showUpdateToast() {
    const updateToast = document.createElement('div');
    updateToast.className = 'toast';
    updateToast.style.borderLeft = '5px solid #ED8936';
    updateToast.innerHTML = `
        <div class="toast-icon">
            <i class="fas fa-sync-alt"></i>
        </div>
        <div class="toast-content">
            <h4>Update Available!</h4>
            <p>New version of BluePure is ready.</p>
        </div>
        <button class="toast-close" onclick="location.reload()">Update</button>
    `;
    document.body.appendChild(updateToast);
    updateToast.style.display = 'flex';
    
    setTimeout(() => {
        updateToast.style.animation = 'slideOutRight 0.5s ease forwards';
        setTimeout(() => updateToast.remove(), 500);
    }, 10000);
}

// Check if app is running in standalone mode
function isRunningStandalone() {
    return window.matchMedia('(display-mode: standalone)').matches || 
           window.navigator.standalone ||
           document.referrer.includes('android-app://');
}

// If running as PWA, hide install button
if (isRunningStandalone()) {
    installButton.style.display = 'none';
    pwaToast.style.display = 'none';
}

// Network status detection
window.addEventListener('online', () => {
    showToast('You are back online!', 3000);
    document.querySelector('.offline-indicator')?.style.display = 'none';
});

window.addEventListener('offline', () => {
    showToast('You are offline. Some features may not work.', 5000);
    
    // Create offline indicator if not exists
    let offlineIndicator = document.querySelector('.offline-indicator');
    if (!offlineIndicator) {
        offlineIndicator = document.createElement('div');
        offlineIndicator.className = 'offline-indicator';
        offlineIndicator.innerHTML = '<i class="fas fa-wifi-slash"></i> Offline';
        document.body.appendChild(offlineIndicator);
    }
    offlineIndicator.style.display = 'block';
});

// Initialize network status
if (!navigator.onLine) {
    window.dispatchEvent(new Event('offline'));
}

// Add to home screen instruction for iOS
function isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

function isSafari() {
    return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}

if (isIOS() && isSafari() && !isRunningStandalone()) {
    setTimeout(() => {
        const iosToast = document.createElement('div');
        iosToast.className = 'toast';
        iosToast.style.borderLeft = '5px solid #3A8DFF';
        iosToast.innerHTML = `
            <div class="toast-icon">
                <i class="fab fa-apple"></i>
            </div>
            <div class="toast-content">
                <h4>Install BluePure</h4>
                <p>Tap <i class="fas fa-share"></i> then "Add to Home Screen"</p>
            </div>
            <button class="toast-close">&times;</button>
        `;
        document.body.appendChild(iosToast);
        iosToast.style.display = 'flex';
        
        iosToast.querySelector('.toast-close').addEventListener('click', () => {
            iosToast.style.animation = 'slideOutRight 0.5s ease forwards';
            setTimeout(() => iosToast.remove(), 500);
        });
        
        setTimeout(() => {
            iosToast.style.animation = 'slideOutRight 0.5s ease forwards';
            setTimeout(() => iosToast.remove(), 500);
        }, 15000);
    }, 10000);
}
