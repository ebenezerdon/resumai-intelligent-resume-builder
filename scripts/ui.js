window.App = window.App || {};

(function() {
    // === STATE ===
    const DEFAULT_DATA = {
        meta: { template: 'modern', zoom: 1 },
        personal: {
            fullName: 'Alex Morgan',
            title: 'Senior Product Designer',
            email: 'alex@example.com',
            phone: '(555) 123-4567',
            location: 'San Francisco, CA',
            website: 'alexmorgan.design'
        },
        summary: 'Creative and detail-oriented Product Designer with 5+ years of experience in building user-centric digital products. Proven track record of improving user engagement and streamlining workflows.',
        experience: [
            {
                id: 'exp1',
                title: 'Senior Product Designer',
                company: 'TechFlow Inc.',
                date: '2021 - Present',
                description: '• Led the redesign of the core mobile application, increasing user retention by 25%.\n• Mentored junior designers and established a comprehensive design system.\n• Collaborated with product managers to define roadmap and feature requirements.'
            },
            {
                id: 'exp2',
                title: 'UX Designer',
                company: 'Creative Pulse',
                date: '2018 - 2021',
                description: '• Conducted user research and usability testing to inform design decisions.\n• Designed intuitive interfaces for fintech clients, simplifying complex data visualizations.'
            }
        ],
        education: [
            {
                id: 'edu1',
                degree: 'B.S. Interaction Design',
                school: 'California Arts University',
                date: '2014 - 2018'
            }
        ],
        skills: 'Figma, Sketch, Adobe CC, HTML/CSS, Prototyping, User Research, Agile Methodology'
    };

    let appData = null;
    let currentSection = 'personal';

    // === INIT ===
    App.init = function() {
        // Load data or default
        appData = App.Storage.get('resume_data', DEFAULT_DATA);
        
        // Render initial UI
        renderNav();
        App.renderEditor('personal');
        App.renderResume();
        
        // Init AI automatically (silent load)
        initAI();
    };

    // === EDITOR RENDERERS ===
    const SECTIONS = [
        { id: 'personal', label: 'Personal Info', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
        { id: 'summary', label: 'Summary', icon: 'M4 6h16M4 12h16M4 18h7' },
        { id: 'experience', label: 'Experience', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
        { id: 'education', label: 'Education', icon: 'M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z' },
        { id: 'skills', label: 'Skills', icon: 'M13 10V3L4 14h7v7l9-11h-7z' }
    ];

    function renderNav() {
        const $nav = $('#section-nav');
        $nav.empty();
        SECTIONS.forEach(sec => {
            const active = sec.id === currentSection ? 'active' : '';
            $nav.append(`
                <button class="shrink-0 h-10 px-4 rounded-full border border-slate-200 bg-white hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700 flex items-center gap-2 transition-all whitespace-nowrap ${active}" onclick="window.App.renderEditor('${sec.id}')">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${sec.icon}"></path></svg>
                    <span class="text-sm font-medium">${sec.label}</span>
                </button>
            `);
        });
    }

    App.renderEditor = function(sectionId) {
        currentSection = sectionId;
        // Update Nav Active State
        $('#section-nav button').removeClass('bg-emerald-600 text-white border-transparent').addClass('bg-white text-slate-600 border-slate-200');
        // Note: Simple redraw of nav to highlight correct one
        renderNav(); 
        $(`#section-nav button:nth-child(${SECTIONS.findIndex(s => s.id === sectionId) + 1})`).removeClass('bg-white text-slate-600').addClass('bg-emerald-600 text-white border-transparent');

        const $container = $('#editor-container');
        $container.hide().empty();

        if (sectionId === 'personal') {
            $container.html(`
                <h3 class="text-lg font-bold text-slate-800 mb-4">Personal Details</h3>
                ${inputField('personal.fullName', 'Full Name', appData.personal.fullName)}
                ${inputField('personal.title', 'Job Title', appData.personal.title)}
                <div class="grid grid-cols-2 gap-4">
                    ${inputField('personal.email', 'Email', appData.personal.email)}
                    ${inputField('personal.phone', 'Phone', appData.personal.phone)}
                </div>
                ${inputField('personal.location', 'Location', appData.personal.location)}
                ${inputField('personal.website', 'Website / Portfolio', appData.personal.website)}
            `);
        } 
        else if (sectionId === 'summary') {
            $container.html(`
                <h3 class="text-lg font-bold text-slate-800 mb-4">Professional Summary</h3>
                <div class="mb-4">
                    <div class="flex justify-between items-center mb-1">
                        <label class="input-label">Bio / Objective</label>
                        <button class="text-xs text-emerald-600 font-medium flex items-center gap-1 hover:underline ai-btn" data-target="summary-text" data-prompt="Rewrite this professional summary to be more impactful and concise:">
                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                            AI Rewrite
                        </button>
                    </div>
                    <textarea id="summary-text" class="form-input h-48 resize-y" oninput="window.App.updateField('summary', this.value)">${appData.summary}</textarea>
                </div>
            `);
        }
        else if (sectionId === 'skills') {
            $container.html(`
                <h3 class="text-lg font-bold text-slate-800 mb-4">Skills</h3>
                 <div class="mb-4">
                    <div class="flex justify-between items-center mb-1">
                        <label class="input-label">List your skills (comma separated)</label>
                        <button class="text-xs text-emerald-600 font-medium flex items-center gap-1 hover:underline ai-btn" data-target="skills-text" data-prompt="Suggest 10 relevant hard and soft skills for a ${appData.personal.title || 'professional'} formatted as a comma separated list:">
                             <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                            AI Suggest
                        </button>
                    </div>
                    <textarea id="skills-text" class="form-input h-32 resize-y" oninput="window.App.updateField('skills', this.value)">${appData.skills}</textarea>
                </div>
            `);
        }
        else if (sectionId === 'experience') {
             $container.html(`
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-bold text-slate-800">Experience</h3>
                    <button onclick="window.App.addItem('experience')" class="text-sm bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-md font-medium hover:bg-emerald-200">+ Add Role</button>
                </div>
                <div class="space-y-6">
                    ${appData.experience.map((item, index) => `
                        <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative group">
                            <button onclick="window.App.deleteItem('experience', ${index})" class="absolute top-2 right-2 text-slate-300 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                            </button>
                            <div class="grid grid-cols-2 gap-3 mb-3">
                                ${inputField(`experience[${index}].title`, 'Title', item.title, 'updateItem', 'experience', index, 'title')}
                                ${inputField(`experience[${index}].company`, 'Company', item.company, 'updateItem', 'experience', index, 'company')}
                            </div>
                            ${inputField(`experience[${index}].date`, 'Date Range', item.date, 'updateItem', 'experience', index, 'date')}
                            <div class="mt-3">
                                 <div class="flex justify-between items-center mb-1">
                                    <label class="input-label">Description</label>
                                    <button class="text-xs text-emerald-600 font-medium flex items-center gap-1 hover:underline ai-btn" data-target="exp-desc-${index}" data-prompt="Rewrite these job responsibilities to be achievement-oriented bullet points:">
                                         <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                                        AI Enhance
                                    </button>
                                </div>
                                <textarea id="exp-desc-${index}" class="form-input h-32 text-xs leading-relaxed" oninput="window.App.updateItem('experience', ${index}, 'description', this.value)">${item.description}</textarea>
                            </div>
                        </div>
                    `).join('')}
                </div>
             `);
        }
        else if (sectionId === 'education') {
             $container.html(`
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-bold text-slate-800">Education</h3>
                    <button onclick="window.App.addItem('education')" class="text-sm bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-md font-medium hover:bg-emerald-200">+ Add School</button>
                </div>
                <div class="space-y-4">
                    ${appData.education.map((item, index) => `
                        <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative group">
                            <button onclick="window.App.deleteItem('education', ${index})" class="absolute top-2 right-2 text-slate-300 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                            </button>
                            ${inputField(`education[${index}].school`, 'School', item.school, 'updateItem', 'education', index, 'school')}
                            <div class="grid grid-cols-2 gap-3 mt-3">
                                ${inputField(`education[${index}].degree`, 'Degree', item.degree, 'updateItem', 'education', index, 'degree')}
                                ${inputField(`education[${index}].date`, 'Date', item.date, 'updateItem', 'education', index, 'date')}
                            </div>
                        </div>
                    `).join('')}
                </div>
             `);
        }

        $container.fadeIn(200);
    };

    // Helper to generate inputs
    function inputField(id, label, value, func = 'updateField', ...args) {
        // Handle nested update args for complex items
        const argsString = args.length ? `, '${args[0]}', ${args[1]}, '${args[2]}'` : `, this.value`;
        // Special handling for personal fields where path is dot-notated but updateField expects split
        const onInput = func === 'updateField' 
            ? `window.App.updateField('${id.includes('.') ? id.split('.')[1] : id}', this.value)`
            : `window.App.${func}('${args[0]}', ${args[1]}, '${args[2]}', this.value)`;
            
        return `
            <div class="input-group">
                <label class="input-label">${label}</label>
                <input type="text" class="form-input" value="${value || ''}" oninput="${onInput}">
            </div>
        `;
    }

    // === DATA MANIPULATION ===
    App.updateField = function(field, value) {
        if (['fullName', 'title', 'email', 'phone', 'location', 'website'].includes(field)) {
            appData.personal[field] = value;
        } else {
            appData[field] = value;
        }
        persist();
        App.renderResume();
    };

    App.updateItem = function(section, index, key, value) {
        appData[section][index][key] = value;
        persist();
        App.renderResume();
    };

    App.addItem = function(section) {
        const newItem = section === 'experience' 
            ? { title: 'Job Title', company: 'Company', date: '2023', description: 'Description...' } 
            : { school: 'University', degree: 'Degree', date: '2023' };
        appData[section].unshift(newItem);
        persist();
        App.renderEditor(section);
        App.renderResume();
    };

    App.deleteItem = function(section, index) {
        if(confirm('Delete this item?')) {
            appData[section].splice(index, 1);
            persist();
            App.renderEditor(section);
            App.renderResume();
        }
    };

    App.resetData = function() {
        if(confirm('Reset all data to default? This cannot be undone.')) {
            localStorage.removeItem('resume_data');
            location.reload();
        }
    };

    App.setTemplate = function(tpl) {
        appData.meta.template = tpl;
        persist();
        App.renderResume();
    };

    function persist() {
        App.Storage.set('resume_data', appData);
    }

    // === RESUME RENDERER ===
    App.renderResume = function() {
        const $preview = $('#resume-preview');
        const tpl = appData.meta.template;
        
        // Add wrapper class
        $preview.removeClass('tpl-modern tpl-classic tpl-minimal').addClass(`tpl-${tpl}`);

        let content = '';

        if (tpl === 'modern') {
            content = `
                <div class="resume-sidebar">
                    <div class="mb-8">
                        <h1 class="text-2xl font-bold leading-tight mb-2 text-slate-900">${appData.personal.fullName}</h1>
                        <p class="text-emerald-600 font-medium">${appData.personal.title}</p>
                    </div>
                    
                    <div class="text-sm space-y-3 mb-8 text-slate-600">
                        ${appData.personal.email ? `<div class="flex items-center gap-3"><svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>${appData.personal.email}</div>` : ''}
                        ${appData.personal.phone ? `<div class="flex items-center gap-3"><svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>${appData.personal.phone}</div>` : ''}
                        ${appData.personal.location ? `<div class="flex items-center gap-3"><svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>${appData.personal.location}</div>` : ''}
                    </div>

                    <div class="section-title">Education</div>
                    <div class="space-y-5">
                        ${appData.education.map(e => `
                            <div>
                                <div class="font-bold text-sm text-slate-800">${e.school}</div>
                                <div class="text-xs text-slate-600">${e.degree}</div>
                                <div class="text-xs text-slate-500 mt-1 font-mono">${e.date}</div>
                            </div>
                        `).join('')}
                    </div>

                    <div class="section-title">Skills</div>
                    <div class="flex flex-wrap gap-2">
                        ${appData.skills.split(',').map(s => `<span class="inline-block bg-slate-100 border border-slate-200 text-slate-700 rounded px-2 py-1 text-xs">${s.trim()}</span>`).join('')}
                    </div>
                </div>
                
                <div class="resume-main">
                    <div class="section-title !mt-0">Professional Summary</div>
                    <p class="text-sm text-slate-600 leading-relaxed mb-8 text-justify">${appData.summary}</p>

                    <div class="section-title">Experience</div>
                    <div class="space-y-6">
                        ${appData.experience.map(e => `
                            <div class="resume-item">
                                <div class="flex justify-between items-baseline mb-1 gap-4">
                                    <h3 class="font-bold text-slate-800 text-base">${e.title}</h3>
                                    <span class="text-xs text-slate-500 font-mono shrink-0">${e.date}</span>
                                </div>
                                <div class="text-sm text-emerald-700 font-medium mb-3">${e.company}</div>
                                <div class="text-sm text-slate-600 leading-relaxed whitespace-pre-line">${e.description}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        } else {
            // Classic & Minimal share structure but differ in CSS
            content = `
                <h1>${appData.personal.fullName}</h1>
                <div class="contact-info">
                    ${appData.personal.title} | ${appData.personal.email} | ${appData.personal.phone} | ${appData.personal.location}
                </div>

                <div class="section-title">Professional Summary</div>
                <p class="text-sm leading-relaxed mb-6">${appData.summary}</p>

                <div class="section-title">Experience</div>
                ${appData.experience.map(e => `
                    <div class="resume-item">
                        <div class="job-header flex justify-between items-baseline gap-4">
                            <div class="min-w-0 break-words">
                                <span class="job-title">${e.title}</span> – <span class="job-company">${e.company}</span>
                            </div>
                            <span class="job-date shrink-0">${e.date}</span>
                        </div>
                        <div class="text-sm leading-relaxed whitespace-pre-line">${e.description}</div>
                    </div>
                `).join('')}

                <div class="section-title">Education</div>
                 ${appData.education.map(e => `
                    <div class="resume-item">
                        <div class="job-header">
                             <span class="job-title">${e.school}</span>
                             <span class="job-date">${e.date}</span>
                        </div>
                        <div class="text-sm">${e.degree}</div>
                    </div>
                `).join('')}

                <div class="section-title">Skills</div>
                <p class="text-sm">${appData.skills}</p>
            `;
        }

        $preview.html(content);
    };

    // === AI INTEGRATION ===
    async function initAI() {
        try {
             await window.AppLLM.load(null, (pct) => {
                // Only show modal if user explicitly requested action? 
                // Strategy: Load silently. If user clicks AI button before ready, show progress.
                // We will handle specific UI in the click handler.
                console.log(`AI Loading: ${pct}%`);
                window.aiLoadProgress = pct;
             });
             $('#ai-status').removeClass('hidden').addClass('flex');
        } catch(e) {
            console.log('WebGPU not supported or load failed', e);
            $('#ai-status').addClass('hidden');
        }
    }

    // Handle AI Button Click
    $(document).on('click', '.ai-btn', async function() {
        const $btn = $(this);
        const targetId = $btn.data('target');
        const promptPrefix = $btn.data('prompt');
        const $input = $(`#${targetId}`);
        const originalText = $input.val();

        if (!window.AppLLM.ready) {
            // Show modal if not ready
            const $modal = $('#ai-modal');
            $modal.removeClass('hidden').addClass('flex');
            
            // Poll for progress updates from the silent load
            const checkInterval = setInterval(() => {
                const pct = window.aiLoadProgress || 0;
                $('#ai-progress-bar').css('width', `${pct}%`);
                $('#ai-progress-text').text(`${pct}%`);
                if (window.AppLLM.ready) {
                    clearInterval(checkInterval);
                    $modal.addClass('hidden').removeClass('flex');
                    runGeneration();
                }
            }, 100);
            return;
        }

        runGeneration();

        async function runGeneration() {
            $btn.addClass('opacity-50 cursor-not-allowed').text('Generating...');
            $input.addClass('bg-emerald-50/50 animate-pulse');
            
            let generated = '';
            try {
                // Construct prompt
                const fullPrompt = `${promptPrefix}\n\n${originalText}`;
                
                // Clear input to stream result
                $input.val('');
                
                await window.AppLLM.generate(fullPrompt, {
                    system: 'You are a professional resume writer. Return only the requested text. Do not include conversational filler like "Here is the rewritten text". Keep it professional, concise, and result-oriented.',
                    onToken: (token) => {
                        generated += token;
                        $input.val(generated);
                        // Auto resize textarea
                        $input.height($input[0].scrollHeight);
                    }
                });
                
                // Trigger save event
                $input.trigger('input');
                App.toast('Content generated successfully!');
            } catch (err) {
                console.error(err);
                $input.val(originalText); // Revert on error
                App.toast('AI Generation failed.', 'error');
            } finally {
                $btn.removeClass('opacity-50 cursor-not-allowed').html(`
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                    AI Rewrite
                `);
                $input.removeClass('bg-emerald-50/50 animate-pulse');
            }
        }
    });

})();