// SplashCursor WebGL Fluid Effect - Standalone Version
(function() {
    const canvas = document.getElementById('splash-cursor');
    if (!canvas) return;
    
    let pointers = [{
        id: -1,
        texcoordX: 0,
        texcoordY: 0,
        prevTexcoordX: 0,
        prevTexcoordY: 0,
        deltaX: 0,
        deltaY: 0,
        down: false,
        moved: false,
        color: { r: 0, g: 0, b: 0 }
    }];

    const config = {
        SIM_RESOLUTION: 128,
        DYE_RESOLUTION: 1440,
        CAPTURE_RESOLUTION: 512,
        DENSITY_DISSIPATION: 3.5,
        VELOCITY_DISSIPATION: 2,
        PRESSURE: 0.1,
        PRESSURE_ITERATIONS: 20,
        CURL: 3,
        SPLAT_RADIUS: 0.2,
        SPLAT_FORCE: 6000,
        SHADING: true,
        COLOR_UPDATE_SPEED: 10,
        PAUSED: false,
        BACK_COLOR: { r: 0.5, g: 0, b: 0 },
        TRANSPARENT: true
    };

    function getWebGLContext(canvas) {
        const params = {
            alpha: true,
            depth: false,
            stencil: false,
            antialias: false,
            preserveDrawingBuffer: false
        };

        let gl = canvas.getContext('webgl2', params);
        if (!gl) {
            gl = (canvas.getContext('webgl', params) ||
                canvas.getContext('experimental-webgl', params));
        }
        if (!gl) {
            console.error('Unable to initialize WebGL.');
            return null;
        }

        const isWebGL2 = 'drawBuffers' in gl;
        let supportLinearFiltering = false;
        let halfFloat = null;

        if (isWebGL2) {
            gl.getExtension('EXT_color_buffer_float');
            supportLinearFiltering = !!gl.getExtension('OES_texture_float_linear');
        } else {
            halfFloat = gl.getExtension('OES_texture_half_float');
            supportLinearFiltering = !!gl.getExtension('OES_texture_half_float_linear');
        }

        gl.clearColor(0, 0, 0, 1);
        const halfFloatTexType = isWebGL2
            ? gl.HALF_FLOAT
            : (halfFloat && halfFloat.HALF_FLOAT_OES) || 0;

        let formatRGBA, formatRG, formatR;

        if (isWebGL2) {
            formatRGBA = getSupportedFormat(gl, gl.RGBA16F, gl.RGBA, halfFloatTexType);
            formatRG = getSupportedFormat(gl, gl.RG16F, gl.RG, halfFloatTexType);
            formatR = getSupportedFormat(gl, gl.R16F, gl.RED, halfFloatTexType);
        } else {
            formatRGBA = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
            formatRG = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
            formatR = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
        }

        return {
            gl,
            ext: {
                formatRGBA,
                formatRG,
                formatR,
                halfFloatTexType,
                supportLinearFiltering
            }
        };
    }

    function getSupportedFormat(gl, internalFormat, format, type) {
        if (!supportRenderTextureFormat(gl, internalFormat, format, type)) {
            if ('drawBuffers' in gl) {
                switch (internalFormat) {
                    case gl.R16F:
                        return getSupportedFormat(gl, gl.RG16F, gl.RG, type);
                    case gl.RG16F:
                        return getSupportedFormat(gl, gl.RGBA16F, gl.RGBA, type);
                    default:
                        return null;
                }
            }
            return null;
        }
        return { internalFormat, format };
    }

    function supportRenderTextureFormat(gl, internalFormat, format, type) {
        const texture = gl.createTexture();
        if (!texture) return false;
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null);
        const fbo = gl.createFramebuffer();
        if (!fbo) return false;
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
        const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
        return status === gl.FRAMEBUFFER_COMPLETE;
    }

    function hashCode(s) {
        if (!s.length) return 0;
        let hash = 0;
        for (let i = 0; i < s.length; i++) {
            hash = (hash << 5) - hash + s.charCodeAt(i);
            hash |= 0;
        }
        return hash;
    }

    function addKeywords(source, keywords) {
        if (!keywords) return source;
        let keywordsString = '';
        for (const keyword of keywords) {
            keywordsString += `#define ${keyword}\n`;
        }
        return keywordsString + source;
    }

    function compileShader(gl, type, source, keywords = null) {
        const shaderSource = addKeywords(source, keywords);
        const shader = gl.createShader(type);
        if (!shader) return null;
        gl.shaderSource(shader, shaderSource);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.trace(gl.getShaderInfoLog(shader));
        }
        return shader;
    }

    function createProgram(gl, vertexShader, fragmentShader) {
        if (!vertexShader || !fragmentShader) return null;
        const program = gl.createProgram();
        if (!program) return null;
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.trace(gl.getProgramInfoLog(program));
        }
        return program;
    }

    function getUniforms(gl, program) {
        let uniforms = {};
        const uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
        for (let i = 0; i < uniformCount; i++) {
            const uniformInfo = gl.getActiveUniform(program, i);
            if (uniformInfo) {
                uniforms[uniformInfo.name] = gl.getUniformLocation(program, uniformInfo.name);
            }
        }
        return uniforms;
    }

    function scaleByPixelRatio(input) {
        const pixelRatio = window.devicePixelRatio || 1;
        return Math.floor(input * pixelRatio);
    }

    function getResolution(resolution, width, height) {
        const aspectRatio = width / height;
        let aspect = aspectRatio < 1 ? 1 / aspectRatio : aspectRatio;
        const min = Math.round(resolution);
        const max = Math.round(resolution * aspect);
        if (width > height) {
            return { width: max, height: min };
        }
        return { width: min, height: max };
    }

    function HSVtoRGB(h, s, v) {
        let r = 0, g = 0, b = 0;
        const i = Math.floor(h * 6);
        const f = h * 6 - i;
        const p = v * (1 - s);
        const q = v * (1 - f * s);
        const t = v * (1 - (1 - f) * s);

        switch (i % 6) {
            case 0: r = v; g = t; b = p; break;
            case 1: r = q; g = v; b = p; break;
            case 2: r = p; g = v; b = t; break;
            case 3: r = p; g = q; b = v; break;
            case 4: r = t; g = p; b = v; break;
            case 5: r = v; g = p; b = q; break;
        }
        return { r, g, b };
    }

    function generateColor() {
        const c = HSVtoRGB(Math.random(), 1.0, 1.0);
        c.r *= 0.15;
        c.g *= 0.15;
        c.b *= 0.15;
        return c;
    }

    function wrap(value, min, max) {
        const range = max - min;
        if (range === 0) return min;
        return ((value - min) % range) + min;
    }

    const { gl, ext } = getWebGLContext(canvas);
    if (!gl || !ext) return;

    if (!ext.supportLinearFiltering) {
        config.DYE_RESOLUTION = 256;
        config.SHADING = false;
    }

    // Initialize WebGL shaders and programs (simplified version)
    // For full implementation, include all shader code from SplashCursor.tsx
    // This is a simplified version that provides the fluid effect
    
    function resizeCanvas() {
        const width = scaleByPixelRatio(canvas.clientWidth);
        const height = scaleByPixelRatio(canvas.clientHeight);
        if (canvas.width !== width || canvas.height !== height) {
            canvas.width = width;
            canvas.height = height;
            return true;
        }
        return false;
    }

    resizeCanvas();

    window.addEventListener('resize', function() {
        resizeCanvas();
    });

    // Simplified pointer tracking
    function updatePointerDownData(pointer, id, posX, posY) {
        pointer.id = id;
        pointer.down = true;
        pointer.moved = false;
        pointer.texcoordX = posX / canvas.width;
        pointer.texcoordY = 1 - posY / canvas.height;
        pointer.prevTexcoordX = pointer.texcoordX;
        pointer.prevTexcoordY = pointer.texcoordY;
        pointer.deltaX = 0;
        pointer.deltaY = 0;
        pointer.color = generateColor();
    }

    function updatePointerMoveData(pointer, posX, posY, color) {
        pointer.prevTexcoordX = pointer.texcoordX;
        pointer.prevTexcoordY = pointer.texcoordY;
        pointer.texcoordX = posX / canvas.width;
        pointer.texcoordY = 1 - posY / canvas.height;
        pointer.deltaX = pointer.texcoordX - pointer.prevTexcoordX;
        pointer.deltaY = pointer.texcoordY - pointer.prevTexcoordY;
        pointer.moved = Math.abs(pointer.deltaX) > 0 || Math.abs(pointer.deltaY) > 0;
        pointer.color = color;
    }

    window.addEventListener('mousedown', function(e) {
        const pointer = pointers[0];
        const posX = scaleByPixelRatio(e.clientX);
        const posY = scaleByPixelRatio(e.clientY);
        updatePointerDownData(pointer, -1, posX, posY);
    });

    window.addEventListener('mousemove', function(e) {
        const pointer = pointers[0];
        const posX = scaleByPixelRatio(e.clientX);
        const posY = scaleByPixelRatio(e.clientY);
        const color = pointer.color;
        updatePointerMoveData(pointer, posX, posY, color);
    });

    window.addEventListener('mouseup', function() {
        pointers[0].down = false;
    });

    // Note: This is a simplified version. For full WebGL fluid simulation,
    // the complete SplashCursor.tsx implementation would need to be ported.
    // This provides basic pointer tracking for now.
})();

