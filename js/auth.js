// HAVEN Auth Logic

function initAuth() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
}

function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!email || !password) {
        showAuthMessage('Please fill in all fields', 'error');
        return;
    }

    if (password.length < 6) {
        showAuthMessage('Password must be at least 6 characters', 'error');
        return;
    }

    // Demo authentication - save to localStorage
    currentUser = {
        id: 'user_' + Date.now(),
        email: email,
        name: email.split('@')[0]
    };

    currentPlan = 'FREE';
    usageData = {
        generationsToday: 0,
        generationsThisMonth: 0,
        projectsCreated: 0,
        lastResetDate: new Date().toDateString()
    };

    saveUserSession();
    localStorage.setItem('haven_plan', currentPlan);
    localStorage.setItem('haven_usage', JSON.stringify(usageData));

    showAuthMessage('Login successful! Redirecting...', 'success');
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 1500);
}

function handleSignup(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (!name || !email || !password || !confirmPassword) {
        showAuthMessage('Please fill in all fields', 'error');
        return;
    }

    if (password.length < 6) {
        showAuthMessage('Password must be at least 6 characters', 'error');
        return;
    }

    if (password !== confirmPassword) {
        showAuthMessage('Passwords do not match', 'error');
        return;
    }

    // Demo authentication - save to localStorage
    currentUser = {
        id: 'user_' + Date.now(),
        email: email,
        name: name
    };

    currentPlan = 'FREE';
    usageData = {
        generationsToday: 0,
        generationsThisMonth: 0,
        projectsCreated: 0,
        lastResetDate: new Date().toDateString()
    };

    saveUserSession();
    localStorage.setItem('haven_plan', currentPlan);
    localStorage.setItem('haven_usage', JSON.stringify(usageData));

    showAuthMessage('Account created! Redirecting...', 'success');
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 1500);
}

function showAuthMessage(message, type) {
    const msgElement = document.getElementById('authMessage');
    if (msgElement) {
        msgElement.textContent = message;
        msgElement.className = `auth-message ${type}`;
        msgElement.style.display = 'block';

        if (type === 'error') {
            setTimeout(() => {
                msgElement.style.display = 'none';
            }, 3000);
        }
    }
}

document.addEventListener('DOMContentLoaded', initAuth);
