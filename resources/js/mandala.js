// Inject background video and navbar
function injectThemeElements() {
    // Inject background video if not exists
    if (!document.getElementById('background-video')) {
        const video = document.createElement('video');
        video.id = 'background-video';
        video.autoplay = true;
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; object-position: center; z-index: -10; pointer-events: none;';
        const source = document.createElement('source');
        source.src = '/Video_Generation_Complete.mp4';
        source.type = 'video/mp4';
        video.appendChild(source);
        document.body.insertBefore(video, document.body.firstChild);
    }
    
    // Update or create video overlay with correct gradient
    let overlay = document.getElementById('video-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'video-overlay';
        document.body.insertBefore(overlay, document.body.firstChild.nextSibling);
    }
    overlay.style.cssText = 'position: fixed; inset: 0; background: linear-gradient(135deg, rgba(44, 24, 16, 0.48) 0%, rgba(44, 24, 16, 0.48) 50%, rgba(44, 24, 16, 0.94) 100%); z-index: -9; pointer-events: none;';

    // Inject splash cursor if not exists
    if (!document.getElementById('splash-cursor')) {
        const splashContainer = document.createElement('div');
        splashContainer.id = 'splash-cursor-container';
        splashContainer.style.cssText = 'position: fixed; top: 0; left: 0; z-index: 50; pointer-events: none; width: 100%; height: 100%;';
        
        const splashCanvas = document.createElement('canvas');
        splashCanvas.id = 'splash-cursor';
        splashCanvas.style.cssText = 'width: 100vw; height: 100vh; display: block;';
        
        splashContainer.appendChild(splashCanvas);
        document.body.appendChild(splashContainer);
        
        // Try to load splash cursor script, fallback after timeout if it doesn't load
        loadSplashCursor();
        
        // Fallback after 1 second if script doesn't load
        setTimeout(function() {
            if (!window.splashCursorLoaded && !window.splashCursorInitialized) {
                console.log('Splash cursor script not loaded, using fallback');
                initSplashCursorFallback();
                window.splashCursorInitialized = true;
            }
        }, 1000);
    }

    // Check if we already have a modern navbar
    const existingModernNavbar = document.querySelector('.navbar-container');
    
    // Find ALL navbar elements
    const allNavbars = document.querySelectorAll('nav.navbar');
    
    // If modern navbar exists, remove all old ones
    if (existingModernNavbar) {
        allNavbars.forEach(nav => {
            if (!nav.querySelector('.navbar-container')) {
                nav.remove();
            }
        });
        return;
    }
    
    // Find old navbar (without navbar-container)
    let oldNavbar = null;
    for (let nav of allNavbars) {
        if (!nav.querySelector('.navbar-container')) {
            oldNavbar = nav;
            break;
        }
    }
    
    // If old navbar exists, TRANSFORM it to new navbar (don't create a second one)
    if (oldNavbar) {
        const currentPath = window.location.pathname;
        const mandalaMatch = currentPath.match(/\/(\d+)\/index\.html/);
        const mandalaNum = mandalaMatch ? mandalaMatch[1] : '1';
        
        // Extract mandala title from existing h2 if present
        const h2 = oldNavbar.querySelector('h2');
        const mandalaTitle = h2 ? h2.textContent.trim() : `MANDALA ${mandalaNum}`;
        
        // Transform the existing navbar - don't create a new one
        oldNavbar.className = 'navbar';
        oldNavbar.id = 'navbar';
        oldNavbar.style.cssText = 'display: flex !important; position: fixed !important; top: 0 !important; left: 0 !important; width: 100% !important; z-index: 1001 !important; height: 64px !important;';
        oldNavbar.innerHTML = getNavbarHTML(mandalaTitle, mandalaNum);
        
        // Add mandala title header below navbar
        addMandalaTitleHeader(mandalaTitle);
        return;
    }
    
    // If no navbar exists at all, create new one
    const newNavbar = document.createElement('nav');
    newNavbar.className = 'navbar';
    newNavbar.id = 'navbar';
    
    const currentPath = window.location.pathname;
    const mandalaMatch = currentPath.match(/\/(\d+)\/index\.html/);
    const mandalaNum = mandalaMatch ? mandalaMatch[1] : '1';
    const mandalaTitle = `MANDALA ${mandalaNum}`;
    
    newNavbar.style.cssText = 'display: flex !important; visibility: visible !important; opacity: 1 !important; position: fixed !important; top: 0 !important; left: 0 !important; width: 100% !important; z-index: 1001 !important; height: 64px !important; background: rgba(44, 24, 16, 0.95) !important;';
    newNavbar.innerHTML = getNavbarHTML(mandalaTitle, mandalaNum);
    document.body.insertBefore(newNavbar, document.body.firstChild);
    
    // Add mandala title header below navbar
    addMandalaTitleHeader(mandalaTitle);
}

function addMandalaTitleHeader(mandalaTitle) {
    // Remove any existing title header
    const existingTitle = document.getElementById('mandala-title-header');
    if (existingTitle) {
        existingTitle.remove();
    }
    
    // Create title header below navbar
    const titleHeader = document.createElement('div');
    titleHeader.id = 'mandala-title-header';
    titleHeader.style.cssText = 'position: fixed; top: 64px; left: 0; width: 100%; background: rgba(44, 24, 16, 0.95); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(212, 175, 55, 0.2); padding: 1rem 3%; text-align: center; z-index: 1000; color: var(--vedic-gold); font-size: 2em; font-weight: bold; font-family: "Playfair Display", serif; text-shadow: 0 0 10px rgba(212, 175, 55, 0.5);';
    titleHeader.textContent = mandalaTitle;
    document.body.appendChild(titleHeader);
}

function getNavbarHTML(mandalaTitle, mandalaNum) {
    return `
            <div class="navbar-container">
                <a href="/" class="navbar-logo">
                    <svg class="navbar-logo-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                    </svg>
                    <div class="navbar-logo-text">
                        <h1>Rig Veda Explorer</h1>
                        <p>Interactive Vedic Journey</p>
                    </div>
                </a>

                <div class="navbar-links">
                    <a href="/" class="navbar-link">
                        <i class="fas fa-home"></i>
                        <span>Home</span>
                    </a>
                    <a href="/mandalas.html" class="navbar-link active">
                        <i class="fas fa-book"></i>
                        <span>Mandalas</span>
                    </a>
                    <a href="/deities" class="navbar-link">
                        <i class="fas fa-project-diagram"></i>
                        <span>Deity Network</span>
                    </a>
                    <a href="/concordance" class="navbar-link">
                        <i class="fas fa-search"></i>
                        <span>Concordance</span>
                    </a>
                    <a href="/study" class="navbar-link">
                        <i class="fas fa-brain"></i>
                        <span>Study Mode</span>
                    </a>
                </div>

                <div class="navbar-badges">
                    <div class="progress-badge" title="Mandalas Explored">
                        <svg class="badge-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
                        </svg>
                        <span>${mandalaNum}/10</span>
                    </div>
                    <div class="progress-badge streak-badge" title="1 day reading streak">
                        <svg class="badge-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        <span>1</span>
                    </div>
                    <div class="progress-badge stats-badge" title="Hymns Read">
                        <svg class="badge-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                        </svg>
                        <span>4/11</span>
                    </div>
                    <button class="settings-btn" title="Show Tutorial">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                    </button>
                </div>
            </div>
    `;
}

function ProgressBarScrollCallback() {
    let winScroll = document.body.scrollTop || document.documentElement.scrollTop,
        height = document.documentElement.scrollHeight - document.documentElement.clientHeight,
        scrolled = (winScroll / height);

    /* Since we have disabled scroll bars, we will display the scroll position as a line on the top of the page. */
    if (scrolled <= 0) {
        $(".progress-container").fadeOut();
    }
    else {
        $(".progress-container").fadeIn();
        document.getElementById("progressBar").style.width = (scrolled * 100) + "%";
    }
}

// Run immediately to catch early DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMandalaPage);
} else {
    initMandalaPage();
}

function loadSplashCursor() {
    // Check if splash cursor script is already loaded
    if (window.splashCursorLoaded) {
        return;
    }
    
    // Try to load from React app bundle first, fallback to standalone
    if (window.React && window.ReactDOM) {
        import('/src/components/SplashCursor.tsx').then(module => {
            const SplashCursor = module.default;
            const container = document.getElementById('splash-cursor-container');
            if (container && window.React && window.ReactDOM) {
                const root = window.ReactDOM.createRoot(container);
                root.render(window.React.createElement(SplashCursor));
            }
            window.splashCursorLoaded = true;
        }).catch(() => {
            loadSplashCursorInline();
        });
    } else {
        loadSplashCursorInline();
    }
}

function loadSplashCursorInline() {
    if (window.splashCursorLoaded) return;
    
    // Ensure canvas exists before loading script
    const canvas = document.getElementById('splash-cursor');
    if (!canvas) {
        setTimeout(loadSplashCursorInline, 100);
        return;
    }
    
    const script = document.createElement('script');
    script.src = '/splash-cursor.js';
    script.onload = function() {
        window.splashCursorLoaded = true;
        // Start the animation loop after a short delay to ensure everything is initialized
        setTimeout(function() {
            if (window.initSplashCursor) {
                window.initSplashCursor();
            }
        }, 100);
    };
    script.onerror = function() {
        console.warn('Could not load splash cursor, using fallback implementation');
        initSplashCursorFallback();
    };
    document.head.appendChild(script);
}

function initSplashCursorFallback() {
    if (window.splashCursorInitialized) return;
    window.splashCursorInitialized = true;
    
    const canvas = document.getElementById('splash-cursor');
    if (!canvas) {
        console.warn('Splash cursor canvas not found');
        return;
    }
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.warn('Could not get 2D context for splash cursor');
        return;
    }
    
    let particles = [];
    const maxParticles = 50;
    
    function resizeCanvas() {
        canvas.width = canvas.clientWidth || window.innerWidth;
        canvas.height = canvas.clientHeight || window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    function createParticle(x, y) {
        return {
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            life: 1.0,
            size: Math.random() * 5 + 2,
            color: `hsl(${Math.random() * 60 + 15}, 100%, ${50 + Math.random() * 30}%)`
        };
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Add new particles on mouse move
        if (window.mouseX !== undefined && window.mouseY !== undefined) {
            for (let i = 0; i < 3; i++) {
                if (particles.length < maxParticles) {
                    particles.push(createParticle(window.mouseX, window.mouseY));
                }
            }
        }
        
        // Update and draw particles
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.life -= 0.02;
            p.vx *= 0.95;
            p.vy *= 0.95;
            
            if (p.life <= 0) {
                particles.splice(i, 1);
                continue;
            }
            
            ctx.globalAlpha = p.life;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
            ctx.fill();
        }
        
        requestAnimationFrame(animate);
    }
    
    document.addEventListener('mousemove', function(e) {
        window.mouseX = e.clientX;
        window.mouseY = e.clientY;
    });
    
    // Initialize mouse position
    window.mouseX = window.innerWidth / 2;
    window.mouseY = window.innerHeight / 2;
    
    animate();
    console.log('Splash cursor fallback initialized');
}

function initMandalaPage() {
    // Inject theme elements first
    injectThemeElements();
    
    // Remove duplicate navbars - keep only ONE
    setTimeout(() => {
        const allNavbars = document.querySelectorAll('nav.navbar');
        if (allNavbars.length > 1) {
            // Keep only the first one (should be the modern one)
            for (let i = 1; i < allNavbars.length; i++) {
                allNavbars[i].remove();
            }
        }
        
        // Ensure the remaining navbar is visible
        const navbar = document.querySelector('nav.navbar');
        if (navbar) {
            navbar.style.setProperty('display', 'flex', 'important');
            navbar.style.setProperty('visibility', 'visible', 'important');
            navbar.style.setProperty('opacity', '1', 'important');
            navbar.style.setProperty('position', 'fixed', 'important');
            navbar.style.setProperty('top', '0', 'important');
            navbar.style.setProperty('left', '0', 'important');
            navbar.style.setProperty('width', '100%', 'important');
            navbar.style.setProperty('height', '64px', 'important');
            navbar.style.setProperty('z-index', '1001', 'important');
        }
        
        // Ensure mandala title header exists
        if (!document.getElementById('mandala-title-header')) {
            const currentPath = window.location.pathname;
            const mandalaMatch = currentPath.match(/\/(\d+)\/index\.html/);
            const mandalaNum = mandalaMatch ? mandalaMatch[1] : '1';
            addMandalaTitleHeader(`MANDALA ${mandalaNum}`);
        }
    }, 100);
    
    /* Hide the progress bar */
    $(".progress-container").hide();

    document.addEventListener('scroll', () => {
        ProgressBarScrollCallback();
    });
}