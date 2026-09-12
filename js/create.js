// HAVEN Create Logic

let selectedType = null;

function initCreate() {
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    setupCreateCards();
    setupFormHandlers();
}

function setupCreateCards() {
    const createCards = document.querySelectorAll('.create-card');
    createCards.forEach(card => {
        card.addEventListener('click', () => {
            selectedType = card.dataset.type;
            showCreationForm();
        });
    });
}

function showCreationForm() {
    const formSection = document.getElementById('creationForm');
    const cardsSection = document.querySelector('.create-grid');

    if (formSection && cardsSection) {
        cardsSection.style.display = 'none';
        formSection.style.display = 'block';

        const titles = {
            content: 'AI Content Generator',
            social: 'Social Media Post',
            email: 'Email Marketing',
            ad: 'Ad Copy Generator',
            seo: 'SEO Content',
            product: 'Product Description'
        };

        document.getElementById('formTitle').textContent = titles[selectedType] || 'Create Content';
        setupAdditionalFields();
    }
}

function setupAdditionalFields() {
    const fieldsContainer = document.getElementById('additionalFields');
    let html = '';

    switch(selectedType) {
        case 'social':
            html = `
                <div class="form-group">
                    <label for="platform">Platform</label>
                    <select id="platform" required>
                        <option>Instagram</option>
                        <option>Twitter/X</option>
                        <option>LinkedIn</option>
                        <option>Facebook</option>
                        <option>TikTok</option>
                    </select>
                </div>
            `;
            break;
        case 'email':
            html = `
                <div class="form-group">
                    <label for="emailType">Email Type</label>
                    <select id="emailType" required>
                        <option>Newsletter</option>
                        <option>Promotional</option>
                        <option>Product Launch</option>
                        <option>Re-engagement</option>
                    </select>
                </div>
            `;
            break;
        case 'ad':
            html = `
                <div class="form-group">
                    <label for="adPlatform">Ad Platform</label>
                    <select id="adPlatform" required>
                        <option>Google Ads</option>
                        <option>Facebook/Instagram</option>
                        <option>LinkedIn Ads</option>
                        <option>TikTok Ads</option>
                    </select>
                </div>
            `;
            break;
    }

    fieldsContainer.innerHTML = html;
}

function setupFormHandlers() {
    const generateForm = document.getElementById('generateForm');
    const backBtn = document.getElementById('backBtn');
    const regenerateBtn = document.getElementById('regenerateBtn');
    const copyBtn = document.getElementById('copyBtn');
    const saveProjectBtn = document.getElementById('saveProjectBtn');

    if (generateForm) {
        generateForm.addEventListener('submit', handleGenerate);
    }

    if (backBtn) {
        backBtn.addEventListener('click', goBack);
    }

    if (regenerateBtn) {
        regenerateBtn.addEventListener('click', regenerateContent);
    }

    if (copyBtn) {
        copyBtn.addEventListener('click', copyContent);
    }

    if (saveProjectBtn) {
        saveProjectBtn.addEventListener('click', saveProject);
    }
}

function goBack() {
    document.getElementById('creationForm').style.display = 'none';
    document.querySelector('.create-grid').style.display = 'grid';
    document.getElementById('resultsSection').style.display = 'none';
    document.getElementById('generateForm').reset();
}

function handleGenerate(e) {
    e.preventDefault();

    if (!canUserGenerate()) {
        return;
    }

    const projectName = document.getElementById('projectName').value;
    const prompt = document.getElementById('prompt').value;

    const generatedContent = generateContent(selectedType, prompt);

    const contentOutput = document.getElementById('contentOutput');
    contentOutput.textContent = generatedContent;

    document.getElementById('resultsSection').style.display = 'block';
    document.getElementById('generateForm').reset();

    incrementGenerationCount();
    updateDashboardStats();
}

function generateContent(type, prompt) {
    const templates = {
        content: [
            `Here's a comprehensive content piece based on your prompt:\n\n${prompt}\n\nKey points:\n- This is AI-generated content\n- Customize as needed\n- Maintain brand voice\n- Proofread before publishing`,
            `Content generated for: ${prompt}\n\nThis professional content can be:\n1. Used directly\n2. Edited for your style\n3. Expanded with more details\n4. Adapted for different platforms`,
            `Professional content about: ${prompt}\n\nMain sections:\n- Introduction\n- Key benefits\n- Implementation guide\n- Conclusion\n\nNote: Personalize this for your audience.`
        ],
        social: [
            `🚀 ${prompt}\n\nLooking to make an impact? This post is designed to engage! #content #growth`,
            `Here's a social post for you:\n\n${prompt}\n\nDon't forget to add relevant hashtags and emojis! 👉 Engage, share, grow! 🎯`,
            `📱 Social Media Magic ✨\n\n${prompt}\n\nReach your audience. Build community. Make it count! #SocialMedia #Digital`
        ],
        email: [
            `Subject: Special Update for Our Valued Customers\n\nDear Valued Customer,\n\n${prompt}\n\nBest regards,\nThe Team`,
            `Subject: You won't believe what we have for you\n\nHi there!\n\n${prompt}\n\nTake action now and transform your business.\n\nWarmly,\nOur Team`,
            `Subject: Exclusive Update Inside\n\nHello,\n\n${prompt}\n\nJoin our community of successful entrepreneurs.\n\nCheers,\nYour Success Partner`
        ],
        ad: [
            `Headline: Transform Your ${prompt}\n\nDescription: Discover the power of cutting-edge solutions. Limited time offer!`,
            `Ad Copy: ${prompt}\n\nCTA: Learn More Today\nBenefit: Save time, increase profits, scale faster`,
            `Headline: ${prompt} – Better Than Ever\n\nBody: Join thousands of happy customers. Get started free.`
        ],
        seo: [
            `SEO-Optimized Content for: ${prompt}\n\nKeywords to target: ${prompt}, best ${prompt}, ${prompt} solutions\n\nHeader structure:\n- H1: Main topic\n- H2: Key sections\n- H3: Subsections\n\nMeta description: Compelling 155-160 character description`,
            `Content optimized for search: ${prompt}\n\nInclude:\n- Related keywords naturally\n- Link internal pages\n- Strong call-to-action\n- Mobile-friendly formatting`,
            `SEO Guide for: ${prompt}\n\nTop ranking factors:\n1. Quality content\n2. Keyword optimization\n3. User experience\n4. Link building\n5. Technical SEO`
        ],
        product: [
            `Product: ${prompt}\n\nDescription:\n${prompt} - Premium quality, exceptional value, trusted by thousands. Engineered for performance.\n\nBenefits:\n✓ High quality\n✓ Affordable pricing\n✓ Fast delivery\n✓ 30-day guarantee`,
            `${prompt}\n\nTransform your ${prompt} experience with our premium solution. Designed for success.\n\nWhat you get:\n- Best-in-class quality\n- 24/7 support\n- Money-back guarantee\n- Free shipping`,
            `Introducing: ${prompt}\n\nThe perfect solution for modern needs. This innovative ${prompt} combines quality, affordability, and reliability. Join satisfied customers today!\n\nOrder now and get 20% off your first purchase.`
        ]
    };

    const typeTemplates = templates[type] || templates.content;
    return typeTemplates[Math.floor(Math.random() * typeTemplates.length)];
}

function regenerateContent() {
    const prompt = document.getElementById('prompt').value;
    const generatedContent = generateContent(selectedType, prompt);
    document.getElementById('contentOutput').textContent = generatedContent;
}

function copyContent() {
    const content = document.getElementById('contentOutput').textContent;
    navigator.clipboard.writeText(content).then(() => {
        const copyBtn = document.getElementById('copyBtn');
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '✓ Copied!';
        setTimeout(() => {
            copyBtn.textContent = originalText;
        }, 2000);
    });
}

function saveProject() {
    const projectName = document.getElementById('projectName').value;
    const content = document.getElementById('contentOutput').textContent;

    if (!projectName) {
        alert('Please enter a project name');
        return;
    }

    const project = {
        id: 'proj_' + Date.now(),
        name: projectName,
        type: selectedType,
        content: content,
        createdAt: new Date(),
        updatedAt: new Date()
    };

    let projects = getProjects();
    const plan = PLANS[currentPlan];

    if (projects.length >= plan.projectsLimit) {
        showUpgradeModal(`Project limit reached (${plan.projectsLimit})`);
        return;
    }

    projects.push(project);
    localStorage.setItem('haven_projects', JSON.stringify(projects));
    usageData.projectsCreated = projects.length;
    saveUsageData();

    alert('Project saved successfully!');
    goBack();
}

function getProjects() {
    const projects = localStorage.getItem('haven_projects');
    return projects ? JSON.parse(projects) : [];
}

function updateDashboardStats() {
    // Placeholder for updating stats if needed
}

document.addEventListener('DOMContentLoaded', initCreate);
