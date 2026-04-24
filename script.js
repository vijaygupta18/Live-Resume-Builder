/* ---------------------------------------------------------
   Resume Builder — vijay.tools
   Preserves all form logic: personal info, profiles, education,
   experience, projects, skills, achievements, PDF download.
   Adds: localStorage autosave, section nav active state,
   save indicator, and shared BMC support dialog.
--------------------------------------------------------- */

// Global counters for dynamic sections (track highest number used)
let educationCount  = 1;
let experienceCount = 2;
let projectCount    = 2;
let skillCount      = 3;
let achievementCount= 2;
let profileCount    = 3;

// ─── Init ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
    loadFromStorage();
    addEventListeners();

    const scaleSlider    = document.getElementById('scale-slider');
    const scaleValueSpan = document.getElementById('scale-value');
    if (scaleSlider) {
        scaleSlider.addEventListener('input', function () {
            scaleValueSpan.textContent = parseFloat(this.value).toFixed(1);
        });
    }

    updatePreview();
    wireNavHighlight();
    wireSupportDialog();
});

// ─── Event Listeners ──────────────────────────────────────
function addEventListeners() {
    document.querySelectorAll('input, textarea').forEach(el => {
        el.addEventListener('input', onFormInput);
    });
}

function addEventListenersToElement(element) {
    element.querySelectorAll('input, textarea').forEach(el => {
        el.addEventListener('input', onFormInput);
    });
}

let saveTimer = null;
function onFormInput() {
    updatePreview();
    // Debounced localStorage save + indicator
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
        saveToStorage();
        flashSaveIndicator();
    }, 600);
}

// ─── Preview Generation ───────────────────────────────────
function updatePreview() {
    const preview = document.getElementById('resume-preview');
    if (!preview) return;

    const data = {
        name:         document.getElementById('name').value,
        email:        document.getElementById('email').value,
        phone:        document.getElementById('phone').value,
        linkedin:     document.getElementById('linkedin').value,
        summary:      document.getElementById('summary').value,
        profiles:     getProfilesData(),
        education:    getEducationData(),
        experience:   getExperienceData(),
        achievements: getAchievementsData(),
        projects:     getProjectsData(),
        skills:       getSkillsData()
    };

    preview.innerHTML = generateResumeHTML(data);
}

function generateResumeHTML(data) {
    let html = '';

    // Header
    html += `<div class="resume-name">${data.name || 'Your Name'}</div>`;

    // Contact line
    const contactParts = [];
    if (data.email)    contactParts.push(`<a href="mailto:${data.email}" class="resume-contact-link">${data.email}</a>`);
    if (data.phone)    contactParts.push(`<span>${data.phone}</span>`);
    if (data.linkedin) contactParts.push(`<a href="https://${data.linkedin}" target="_blank" class="resume-contact-link">${data.linkedin}</a>`);

    if (contactParts.length > 0) {
        html += `<div class="resume-contact">${contactParts.join(' || ')}</div>`;
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
                html += `<div><strong>${edu.university}</strong></div>`;
                if (edu.location) html += `<div>${edu.location}</div>`;
                html += `</div>`;
                html += `<div class="education-header">`;
                html += `<div>`;
                if (edu.degree) html += edu.degree;
                if (edu.field)  html += ` in ${edu.field}`;
                html += `</div>`;
                if (edu.year) html += `<div><em>${edu.year}</em></div>`;
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
                html += `<div class="resume-item-header">`;
                html += `<div><span class="resume-item-company">${exp.company}</span></div>`;
                if (exp.duration) html += `<div><span class="resume-item-date">${exp.duration}</span></div>`;
                html += `</div>`;
                html += `<div class="resume-item-header">`;
                html += `<div><span class="resume-item-title">${exp.title}</span></div>`;
                if (exp.location) html += `<div><span class="resume-item-location">${exp.location}</span></div>`;
                html += `</div>`;
                if (exp.bullets.length > 0) {
                    html += `<ul class="resume-bullet-points">`;
                    exp.bullets.forEach(bullet => {
                        if (bullet.trim()) {
                            const clean = bullet.replace(/^[•\-\*]\s*/, '');
                            html += `<li>${clean}</li>`;
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
                if (project.tech) html += ` &mdash; <span class="project-tech-inline">${project.tech}</span>`;
                html += `</div>`;
                if (project.github) {
                    html += `<div class="resume-item-date"><a href="https://${project.github}" target="_blank" class="resume-profile-link">GitHub</a></div>`;
                }
                html += `</div>`;
                if (project.bullets.length > 0) {
                    html += `<ul class="resume-bullet-points">`;
                    project.bullets.forEach(bullet => {
                        if (bullet.trim()) {
                            const clean = bullet.replace(/^[•\-\*]\s*/, '');
                            html += `<li>${clean}</li>`;
                        }
                    });
                    html += `</ul>`;
                }
                html += `</div>`;
            }
        });
    }

    // Skills
    if (data.skills.length > 0) {
        html += `<div class="resume-section-title">SKILLS</div>`;
        data.skills.forEach(sc => {
            if (sc.category && sc.items) {
                html += `<div class="resume-skills-category">`;
                html += `<span class="resume-skills-title">${sc.category}:</span>`;
                html += `<span class="resume-skills-list"> ${sc.items}</span>`;
                html += `</div>`;
            }
        });
    }

    // Achievements
    if (data.achievements.length > 0 && data.achievements.some(a => a.title)) {
        html += `<div class="resume-section-title">ACHIEVEMENTS</div>`;
        data.achievements.forEach(ach => {
            if (ach.title) {
                html += `<div class="resume-subsection">`;
                html += `<div class="resume-item-header">`;
                html += `<div>`;
                html += `<span class="resume-item-title">${ach.title}</span>`;
                if (ach.organization) html += ` &mdash; <span class="resume-item-company">${ach.organization}</span>`;
                if (ach.details)      html += ` &mdash; <span class="resume-item-location">${ach.details}</span>`;
                html += `</div>`;
                if (ach.date) html += `<div class="resume-item-date">${ach.date}</div>`;
                html += `</div>`;
                html += `</div>`;
            }
        });
    }

    // Profiles
    if (data.profiles.length > 0 && data.profiles.some(p => p.name && p.url)) {
        html += `<div class="resume-section-title">PROFILES</div>`;
        html += `<div class="resume-profiles">`;
        data.profiles.forEach(profile => {
            if (profile.name && profile.url) {
                html += `<div class="resume-profile-item">`;
                html += `<a href="https://${profile.url}" class="resume-profile-link" target="_blank">${profile.name}</a>`;
                html += `</div>`;
            }
        });
        html += `</div>`;
    }

    return html;
}

// ─── Data Collectors ──────────────────────────────────────
function getProfilesData() {
    return Array.from(document.querySelectorAll('#profiles-container .dynamic-entry')).map(sec => ({
        name: sec.querySelector('.profile-name')?.value || '',
        url:  sec.querySelector('.profile-url')?.value  || ''
    }));
}

function getEducationData() {
    return Array.from(document.querySelectorAll('#education-container .dynamic-entry')).map(sec => ({
        degree:     sec.querySelector('.education-degree')?.value     || '',
        field:      sec.querySelector('.education-field')?.value      || '',
        university: sec.querySelector('.education-university')?.value || '',
        year:       sec.querySelector('.education-year')?.value       || '',
        location:   sec.querySelector('.education-location')?.value   || ''
    }));
}

function getExperienceData() {
    return Array.from(document.querySelectorAll('#experience-container .dynamic-entry')).map(sec => ({
        title:    sec.querySelector('.experience-title')?.value    || '',
        company:  sec.querySelector('.experience-company')?.value  || '',
        location: sec.querySelector('.experience-location')?.value || '',
        duration: sec.querySelector('.experience-duration')?.value || '',
        bullets:  (sec.querySelector('.experience-bullets')?.value || '').split('\n').filter(b => b.trim())
    }));
}

function getAchievementsData() {
    return Array.from(document.querySelectorAll('#achievements-container .dynamic-entry')).map(sec => ({
        title:        sec.querySelector('.achievement-title')?.value        || '',
        organization: sec.querySelector('.achievement-organization')?.value || '',
        date:         sec.querySelector('.achievement-date')?.value         || '',
        details:      sec.querySelector('.achievement-details')?.value      || ''
    }));
}

function getProjectsData() {
    return Array.from(document.querySelectorAll('#projects-container .dynamic-entry')).map(sec => ({
        name:    sec.querySelector('.project-name')?.value   || '',
        tech:    sec.querySelector('.project-tech')?.value   || '',
        bullets: (sec.querySelector('.project-bullets')?.value || '').split('\n').filter(b => b.trim()),
        github:  sec.querySelector('.project-github')?.value || ''
    }));
}

function getSkillsData() {
    return Array.from(document.querySelectorAll('#skills-container .dynamic-entry')).map(sec => ({
        category: sec.querySelector('.skill-category')?.value || '',
        items:    sec.querySelector('.skill-items')?.value    || ''
    }));
}

// ─── Dynamic Section Adders ───────────────────────────────
function addProfile() {
    profileCount++;
    const container = document.getElementById('profiles-container');
    const el = document.createElement('div');
    el.className = 'dynamic-entry';
    el.innerHTML = `
        <div class="entry-head">
            <span class="entry-label">Profile ${profileCount}</span>
            <button type="button" class="btn-remove" onclick="removeProfile(this)">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                Remove
            </button>
        </div>
        <div class="input-row">
            <div class="form-group">
                <label>Platform</label>
                <input type="text" class="profile-name" placeholder="Platform Name">
            </div>
            <div class="form-group">
                <label>URL</label>
                <input type="url" class="profile-url" placeholder="profile-url.com/username">
            </div>
        </div>`;
    container.appendChild(el);
    addEventListenersToElement(el);
    updatePreview();
}

function removeProfile(button) {
    button.closest('.dynamic-entry').remove();
    updatePreview();
}

function addEducation() {
    educationCount++;
    const container = document.getElementById('education-container');
    const el = document.createElement('div');
    el.className = 'dynamic-entry';
    el.innerHTML = `
        <div class="entry-head">
            <span class="entry-label">Education ${educationCount}</span>
            <button type="button" class="btn-remove" onclick="removeEducation(this)">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                Remove
            </button>
        </div>
        <div class="input-row">
            <div class="form-group">
                <label>Degree</label>
                <input type="text" class="education-degree" placeholder="Bachelor of Science">
            </div>
            <div class="form-group">
                <label>Field of Study</label>
                <input type="text" class="education-field" placeholder="Computer Science">
            </div>
        </div>
        <div class="input-row">
            <div class="form-group">
                <label>University</label>
                <input type="text" class="education-university" placeholder="University Name">
            </div>
            <div class="form-group">
                <label>Year / Period</label>
                <input type="text" class="education-year" placeholder="2020 -- 2024">
            </div>
        </div>
        <div class="form-group">
            <label>Location</label>
            <input type="text" class="education-location" placeholder="City, State">
        </div>`;
    container.appendChild(el);
    addEventListenersToElement(el);
    updatePreview();
}

function removeEducation(button) {
    button.closest('.dynamic-entry').remove();
    updatePreview();
}

function addExperience() {
    experienceCount++;
    const container = document.getElementById('experience-container');
    const el = document.createElement('div');
    el.className = 'dynamic-entry';
    el.innerHTML = `
        <div class="entry-head">
            <span class="entry-label">Experience ${experienceCount}</span>
            <button type="button" class="btn-remove" onclick="removeExperience(this)">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                Remove
            </button>
        </div>
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
                <input type="text" class="experience-duration" placeholder="Jan 2023 – Present">
            </div>
        </div>
        <div class="form-group">
            <label>Responsibilities (one per line)</label>
            <textarea class="experience-bullets" placeholder="Describe what you built, shipped, or improved."></textarea>
        </div>`;
    container.appendChild(el);
    addEventListenersToElement(el);
    updatePreview();
}

function removeExperience(button) {
    button.closest('.dynamic-entry').remove();
    updatePreview();
}

function addAchievement() {
    achievementCount++;
    const container = document.getElementById('achievements-container');
    const el = document.createElement('div');
    el.className = 'dynamic-entry';
    el.innerHTML = `
        <div class="entry-head">
            <span class="entry-label">Achievement ${achievementCount}</span>
            <button type="button" class="btn-remove" onclick="removeAchievement(this)">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                Remove
            </button>
        </div>
        <div class="input-row">
            <div class="form-group">
                <label>Title</label>
                <input type="text" class="achievement-title" placeholder="Award / Recognition Title">
            </div>
            <div class="form-group">
                <label>Organization</label>
                <input type="text" class="achievement-organization" placeholder="Organization Name">
            </div>
        </div>
        <div class="input-row">
            <div class="form-group">
                <label>Date / Year</label>
                <input type="text" class="achievement-date" placeholder="2022">
            </div>
            <div class="form-group">
                <label>Details (optional)</label>
                <input type="text" class="achievement-details" placeholder="Additional context">
            </div>
        </div>`;
    container.appendChild(el);
    addEventListenersToElement(el);
    updatePreview();
}

function removeAchievement(button) {
    button.closest('.dynamic-entry').remove();
    updatePreview();
}

function addProject() {
    projectCount++;
    const container = document.getElementById('projects-container');
    const el = document.createElement('div');
    el.className = 'dynamic-entry';
    el.innerHTML = `
        <div class="entry-head">
            <span class="entry-label">Project ${projectCount}</span>
            <button type="button" class="btn-remove" onclick="removeProject(this)">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                Remove
            </button>
        </div>
        <div class="input-row">
            <div class="form-group">
                <label>Project Name</label>
                <input type="text" class="project-name" placeholder="Project Name">
            </div>
            <div class="form-group">
                <label>Technologies</label>
                <input type="text" class="project-tech" placeholder="React, Node.js, MongoDB">
            </div>
        </div>
        <div class="form-group">
            <label>Description & Achievements (one per line)</label>
            <textarea class="project-bullets" placeholder="What it does, what you built, key metrics."></textarea>
        </div>
        <div class="form-group">
            <label>GitHub URL (optional)</label>
            <input type="url" class="project-github" placeholder="github.com/username/project">
        </div>`;
    container.appendChild(el);
    addEventListenersToElement(el);
    updatePreview();
}

function removeProject(button) {
    button.closest('.dynamic-entry').remove();
    updatePreview();
}

function addSkill() {
    skillCount++;
    const container = document.getElementById('skills-container');
    const el = document.createElement('div');
    el.className = 'dynamic-entry';
    el.innerHTML = `
        <div class="entry-head">
            <span class="entry-label">Category ${skillCount}</span>
            <button type="button" class="btn-remove" onclick="removeSkill(this)">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                Remove
            </button>
        </div>
        <div class="input-row">
            <div class="form-group">
                <label>Category Name</label>
                <input type="text" class="skill-category" placeholder="Languages">
            </div>
            <div class="form-group">
                <label>Skills (comma-separated)</label>
                <input type="text" class="skill-items" placeholder="JavaScript, Python, Go">
            </div>
        </div>`;
    container.appendChild(el);
    addEventListenersToElement(el);
    updatePreview();
}

function removeSkill(button) {
    button.closest('.dynamic-entry').remove();
    updatePreview();
}

// ─── PDF Download ──────────────────────────────────────────
function downloadPDF() {
    const element    = document.getElementById('resume-preview');
    const scaleValue = parseFloat(document.getElementById('scale-slider').value);
    const opt = {
        margin:    [0, 0, 0, 0],
        filename:  'resume.pdf',
        image:     { type: 'jpeg', quality: 0.99 },
        html2canvas: {
            scale:          scaleValue,
            useCORS:        true,
            letterRendering: true
        },
        jsPDF: {
            unit:        'in',
            format:      'letter',
            orientation: 'portrait',
            margin:      [0.1, 0.15, 0.15, 0.15]
        },
        pagebreak: { mode: ['css', 'legacy'] }
    };
    html2pdf().set(opt).from(element).save();
}

// ─── Section Nav ──────────────────────────────────────────
function scrollToSection(id) {
    const target = document.getElementById(id);
    const panel  = document.getElementById('formPanel');
    if (!target || !panel) return;
    panel.scrollTo({ top: target.offsetTop - 16, behavior: 'smooth' });
}

function wireNavHighlight() {
    const panel   = document.getElementById('formPanel');
    const links   = document.querySelectorAll('.section-nav-link');
    const sections = document.querySelectorAll('.form-section-block');
    if (!panel || !sections.length) return;

    panel.addEventListener('scroll', () => {
        const scrollTop = panel.scrollTop + 64;
        let current = sections[0];
        sections.forEach(sec => {
            if (sec.offsetTop <= scrollTop) current = sec;
        });
        links.forEach(link => {
            const target = link.getAttribute('onclick')?.match(/'(sec-[^']+)'/)?.[1];
            link.classList.toggle('active', target === current?.id);
        });
    }, { passive: true });
}

// ─── Save Indicator ───────────────────────────────────────
function flashSaveIndicator() {
    const el = document.getElementById('saveIndicator');
    if (!el) return;
    el.classList.add('visible');
    setTimeout(() => el.classList.remove('visible'), 2000);
}

// ─── localStorage Persistence ─────────────────────────────
const STORAGE_KEY = 'vjtools_resume_v1';

function gatherFormState() {
    const state = {
        name:         document.getElementById('name')?.value     || '',
        email:        document.getElementById('email')?.value    || '',
        phone:        document.getElementById('phone')?.value    || '',
        linkedin:     document.getElementById('linkedin')?.value || '',
        summary:      document.getElementById('summary')?.value  || '',
        profiles:     getProfilesData(),
        education:    getEducationData(),
        experience:   getExperienceData().map(e => ({ ...e, bulletsRaw: document.querySelectorAll('#experience-container .dynamic-entry .experience-bullets')[getExperienceData().indexOf(e)]?.value || '' })),
        achievements: getAchievementsData(),
        projects:     getProjectsData().map(p => ({ ...p, bulletsRaw: document.querySelectorAll('#projects-container .dynamic-entry .project-bullets')[getProjectsData().indexOf(p)]?.value || '' })),
        skills:       getSkillsData()
    };
    // Store raw textarea values properly
    state.experienceRaw = Array.from(document.querySelectorAll('#experience-container .dynamic-entry')).map(sec => ({
        title:    sec.querySelector('.experience-title')?.value    || '',
        company:  sec.querySelector('.experience-company')?.value  || '',
        location: sec.querySelector('.experience-location')?.value || '',
        duration: sec.querySelector('.experience-duration')?.value || '',
        bullets:  sec.querySelector('.experience-bullets')?.value  || ''
    }));
    state.projectsRaw = Array.from(document.querySelectorAll('#projects-container .dynamic-entry')).map(sec => ({
        name:    sec.querySelector('.project-name')?.value   || '',
        tech:    sec.querySelector('.project-tech')?.value   || '',
        bullets: sec.querySelector('.project-bullets')?.value || '',
        github:  sec.querySelector('.project-github')?.value || ''
    }));
    return state;
}

function saveToStorage() {
    try {
        const state = gatherFormState();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
        // localStorage unavailable — silent fail
    }
}

function loadFromStorage() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return;
        const state = JSON.parse(raw);

        // Simple fields
        if (state.name)     document.getElementById('name').value     = state.name;
        if (state.email)    document.getElementById('email').value    = state.email;
        if (state.phone)    document.getElementById('phone').value    = state.phone;
        if (state.linkedin) document.getElementById('linkedin').value = state.linkedin;
        if (state.summary)  document.getElementById('summary').value  = state.summary;

        // Restore profiles
        if (Array.isArray(state.profiles) && state.profiles.length) {
            restoreDynamicSection(
                'profiles-container', state.profiles,
                (item, i) => buildProfileHTML(i + 1, item)
            );
            profileCount = Math.max(profileCount, state.profiles.length);
        }

        // Restore education
        if (Array.isArray(state.education) && state.education.length) {
            restoreDynamicSection(
                'education-container', state.education,
                (item, i) => buildEducationHTML(i + 1, item)
            );
            educationCount = Math.max(educationCount, state.education.length);
        }

        // Restore experience
        if (Array.isArray(state.experienceRaw) && state.experienceRaw.length) {
            restoreDynamicSection(
                'experience-container', state.experienceRaw,
                (item, i) => buildExperienceHTML(i + 1, item)
            );
            experienceCount = Math.max(experienceCount, state.experienceRaw.length);
        }

        // Restore projects
        if (Array.isArray(state.projectsRaw) && state.projectsRaw.length) {
            restoreDynamicSection(
                'projects-container', state.projectsRaw,
                (item, i) => buildProjectHTML(i + 1, item)
            );
            projectCount = Math.max(projectCount, state.projectsRaw.length);
        }

        // Restore skills
        if (Array.isArray(state.skills) && state.skills.length) {
            restoreDynamicSection(
                'skills-container', state.skills,
                (item, i) => buildSkillHTML(i + 1, item)
            );
            skillCount = Math.max(skillCount, state.skills.length);
        }

        // Restore achievements
        if (Array.isArray(state.achievements) && state.achievements.length) {
            restoreDynamicSection(
                'achievements-container', state.achievements,
                (item, i) => buildAchievementHTML(i + 1, item)
            );
            achievementCount = Math.max(achievementCount, state.achievements.length);
        }

        // Re-wire all inputs after restore
        addEventListeners();

    } catch (e) {
        // Corrupt state — ignore and use defaults
    }
}

function restoreDynamicSection(containerId, items, htmlBuilder) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';
    items.forEach((item, i) => {
        const el = document.createElement('div');
        el.className = 'dynamic-entry';
        el.innerHTML = htmlBuilder(item, i);
        container.appendChild(el);
    });
}

function removeBtnHTML() {
    return `<button type="button" class="btn-remove" onclick="removeGeneric(this)">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        Remove
    </button>`;
}

// Note: generic remove used by restored sections — routes by container
function removeGeneric(button) {
    const entry = button.closest('.dynamic-entry');
    const container = entry.parentElement;
    entry.remove();
    updatePreview();
}

function buildProfileHTML(n, item) {
    return `<div class="entry-head"><span class="entry-label">Profile ${n}</span>
        <button type="button" class="btn-remove" onclick="removeProfile(this)"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>Remove</button></div>
    <div class="input-row">
        <div class="form-group"><label>Platform</label><input type="text" class="profile-name" placeholder="GitHub" value="${esc(item.name)}"></div>
        <div class="form-group"><label>URL</label><input type="url" class="profile-url" placeholder="github.com/username" value="${esc(item.url)}"></div>
    </div>`;
}

function buildEducationHTML(n, item) {
    return `<div class="entry-head"><span class="entry-label">Education ${n}</span>
        <button type="button" class="btn-remove" onclick="removeEducation(this)"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>Remove</button></div>
    <div class="input-row">
        <div class="form-group"><label>Degree</label><input type="text" class="education-degree" placeholder="Bachelor of Science" value="${esc(item.degree)}"></div>
        <div class="form-group"><label>Field of Study</label><input type="text" class="education-field" placeholder="Computer Science" value="${esc(item.field)}"></div>
    </div>
    <div class="input-row">
        <div class="form-group"><label>University</label><input type="text" class="education-university" placeholder="University Name" value="${esc(item.university)}"></div>
        <div class="form-group"><label>Year / Period</label><input type="text" class="education-year" placeholder="2020 -- 2024" value="${esc(item.year)}"></div>
    </div>
    <div class="form-group"><label>Location</label><input type="text" class="education-location" placeholder="City, State" value="${esc(item.location)}"></div>`;
}

function buildExperienceHTML(n, item) {
    return `<div class="entry-head"><span class="entry-label">Experience ${n}</span>
        <button type="button" class="btn-remove" onclick="removeExperience(this)"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>Remove</button></div>
    <div class="input-row">
        <div class="form-group"><label>Job Title</label><input type="text" class="experience-title" placeholder="Software Engineer" value="${esc(item.title)}"></div>
        <div class="form-group"><label>Company</label><input type="text" class="experience-company" placeholder="Company Name" value="${esc(item.company)}"></div>
    </div>
    <div class="input-row">
        <div class="form-group"><label>Location</label><input type="text" class="experience-location" placeholder="City, State" value="${esc(item.location)}"></div>
        <div class="form-group"><label>Duration</label><input type="text" class="experience-duration" placeholder="Jan 2023 – Present" value="${esc(item.duration)}"></div>
    </div>
    <div class="form-group"><label>Responsibilities (one per line)</label><textarea class="experience-bullets" placeholder="Describe what you built, shipped, or improved.">${esc(item.bullets)}</textarea></div>`;
}

function buildProjectHTML(n, item) {
    return `<div class="entry-head"><span class="entry-label">Project ${n}</span>
        <button type="button" class="btn-remove" onclick="removeProject(this)"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>Remove</button></div>
    <div class="input-row">
        <div class="form-group"><label>Project Name</label><input type="text" class="project-name" placeholder="Project Name" value="${esc(item.name)}"></div>
        <div class="form-group"><label>Technologies</label><input type="text" class="project-tech" placeholder="React, Node.js, MongoDB" value="${esc(item.tech)}"></div>
    </div>
    <div class="form-group"><label>Description & Achievements (one per line)</label><textarea class="project-bullets" placeholder="What it does, what you built, key metrics.">${esc(item.bullets)}</textarea></div>
    <div class="form-group"><label>GitHub URL (optional)</label><input type="url" class="project-github" placeholder="github.com/username/project" value="${esc(item.github)}"></div>`;
}

function buildSkillHTML(n, item) {
    return `<div class="entry-head"><span class="entry-label">Category ${n}</span>
        <button type="button" class="btn-remove" onclick="removeSkill(this)"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>Remove</button></div>
    <div class="input-row">
        <div class="form-group"><label>Category Name</label><input type="text" class="skill-category" placeholder="Languages" value="${esc(item.category)}"></div>
        <div class="form-group"><label>Skills (comma-separated)</label><input type="text" class="skill-items" placeholder="JavaScript, Python, Go" value="${esc(item.items)}"></div>
    </div>`;
}

function buildAchievementHTML(n, item) {
    return `<div class="entry-head"><span class="entry-label">Achievement ${n}</span>
        <button type="button" class="btn-remove" onclick="removeAchievement(this)"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>Remove</button></div>
    <div class="input-row">
        <div class="form-group"><label>Title</label><input type="text" class="achievement-title" placeholder="Award / Recognition Title" value="${esc(item.title)}"></div>
        <div class="form-group"><label>Organization</label><input type="text" class="achievement-organization" placeholder="Organization Name" value="${esc(item.organization)}"></div>
    </div>
    <div class="input-row">
        <div class="form-group"><label>Date / Year</label><input type="text" class="achievement-date" placeholder="2022" value="${esc(item.date)}"></div>
        <div class="form-group"><label>Details (optional)</label><input type="text" class="achievement-details" placeholder="Additional context" value="${esc(item.details)}"></div>
    </div>`;
}

function esc(str) {
    return String(str || '').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// ─── Support Dialog ────────────────────────────────────────
const BMC_UPI_ID   = 'vijaygupta1818@ptyes';
const BMC_UPI_NAME = 'Vijay Gupta';
const BMC_TN       = 'vijay.tools support';

function buildUpiIntent(amount) {
    const params = new URLSearchParams({ pa: BMC_UPI_ID, pn: BMC_UPI_NAME, cu: 'INR', tn: BMC_TN });
    if (amount) params.set('am', String(amount));
    return `upi://pay?${params.toString()}`;
}

function wireSupportDialog() {
    const dialog  = document.getElementById('supportDialog');
    const copyBtn = document.getElementById('supportCopyBtn');
    const amt49   = document.getElementById('amount49');
    const amt99   = document.getElementById('amount99');
    if (!dialog) return;

    if (amt49) amt49.href = buildUpiIntent(49);
    if (amt99) amt99.href = buildUpiIntent(99);

    const open = () => {
        dialog.classList.add('open');
        dialog.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    };
    const close = () => {
        dialog.classList.remove('open');
        dialog.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };

    document.querySelectorAll('[data-open="support"], #supportFab').forEach(el => {
        el.addEventListener('click', open);
    });
    dialog.addEventListener('click', e => {
        if (e.target.closest('[data-close]')) close();
    });
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && dialog.classList.contains('open')) close();
    });

    if (copyBtn) {
        const icon     = document.getElementById('supportCopyIcon');
        const original = icon ? icon.innerHTML : '';
        copyBtn.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(BMC_UPI_ID);
                copyBtn.classList.add('copied');
                if (icon) icon.innerHTML = '<polyline points="20 6 9 17 4 12"/>';
                setTimeout(() => {
                    copyBtn.classList.remove('copied');
                    if (icon) icon.innerHTML = original;
                }, 2000);
            } catch {
                // Clipboard unavailable — user can copy manually
            }
        });
    }
}
