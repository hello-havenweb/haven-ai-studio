// HAVEN Settings Logic

function initSettings() {
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    loadUserProfile();
    loadCurrentPlanInfo();
    loadUsageStats();
}

function loadUserProfile() {
    const nameInput = document.getElementById('userName');
    const emailInput = document.getElementById('userEmail');

    if (nameInput) nameInput.value = currentUser.name || '';
    if (emailInput) emailInput.value = currentUser.email || '';
}

function saveProfile() {
    const nameInput = document.getElementById('userName');
    const emailInput = document.getElementById('userEmail');

    if (nameInput.value && emailInput.value) {
        currentUser.name = nameInput.value;
        currentUser.email = emailInput.value;
        saveUserSession();
        alert('Profile saved successfully!');
    } else {
        alert('Please fill in all fields');
    }
}

function loadCurrentPlanInfo() {
    const plan = PLANS[currentPlan];

    const planName = document.getElementById('planName');
    const planPrice = document.getElementById('planPrice');
    const planFeatures = document.getElementById('planFeatures');

    if (planName) planName.textContent = plan.name;
    if (planPrice) planPrice.textContent = `PKR ${plan.price.toLocaleString()}/month`;

    if (planFeatures) {
        planFeatures.innerHTML = plan.features.map(f =>
            `<li>✓ ${f}</li>`
        ).join('');
    }
}

function loadUsageStats() {
    const plan = PLANS[currentPlan];
    const usageStats = document.getElementById('usageStats');

    if (usageStats) {
        usageStats.innerHTML = `
            <div class="usage-stat">
                <span class="usage-stat-label">Projects Created</span>
                <span class="usage-stat-value">${usageData.projectsCreated} / ${plan.projectsLimit === 999 ? '∞' : plan.projectsLimit}</span>
            </div>
            <div class="usage-stat">
                <span class="usage-stat-label">Generations Today</span>
                <span class="usage-stat-value">${usageData.generationsToday} / ${plan.generationsPerDay}</span>
            </div>
            <div class="usage-stat">
                <span class="usage-stat-label">Generations This Month</span>
                <span class="usage-stat-value">${usageData.generationsThisMonth} / ${plan.generationsPerMonth}</span>
            </div>
            <div class="usage-stat">
                <span class="usage-stat-label">Current Plan</span>
                <span class="usage-stat-value">${plan.name}</span>
            </div>
        `;
    }
}

document.addEventListener('DOMContentLoaded', initSettings);
