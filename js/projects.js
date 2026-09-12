// HAVEN Projects Logic

function initProjects() {
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    loadAllProjects();
    setupSearch();
}

function loadAllProjects() {
    const projects = getProjects();
    const projectsList = document.getElementById('projectsList');

    if (!projectsList) return;

    if (projects.length === 0) {
        projectsList.innerHTML = `
            <div class="empty-state">
                <h3>No projects yet</h3>
                <p>Create your first project to get started</p>
                <a href="create.html" class="btn-primary">Create Project</a>
            </div>
        `;
        return;
    }

    renderProjects(projects);
}

function renderProjects(projects) {
    const projectsList = document.getElementById('projectsList');
    projectsList.innerHTML = projects.map(project => `
        <div class="project-card">
            <div class="project-type">${project.type}</div>
            <div class="project-title">${project.name}</div>
            <div class="project-date">${new Date(project.createdAt).toLocaleDateString()}</div>
            <div class="project-actions">
                <button class="btn-primary" onclick="viewProject('${project.id}')">View</button>
                <button class="btn-secondary" onclick="editProject('${project.id}')">Edit</button>
                <button class="btn-danger" onclick="removeProject('${project.id}')">Delete</button>
            </div>
        </div>
    `).join('');
}

function viewProject(projectId) {
    const projects = getProjects();
    const project = projects.find(p => p.id === projectId);
    if (project) {
        alert(`Project: ${project.name}\n\nContent:\n${project.content}`);
    }
}

function editProject(projectId) {
    const projects = getProjects();
    const project = projects.find(p => p.id === projectId);
    if (project) {
        localStorage.setItem('haven_current_project', JSON.stringify(project));
        window.location.href = 'create.html';
    }
}

function removeProject(projectId) {
    if (confirm('Are you sure you want to delete this project?')) {
        let projects = getProjects();
        projects = projects.filter(p => p.id !== projectId);
        localStorage.setItem('haven_projects', JSON.stringify(projects));
        usageData.projectsCreated = projects.length;
        saveUsageData();
        loadAllProjects();
    }
}

function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const projects = getProjects();
            const filtered = projects.filter(p =>
                p.name.toLowerCase().includes(query) ||
                p.type.toLowerCase().includes(query)
            );
            renderProjects(filtered);
        });
    }
}

function getProjects() {
    const projects = localStorage.getItem('haven_projects');
    return projects ? JSON.parse(projects) : [];
}

document.addEventListener('DOMContentLoaded', initProjects);
