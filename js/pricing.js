// HAVEN Pricing Logic

function initPricing() {
    renderPricingCards();
    renderComparisonTable();
}

function renderPricingCards() {
    const pricingGrid = document.getElementById('pricingGrid');
    if (!pricingGrid) return;

    const plansArray = Object.entries(PLANS);

    pricingGrid.innerHTML = plansArray.map(([key, plan]) => {
        const isCurrentPlan = currentPlan === key;
        const isFeatured = key === 'PRO';

        return `
            <div class="pricing-card ${isFeatured ? 'featured' : ''}">
                ${isFeatured ? '<div class="pricing-badge">Most Popular</div>' : ''}
                <div class="pricing-name">${plan.name}</div>
                <div class="pricing-price">PKR ${plan.price.toLocaleString()}</div>
                <div class="pricing-period">per month</div>
                <ul class="pricing-features">
                    <li>${plan.projectsLimit === 999 ? 'Unlimited' : plan.projectsLimit} Projects</li>
                    <li>${plan.generationsPerDay} Generations/Day</li>
                    <li>${plan.generationsPerMonth.toLocaleString()} Generations/Month</li>
                    ${plan.features.map(f => `<li>${f}</li>`).join('')}
                </ul>
                ${isCurrentPlan
                    ? '<button class="btn-primary pricing-button" disabled>Current Plan</button>'
                    : `<a href="contact.html" class="btn-primary pricing-button">Choose ${plan.name}</a>`
                }
            </div>
        `;
    }).join('');
}

function renderComparisonTable() {
    const comparisonTable = document.getElementById('comparisonTable');
    if (!comparisonTable) return;

    const features = [
        { label: 'Projects', free: '3', starter: '10', pro: '50', business: 'Unlimited' },
        { label: 'Daily Generations', free: '10', starter: '50', pro: '200', business: '500' },
        { label: 'Monthly Generations', free: '50', starter: '500', pro: '2,000', business: '5,000' },
        { label: 'Advanced Tools', free: '❌', starter: '✓', pro: '✓', business: '✓' },
        { label: 'Email Support', free: '❌', starter: '✓', pro: '✓', business: '✓' },
        { label: 'Priority Support', free: '❌', starter: '❌', pro: '✓', business: '✓' },
        { label: 'Analytics', free: '❌', starter: '❌', pro: '✓', business: '✓' },
        { label: 'Team Collaboration', free: '❌', starter: '❌', pro: '❌', business: '✓' }
    ];

    comparisonTable.innerHTML = features.map(f => `
        <tr>
            <td>${f.label}</td>
            <td>${f.free}</td>
            <td>${f.starter}</td>
            <td>${f.pro}</td>
            <td>${f.business}</td>
        </tr>
    `).join('');
}

document.addEventListener('DOMContentLoaded', initPricing);
