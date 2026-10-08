/**
 * Al Rayyan - Thermal Heat Wave Effect (Petrol / Oil Burn Mirage)
 * Simulates rising hot air convection currents and image optical fluctuation on hover.
 */
(function () {
  "use strict";

  function initLiquidHeatWave() {
    var wrapEl = document.querySelector(".about-card-image-wrap");
    if (!wrapEl) return;

    var imgEl = wrapEl.querySelector(".about-card-img");
    var canvas = wrapEl.querySelector(".cea-liquid-canvas");

    if (!canvas) {
      canvas = document.createElement("canvas");
      canvas.className = "cea-liquid-canvas";
      canvas.setAttribute("data-engine", "three.js r149");
      canvas.setAttribute("aria-hidden", "true");
      wrapEl.appendChild(canvas);
    }

    if (!window.THREE) {
      console.warn("Three.js not loaded. Heat wave effect disabled.");
      return;
    }

    var THREE = window.THREE;

    // Renderer setup
    var renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance"
      });
    } catch (e) {
      console.warn("WebGL not supported for liquid canvas:", e);
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);

    // Scene & Orthographic Camera for Full-Screen Quad
    var scene = new THREE.Scene();
    var camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    // Geometry: Quad covering [-1, 1] in device coordinates
    var geometry = new THREE.PlaneGeometry(2, 2);

    // Resolutions
    var rect = wrapEl.getBoundingClientRect();
    var width = rect.width || 595;
    var height = rect.height || 396;
    var uResolution = new THREE.Vector2(width, height);
    var uImageResolution = new THREE.Vector2(800, 1000);

    var currentHover = 0.0;
    var targetHover = 0.0;
    var rafId = null;

    // Load texture from the card image
    var textureLoader = new THREE.TextureLoader();
    var imgSrc = (imgEl && imgEl.currentSrc) ? imgEl.currentSrc : "assets/images/home/about-us-sec-img.png";

    var texture = textureLoader.load(imgSrc, function (tex) {
      if (tex.image) {
        uImageResolution.set(tex.image.naturalWidth || tex.image.width || 800, tex.image.naturalHeight || tex.image.height || 1000);
      }
    });
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;

    if (imgEl && imgEl.complete && imgEl.naturalWidth) {
      uImageResolution.set(imgEl.naturalWidth, imgEl.naturalHeight);
    }

    // Vertex Shader
    var vertexShader = [
      "varying vec2 vUv;",
      "void main() {",
      "  vUv = uv;",
      "  gl_Position = vec4(position.xy, 0.0, 1.0);",
      "}"
    ].join("\n");

    // Fragment Shader: Burning Petrol / Oil Rising Heat Haze Fluctuation
    var fragmentShader = [
      "precision highp float;",
      "uniform sampler2D uTexture;",
      "uniform float uTime;",
      "uniform float uHover;",
      "uniform vec2 uResolution;",
      "uniform vec2 uImageResolution;",
      "varying vec2 vUv;",
      "",
      "// Calculate cover UV to match CSS object-fit: cover",
      "vec2 getCoverUv(vec2 uv, vec2 screenRes, vec2 imgRes) {",
      "  float screenAspect = screenRes.x / screenRes.y;",
      "  float imgAspect = imgRes.x / imgRes.y;",
      "  vec2 newUv = uv;",
      "  if (screenAspect > imgAspect) {",
      "    float scale = screenAspect / imgAspect;",
      "    newUv.y = (uv.y - 0.5) * (1.0 / scale) + 0.5;",
      "  } else {",
      "    float scale = imgAspect / screenAspect;",
      "    newUv.x = (uv.x - 0.5) * (1.0 / scale) + 0.5;",
      "  }",
      "  return newUv;",
      "}",
      "",
      "void main() {",
      "  vec2 uv = getCoverUv(vUv, uResolution, uImageResolution);",
      "",
      "  // Thermal Convection Phase (Hot air rising upwards like burning petrol/oil)",
      "  float t = uTime * 1.6;",
      "",
      "  // Multi-layered rising turbulent heat waves",
      "  // 1. Broad undulating heat plume (primary fluctuation)",
      "  float wave1 = sin(uv.y * 16.0 - t * 2.2 + uv.x * 4.0) * 0.007;",
      "",
      "  // 2. Secondary rising convective eddies (frequent fluctuation)",
      "  float wave2 = sin(uv.y * 32.0 - t * 3.6 + uv.x * 8.0) * 0.0045;",
      "",
      "  // 3. High-frequency mirage micro-shimmer",
      "  float wave3 = cos(uv.y * 55.0 - t * 4.8 + uv.x * 12.0) * 0.0025;",
      "",
      "  // Horizontal optical displacement (causes the image to fluctuate side to side)",
      "  float dispX = (wave1 + wave2 + wave3) * uHover;",
      "",
      "  // Vertical gas expansion / compression fluctuation",
      "  float dispY = (cos(uv.y * 22.0 - t * 2.6) * 0.004 + sin(uv.x * 14.0 - t * 1.8) * 0.002) * uHover;",
      "",
      "  vec2 distortedUv = clamp(uv + vec2(dispX, dispY), 0.001, 0.999);",
      "",
      "  // Heat refraction chromatic aberration (slight light wavelength dispersion)",
      "  float chromatic = 0.0025 * uHover;",
      "  float r = texture2D(uTexture, clamp(distortedUv + vec2(chromatic, 0.0), 0.001, 0.999)).r;",
      "  float g = texture2D(uTexture, distortedUv).g;",
      "  float b = texture2D(uTexture, clamp(distortedUv - vec2(chromatic, 0.0), 0.001, 0.999)).b;",
      "  float a = texture2D(uTexture, distortedUv).a;",
      "",
      "  vec3 color = vec3(r, g, b);",
      "",
      "  // Thermal atmospheric shimmer glow",
      "  float shimmer = sin(uv.y * 24.0 - t * 3.0) * 0.02 * uHover;",
      "  color += vec3(shimmer * 1.1, shimmer * 0.75, shimmer * 0.25);",
      "",
      "  gl_FragColor = vec4(color, a);",
      "}"
    ].join("\n");

    var material = new THREE.ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      uniforms: {
        uTexture: { value: texture },
        uTime: { value: 0 },
        uHover: { value: 0.0 },
        uResolution: { value: uResolution },
        uImageResolution: { value: uImageResolution }
      },
      transparent: true,
      depthTest: false,
      depthWrite: false
    });

    var mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    function updateSize() {
      var r = wrapEl.getBoundingClientRect();
      width = r.width || 595;
      height = r.height || 396;
      renderer.setSize(width, height, false);
      uResolution.set(width, height);
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
    }

    updateSize();
    window.addEventListener("resize", updateSize);

    if (imgEl) {
      if (imgEl.complete) {
        setTimeout(updateSize, 50);
      } else {
        imgEl.addEventListener("load", updateSize);
      }
    }

    var clock = new THREE.Clock();

    function renderLoop() {
      rafId = requestAnimationFrame(renderLoop);
      var delta = clock.getDelta();
      // Steady, natural rising heat flow
      material.uniforms.uTime.value += delta;

      // Smooth hover lerp (fade-in & fade-out)
      currentHover += (targetHover - currentHover) * 0.08;
      material.uniforms.uHover.value = currentHover;

      renderer.render(scene, camera);

      // Stop loop when fully idle and hidden
      if (targetHover === 0 && currentHover < 0.001) {
        cancelAnimationFrame(rafId);
        rafId = null;
        currentHover = 0;
        material.uniforms.uHover.value = 0;
      }
    }

    function startLoop() {
      if (!rafId) {
        clock.start();
        renderLoop();
      }
    }

    var triggerEl = document.querySelector(".about-card-banner") || wrapEl;

    function handleEnter() {
      updateSize();
      targetHover = 1.0;
      canvas.classList.add("is-active");
      canvas.style.opacity = "1";
      startLoop();
    }

    function handleLeave() {
      targetHover = 0.0;
      canvas.classList.remove("is-active");
      canvas.style.opacity = "0";
    }

    // Bind to both the image wrap and the whole card banner
    triggerEl.addEventListener("mouseenter", handleEnter);
    triggerEl.addEventListener("mouseleave", handleLeave);
    wrapEl.addEventListener("mouseenter", handleEnter);
    wrapEl.addEventListener("mouseleave", handleLeave);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initLiquidHeatWave);
  } else {
    initLiquidHeatWave();
  }
})();
