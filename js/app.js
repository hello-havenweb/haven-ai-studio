// HAVEN AI Studio - Main App Logic

// Configuration
const SITE_CONFIG = {
    email: 'hello.havenweb@gmail.com',
    whatsapp: '+923001234567',
    siteUrl: 'https://haven-ai-studio.com'
};

const PLANS = {
    FREE: {
        name: 'Free',
        price: 0,
        projectsLimit: 3,
        generationsPerDay: 10,
        generationsPerMonth: 50,
        features: [
            'Basic AI tools',
            'Content generation',
            '3 saved projects',
            'Community support'
        ]
    },
    STARTER: {
        name: 'Starter',
        price: 1499,
        projectsLimit: 10,
        generationsPerDay: 50,
        generationsPerMonth: 500,
        features: [
            'Everything in Free',
            'Advanced AI tools',
            '10 saved projects',
            'Email support',
            'Priority processing'
        ]
    },
    PRO: {
        name: 'Pro',
        price: 3499,
        projectsLimit: 50,
        generationsPerDay: 200,
        generationsPerMonth: 2000,
        features: [
            'Everything in Starter',
            'Unlimited advanced tools',
            '50 saved projects',
            'Priority email support',
            'Advanced analytics'
        ]
    },
    BUSINESS: {
        name: 'Business',
        price: 7999,
        projectsLimit: 999,
        generationsPerDay: 500,
        generationsPerMonth: 5000,
        features: [
            'Everything in Pro',
            'Unlimited projects',
            'Team collaboration',
            '24/7 phone support',
            'Custom integrations'
        ]
    }
};

// User State
let currentUser = null;
let currentPlan = 'FREE';
let usageData = {
    generationsToday: 0,
    generationsThisMonth: 0,
    projectsCreated: 0,
    lastResetDate: new Date().toDateString()
};

// Initialize App
function initApp() {
    loadUserSession();
    setupNavigation();
    setupEventListeners();
    checkUsageReset();
}

// Load user session from localStorage
function loadUserSession() {
    const userSession = localStorage.getItem('haven_user');
    if (userSession) {
        currentUser = JSON.parse(userSession);
    }

    const savedPlan = localStorage.getItem('haven_plan');
    if (savedPlan) {
        currentPlan = savedPlan;
    }

    const savedUsage = localStorage.getItem('haven_usage');
    if (savedUsage) {
        usageData = JSON.parse(savedUsage);
    }

    updateUIByAuthStatus();
}

// Update UI based on auth status
function updateUIByAuthStatus() {
    if (currentUser) {
        const userGreeting = document.getElementById('userGreeting');
        if (userGreeting) {
            userGreeting.textContent = `Welcome back, ${currentUser.name || 'User'}!`;
        }
    }
}

// Setup navigation
function setupNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close menu on link click
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (hamburger) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });
}

// Setup event listeners
function setupEventListeners() {
    // Logout buttons
    const logoutBtns = document.querySelectorAll('#logoutBtn, #logoutSettingsBtn');
    logoutBtns.forEach(btn => {
        if (btn) {
            btn.addEventListener('click', logout);
        }
    });

    // Contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
}

// Handle contact form
function handleContactForm(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const businessName = document.getElementById('businessName').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;

    const mailtoLink = `mailto:${SITE_CONFIG.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\nBusiness: ${businessName}\n\nMessage:\n${message}`)}`;

    window.location.href = mailtoLink;

    const formMessage = document.getElementById('formMessage');
    if (formMessage) {
        formMessage.textContent = 'Opening your email client...';
        formMessage.className = 'form-message success';
        formMessage.style.display = 'block';
        setTimeout(() => {
            const contactForm = document.getElementById('contactForm');
            if (contactForm) contactForm.reset();
            formMessage.style.display = 'none';
        }, 2000);
    }
}

// Check and reset daily usage
function checkUsageReset() {
    const today = new Date().toDateString();
    if (usageData.lastResetDate !== today) {
        usageData.generationsToday = 0;
        usageData.lastResetDate = today;
        saveUsageData();
    }
}

// Save usage data
function saveUsageData() {
    localStorage.setItem('haven_usage', JSON.stringify(usageData));
}

// Save user session
function saveUserSession() {
    localStorage.setItem('haven_user', JSON.stringify(currentUser));
}

// Logout
function logout() {
    currentUser = null;
    localStorage.removeItem('haven_user');
    window.location.href = 'login.html';
}

// Check if user can generate
function canUserGenerate() {
    const plan = PLANS[currentPlan];
    if (!plan) return false;

    if (usageData.generationsToday >= plan.generationsPerDay) {
        showUpgradeModal(`Daily limit reached (${plan.generationsPerDay}/day)`);
        return false;
    }

    if (usageData.generationsThisMonth >= plan.generationsPerMonth) {
        showUpgradeModal(`Monthly limit reached (${plan.generationsPerMonth}/month)`);
        return false;
    }

    return true;
}

// Increment generation count
function incrementGenerationCount() {
    usageData.generationsToday++;
    usageData.generationsThisMonth++;
    saveUsageData();
}

// Show upgrade modal
function showUpgradeModal(message) {
    const modal = document.getElementById('upgradeModal');
    if (modal) {
        const limitMessage = document.getElementById('limitMessage');
        if (limitMessage) {
            limitMessage.textContent = message || "You've reached your Free plan limit.";
        }

        modal.classList.add('active');

        const closeBtn = document.getElementById('closeModal');
        const dismissBtn = document.getElementById('dismissBtn');

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.classList.remove('active');
            });
        }

        if (dismissBtn) {
            dismissBtn.addEventListener('click', () => {
                modal.classList.remove('active');
            });
        }

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initApp);
