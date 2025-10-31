const AUDIO_LOAD_ICON = `<span class="fa fa-hourglass"></span>`;
const AUDIO_NORMAL_ICON = `<span class="fa fa-volume-up"></span>`;
const AUDIO_PLAYING_ICON = `<span class="fa fa-stop"></span>`;

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
    
    const currentPath = window.location.pathname;
    const hymnMatch = currentPath.match(/\/(\d+)\/(\d+)\.html/);
    const mandalaNum = hymnMatch ? hymnMatch[1] : '1';
    const hymnNum = hymnMatch ? hymnMatch[2] : '1';
    
    // Find old navbar (without navbar-container)
    let oldNavbar = null;
    for (let nav of allNavbars) {
        if (!nav.querySelector('.navbar-container')) {
            oldNavbar = nav;
            break;
        }
    }
    
    // Extract audio and title info BEFORE modifying navbar
    let h2, hymnTitle, audioSrc;
    if (oldNavbar) {
        h2 = oldNavbar.querySelector('h2');
        hymnTitle = h2 ? h2.textContent.trim() : 'HYMN';
        const audioElement = oldNavbar.querySelector('#hymn_audio');
        audioSrc = audioElement ? audioElement.src : '';
        
        // IMMEDIATELY hide all old navbar content to prevent flickering
        const oldCols = oldNavbar.querySelectorAll('[class^="col-"], h2, button, a');
        oldCols.forEach(el => {
            el.style.display = 'none';
            el.style.visibility = 'hidden';
            el.style.opacity = '0';
        });
    } else {
        hymnTitle = 'HYMN';
        audioSrc = '';
    }
    
    const prevHymn = parseInt(hymnNum) > 1 ? `${mandalaNum}/${parseInt(hymnNum) - 1}.html` : `${mandalaNum}/index.html`;
    const nextHymn = `${mandalaNum}/${parseInt(hymnNum) + 1}.html`;
    
    // If old navbar exists, TRANSFORM it to new navbar (don't create a second one)
    if (oldNavbar) {
        // Transform the existing navbar - don't create a new one
        oldNavbar.className = 'navbar';
        oldNavbar.id = 'navbar';
        oldNavbar.style.cssText = 'display: flex !important; position: fixed !important; top: 0 !important; left: 0 !important; width: 100% !important; z-index: 1001 !important; height: 64px !important;';
        oldNavbar.innerHTML = getNavbarHTML(hymnTitle, mandalaNum, hymnNum, prevHymn, nextHymn, audioSrc);
        
        // Add navigation buttons after navbar
        addHymnNavButtons(mandalaNum, hymnNum, prevHymn, nextHymn, audioSrc);
        return;
    }
    
    // If no navbar exists, create new one
    const newNavbar = document.createElement('nav');
    newNavbar.className = 'navbar';
    newNavbar.id = 'navbar';
    newNavbar.style.cssText = 'display: flex !important; visibility: visible !important; opacity: 1 !important; position: fixed !important; top: 0 !important; left: 0 !important; width: 100% !important; z-index: 1001 !important; height: 64px !important; background: rgba(44, 24, 16, 0.95) !important;';
    newNavbar.innerHTML = getNavbarHTML(hymnTitle, mandalaNum, hymnNum, prevHymn, nextHymn, audioSrc);
    document.body.insertBefore(newNavbar, document.body.firstChild);
    
    // Add navigation buttons after navbar
    addHymnNavButtons(mandalaNum, hymnNum, prevHymn, nextHymn, audioSrc);
}

function addHymnNavButtons(mandalaNum, hymnNum, prevHymn, nextHymn, audioSrc) {
    // Remove any existing nav buttons
    const existingButtons = document.getElementById('hymn-nav-buttons');
    if (existingButtons) {
        existingButtons.remove();
    }
    
    // Create navigation buttons container
    const navButtons = document.createElement('div');
    navButtons.id = 'hymn-nav-buttons';
    navButtons.style.cssText = 'position: fixed !important; top: 64px !important; right: 1rem !important; display: flex !important; gap: 0.5rem !important; z-index: 1000 !important; padding: 0.75rem !important; background: rgba(44, 24, 16, 0.95) !important; backdrop-filter: blur(12px) !important; border-radius: 0 0 8px 8px !important; border: 1px solid rgba(212, 175, 55, 0.2) !important; border-top: none !important; height: auto !important; min-height: 56px !important;';
    navButtons.innerHTML = `
        <a href="${prevHymn}" class="btn btn-nav" style="padding: 0.5rem; display: flex; align-items: center; justify-content: center;"><span class="fa fa-arrow-left"></span></a>
        <a href="/${mandalaNum}/index.html" class="btn btn-nav" style="padding: 0.5rem; display: flex; align-items: center; justify-content: center;"><span class="fa fa-bars"></span></a>
        ${audioSrc ? `<button class="btn btn-nav" id="play_hymn_button" onClick="PlayHymnAudio()" style="padding: 0.5rem; display: flex; align-items: center; justify-content: center;"><span class="fa fa-volume-up"></span></button><audio src="${audioSrc}" id="hymn_audio"></audio>` : ''}
        <a href="${nextHymn}" class="btn btn-nav" style="padding: 0.5rem; display: flex; align-items: center; justify-content: center;"><span class="fa fa-arrow-right"></span></a>
    `;
    document.body.appendChild(navButtons);
}

function getNavbarHTML(hymnTitle, mandalaNum, hymnNum, prevHymn, nextHymn, audioSrc) {
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
            <!-- Hymn title in center -->
            <div style="position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); z-index: 1001; color: var(--vedic-gold); font-weight: bold; font-size: 1.2em; pointer-events: none;">
                ${hymnTitle}
            </div>
        </nav>
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

function PlayHymnAudio()
{
    var audio_element = document.getElementById('hymn_audio');
    if (!audio_element) {
        console.error('Audio element not found');
        return;
    }
    
    // Ensure audio element is configured correctly before play
    try {
        // Normalize GitHub raw URL if needed
        var src = audio_element.getAttribute('src') || audio_element.src || '';
        if (src.indexOf('github.com/') !== -1 && src.indexOf('/raw/') !== -1) {
            // Convert https://github.com/{owner}/{repo}/raw/{branch}/{path}
            // to   https://raw.githubusercontent.com/{owner}/{repo}/{branch}/{path}
            var parts = src.split('github.com/')[1].split('/');
            if (parts.length >= 5) {
                var owner = parts[0];
                var repo = parts[1];
                var branch = parts[3]; // parts[2] === 'raw'
                var rest = parts.slice(4).join('/');
                var rawUrl = 'https://raw.githubusercontent.com/' + owner + '/' + repo + '/' + branch + '/' + rest;
                audio_element.crossOrigin = 'anonymous';
                audio_element.preload = 'auto';
                audio_element.src = rawUrl;
            }
        } else {
            // Set CORS for analyser if server supports it
            audio_element.crossOrigin = 'anonymous';
            audio_element.preload = 'auto';
        }
    } catch (e) {
        console.log('Audio normalize error:', e.message);
    }
    
    if(!audio_element.paused)
    {
        // Pause audio
        audio_element.pause();
        audio_element.currentTime = 0;
        $('#play_hymn_button').html(AUDIO_NORMAL_ICON);
        stopMusicVisualizerAnimation();
    }
    else {
        // Start visualizer immediately (before audio plays)
        initMusicVisualizerAnimation();
        
        // Play audio
        audio_element.play().then(() => {
            // Audio started playing successfully
            $('#play_hymn_button').html(AUDIO_PLAYING_ICON);
            console.log('Audio started playing');
        }).catch(error => {
            // Auto-play was prevented or error occurred
            console.error('Error playing audio:', error);
            
            // Try to resume audio context if suspended
            if (audioContext && audioContext.state === 'suspended') {
                audioContext.resume().then(() => {
                    return audio_element.play();
                }).then(() => {
                    $('#play_hymn_button').html(AUDIO_PLAYING_ICON);
                    console.log('Audio started after resuming context');
                }).catch(err => {
                    console.error('Error after resuming context:', err);
                    $('#play_hymn_button').html(AUDIO_NORMAL_ICON);
                    stopMusicVisualizerAnimation();
                });
            } else {
                // User interaction required - stop visualizer
                $('#play_hymn_button').html(AUDIO_NORMAL_ICON);
                stopMusicVisualizerAnimation();
                console.log('Audio playback requires user interaction');
            }
        });
    }
}

// Run immediately to catch early DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHymnPage);
} else {
    initHymnPage();
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

// Music Visualizer Image Animation
let visualizerImage = null;
let visualizerAnimationFrame = null;
let audioContext = null;
let analyser = null;
let dataArray = null;
let currentRotation = 0;

function initMusicVisualizerAnimation() {
    // Create or get visualizer image element
    if (!document.getElementById('music-visualizer-img')) {
        visualizerImage = document.createElement('img');
        visualizerImage.id = 'music-visualizer-img';
        visualizerImage.src = '/music-visualizer.jpg';
        visualizerImage.alt = 'Music Visualizer';
        // Fullscreen overlay with transparent background, centered, rotating
        visualizerImage.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(0deg); width: 100vw; height: 100vh; object-fit: contain; z-index: 5; pointer-events: none; opacity: 0; transition: opacity 0.5s ease-in-out; mix-blend-mode: screen; filter: drop-shadow(0 0 30px rgba(212, 175, 55, 0.3)); display: block;';
        document.body.appendChild(visualizerImage);
        
        // Fade in
        setTimeout(() => {
            if (visualizerImage) {
                visualizerImage.style.opacity = '0.6';
            }
        }, 10);
    } else {
        visualizerImage = document.getElementById('music-visualizer-img');
        visualizerImage.style.display = 'block';
        visualizerImage.style.opacity = '0.6';
    }
    
    // Start animation loop if not already running
    if (!visualizerAnimationFrame) {
        animateMusicVisualizer();
    }
    
    // Initialize Web Audio API for dynamic rotation speed
    const audioElement = document.getElementById('hymn_audio');
    if (audioElement) {
        // Resume audio context if suspended
        if (audioContext && audioContext.state === 'suspended') {
            audioContext.resume().catch(err => {
                console.log('Error resuming audio context:', err);
            });
        }
        
        // Create audio context if it doesn't exist
        if (!audioContext) {
            try {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
                
                analyser = audioContext.createAnalyser();
                analyser.fftSize = 256;
                analyser.smoothingTimeConstant = 0.8;
                dataArray = new Uint8Array(analyser.frequencyBinCount);
                
                // Connect audio element to analyser (only once)
                if (!audioElement.audioSource) {
                    try {
                        const source = audioContext.createMediaElementSource(audioElement);
                        source.connect(analyser);
                        analyser.connect(audioContext.destination);
                        audioElement.audioSource = source;
                    } catch (e) {
                        // Already connected or error
                        console.log('Audio source connection:', e.message);
                    }
                }
            } catch (e) {
                console.log('Audio context initialization:', e.message);
            }
        } else if (!analyser) {
            // Audio context exists but analyser doesn't
            try {
                analyser = audioContext.createAnalyser();
                analyser.fftSize = 256;
                analyser.smoothingTimeConstant = 0.8;
                dataArray = new Uint8Array(analyser.frequencyBinCount);
                
                if (!audioElement.audioSource) {
                    const source = audioContext.createMediaElementSource(audioElement);
                    source.connect(analyser);
                    analyser.connect(audioContext.destination);
                    audioElement.audioSource = source;
                }
            } catch (e) {
                console.log('Analyser initialization:', e.message);
            }
        }
    }
    
}

function animateMusicVisualizer() {
    if (!visualizerImage) {
        // Restart animation loop if visualizer image exists but wasn't found
        visualizerImage = document.getElementById('music-visualizer-img');
        if (!visualizerImage) {
            return;
        }
    }
    
    // Check if image is visible - if not, continue loop but don't animate
    const isVisible = visualizerImage.style.display !== 'none' && visualizerImage.style.opacity !== '0';
    
    // Always continue the animation loop
    visualizerAnimationFrame = requestAnimationFrame(animateMusicVisualizer);
    
    // Only animate if image is visible
    if (!isVisible) {
        return;
    }
    
    // Check if audio is playing
    const audioElement = document.getElementById('hymn_audio');
    const isPlaying = audioElement && !audioElement.paused && !audioElement.ended;
    
    // If audio is not playing, keep rotating at base speed (don't stop animation)
    let rotationSpeed = 0.5; // Base rotation speed (degrees per frame)
    
    // Use audio data if available and audio is playing
    if (isPlaying && analyser && dataArray && audioContext && audioContext.state === 'running') {
        try {
            analyser.getByteFrequencyData(dataArray);
            
            // Calculate average amplitude
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) {
                sum += dataArray[i];
            }
            const average = sum / dataArray.length;
            const normalized = average / 255;
            
            // Rotation speed varies with audio (0.3 to 1.5 degrees per frame)
            rotationSpeed = 0.3 + (normalized * 1.2);
        } catch (e) {
            // Fallback: constant rotation if analyser fails
            rotationSpeed = 0.5;
        }
    }
    
    // Always update rotation (keeps animation smooth even if audio pauses briefly)
    currentRotation += rotationSpeed;
    if (currentRotation >= 360) {
        currentRotation -= 360;
    }
    
    // Apply rotation with center translation
    visualizerImage.style.transform = `translate(-50%, -50%) rotate(${currentRotation}deg)`;
}

function stopMusicVisualizerAnimation() {
    if (visualizerAnimationFrame) {
        cancelAnimationFrame(visualizerAnimationFrame);
        visualizerAnimationFrame = null;
    }
    
    if (visualizerImage) {
        // Fade out and hide
        visualizerImage.style.opacity = '0';
        setTimeout(() => {
            if (visualizerImage) {
                visualizerImage.style.display = 'none';
                // Reset rotation
                currentRotation = 0;
                visualizerImage.style.transform = 'translate(-50%, -50%) rotate(0deg)';
            }
        }, 500);
    }
}

// IMMEDIATELY hide old navbar content on script load
(function() {
    const navbar = document.querySelector('nav.navbar');
    if (navbar && !navbar.querySelector('.navbar-container')) {
        // Hide all old content immediately
        const oldContent = navbar.querySelectorAll('h2, [class^="col-"], button, a');
        oldContent.forEach(el => {
            el.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important; position: absolute !important; left: -9999px !important;';
        });
    }
})();

function initHymnPage() {
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
        
        // Ensure nav buttons exist
        if (!document.getElementById('hymn-nav-buttons')) {
            const currentPath = window.location.pathname;
            const hymnMatch = currentPath.match(/\/(\d+)\/(\d+)\.html/);
            const mandalaNum = hymnMatch ? hymnMatch[1] : '1';
            const hymnNum = hymnMatch ? hymnMatch[2] : '1';
            const prevHymn = parseInt(hymnNum) > 1 ? `${mandalaNum}/${parseInt(hymnNum) - 1}.html` : `${mandalaNum}/index.html`;
            const nextHymn = `${mandalaNum}/${parseInt(hymnNum) + 1}.html`;
            const audioElement = document.querySelector('#hymn_audio');
            const audioSrc = audioElement ? audioElement.src : '';
            addHymnNavButtons(mandalaNum, hymnNum, prevHymn, nextHymn, audioSrc);
        }
        
        // Ensure container has proper spacing - force it with !important
        const containers = document.querySelectorAll('.container');
        containers.forEach(container => {
            container.style.setProperty('margin-top', '180px', 'important');
            container.style.setProperty('padding-top', '2rem', 'important');
            container.style.setProperty('position', 'relative', 'important');
            container.style.setProperty('z-index', '10', 'important');
        });
        
        // Ensure first element in container doesn't collide
        containers.forEach(container => {
            const firstChild = container.firstElementChild;
            if (firstChild) {
                if (firstChild.tagName === 'H2') {
                    firstChild.style.setProperty('margin-top', '0', 'important');
                    firstChild.style.setProperty('padding-top', '1rem', 'important');
                } else {
                    firstChild.style.setProperty('margin-top', '0', 'important');
                }
            }
        });
    }, 100);
    
    // Re-apply container spacing after a short delay to ensure it's not overridden
    setTimeout(() => {
        const containers = document.querySelectorAll('.container');
        containers.forEach(container => {
            container.style.setProperty('margin-top', '180px', 'important');
            container.style.setProperty('padding-top', '2rem', 'important');
        });
    }, 300);
    
    /* Hide the progress bar */
    $(".progress-container").hide();
    var n_stanzas = document.getElementsByClassName('card').length;
    var stanza_height = n_stanzas > 0 ? document.getElementsByClassName('card')[0].offsetHeight : 0;

    document.addEventListener('scroll', () => {
        ProgressBarScrollCallback();
        
        // Ensure container spacing is maintained during scroll
        const containers = document.querySelectorAll('.container');
        containers.forEach(container => {
            const computedStyle = window.getComputedStyle(container);
            const marginTop = parseInt(computedStyle.marginTop);
            if (marginTop < 180) {
                container.style.setProperty('margin-top', '180px', 'important');
            }
        });
    });

    var audio_element = document.getElementById('hymn_audio');
    if (audio_element) {
    audio_element.addEventListener('loadstart', () => {
            const btn = document.getElementById('play_hymn_button');
            if (btn) btn.innerHTML = AUDIO_LOAD_ICON;
    });

    audio_element.addEventListener('canplaythrough', () => {
            const btn = document.getElementById('play_hymn_button');
            if (btn) btn.innerHTML = AUDIO_NORMAL_ICON;
    });

    audio_element.addEventListener('ended', () => {
            const btn = document.getElementById('play_hymn_button');
            if (btn) btn.innerHTML = AUDIO_NORMAL_ICON;
        audio_element.currentTime = 0;
        stopMusicVisualizerAnimation();
    });
    
    // Pause animation when audio is paused
    audio_element.addEventListener('pause', () => {
        const btn = document.getElementById('play_hymn_button');
        if (btn && audio_element.paused) {
            btn.innerHTML = AUDIO_NORMAL_ICON;
        }
        stopMusicVisualizerAnimation();
    });
    
    // Resume animation when audio plays
    audio_element.addEventListener('play', () => {
        const btn = document.getElementById('play_hymn_button');
        if (btn) {
            btn.innerHTML = AUDIO_PLAYING_ICON;
        }
        // Ensure visualizer is showing and animating
        if (!visualizerImage || visualizerImage.style.display === 'none') {
            initMusicVisualizerAnimation();
        } else if (visualizerImage) {
            visualizerImage.style.display = 'block';
            visualizerImage.style.opacity = '0.6';
        }
        if (!visualizerAnimationFrame) {
            animateMusicVisualizer();
        }
    });
    
    // Handle audio errors
    audio_element.addEventListener('error', (e) => {
        console.error('Audio error:', e);
        const btn = document.getElementById('play_hymn_button');
        if (btn) btn.innerHTML = AUDIO_NORMAL_ICON;
        stopMusicVisualizerAnimation();
        
        // Try to reload audio on error
        try {
            audio_element.load();
        } catch (err) {
            console.error('Error reloading audio:', err);
        }
    });
    
    // Ensure audio is ready to play
    audio_element.preload = 'auto';
    
    // Try to load audio immediately
    try {
        audio_element.load();
    } catch (e) {
        console.log('Audio load attempt:', e.message);
    }

    /* Scroll while playing audio */
    audio_element.ontimeupdate = function () {
            if (n_stanzas > 0 && stanza_height > 0) {
        var percent_scroll = audio_element.currentTime / audio_element.duration;
        window.scrollTo(0, stanza_height * Math.floor(percent_scroll * n_stanzas));
    }
        }
    }
}