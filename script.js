
// Global counters for dynamic sections
let educationCount = 1;
let experienceCount = 2;
let projectCount = 2;
let skillCount = 3;
let achievementCount = 2;
let profileCount = 3;

// Initialize the application
document.addEventListener('DOMContentLoaded', function () {
    // Add event listeners to all form inputs
    addEventListeners();
    // Add event listener for the scale slider
    const scaleSlider = document.getElementById('scale-slider');
    const scaleValueSpan = document.getElementById('scale-value');
    scaleSlider.addEventListener('input', function () {
        scaleValueSpan.textContent = parseFloat(this.value).toFixed(1);
    });
    // Generate initial preview
    updatePreview();
});

function addEventListeners() {
    // Add listeners to all existing inputs
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', updatePreview);
    });
}

function updatePreview() {
    const preview = document.getElementById('resume-preview');

    // Get all form data
    const data = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        linkedin: document.getElementById('linkedin').value,
        summary: document.getElementById('summary').value,
        profiles: getProfilesData(),
        education: getEducationData(),
        experience: getExperienceData(),
        achievements: getAchievementsData(),
        projects: getProjectsData(),
        skills: getSkillsData()
    };

    // Generate HTML
    preview.innerHTML = generateResumeHTML(data);
}

function generateResumeHTML(data) {
    let html = '';

    // Header
    html += `<div class="resume-name">${data.name || 'Your Name'}</div>`;

    // Contact info
    const contactInfo = [];
    if (data.email) contactInfo.push(data.email);
    if (data.phone) contactInfo.push(data.phone);
    if (data.linkedin) contactInfo.push(data.linkedin);

    if (contactInfo.length > 0) {
        // Create links for email and potentially others later
        const contactHtml = contactInfo.map(item => {
            if (item.includes('@') && item.includes('.')) { // Simple check for email format
                return `<a href="mailto:${item}" class="resume-contact-link">${item}</a>`;
            } else if (item.startsWith('linkedin.com/')) { // Add styling for LinkedIn if needed
                return `<a href="https://${item}" target="_blank" class="resume-contact-link">${item}</a>`;
            } else { // Default for phone or other items
                return `<span>${item}</span>`;
            }
        }).join(' || ');

        html += `<div class="resume-contact">${contactHtml}</div>`;
    }

    // Summary
    if (data.summary) {
        html += `<div class="resume-section-title">SUMMARY</div>`;
        html += `<div class="resume-summary">${data.summary}</div>`;
    }

    // Education
    if (data.education.length > 0) {
        html += `<div class="resume-section-title">EDUCATION</div>`;
        data.education.forEach(edu => {
            if (edu.degree || edu.field || edu.university) {
                html += `<div class="education-item">`;
                html += `<div class="education-header">`;
                // Left side: University
                html += `<div><strong>${edu.university}</strong></div>`;
                // Right side: Location
                if (edu.location) html += `<div>${edu.location}</div>`;
                html += `</div>`;
                // New line for Degree details and Year
                html += `<div class="education-header">`; // Reusing education-header for layout
                // Left side: Degree and Field
                html += `<div>`;
                if (edu.degree) html += `${edu.degree}`; // Degree
                if (edu.field) html += ` in ${edu.field}`; // Field
                // Note: If you need to include extra details like CGPA, add them to the Degree or Field input fields in the form.
                html += `</div>`;
                // Right side: Year/Date Range
                if (edu.year) {
                    html += `<div><em>${edu.year}</em></div>`; // Consistently put Year content on the right
                }
                html += `</div>`;
                html += `</div>`;
            }
        });
    }

    // Experience
    if (data.experience.length > 0) {
        html += `<div class="resume-section-title">EXPERIENCE</div>`;
        data.experience.forEach(exp => {
            if (exp.title || exp.company) {
                html += `<div class="resume-subsection">`;

                // Line 1: Company Name (Left) and Duration (Right)
                html += `<div class="resume-item-header">`; // Reusing header class for flex layout
                html += `<div><span class="resume-item-company">${exp.company}</span></div>`; // Company on the left
                if (exp.duration) html += `<div><span class="resume-item-date">${exp.duration}</span></div>`; // Duration on the right
                html += `</div>`;

                // Line 2: Job Title (Left) and Location (Right)
                html += `<div class="resume-item-header">`; // Another header for the second line
                html += `<div><span class="resume-item-title">${exp.title}</span></div>`; // Job Title on the left
                if (exp.location) html += `<div><span class="resume-item-location">${exp.location}</span></div>`; // Location on the right
                html += `</div>`;

                if (exp.bullets.length > 0) {
                    html += `<ul class="resume-bullet-points">`;
                    exp.bullets.forEach(bullet => {
                        if (bullet.trim()) {
                            const cleanBullet = bullet.replace(/^[•\-\*]\s*/, '');
                            html += `<li>${cleanBullet}</li>`;
                        }
                    });
                    html += `</ul>`;
                }
                html += `</div>`;
            }
        });
    }

    // Projects
    if (data.projects.length > 0) {
        html += `<div class="resume-section-title">PROJECTS</div>`;
        data.projects.forEach(project => {
            if (project.name) {
                html += `<div class="resume-subsection">`;
                html += `<div class="resume-item-header">`;
                html += `<div>`;
                html += `<span class="resume-item-title">${project.name}</span>`;
                if (project.tech) {
                    html += ` — <span class="project-tech-inline">${project.tech}</span>`;
                }
                html += `</div>`;
                if (project.github) {
                    html += `<div class="resume-item-date"><a href="https://${project.github}" target="_blank" class="resume-profile-link">GitHub</a></div>`;
                }
                html += `</div>`;

                if (project.bullets.length > 0) {
                    html += `<ul class="resume-bullet-points">`;
                    project.bullets.forEach(bullet => {
                        if (bullet.trim()) {
                            const cleanBullet = bullet.replace(/^[•\-\*]\s*/, '');
                            html += `<li>${cleanBullet}</li>`;
                        }
                    });
                    html += `</ul>`;
                }
                html += `</div>`;
            }
        });
    }

    // Skills (2nd last section before profiles)
    if (data.skills.length > 0) {
        html += `<div class="resume-section-title">SKILLS</div>`;
        data.skills.forEach(skillCategory => {
            if (skillCategory.category && skillCategory.items) {
                html += `<div class="resume-skills-category">`;
                html += `<span class="resume-skills-title">${skillCategory.category}:</span>`;
                html += `<span class="resume-skills-list">${skillCategory.items}</span>`;
                html += `</div>`;
            }
        });
    }

    // Achievements (2nd last, optional like summary)
    if (data.achievements.length > 0 && data.achievements.some(ach => ach.title)) {
        html += `<div class="resume-section-title">ACHIEVEMENTS</div>`;
        data.achievements.forEach(ach => {
            if (ach.title) {
                html += `<div class="resume-subsection">`;
                html += `<div class="resume-item-header">`;
                html += `<div>`;
                html += `<span class="resume-item-title">${ach.title}</span>`;
                if (ach.organization) html += ` — <span class="resume-item-company">${ach.organization}</span>`;
                if (ach.details) html += ` — <span class="resume-item-location">${ach.details}</span>`;
                html += `</div>`;
                if (ach.date) html += `<div class="resume-item-date">${ach.date}</div>`;
                html += `</div>`;
                html += `</div>`;
            }
        });
    }

    // Profiles section (at the very bottom)
    if (data.profiles.length > 0 && data.profiles.some(profile => profile.name && profile.url)) {
        html += `<div class="resume-section-title">PROFILES</div>`;
        html += `<div class="resume-profiles">`;
        data.profiles.forEach(profile => {
            if (profile.name && profile.url) {
                html += `<div class="resume-profile-item">`;
                // Make the platform name clickable
                html += `<a href="https://${profile.url}" class="resume-profile-link" target="_blank">${profile.name}</a>`;
                html += `</div>`;
            }
        });
        html += `</div>`;
    }

    return html;
}

// Data collection functions
function getProfilesData() {
    const profileSections = document.querySelectorAll('#profiles-container .dynamic-section');
    return Array.from(profileSections).map(section => ({
        name: section.querySelector('.profile-name').value,
        url: section.querySelector('.profile-url').value
    }));
}

function getEducationData() {
    const educationSections = document.querySelectorAll('#education-container .dynamic-section');
    return Array.from(educationSections).map(section => ({
        degree: section.querySelector('.education-degree').value,
        field: section.querySelector('.education-field').value,
        university: section.querySelector('.education-university').value,
        year: section.querySelector('.education-year').value,
        location: section.querySelector('.education-location').value
    }));
}

function getExperienceData() {
    const experienceSections = document.querySelectorAll('#experience-container .dynamic-section');
    return Array.from(experienceSections).map(section => ({
        title: section.querySelector('.experience-title').value,
        company: section.querySelector('.experience-company').value,
        location: section.querySelector('.experience-location').value,
        duration: section.querySelector('.experience-duration').value,
        bullets: section.querySelector('.experience-bullets').value.split('\n').filter(bullet => bullet.trim())
    }));
}

function getAchievementsData() {
    const achievementSections = document.querySelectorAll('#achievements-container .dynamic-section');
    return Array.from(achievementSections).map(section => ({
        title: section.querySelector('.achievement-title').value,
        organization: section.querySelector('.achievement-organization').value,
        date: section.querySelector('.achievement-date').value,
        details: section.querySelector('.achievement-details').value
    }));
}

function getProjectsData() {
    const projectSections = document.querySelectorAll('#projects-container .dynamic-section');
    return Array.from(projectSections).map(section => ({
        name: section.querySelector('.project-name').value,
        tech: section.querySelector('.project-tech').value,
        bullets: section.querySelector('.project-bullets').value.split('\n').filter(bullet => bullet.trim()),
        github: section.querySelector('.project-github').value
    }));
}

function getSkillsData() {
    const skillSections = document.querySelectorAll('#skills-container .dynamic-section');
    return Array.from(skillSections).map(section => ({
        category: section.querySelector('.skill-category').value,
        items: section.querySelector('.skill-items').value
    }));
}

// Dynamic section management
function addProfile() {
    profileCount++;
    const container = document.getElementById('profiles-container');
    const newSection = document.createElement('div');
    newSection.className = 'dynamic-section';
    newSection.innerHTML = `
        <h4>Profile #${profileCount}</h4>
        <div class="profiles-input-row">
            <div class="form-group">
                <label>Platform Name</label>
                <input type="text" class="profile-name" placeholder="Platform Name">
            </div>
            <div class="form-group">
                <label>Profile URL</label>
                <input type="url" class="profile-url" placeholder="profile-url.com/username">
            </div>
        </div>
        <button type="button" class="btn btn-danger" onclick="removeProfile(this)">Remove</button>
    `;
    container.appendChild(newSection);
    addEventListenersToElement(newSection);
    updatePreview();
}

function removeProfile(button) {
    button.parentElement.remove();
    updatePreview();
}

function addEducation() {
    educationCount++;
    const container = document.getElementById('education-container');
    const newSection = document.createElement('div');
    newSection.className = 'dynamic-section';
    newSection.innerHTML = `
        <h4>Education #${educationCount}</h4>
        <div class="input-row">
            <div class="form-group">
                <label>Degree</label>
                <input type="text" class="education-degree" placeholder="Bachelor of Science">
            </div>
            <div class="form-group">
                <label>Field</label>
                <input type="text" class="education-field" placeholder="Computer Science">
            </div>
        </div>
        <div class="input-row">
            <div class="form-group">
                <label>University</label>
                <input type="text" class="education-university" placeholder="University Name">
            </div>
            <div class="form-group">
                <label>Year</label>
                <input type="text" class="education-year" placeholder="2020-2024">
            </div>
        </div>
        <div class="form-group">
            <label>Location</label>
            <input type="text" class="education-location" placeholder="City, State">
        </div>
        <button type="button" class="btn btn-danger" onclick="removeEducation(this)">Remove</button>
    `;
    container.appendChild(newSection);
    addEventListenersToElement(newSection);
    updatePreview();
}

function removeEducation(button) {
    button.parentElement.remove();
    updatePreview();
}

function addExperience() {
    experienceCount++;
    const container = document.getElementById('experience-container');
    const newSection = document.createElement('div');
    newSection.className = 'dynamic-section';
    newSection.innerHTML = `
        <h4>Experience #${experienceCount}</h4>
        <div class="input-row">
            <div class="form-group">
                <label>Job Title</label>
                <input type="text" class="experience-title" placeholder="Software Engineer">
            </div>
            <div class="form-group">
                <label>Company</label>
                <input type="text" class="experience-company" placeholder="Company Name">
            </div>
        </div>
        <div class="input-row">
            <div class="form-group">
                <label>Location</label>
                <input type="text" class="experience-location" placeholder="City, State">
            </div>
            <div class="form-group">
                <label>Duration</label>
                <input type="text" class="experience-duration" placeholder="Jan 2023 - Present">
            </div>
        </div>
        <div class="form-group">
            <label>Responsibilities (one per line)</label>
            <textarea class="experience-bullets" placeholder="• Developed web applications using React and Node.js&#10;• Collaborated with cross-functional teams&#10;• Improved system performance by 30%"></textarea>
        </div>
        <button type="button" class="btn btn-danger" onclick="removeExperience(this)">Remove</button>
    `;
    container.appendChild(newSection);
    addEventListenersToElement(newSection);
    updatePreview();
}

function removeExperience(button) {
    button.parentElement.remove();
    updatePreview();
}

function addAchievement() {
    achievementCount++;
    const container = document.getElementById('achievements-container');
    const newSection = document.createElement('div');
    newSection.className = 'dynamic-section';
    newSection.innerHTML = `
        <h4>Achievement #${achievementCount}</h4>
        <div class="input-row">
            <div class="form-group">
                <label>Achievement Title</label>
                <input type="text" class="achievement-title" placeholder="Award/Recognition Title">
            </div>
            <div class="form-group">
                <label>Organization/Platform</label>
                <input type="text" class="achievement-organization" placeholder="Organization Name">
            </div>
        </div>
        <div class="input-row">
            <div class="form-group">
                <label>Date/Year</label>
                <input type="text" class="achievement-date" placeholder="Date achieved">
            </div>
            <div class="form-group">
                <label>Details (Optional)</label>
                <input type="text" class="achievement-details" placeholder="Additional details">
            </div>
        </div>
        <button type="button" class="btn btn-danger" onclick="removeAchievement(this)">Remove</button>
    `;
    container.appendChild(newSection);
    addEventListenersToElement(newSection);
    updatePreview();
}

function removeAchievement(button) {
    button.parentElement.remove();
    updatePreview();
}

function addProject() {
    projectCount++;
    const container = document.getElementById('projects-container');
    const newSection = document.createElement('div');
    newSection.className = 'dynamic-section';
    newSection.innerHTML = `
        <h4>Project #${projectCount}</h4>
        <div class="input-row">
            <div class="form-group">
                <label>Project Name</label>
                <input type="text" class="project-name" placeholder="E-commerce Platform">
            </div>
            <div class="form-group">
                <label>Technologies Used</label>
                <input type="text" class="project-tech" placeholder="React, Node.js, MongoDB">
            </div>
        </div>
        <div class="form-group">
            <label>Description & Achievements (one per line)</label>
            <textarea class="project-bullets" placeholder="• Built a full-stack e-commerce platform&#10;• Implemented secure payment processing&#10;• Achieved 99.9% uptime"></textarea>
        </div>
        <div class="form-group">
            <label>GitHub URL (Optional)</label>
            <input type="url" class="project-github" placeholder="github.com/username/project">
        </div>
        <button type="button" class="btn btn-danger" onclick="removeProject(this)">Remove</button>
    `;
    container.appendChild(newSection);
    addEventListenersToElement(newSection);
    updatePreview();
}

function removeProject(button) {
    button.parentElement.remove();
    updatePreview();
}

function addSkill() {
    skillCount++;
    const container = document.getElementById('skills-container');
    const newSection = document.createElement('div');
    newSection.className = 'dynamic-section';
    newSection.innerHTML = `
        <h4>Skill Category #${skillCount}</h4>
        <div class="form-group">
            <label>Category Name</label>
            <input type="text" class="skill-category" placeholder="Programming Languages">
        </div>
        <div class="form-group">
            <label>Skills (comma-separated)</label>
            <input type="text" class="skill-items" placeholder="JavaScript, Python, Java, C++">
        </div>
        <button type="button" class="btn btn-danger" onclick="removeSkill(this)">Remove</button>
    `;
    container.appendChild(newSection);
    addEventListenersToElement(newSection);
    updatePreview();
}

function removeSkill(button) {
    button.parentElement.remove();
    updatePreview();
}

function addEventListenersToElement(element) {
    const inputs = element.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', updatePreview);
    });
}

// PDF Download function
function downloadPDF() {
    const element = document.getElementById('resume-preview');
    const scaleValue = parseFloat(document.getElementById('scale-slider').value);
    const opt = {
        margin: [0, 0, 0, 0],
        filename: 'resume.pdf',
        image: { type: 'jpeg', quality: 0.99 },
        html2canvas: {
            scale: scaleValue,
            useCORS: true,
            letterRendering: true
        },
        jsPDF: {
            unit: 'in',
            format: 'letter',
            orientation: 'portrait',
            margin: [0.1, 0.15, 0.15, 0.15]
        },
        pagebreak: { mode: ['css', 'legacy'] }
    };

    html2pdf().set(opt).from(element).save();
}
