// HAVEN Dashboard Logic

function initDashboard() {
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    updateDashboardStats();
    loadRecentProjects();
}

function updateDashboardStats() {
    const plan = PLANS[currentPlan];

    // Update current plan
    const planElement = document.getElementById('currentPlan');
    if (planElement) {
        planElement.textContent = plan.name;
    }

    // Update projects used
    const projectsUsed = document.getElementById('projectsUsed');
    const projectsLimit = document.getElementById('projectsLimit');
    if (projectsUsed && projectsLimit) {
        projectsUsed.textContent = usageData.projectsCreated;
        projectsLimit.textContent = plan.projectsLimit;
        updateProgressBar('projectsProgress', usageData.projectsCreated, plan.projectsLimit);
    }

    // Update generations today
    const generationsToday = document.getElementById('generationsToday');
    const generationsLimit = document.getElementById('generationsLimit');
    if (generationsToday && generationsLimit) {
        generationsToday.textContent = usageData.generationsToday;
        generationsLimit.textContent = plan.generationsPerDay;
        updateProgressBar('generationsProgress', usageData.generationsToday, plan.generationsPerDay);
    }

    // Update monthly usage
    const monthlyUsage = document.getElementById('monthlyUsage');
    const monthlyLimit = document.getElementById('monthlyLimit');
    if (monthlyUsage && monthlyLimit) {
        monthlyUsage.textContent = usageData.generationsThisMonth;
        monthlyLimit.textContent = plan.generationsPerMonth;
        updateProgressBar('monthlyProgress', usageData.generationsThisMonth, plan.generationsPerMonth);
    }
}

function updateProgressBar(elementId, current, max) {
    const progressBar = document.getElementById(elementId);
    if (progressBar) {
        const percentage = (current / max) * 100;
        progressBar.style.width = Math.min(percentage, 100) + '%';
    }
}

function loadRecentProjects() {
    const projects = getProjects();
    const recentProjects = document.getElementById('recentProjects');

    if (!recentProjects) return;

    if (projects.length === 0) {
        recentProjects.innerHTML = '<p class="empty-state">No projects yet. <a href="create.html">Create your first project</a></p>';
        return;
    }

    const recentList = projects.slice(-3).reverse();
    recentProjects.innerHTML = recentList.map(project => `
        <div class="project-card">
            <div class="project-type">${project.type}</div>
            <div class="project-title">${project.name}</div>
            <div class="project-date">${new Date(project.createdAt).toLocaleDateString()}</div>
            <div class="project-actions">
                <button class="btn-primary" onclick="openProject('${project.id}')">Open</button>
                <button class="btn-secondary" onclick="deleteProject('${project.id}')">Delete</button>
            </div>
        </div>
    `).join('');
}

function openProject(projectId) {
    const projects = getProjects();
    const project = projects.find(p => p.id === projectId);
    if (project) {
        localStorage.setItem('haven_current_project', JSON.stringify(project));
        window.location.href = 'create.html';
    }
}

function deleteProject(projectId) {
    if (confirm('Are you sure you want to delete this project?')) {
        let projects = getProjects();
        projects = projects.filter(p => p.id !== projectId);
        localStorage.setItem('haven_projects', JSON.stringify(projects));
        usageData.projectsCreated = projects.length;
        saveUsageData();
        loadRecentProjects();
        updateDashboardStats();
    }
}

function getProjects() {
    const projects = localStorage.getItem('haven_projects');
    return projects ? JSON.parse(projects) : [];
}

document.addEventListener('DOMContentLoaded', initDashboard);
