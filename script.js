document.addEventListener('DOMContentLoaded', function() {
    // --- SYSTEM INITIALIZATION (The Ritual) ---
    const preloader = document.getElementById('preloader');
    const preloaderText = document.getElementById('preloader-text');
    
    if (preloader && preloaderText) {
        // Stop scroll during load
        document.body.style.overflow = 'hidden';
        
        const bootText = [
            "INITIALIZING SYSTEM...",
            "CONFIGURING MODULES...",
            "DEPLOYING INTERFACE..."
        ];
        
        let lineIndex = 0;
        let charIndex = 0;
        
        function typeBootSequence() {
            if (lineIndex < bootText.length) {
                if (charIndex < bootText[lineIndex].length) {
                    preloaderText.innerHTML = bootText[lineIndex].substring(0, charIndex + 1) + '<span class="typing-cursor">_</span>';
                    charIndex++;
                    setTimeout(typeBootSequence, 65); // Ultra-fast typing
                } else {
                    // Line complete
                    setTimeout(() => {
                        lineIndex++;
                        charIndex = 0;
                        typeBootSequence();
                    }, 250); // Minimal pause
                }
            } else {
                // Sequence Complete
                console.log("System Online");
                setTimeout(revealHero, 200);
            }
        }
        
        function revealHero() {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
                document.body.style.overflow = 'auto'; // Restore scroll
            }, 500); // Quick fade
        }
        
        // Start the ritual
        setTimeout(typeBootSequence, 500);
    }

    // --- CINEMATIC PARALLAX ENGINE ---
    const canvas = document.getElementById('background-canvas');
    const midground = document.getElementById('parallax-midground');
    let mouse = { x: null, y: null };
    let windowCenter = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    // Update mouse position and window center
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        
        // Parallax Effect for Midground
        if (midground) {
            const moveX = (mouse.x - windowCenter.x) * 0.01;
            const moveY = (mouse.y - windowCenter.y) * 0.01;
            
            Array.from(midground.children).forEach(child => {
                const speed = parseFloat(child.getAttribute('data-speed')) || 0.02;
                child.style.transform = `translate(${moveX * speed * 100}px, ${moveY * speed * 100}px)`;
            });
        }
    });

    window.addEventListener('resize', () => {
        windowCenter = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    });

    // --- GEOMETRY (Morphing Mask) ---
    const heroImg = document.querySelector('.hero-image-container img');
    if (heroImg) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            const limit = 500; // Max scroll effect range
            const factor = Math.min(scrollY / limit, 1);
            
            // Base Hexagon: 50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%
            
            // Morph logic: Pull corners in/out slightly
            // Top point: 50% 0% -> shifts down
            const p1_y = 0 + (factor * 10); 
            // Top Right: 100% 25% -> shifts left
            const p2_x = 100 - (factor * 5);
            const p2_y = 25 - (factor * 5);
            // Bottom Right: 100% 75% -> shifts left
            const p3_x = 100 - (factor * 10);
            const p3_y = 75 + (factor * 5);
            // Bottom: 50% 100% -> shifts up
            const p4_y = 100 - (factor * 10);
            // Bottom Left: 0% 75% -> shifts right
            const p5_x = 0 + (factor * 10); 
            const p5_y = 75 + (factor * 5);
            // Top Left: 0% 25% -> shifts right
            const p6_x = 0 + (factor * 5);
            const p6_y = 25 - (factor * 5);

            const newClip = `polygon(50% ${p1_y}%, ${p2_x}% ${p2_y}%, ${p3_x}% ${p3_y}%, 50% ${p4_y}%, ${p5_x}% ${p5_y}%, ${p6_x}% ${p6_y}%)`;
            
            heroImg.style.clipPath = newClip;
            heroImg.style.webkitClipPath = newClip;
        });
    }

    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particlesArray;

        function setCanvasSize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            const dpr = window.devicePixelRatio || 1;
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            ctx.scale(dpr, dpr);
            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight}px`;
        }

        class Particle {
            constructor() {
                this.x = Math.random() * window.innerWidth;
                this.y = Math.random() * window.innerHeight;
                this.size = Math.random() * 2 + 0.5; // Varied sizes for depth
                this.speedX = Math.random() * 0.5 - 0.25;
                this.speedY = Math.random() * 0.5 - 0.25;
                this.z = Math.random() * 3 + 1; // Depth factor (1 is close, 4 is far)
                this.color = `rgba(255, 215, 0, ${0.1 + (1/this.z) * 0.4})`; // Closer = brighter
            }
            
            update() {
                // Standard movement
                this.x += this.speedX / this.z; 
                this.y += this.speedY / this.z;

                // Mouse interaction (Parallax)
                if (mouse.x != null) {
                    const dx = (mouse.x - windowCenter.x) * 0.005;
                    const dy = (mouse.y - windowCenter.y) * 0.005;
                    this.x += dx / this.z; // Closer particles move more with mouse
                    this.y += dy / this.z;
                }

                // Wrap around screen
                if (this.x > window.innerWidth) this.x = 0;
                if (this.x < 0) this.x = window.innerWidth;
                if (this.y > window.innerHeight) this.y = 0;
                if (this.y < 0) this.y = window.innerHeight;
            }
            
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
            }
        }

        function init() {
            particlesArray = [];
            const numberOfParticles = (window.innerWidth * window.innerHeight) / 9000;
            for (let i = 0; i < numberOfParticles; i++) {
                particlesArray.push(new Particle());
            }
        }

        function animate() {
            ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
                particlesArray[i].draw();
            }
            requestAnimationFrame(animate);
        }

        setCanvasSize();
        init();
        animate();

        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                setCanvasSize();
                init();
            }, 100);
        });
    }

    // --- TYPING ANIMATION (The Verdict) ---
    const subtitleEl = document.getElementById('subtitle');
    if (subtitleEl) {
    const phrases = ["Structured Thinking with Clarity.", "Problem Solving with Precision.", "Continuous Learning and Refinement."];
        let phraseIndex = 0; let letterIndex = 0;
        let currentPhrase = ''; let isDeleting = false;

        function type() {
            const fullPhrase = phrases[phraseIndex];
            if (isDeleting) {
                currentPhrase = fullPhrase.substring(0, letterIndex - 1);
                letterIndex--;
            } else {
                currentPhrase = fullPhrase.substring(0, letterIndex + 1);
                letterIndex++;
            }
            subtitleEl.textContent = currentPhrase;
            
            let typeSpeed = 80; // Slower typing for "weight"
            if (isDeleting) typeSpeed /= 2;
            
            if (!isDeleting && letterIndex === fullPhrase.length) {
                typeSpeed = 3000; // Long pause to let it sink in
                isDeleting = true;
            } else if (isDeleting && letterIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                typeSpeed = 1000;
            }
            setTimeout(type, typeSpeed);
        }
        type();
    }

    // --- MOBILE MENU ---
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            const isHidden = mobileMenu.classList.contains('hidden');
            if (isHidden) {
                mobileMenu.classList.remove('hidden');
                setTimeout(() => {
                    mobileMenu.classList.remove('opacity-0');
                }, 10);
                menuBtn.innerHTML = '<i data-lucide="x" class="w-8 h-8 text-gold"></i>';
                lucide.createIcons(); 
            } else {
                mobileMenu.classList.add('opacity-0');
                setTimeout(() => {
                    mobileMenu.classList.add('hidden');
                }, 300);
                menuBtn.innerHTML = '<i data-lucide="menu" class="w-8 h-8 text-gray-300"></i>';
                lucide.createIcons();
            }
        });

        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('opacity-0');
                setTimeout(() => {
                    mobileMenu.classList.add('hidden');
                }, 300);
                menuBtn.innerHTML = '<i data-lucide="menu" class="w-8 h-8 text-gray-300"></i>';
                lucide.createIcons();
            });
        });
    }

    // --- MICRO-INTERACTIONS (SVG Border Injection) ---
    const glassPanels = document.querySelectorAll('.glass-panel');
    const accentMap = {
        'gold': '#ffd700',
        'cyan': '#00e5ff',
        'purple': '#a855f7',
        'green': '#10b981',
        'blue': '#3b82f6'
    };

    glassPanels.forEach(panel => {
        // Check if SVG already exists to avoid dupes
        if (!panel.querySelector('.glass-border-svg')) {
            const svgNS = "http://www.w3.org/2000/svg";
            const svg = document.createElementNS(svgNS, "svg");
            svg.classList.add('glass-border-svg');
            
            const accentKey = panel.getAttribute('data-accent') || 'gold';
            const accentColor = accentMap[accentKey] || accentMap['gold'];

            const rect = document.createElementNS(svgNS, "rect");
            rect.classList.add('glass-border-rect');
            rect.setAttribute('x', '0');
            rect.setAttribute('y', '0');
            rect.setAttribute('width', '100%');
            rect.setAttribute('height', '100%');
            
            // Match border radius dynamically
            let rx = '16'; // default rounded-2xl
            if (panel.classList.contains('rounded-xl')) rx = '12';
            else if (panel.classList.contains('rounded-lg')) rx = '8';
            else if (panel.classList.contains('rounded-md')) rx = '6';
            
            rect.setAttribute('rx', rx); 
            rect.setAttribute('pathLength', '1'); 
            
            // Set dynamic color via attribute (more robust for SVG)
            rect.setAttribute('stroke', accentColor);
            
            // Allow dynamic updating if attribute changes (MutationObserver could be added here if needed, but likely static)

            svg.appendChild(rect);
            panel.appendChild(svg);
            
            // Optional: visual flair for different accents on hover via CSS variables
            panel.style.setProperty('--hover-accent', accentColor);
        }
    });

    // --- SCROLL ANIMATIONS (Cinematic Reveal) ---
    const observerOptions = {
        threshold: 0.15, // Wait until 15% visible
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add a slight stagger delay based on child index if possible, otherwise just show
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-fade-in-up, .glass-panel, .hero-text, .section-title, .timeline-item').forEach(el => {
        el.classList.add('fade-in-section');
        observer.observe(el);
    });

    // --- CUSTOM CURSOR ---
    const cursorDot = document.createElement('div');
    cursorDot.id = 'custom-cursor';
    document.body.appendChild(cursorDot);

    const cursorFollower = document.createElement('div');
    cursorFollower.id = 'custom-cursor-follower';
    document.body.appendChild(cursorFollower);

    let cursorX = window.innerWidth / 2;
    let cursorY = window.innerHeight / 2;
    let followerX = cursorX;
    let followerY = cursorY;

    // Fast update for the main dot for responsiveness
    window.addEventListener('mousemove', (e) => {
        cursorX = e.clientX;
        cursorY = e.clientY;
        cursorDot.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;
    });

    // Smooth animation loop for the follower
    function animateCursor() {
        followerX += (cursorX - followerX) * 0.15;
        followerY += (cursorY - followerY) * 0.15;
        cursorFollower.style.transform = `translate(${followerX}px, ${followerY}px) translate(-50%, -50%)`;
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // --- PROJECT FILTERING ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (filterBtns.length > 0 && projectCards.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active classes
                filterBtns.forEach(b => {
                    b.classList.remove('active', 'border-gold/30', 'text-gold', 'bg-gold/10');
                    b.classList.add('border-white/10', 'text-gray-400');
                });

                // Add active classes to clicked
                btn.classList.add('active', 'border-gold/30', 'text-gold', 'bg-gold/10');
                btn.classList.remove('border-white/10', 'text-gray-400');

                const filterValue = btn.getAttribute('data-filter');

                projectCards.forEach(card => {
                    if (filterValue === 'all' || card.getAttribute('data-category').includes(filterValue)) {
                        card.style.display = 'block';
                        // Small timeout to allow display:block to apply before animating opacity
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'scale(0.95)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300); // match transition duration
                    }
                });
            });
        });
    }

    // --- PROJECT MODAL ENGINE ---
    const projectData = {
        'triage-ai': {
            title: 'Triage-AI Agent',
            subtitle: 'Defensive MoE Architecture',
            description: 'A cutting-edge generative AI security agent leveraging a "Double-Check" Mixture of Experts (MoE) architecture. It utilizes Llama-4, Groq inference, and strict grounding techniques to filter, analyze, and neutralize potentially malicious prompts with extreme low latency.',
            image: 'images/triage_ai.png',
            stack: ['Python', 'Groq API', 'Llama-4', 'MoE'],
            links: {
                github: 'https://github.com/MuditGupta07/Triage-AI'
            }
        },
        'air-quality': {
            title: 'Air Quality Prediction',
            subtitle: 'Machine Learning & EDA',
            description: 'A comprehensive data science project that analyzes air quality parameters to predict PM2.5 levels. It features extensive Exploratory Data Analysis (EDA) and a trained RandomForestRegressor model, all deployed through a clean Streamlit interface.',
            image: 'images/Air.png',
            stack: ['Python', 'Streamlit', 'Scikit-learn', 'Pandas', 'Seaborn'],
            links: {
                github: 'https://github.com/MuditGupta07/Air-Quality-Analysis'
            }
        },
        'gsap-pitch': {
            title: 'Google Pitch Website',
            subtitle: 'Advanced Motion Design',
            description: 'An interactive, cinematic pitch application built for the Google Student Ambassador 2025 program. This project demonstrates complex animation choreography and scroll-triggered physics to ensure butter-smooth 60fps animations, proving a deep understanding of frontend aesthetics.',
            image: 'images/GSAP.png',
            stack: ['HTML', 'CSS', 'JavaScript', 'GSAP'],
            links: {
                live: 'https://muditgupta07.github.io/GSAP-Pitch/',
                github: 'https://github.com/MuditGupta07/GSAP-Pitch'
            }
        },
        'health-meal': {
            title: 'Health-Meal AI Guide',
            subtitle: 'Generative AI Nutrition System',
            description: 'An AI-powered application that generates personalized meal plans tailored to specific medical conditions. It integrates the OpenAI API with robust nutrition databases to provide safe, actionable dietary advice. Built with a focus on scalable architecture and prompt engineering.',
            image: 'images/health.jpg',
            stack: ['Next.js', 'OpenAI API', 'React', 'Tailwind'],
            links: {
                live: 'https://health-meal-ai-guide.vercel.app/',
                github: 'https://github.com/MuditGupta07/health-meal-ai-guide'
            }
        },
        'virtupet': {
            title: 'VirtuPet',
            subtitle: 'Digital Life Simulation',
            description: 'An interactive state-management game featuring 3D environments and complex mood algorithms for virtual pet care. This project focuses heavily on Vanilla JavaScript performance, state persistence, and DOM manipulation without heavy frameworks.',
            image: 'images/virtupet.jpg',
            stack: ['Vanilla JS', 'HTML5', 'CSS3', '3D Environment'],
            links: {
                live: 'https://muditgupta07.github.io/VirtuPet/',
                github: 'https://github.com/MuditGupta07/VirtuPet'
            }
        },
        'budget-buddy': {
            title: 'BudgetBuddy',
            subtitle: 'LocalStorage Finance Tracker',
            description: 'A responsive expense tracking system utilizing browser LocalStorage for data persistence. Features include detailed analytics, categorization, and real-time budget calculation.',
            image: 'images/budget.jpg',
            stack: ['HTML', 'CSS', 'JavaScript', 'Chart.js'],
            links: {
                live: 'https://muditgupta07.github.io/BudgetBuddy/',
                github: 'https://github.com/MuditGupta07/BudgetBuddy'
            }
        },
        'task-master': {
            title: 'Task Master',
            subtitle: 'Persistent Productivity System',
            description: 'A sophisticated task management application with priority sorting, completion date tracking, and state persistence via LocalStorage. Designed with a clean DOM manipulation approach to maximize user productivity without database dependencies.',
            image: 'images/Task.png',
            stack: ['HTML', 'CSS', 'JavaScript', 'LocalStorage'],
            links: {
                live: 'https://muditgupta07.github.io/Todo-App/',
                github: 'https://github.com/muditgupta07/Todo-APP/'
            }
        },
        'innobyte': {
            title: 'Innobyte Services',
            subtitle: 'Frontend Corporate Architecture',
            description: 'A responsive corporate interface designed for high user engagement and performance. Focuses on semantic HTML, accessible design patterns, and modular CSS architecture.',
            image: 'images/Innobyte.png',
            stack: ['HTML', 'CSS', 'JavaScript'],
            links: {
                live: 'https://muditgupta07.github.io/Innobyte-Services-Intern-Project/',
                github: 'https://github.com/MuditGupta07/Innobyte-Services-Intern-Project'
            }
        },
        'traffic-sim': {
            title: 'Traffic Simulator',
            subtitle: 'Logic Visualization',
            description: 'A visual simulation of traffic control systems using timed state changes and finite state machine concepts to manage complex intersection logic.',
            image: 'images/Traffic.jpg',
            stack: ['HTML', 'CSS', 'JavaScript'],
            links: {
                live: 'https://muditgupta07.github.io/Traffic-Signal-Simulator/',
                github: 'https://github.com/MuditGupta07/Traffic-Signal-Simulator'
            }
        },
        'decentralization': {
            title: 'Decentralization Analyzer',
            subtitle: 'Blockchain Analytics Tool',
            description: 'A tool for analyzing blockchain node distribution data to compute Nakamoto coefficients and overall decentralization scores for various networks.',
            image: 'images/DecentraLens.png',
            stack: ['Python', 'Data Analytics', 'APIs'],
            links: {
                live: 'https://muditgupta07.github.io/Decentralization-Readiness-Analyzer/',
                github: 'https://github.com/MuditGupta07/Decentralization-Readiness-Analyzer'
            }
        }
    };

    const modal = document.getElementById('project-modal');
    const modalContentBox = document.getElementById('modal-content-box');
    const modalBody = document.getElementById('modal-body');
    const closeModalBtn = document.getElementById('close-modal');

    if (modal && projectCards.length > 0) {
        // Open Modal
        projectCards.forEach(card => {
            card.addEventListener('click', () => {
                const projectId = card.getAttribute('data-project');
                if (!projectId || !projectData[projectId]) return;

                const data = projectData[projectId];
                
                // Build Stack HTML
                const stackHtml = data.stack.map(tech => `<span class="px-3 py-1 border border-white/10 rounded-full text-xs text-gray-300 bg-white/5">${tech}</span>`).join('');
                
                // Build Links HTML
                let linksHtml = '';
                if (data.links.live) {
                    linksHtml += `<a href="${data.links.live}" target="_blank" class="btn-god px-6 py-2 rounded text-sm inline-flex items-center gap-2"><i data-lucide="external-link" class="w-4 h-4"></i> Live Deployment</a>`;
                }
                if (data.links.github) {
                    linksHtml += `<a href="${data.links.github}" target="_blank" class="btn-outline px-6 py-2 rounded text-sm inline-flex items-center gap-2"><i data-lucide="github" class="w-4 h-4"></i> Source Code</a>`;
                }

                // Image HTML
                const imageHtml = data.image ? `<img src="${data.image}" class="w-full h-48 md:h-64 object-cover rounded-xl mb-6 border border-white/5 shadow-2xl" alt="${data.title}">` : '';

                modalBody.innerHTML = `
                    ${imageHtml}
                    <h2 class="text-3xl font-heading font-bold text-white mb-2">${data.title}</h2>
                    <p class="text-gold font-mono text-sm uppercase tracking-widest mb-6">${data.subtitle}</p>
                    
                    <h3 class="text-white text-lg font-bold mb-3 border-b border-white/10 pb-2 inline-block">Architecture & Context</h3>
                    <p class="text-gray-400 text-sm leading-relaxed mb-8">${data.description}</p>
                    
                    <div class="mb-8">
                        <h3 class="text-white text-lg font-bold mb-3 border-b border-white/10 pb-2 inline-block">Tech Stack</h3>
                        <div class="flex flex-wrap gap-2 mt-2">
                            ${stackHtml}
                        </div>
                    </div>
                    
                    <div class="flex flex-wrap gap-4 pt-4 border-t border-white/10">
                        ${linksHtml}
                    </div>
                `;

                // Re-init lucide icons for modal
                if (window.lucide) {
                    lucide.createIcons();
                }

                // Show Modal
                modal.classList.remove('hidden');
                document.body.style.overflow = 'hidden'; // Prevent background scrolling
                
                // Small delay for transition
                setTimeout(() => {
                    modal.classList.remove('opacity-0');
                    modalContentBox.classList.remove('scale-95');
                    modalContentBox.classList.add('scale-100');
                }, 10);
            });
        });

        // Close Modal Function
        const closeModal = () => {
            modal.classList.add('opacity-0');
            modalContentBox.classList.remove('scale-100');
            modalContentBox.classList.add('scale-95');
            
            setTimeout(() => {
                modal.classList.add('hidden');
                document.body.style.overflow = 'auto'; // Restore scrolling
            }, 300);
        };

        // Close on X click
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', closeModal);
        }

        // Close on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target === modalContentBox.parentElement) {
                closeModal();
            }
        });
        
        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
                closeModal();
            }
        });
    }

    // Add hover states for interactive elements
    const interactables = document.querySelectorAll('a, button, input, textarea, select, .glass-panel, [data-lucide]');
    interactables.forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
});

