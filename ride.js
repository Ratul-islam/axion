/* Axion Bangladesh — The Axion Line
   The home page opens with a ride along the Axion swoosh. A steamed-up mirror to wipe, five
   vanity-mirror stops through the range (a drop, a barrel roll through ring lights, a loop in
   the dark), then the whole track reels itself in and ties into the logo.

   Scroll drives everything. motion.js has already set up Lenis and ScrollTrigger and adds
   `.motion` to <html>; without it (reduced motion, no GSAP) the section stays hidden by CSS.
   Without WebGL the section removes itself and the page starts at the hero. */

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.min.js';

const root = document.documentElement;
const section = document.querySelector('.ride');

// Colours are written exactly as they appear on screen (sRGB in, sRGB out), like the CSS.
THREE.ColorManagement.enabled = false;

if (section && root.classList.contains('motion') && window.gsap && window.ScrollTrigger) init();
else ready();

function ready() {
  document.dispatchEvent(new CustomEvent('axion:rideready'));
}

function init() {
  const $ = (sel) => section.querySelector(sel);
  const stage = $('.ride__stage');
  const canvas = $('.ride__canvas');
  const fogCanvas = $('.ride__fog');
  const stopEls = [...section.querySelectorAll('.ride__stop')];
  const lineDots = [...section.querySelectorAll('.ride__line li')];
  const endEl = $('.ride__end');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const small = matchMedia('(max-width: 680px)');
  const assetRoot = new URL(root.dataset.root || './', location.href);

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  } catch (e) {
    section.remove();
    ScrollTrigger.refresh();
    ready();
    return;
  }
  renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
  renderer.setPixelRatio(Math.min(devicePixelRatio, small.matches ? 1.5 : 1.75));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 1400);

  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const smooth = (a, b, v) => { const x = clamp((v - a) / (b - a), 0, 1); return x * x * (3 - 2 * x); };
  const smoother = (x) => x * x * x * (x * (x * 6 - 15) + 10);
  const lerp = (a, b, t) => a + (b - a) * t;

  /* ------------------------------------------------------------------ */
  /* The track                                                           */
  /* ------------------------------------------------------------------ */

  // Control points (y up, the ride heads down -z). Tagged points mark where things happen.
  const loop = (x0, yBottom, zc, r, drift, n = 12) => {
    const pts = [];
    for (let k = 1; k < n; k++) {
      const a = (k / n) * Math.PI * 2;
      pts.push([x0 + (drift * k) / n, yBottom + r - r * Math.cos(a), zc - r * Math.sin(a)]);
    }
    return pts;
  };

  // The run-in to the finish: a corkscrew that the ribbon later unspools through into the logo.
  const corkscrew = (x0, yBottom, z0, z1, r, turns, n = 20) => {
    const pts = [];
    for (let k = 1; k <= n; k++) {
      const a = (k / n) * turns * Math.PI * 2;
      pts.push([x0 + r * Math.sin(a), yBottom + r - r * Math.cos(a), lerp(z0, z1, k / n)]);
    }
    pts[pts.length - 1].push('end');
    return pts;
  };

  const TRACK = [
    [0, 8, 40, 'start'], [0, 8.6, 28], [0, 7.6, 16], [0, 4, 4],    // up to the crest
    [2, -4, -10], [7, -8.5, -26, 'drop'], [15, -7, -40],           // the drop, curling right
    [20, -5, -56, 's0'], [18, -3, -72], [10, -2, -84], [0, -2, -94],
    [-10, -1, -106, 's1'], [-16, 0, -122],
    [-17, 1, -138, 'roll0'], [-15, 2, -156], [-11, 2, -174, 'roll1'], // barrel roll through the rings
    [-5, 0, -190, 's2'], [1, -3, -204], [3, -4, -220],
    [4, -4, -236, 'loop0'], ...loop(4, -4, -236, 11, 6), [10, -4, -236, 'loop1'], // the loop, in the dark
    [11, -4, -252], [10, -3, -268, 's3'], [4, -1, -282], [-4, 1, -296], [-8, 2, -312], [-6, -2, -328],
    [0, -5, -342, 's4'], [4, -4, -358], [2, -2, -372], [0, -1, -380], ...corkscrew(0, -1, -380, -424, 4.2, 2),
  ];

  const curve = new THREE.CatmullRomCurve3(TRACK.map((p) => new THREE.Vector3(p[0], p[1], p[2])), false, 'centripetal');
  const LENGTH = curve.getLength();
  const LEN_DIV = 6000;
  const cumulative = curve.getLengths(LEN_DIV);
  const mark = {};
  TRACK.forEach((p, i) => {
    if (p[3]) mark[p[3]] = cumulative[Math.round((i / (TRACK.length - 1)) * LEN_DIV)] / LENGTH;
  });
  const STOPS = ['s0', 's1', 's2', 's3', 's4'].map((k) => mark[k]);

  // Frames sampled evenly along the track: position, tangent, up (normal) and side.
  // "Up" is carried along by parallel transport so it follows the loop, then the track banks
  // into turns and spins once through the barrel roll.
  const N = 3000;
  const fP = [], fT = [], fN = [], fB = [];
  {
    const up = new THREE.Vector3(0, 1, 0);
    const axis = new THREE.Vector3();
    for (let i = 0; i <= N; i++) {
      fP.push(curve.getPointAt(i / N));
      fT.push(curve.getTangentAt(i / N).normalize());
    }
    const n = up.clone().addScaledVector(fT[0], -fT[0].dot(up)).normalize();
    const base = [];
    for (let i = 0; i <= N; i++) {
      if (i > 0) {
        axis.crossVectors(fT[i - 1], fT[i]);
        const len = axis.length();
        if (len > 1e-7) n.applyAxisAngle(axis.divideScalar(len), Math.asin(clamp(len, -1, 1)));
        n.addScaledVector(fT[i], -n.dot(fT[i])).normalize();
      }
      base.push(n.clone());
    }

    // Bank from how fast the heading turns on the level; nothing inside the loop.
    const ds = LENGTH / N;
    const raw = new Float32Array(N + 1);
    for (let i = 1; i < N; i++) {
      const a = fT[i - 1], b = fT[i + 1];
      const turn = (a.z * b.x - a.x * b.z) / (2 * ds);
      const level = (1 - fT[i].y * fT[i].y) ** 2;
      const u = i / N;
      const inLoop = smooth(mark.loop0 - 0.01, mark.loop0, u) * (1 - smooth(mark.loop1, mark.loop1 + 0.01, u));
      raw[i] = clamp(turn * 9, -0.75, 0.75) * level * (1 - inLoop);
    }
    const W = 60;
    for (let i = 0; i <= N; i++) {
      let sum = 0, cnt = 0;
      for (let j = Math.max(0, i - W); j <= Math.min(N, i + W); j++) { sum += raw[j]; cnt++; }
      const u = i / N;
      const roll = sum / cnt + Math.PI * 2 * smoother(clamp((u - mark.roll0) / (mark.roll1 - mark.roll0), 0, 1));
      const nn = base[i].clone().applyAxisAngle(fT[i], roll);
      fN.push(nn);
      fB.push(new THREE.Vector3().crossVectors(fT[i], nn).normalize());
    }
  }

  const frame = { p: new THREE.Vector3(), t: new THREE.Vector3(), n: new THREE.Vector3(), b: new THREE.Vector3() };
  function frameAt(u, out = frame) {
    const x = clamp(u, 0, 1) * N;
    const i = Math.min(N - 1, Math.floor(x));
    const f = x - i;
    out.p.lerpVectors(fP[i], fP[i + 1], f);
    out.t.lerpVectors(fT[i], fT[i + 1], f).normalize();
    out.n.lerpVectors(fN[i], fN[i + 1], f).normalize();
    out.b.lerpVectors(fB[i], fB[i + 1], f).normalize();
    return out;
  }

  /* ------------------------------------------------------------------ */
  /* The logo the track turns into                                       */
  /* ------------------------------------------------------------------ */

  // Same geometry as the preloader mark (a 120-unit SVG box), stood up so the swoosh's tail
  // is exactly where the track ends: the ribbon runs off the line and straight into the stroke.
  const LOGO_K = 0.06;
  const LOGO = fP[N].clone().add(new THREE.Vector3((60 - 10) * LOGO_K, (88 - 60) * LOGO_K, 0));
  const svg = (x, y, z = 0) => new THREE.Vector3((x - 60) * LOGO_K + LOGO.x, (60 - y) * LOGO_K + LOGO.y, LOGO.z + z);
  const swoosh = new THREE.CubicBezierCurve3(svg(10, 88), svg(42, 104), svg(86, 84), svg(110, 26));

  /* ------------------------------------------------------------------ */
  /* Shared shader pieces                                                */
  /* ------------------------------------------------------------------ */

  const fogUniforms = {
    uFogColor: { value: new THREE.Color('#efe4de') },
    uFogNear: { value: 28 },
    uFogFar: { value: 150 },
  };
  const FOG_GLSL = /* glsl */ `
    uniform vec3 uFogColor;
    uniform float uFogNear;
    uniform float uFogFar;
    vec3 applyFog(vec3 col, vec3 world) {
      float f = smoothstep(uFogNear, uFogFar, distance(cameraPosition, world));
      return mix(col, uFogColor, f);
    }
    float fogAmount(vec3 world) { return smoothstep(uFogNear, uFogFar, distance(cameraPosition, world)); }
  `;

  /* ------------------------------------------------------------------ */
  /* Sky                                                                 */
  /* ------------------------------------------------------------------ */

  const sky = new THREE.Mesh(
    new THREE.SphereGeometry(1000, 32, 16),
    new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      uniforms: { uTop: { value: new THREE.Color() }, uBottom: { value: new THREE.Color() } },
      vertexShader: /* glsl */ `
        varying vec3 vDir;
        void main() {
          vDir = normalize(position);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }`,
      fragmentShader: /* glsl */ `
        uniform vec3 uTop;
        uniform vec3 uBottom;
        varying vec3 vDir;
        void main() {
          float h = smoothstep(-0.55, 0.65, vDir.y);
          gl_FragColor = vec4(mix(uBottom, uTop, h), 1.0);
        }`,
    }),
  );
  sky.renderOrder = -10;
  scene.add(sky);

  /* ------------------------------------------------------------------ */
  /* The ribbon                                                          */
  /* ------------------------------------------------------------------ */

  const SEG = small.matches ? 1600 : 2400;
  const RIBBON_W = 2.5;

  // The ribbon is drawn from a path texture rather than fixed vertices, so at the finish it can
  // slide along its own track and out of the end, laying the swoosh down like a pen stroke.
  // Rows: track position, up, side; swoosh position (+ half width in w), swoosh side.
  const PATH_N = 4096;
  const pathTex = (() => {
    const data = new Float32Array(PATH_N * 5 * 4);
    const f = { p: new THREE.Vector3(), t: new THREE.Vector3(), n: new THREE.Vector3(), b: new THREE.Vector3() };
    const put = (row, i, x, y, z, w = 0) => data.set([x, y, z, w], (row * PATH_N + i) * 4);
    for (let i = 0; i < PATH_N; i++) {
      const u = i / (PATH_N - 1);
      frameAt(u, f);
      put(0, i, f.p.x, f.p.y, f.p.z);
      put(1, i, f.n.x, f.n.y, f.n.z);
      put(2, i, f.b.x, f.b.y, f.b.z);
      // The swoosh: thin at the tail, full through the curve, tapering to a point at the tip.
      const sp = swoosh.getPointAt(u);
      const st = swoosh.getTangentAt(u);
      const half = LOGO_K * 6.2 * Math.sin(Math.PI * clamp(u, 0.03, 1)) ** 0.75 * (0.55 + 0.45 * u);
      put(3, i, sp.x, sp.y, sp.z, half);
      const side = new THREE.Vector3(st.y, -st.x, 0).normalize();
      put(4, i, side.x, side.y, 0);
    }
    const tex = new THREE.DataTexture(data, PATH_N, 5, THREE.RGBAFormat, THREE.FloatType);
    tex.needsUpdate = true;
    return tex;
  })();

  const ribbon = (() => {
    const uv = new Float32Array((SEG + 1) * 2 * 2);
    const index = [];
    for (let i = 0; i <= SEG; i++) {
      uv.set([i / SEG, 0, i / SEG, 1], i * 4);
      if (i < SEG) {
        const a = i * 2;
        index.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array((SEG + 1) * 2 * 3), 3));
    geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
    geo.setIndex(index);

    const mat = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      defines: { PATH_N },
      uniforms: {
        ...fogUniforms,
        uPath: { value: pathTex },
        uReel: { value: 0 },
        uHalfW: { value: RIBBON_W / 2 },
        uGlow: { value: 0 },
        uLength: { value: LENGTH },
        uLight: { value: new THREE.Vector3(0.3, 1, 0.45).normalize() },
        uTop: sky.material.uniforms.uTop,
        uBottom: sky.material.uniforms.uBottom,
      },
      vertexShader: /* glsl */ `
        uniform sampler2D uPath;
        uniform float uReel;
        uniform float uHalfW;
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vSide;
        varying vec3 vWorld;
        varying float vMorph;

        vec4 path(int row, float t) {
          float x = clamp(t, 0.0, 1.0) * float(PATH_N - 1);
          int i = int(floor(x));
          int j = min(i + 1, PATH_N - 1);
          return mix(texelFetch(uPath, ivec2(i, row), 0), texelFetch(uPath, ivec2(j, row), 0), x - float(i));
        }

        void main() {
          float u = uv.x;
          float dir = uv.y * 2.0 - 1.0;
          // Where along the line this piece of ribbon is now: past the end, it is part of the swoosh.
          float t = u + uReel;
          vec3 p;
          if (t <= 1.0) {
            float taper = smoothstep(0.0, 0.012, u) * (0.35 + 0.65 * (1.0 - smoothstep(0.996, 1.0, u)));
            // The line narrows to the width of the swoosh's tail where the two meet.
            taper *= mix(1.0, 0.05, smoothstep(0.972, 1.0, t));
            vNormal = path(1, t).xyz;
            vSide = path(2, t).xyz;
            p = path(0, t).xyz + vSide * uHalfW * taper * dir;
            vMorph = 0.0;
          } else {
            vec4 s = path(3, t - 1.0);
            vNormal = vec3(0.0, 0.0, 1.0);
            vSide = path(4, t - 1.0).xyz;
            p = s.xyz + vSide * s.w * dir;
            vMorph = 1.0;
          }
          vUv = uv;
          vec4 world = modelMatrix * vec4(p, 1.0);
          vWorld = world.xyz;
          gl_Position = projectionMatrix * viewMatrix * world;
        }`,
      fragmentShader: /* glsl */ `
        ${FOG_GLSL}
        uniform float uGlow;
        uniform float uLength;
        uniform vec3 uLight;
        uniform vec3 uTop;
        uniform vec3 uBottom;
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vSide;
        varying vec3 vWorld;
        varying float vMorph;

        vec3 rideColor(float u) {
          vec3 c = mix(vec3(0.478, 0.133, 0.267), vec3(0.761, 0.094, 0.357), smoothstep(0.0, 0.3, u));
          c = mix(c, vec3(0.878, 0.149, 0.169), smoothstep(0.3, 0.62, u));
          c = mix(c, vec3(0.910, 0.263, 0.165), smoothstep(0.62, 0.8, u));
          return mix(c, vec3(0.969, 0.580, 0.114), smoothstep(0.8, 1.0, u));
        }
        vec3 logoColor(float u) {
          vec3 c = mix(vec3(0.761, 0.094, 0.357), vec3(0.910, 0.263, 0.165), smoothstep(0.0, 0.55, u));
          return mix(c, vec3(0.969, 0.580, 0.114), smoothstep(0.55, 1.0, u));
        }
        float line(float d, float w) {
          float f = fwidth(d);
          return 1.0 - smoothstep(w - f, w + f, d);
        }
        void main() {
          float across = vUv.y;
          // Satin: the ribbon is shaded as if gently curved across its width.
          vec3 n = normalize(vNormal);
          if (!gl_FrontFacing) n = -n;
          n = normalize(n + normalize(vSide) * (across - 0.5) * 1.1);
          vec3 v = normalize(cameraPosition - vWorld);
          vec3 base = mix(rideColor(vUv.x), logoColor(vUv.x), vMorph);
          float diff = 0.6 + 0.4 * max(dot(n, uLight), 0.0);
          float spec = pow(max(dot(n, normalize(v + uLight)), 0.0), 36.0);
          float fres = pow(1.0 - abs(dot(n, v)), 2.5);
          // It picks up the sky of each chapter.
          vec3 r = reflect(-v, n);
          vec3 skyCol = mix(uBottom, uTop, smoothstep(-0.55, 0.65, r.y));
          vec3 col = base * diff;
          col = mix(col, skyCol, fres * 0.45 * (1.0 - vMorph * 0.6));
          col += vec3(1.0, 0.93, 0.86) * spec * 0.45;
          // Woven sheen bands slip past underneath you: the sense of speed.
          float band = pow(0.5 + 0.5 * sin(vUv.x * uLength * 2.4), 10.0);
          col += vec3(1.0, 0.9, 0.85) * band * 0.07 * (1.0 - vMorph);

          // A fine hem along both edges, gone once it is a logo.
          float hem = line(abs(across - 0.06), 0.009) + line(abs(across - 0.94), 0.009);
          hem *= 1.0 - vMorph;
          col = mix(col, vec3(1.0, 0.94, 0.86), hem * 0.75);
          // In the dark the hems burn like neon.
          col += vec3(1.0, 0.55, 0.35) * uGlow * hem;

          float fog = fogAmount(vWorld) * (1.0 - vMorph);
          gl_FragColor = vec4(mix(col, uFogColor, fog), 1.0);
        }`,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.frustumCulled = false;
    scene.add(mesh);
    return mesh;
  })();

  /* ------------------------------------------------------------------ */
  /* The A's two legs, drawn in at the finish                            */
  /* ------------------------------------------------------------------ */

  function leg(x1, y1, x2, y2, from, to, z) {
    const a = svg(x1, y1, z), b = svg(x2, y2, z);
    const along = b.clone().sub(a);
    const side = new THREE.Vector3(-along.y, along.x, 0).normalize().multiplyScalar(19 * LOGO_K * 0.5);
    const geo = new THREE.BufferGeometry();
    const corners = [a.clone().sub(side), a.clone().add(side), b.clone().sub(side), b.clone().add(side)];
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(corners.flatMap((c) => [c.x, c.y, c.z])), 3));
    geo.setAttribute('uv', new THREE.BufferAttribute(new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]), 2));
    geo.setIndex([0, 1, 2, 1, 3, 2]);
    const mat = new THREE.ShaderMaterial({
      transparent: true,
      side: THREE.DoubleSide,
      uniforms: { uDraw: { value: 0 }, uFrom: { value: new THREE.Color(from) }, uTo: { value: new THREE.Color(to) } },
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: /* glsl */ `
        uniform float uDraw;
        uniform vec3 uFrom;
        uniform vec3 uTo;
        varying vec2 vUv;
        void main() {
          float edge = fwidth(vUv.y);
          float a = 1.0 - smoothstep(uDraw - edge, uDraw + edge, vUv.y);
          if (a <= 0.0) discard;
          gl_FragColor = vec4(mix(uFrom, uTo, vUv.y), a);
        }`,
    });
    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);
    return mat;
  }
  const legs = [
    leg(18, 110, 57, 12, '#7a2244', '#e0262b', -0.15),
    leg(57, 12, 96, 110, '#f26a24', '#c2185b', -0.35),
  ];

  /* ------------------------------------------------------------------ */
  /* Ring lights the track threads through                               */
  /* ------------------------------------------------------------------ */

  const ringMat = new THREE.ShaderMaterial({
    uniforms: { ...fogUniforms, uGlow: { value: 0 } },
    vertexShader: /* glsl */ `
      varying vec3 vNormal;
      varying vec3 vWorld;
      void main() {
        vNormal = normalize(mat3(modelMatrix) * normal);
        vec4 w = modelMatrix * vec4(position, 1.0);
        vWorld = w.xyz;
        gl_Position = projectionMatrix * viewMatrix * w;
      }`,
    fragmentShader: /* glsl */ `
      ${FOG_GLSL}
      uniform float uGlow;
      varying vec3 vNormal;
      varying vec3 vWorld;
      void main() {
        vec3 n = normalize(vNormal);
        vec3 v = normalize(cameraPosition - vWorld);
        vec3 l = normalize(vec3(0.3, 1.0, 0.5));
        float spec = pow(max(dot(n, normalize(v + l)), 0.0), 30.0);
        vec3 brass = vec3(0.79, 0.64, 0.44) * (0.55 + 0.45 * max(dot(n, l), 0.0)) + spec * 0.6;
        vec3 lit = vec3(1.0, 0.93, 0.84);
        gl_FragColor = vec4(applyFog(mix(brass, lit, uGlow), vWorld), 1.0);
      }`,
  });
  const haloMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    uniforms: { ...fogUniforms, uGlow: { value: 0 } },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      varying vec3 vWorld;
      void main() {
        vUv = uv;
        vec4 w = modelMatrix * vec4(position, 1.0);
        vWorld = w.xyz;
        gl_Position = projectionMatrix * viewMatrix * w;
      }`,
    fragmentShader: /* glsl */ `
      ${FOG_GLSL}
      uniform float uGlow;
      varying vec2 vUv;
      varying vec3 vWorld;
      void main() {
        float r = length(vUv - 0.5) * 2.0;
        float g = exp(-pow((r - 0.62) / 0.09, 2.0));
        float a = g * (0.12 + 0.6 * uGlow) * (1.0 - fogAmount(vWorld));
        gl_FragColor = vec4(vec3(1.0, 0.78, 0.55) * a, 1.0);
      }`,
  });
  const RING_R = 5.4;
  const ringGeo = new THREE.TorusGeometry(RING_R, 0.13, 12, 120);
  const haloGeo = new THREE.PlaneGeometry(RING_R * 3.2, RING_R * 3.2);
  const ringAt = [mark.drop + 0.012];
  for (let k = 0; k < 6; k++) ringAt.push(lerp(mark.roll0, mark.roll1, (k + 0.5) / 6));
  for (let k = 0; k < 4; k++) ringAt.push(lerp(mark.loop0, mark.loop1, (k + 0.5) / 4));
  const CAM_H = 1.15;
  ringAt.forEach((u) => {
    const f = frameAt(u, { p: new THREE.Vector3(), t: new THREE.Vector3(), n: new THREE.Vector3(), b: new THREE.Vector3() });
    const g = new THREE.Group();
    g.position.copy(f.p).addScaledVector(f.n, CAM_H);
    g.up.copy(f.n);
    g.lookAt(g.position.clone().add(f.t));
    g.add(new THREE.Mesh(ringGeo, ringMat));
    g.add(new THREE.Mesh(haloGeo, haloMat));
    scene.add(g);
  });

  /* ------------------------------------------------------------------ */
  /* Steam (and, in the dark, embers)                                    */
  /* ------------------------------------------------------------------ */

  const steam = (() => {
    const COUNT = small.matches ? 700 : 1500;
    const pos = new Float32Array(COUNT * 3);
    const size = new Float32Array(COUNT);
    const phase = new Float32Array(COUNT);
    const f = { p: new THREE.Vector3(), t: new THREE.Vector3(), n: new THREE.Vector3(), b: new THREE.Vector3() };
    for (let i = 0; i < COUNT; i++) {
      frameAt(Math.random(), f);
      const r = 4 + Math.random() ** 1.5 * 40;
      const a = Math.random() * Math.PI * 2;
      pos.set([
        f.p.x + Math.cos(a) * r,
        f.p.y + Math.sin(a) * r * 0.7 + 2,
        f.p.z + (Math.random() - 0.5) * 20,
      ], i * 3);
      size[i] = Math.random() < 0.82 ? 2 + Math.random() * 5 : 0.25 + Math.random() * 0.5;
      phase[i] = Math.random() * 100;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('aSize', new THREE.BufferAttribute(size, 1));
    geo.setAttribute('aPhase', new THREE.BufferAttribute(phase, 1));
    const mat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: {
        ...fogUniforms,
        uTime: { value: 0 },
        uColor: { value: new THREE.Color('#ffffff') },
        uAlpha: { value: 0.5 },
        uScale: { value: 400 },
        uEmber: { value: 0 },
      },
      vertexShader: /* glsl */ `
        attribute float aSize;
        attribute float aPhase;
        uniform float uTime;
        uniform float uScale;
        uniform float uEmber;
        varying float vFade;
        varying vec3 vWorld;
        varying float vSmall;
        void main() {
          vec3 p = position;
          p.y += mod(uTime * 0.35 + aPhase, 10.0) - 5.0;
          p.x += sin(uTime * 0.2 + aPhase) * 1.2;
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          vWorld = (modelMatrix * vec4(p, 1.0)).xyz;
          vSmall = step(aSize, 1.0);
          // Embers are small and sharp; steam is broad and soft.
          float s = mix(aSize, aSize * 0.22 + 0.25, uEmber);
          gl_PointSize = s * uScale / -mv.z;
          float rise = mod(uTime * 0.35 + aPhase, 10.0) / 10.0;
          vFade = smoothstep(0.0, 0.2, rise) * (1.0 - smoothstep(0.75, 1.0, rise)) * smoothstep(2.0, 7.0, -mv.z);
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: /* glsl */ `
        ${FOG_GLSL}
        uniform vec3 uColor;
        uniform float uAlpha;
        uniform float uEmber;
        varying float vFade;
        varying vec3 vWorld;
        varying float vSmall;
        void main() {
          float d = length(gl_PointCoord - 0.5) * 2.0;
          float soft = pow(max(1.0 - d, 0.0), mix(1.6, 2.5, uEmber));
          float a = soft * uAlpha * vFade * (1.0 - fogAmount(vWorld) * 0.8) * mix(1.0, 1.6, vSmall);
          if (a < 0.004) discard;
          gl_FragColor = vec4(uColor, a);
        }`,
    });
    const pts = new THREE.Points(geo, mat);
    pts.frustumCulled = false;
    scene.add(pts);
    return mat;
  })();

  /* ------------------------------------------------------------------ */
  /* Vanity-mirror stops                                                 */
  /* ------------------------------------------------------------------ */

  // One arch per stop, in the brass of the equipment trim, ringed with bulbs that chase on as you near.
  const STOP_IMAGES = [
    { src: 'assets/home/home_page.png', aspect: 0.82, side: 1 },
    { src: 'assets/categories/Product%20image%20(2).png', aspect: 1.45, side: -1 },
    { src: 'assets/categories/Product%20image%20(3).png', aspect: 1.5, side: 1 },
    { src: 'assets/categories/Product%20image%20(1).png', aspect: 1.5, side: -1 },
    { src: 'assets/company/Salon%20interior.png', aspect: 0.9, side: 1 },
  ];

  const ARCH_GLSL = /* glsl */ `
    // Signed distance to an arch (round top, flat bottom) of width a and height 1, in that space.
    float archDist(vec2 uv, float a) {
      vec2 p = vec2((uv.x - 0.5) * a, uv.y);
      float r = a * 0.5;
      float cy = 1.0 - r;
      float d = p.y < cy ? abs(p.x) - r : length(vec2(p.x, p.y - cy)) - r;
      return max(d, -p.y);
    }
  `;

  const loader = new THREE.TextureLoader();
  const mirrors = STOP_IMAGES.map((stop, i) => {
    const h = stop.aspect < 1 ? 4.4 : 5.8 / stop.aspect;
    const w = h * stop.aspect;
    const group = new THREE.Group();
    const uniforms = {
      ...fogUniforms,
      uMap: { value: null },
      uImgAspect: { value: 1 },
      uAspect: { value: stop.aspect },
      uGlint: { value: -1 },
      uOpacity: { value: 0 },
    };
    const glass = new THREE.Mesh(
      new THREE.PlaneGeometry(w, h),
      new THREE.ShaderMaterial({
        transparent: true,
        uniforms,
        vertexShader: /* glsl */ `
          varying vec2 vUv;
          varying vec3 vWorld;
          void main() {
            vUv = uv;
            vec4 w = modelMatrix * vec4(position, 1.0);
            vWorld = w.xyz;
            gl_Position = projectionMatrix * viewMatrix * w;
          }`,
        fragmentShader: /* glsl */ `
          ${FOG_GLSL}
          ${ARCH_GLSL}
          uniform sampler2D uMap;
          uniform float uImgAspect;
          uniform float uAspect;
          uniform float uGlint;
          uniform float uOpacity;
          varying vec2 vUv;
          varying vec3 vWorld;
          void main() {
            float d = archDist(vUv, uAspect);
            float aa = fwidth(d);
            float inside = 1.0 - smoothstep(-aa, aa, d);
            if (inside <= 0.0) discard;
            // Cover-fit the photo into the arch.
            vec2 uv = vUv - 0.5;
            if (uImgAspect > uAspect) uv.x *= uAspect / uImgAspect; else uv.y *= uImgAspect / uAspect;
            vec3 col = texture2D(uMap, uv + 0.5).rgb;
            // A glint sweeps across the glass as you pass.
            float g = vUv.x * 0.8 + vUv.y * 0.6 - uGlint;
            col += vec3(1.0, 0.97, 0.92) * (exp(-g * g * 90.0) * 0.35 + exp(-pow(g - 0.12, 2.0) * 400.0) * 0.2);
            gl_FragColor = vec4(applyFog(col, vWorld), inside * uOpacity);
          }`,
      }),
    );
    glass.position.z = 0.03;

    const FRAME = 0.28;
    const frameMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(w + FRAME * 2, h + FRAME * 2),
      new THREE.ShaderMaterial({
        transparent: true,
        uniforms: { ...fogUniforms, uAspect: { value: (w + FRAME * 2) / (h + FRAME * 2) }, uOpacity: uniforms.uOpacity },
        vertexShader: glass.material.vertexShader,
        fragmentShader: /* glsl */ `
          ${FOG_GLSL}
          ${ARCH_GLSL}
          uniform float uAspect;
          uniform float uOpacity;
          varying vec2 vUv;
          varying vec3 vWorld;
          void main() {
            float d = archDist(vUv, uAspect);
            float aa = fwidth(d);
            float inside = 1.0 - smoothstep(-aa, aa, d);
            if (inside <= 0.0) discard;
            float sheen = 0.5 + 0.5 * sin((vUv.x + vUv.y) * 9.0);
            vec3 brass = mix(vec3(0.62, 0.46, 0.28), vec3(0.88, 0.75, 0.55), sheen);
            gl_FragColor = vec4(applyFog(brass, vWorld), inside * uOpacity);
          }`,
      }),
    );

    // Bulbs follow the frame: up the left side, over the arch, down the right.
    const BULBS = 18;
    const bulbPos = new Float32Array(BULBS * 3);
    const bulbIdx = new Float32Array(BULBS);
    const r = w / 2 + FRAME * 0.5;
    const straight = h - w / 2;
    const perim = straight * 2 + Math.PI * r;
    for (let k = 0; k < BULBS; k++) {
      const s = ((k + 0.5) / BULBS) * perim;
      let x, y;
      if (s < straight) { x = -r; y = s; }
      else if (s < straight + Math.PI * r) {
        const a = Math.PI - (s - straight) / r;
        x = Math.cos(a) * r; y = straight + Math.sin(a) * r;
      } else { x = r; y = straight - (s - straight - Math.PI * r); }
      bulbPos.set([x, y - h / 2, 0.08], k * 3);
      bulbIdx[k] = k / (BULBS - 1);
    }
    const bulbGeo = new THREE.BufferGeometry();
    bulbGeo.setAttribute('position', new THREE.BufferAttribute(bulbPos, 3));
    bulbGeo.setAttribute('aIdx', new THREE.BufferAttribute(bulbIdx, 1));
    const bulbUniforms = { uLit: { value: 0 }, uTime: { value: 0 }, uScale: { value: 400 }, uOpacity: uniforms.uOpacity };
    const bulbs = new THREE.Points(bulbGeo, new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: bulbUniforms,
      vertexShader: /* glsl */ `
        attribute float aIdx;
        uniform float uLit;
        uniform float uTime;
        uniform float uScale;
        varying float vOn;
        void main() {
          // Light from the bottom of both sides at once, meeting at the top of the arch.
          float order = 1.0 - abs(aIdx - 0.5) * 2.0;
          vOn = smoothstep(order - 0.05, order + 0.05, uLit) * (0.85 + 0.15 * sin(uTime * 6.0 + aIdx * 40.0));
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = 0.9 * uScale / -mv.z;
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: /* glsl */ `
        uniform float uOpacity;
        varying float vOn;
        void main() {
          float d = length(gl_PointCoord - 0.5) * 2.0;
          float core = 1.0 - smoothstep(0.12, 0.2, d);
          float halo = pow(max(1.0 - d, 0.0), 2.2);
          vec3 off = vec3(0.55, 0.45, 0.35) * core;
          vec3 on = vec3(1.0, 0.92, 0.78) * (core + halo * 0.9);
          vec3 col = mix(off, on, vOn) * uOpacity;
          gl_FragColor = vec4(col, 1.0);
        }`,
    }));

    const pivot = new THREE.Group(); // swings open like a door
    pivot.add(frameMesh, glass, bulbs);
    group.add(pivot);
    scene.add(group);

    loader.load(new URL(stop.src, assetRoot).href, (tex) => {
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
      uniforms.uMap.value = tex;
      uniforms.uImgAspect.value = tex.image.width / tex.image.height;
      loaded();
    }, undefined, loaded);

    return { group, pivot, uniforms, bulbUniforms, side: stop.side, h, u: STOPS[i] };
  });

  let pendingImages = mirrors.length;
  function loaded() {
    pendingImages -= 1;
    if (pendingImages === 0) {
      section.classList.add('is-ready');
      ready();
    }
  }

  /* ------------------------------------------------------------------ */
  /* Story: scroll progress → where you are on the line                  */
  /* ------------------------------------------------------------------ */

  const P_RIDE = 0.05;     // the mirror clears, the car starts rolling
  const P_FINALE = 0.83;   // the car stops, the track reels in
  const U_END = 0.988;

  // The car slows (but never stops) at each mirror and races between them.
  const KEYS = [[0, 0], ...STOPS.map((u) => [u / U_END, u]), [1, U_END]];
  function rideU(q) {
    for (let k = 0; k < KEYS.length - 1; k++) {
      const [q0, u0] = KEYS[k], [q1, u1] = KEYS[k + 1];
      if (q <= q1) {
        const x = (q - q0) / (q1 - q0);
        return lerp(u0, u1, lerp(x, smoother(x), 0.72));
      }
    }
    return U_END;
  }

  // Sky and air by chapter: steam, blush, white steam, heat, night for the loop, dawn, then the page's cream.
  const hex = (h) => new THREE.Color(h);
  const PALETTE = [
    [0, '#fbf6f2', '#e8d7cf', '#ffffff', 0.55, 0],
    [STOPS[0] - 0.05, '#fbf6f2', '#e8d7cf', '#ffffff', 0.55, 0],
    [STOPS[0], '#f9e7ed', '#e2b5c6', '#ffffff', 0.5, 0],
    [STOPS[1], '#fdfaf8', '#e3dad5', '#ffffff', 0.8, 0],
    [STOPS[2], '#f8e5cc', '#d6a877', '#fff1df', 0.45, 0.15],
    [mark.loop0 - 0.012, '#3b1a29', '#12090d', '#ffb46a', 0.95, 1],
    [STOPS[3] + 0.03, '#2d1520', '#0d0609', '#ffb46a', 0.95, 1],
    [STOPS[4] - 0.025, '#f8d9c6', '#e3998a', '#fff1e6', 0.5, 0.2],
    [1, '#fae5d9', '#eebcab', '#fff4ec', 0.3, 0.1],
    [1.55, '#fcfaf7', '#fcfaf7', '#ffffff', 0, 0],
  ].map(([s, top, bottom, steamCol, steamAlpha, glow]) => ({
    s, top: hex(top), bottom: hex(bottom), steam: hex(steamCol), steamAlpha, glow,
  }));

  const air = { top: new THREE.Color(), bottom: new THREE.Color(), steam: new THREE.Color(), steamAlpha: 0, glow: 0 };
  function airAt(s) {
    let k = 0;
    while (k < PALETTE.length - 2 && s > PALETTE[k + 1].s) k++;
    const a = PALETTE[k], b = PALETTE[k + 1];
    const t = smooth(a.s, b.s, s);
    air.top.lerpColors(a.top, b.top, t);
    air.bottom.lerpColors(a.bottom, b.bottom, t);
    air.steam.lerpColors(a.steam, b.steam, t);
    air.steamAlpha = lerp(a.steamAlpha, b.steamAlpha, t);
    air.glow = lerp(a.glow, b.glow, t);
    return air;
  }

  /* ------------------------------------------------------------------ */
  /* The steamed-up mirror (2D, wiped by hand)                           */
  /* ------------------------------------------------------------------ */

  let fogGone = false;
  const fog = (() => {
    const ctx = fogCanvas.getContext('2d');
    const frost = document.createElement('canvas');
    const brush = document.createElement('canvas');
    let last = null;
    let dirty = false;
    let width = 0, height = 0;

    brush.width = brush.height = 160;
    {
      const b = brush.getContext('2d');
      const g = b.createRadialGradient(80, 80, 0, 80, 80, 80);
      g.addColorStop(0, 'rgba(0,0,0,1)');
      g.addColorStop(0.55, 'rgba(0,0,0,0.9)');
      g.addColorStop(1, 'rgba(0,0,0,0)');
      b.fillStyle = g;
      b.fillRect(0, 0, 160, 160);
    }

    function paintFrost() {
      frost.width = width;
      frost.height = height;
      const f = frost.getContext('2d');
      f.fillStyle = 'rgba(247, 241, 237, 0.93)';
      f.fillRect(0, 0, width, height);
      // Uneven condensation…
      for (let i = 0; i < 70; i++) {
        const x = Math.random() * width, y = Math.random() * height, r = 60 + Math.random() * 220;
        const g = f.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, `rgba(255,255,255,${0.15 + Math.random() * 0.2})`);
        g.addColorStop(1, 'rgba(255,255,255,0)');
        f.fillStyle = g;
        f.fillRect(x - r, y - r, r * 2, r * 2);
      }
      // …and beads of water catching the light.
      const beads = Math.round((width * height) / 2600);
      for (let i = 0; i < beads; i++) {
        const x = Math.random() * width, y = Math.random() * height;
        const r = Math.random() < 0.9 ? 0.6 + Math.random() * 1.6 : 2 + Math.random() * 3.5;
        f.beginPath();
        f.arc(x, y, r, 0, Math.PI * 2);
        f.fillStyle = 'rgba(160, 130, 125, 0.22)';
        f.fill();
        f.beginPath();
        f.arc(x - r * 0.3, y - r * 0.35, r * 0.45, 0, Math.PI * 2);
        f.fillStyle = 'rgba(255, 255, 255, 0.9)';
        f.fill();
      }
    }

    function resize(w, h) {
      width = fogCanvas.width = Math.round(w);
      height = fogCanvas.height = Math.round(h);
      paintFrost();
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(frost, 0, 0);
    }

    function wipe(x, y) {
      const size = Math.max(110, Math.min(width, height) * 0.16);
      ctx.globalCompositeOperation = 'destination-out';
      ctx.globalAlpha = 1;
      const from = last || { x, y };
      const dist = Math.hypot(x - from.x, y - from.y);
      const steps = Math.max(1, Math.ceil(dist / (size * 0.12)));
      for (let i = 1; i <= steps; i++) {
        const px = from.x + ((x - from.x) * i) / steps, py = from.y + ((y - from.y) * i) / steps;
        ctx.drawImage(brush, px - size / 2, py - size / 2, size, size);
      }
      last = { x, y };
      dirty = true;
    }

    // Wiped glass slowly steams back over.
    function tick() {
      if (!dirty || fogGone) return;
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 0.008;
      ctx.drawImage(frost, 0, 0);
    }

    function point(e) {
      const rect = fogCanvas.getBoundingClientRect();
      return [(e.clientX - rect.left) * (width / rect.width), (e.clientY - rect.top) * (height / rect.height)];
    }
    stage.addEventListener('pointermove', (e) => {
      if (fogGone) return;
      if (e.pointerType === 'mouse' || e.pressure > 0 || e.buttons) wipe(...point(e));
    });
    stage.addEventListener('pointerleave', () => { last = null; });
    stage.addEventListener('pointerup', () => { last = null; });
    stage.addEventListener('touchmove', (e) => {
      if (fogGone) return;
      const t = e.touches[0];
      wipe(...point(t));
    }, { passive: true });
    stage.addEventListener('touchend', () => { last = null; }, { passive: true });

    return { resize, tick };
  })();

  /* ------------------------------------------------------------------ */
  /* Frame loop                                                          */
  /* ------------------------------------------------------------------ */

  let target = 0;        // scroll progress through the section
  let progress = 0;      // eased towards it, for a little momentum
  let lastU = 0;
  let speed = 0;
  let running = false;
  let visible = false;
  let revealed = root.classList.contains('is-revealed') || !root.classList.contains('is-loading');
  let introClock = revealed ? 1 : 0;
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  const clock = new THREE.Clock();
  const RIDE_KEY = 'axion-ride';

  document.addEventListener('axion:revealed', () => { revealed = true; });

  if (finePointer) {
    window.addEventListener('pointermove', (e) => {
      pointer.tx = (e.clientX / innerWidth) * 2 - 1;
      pointer.ty = (e.clientY / innerHeight) * 2 - 1;
    }, { passive: true });
  }

  const st = ScrollTrigger.create({
    trigger: section,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (self) => { target = self.progress; },
    onToggle: (self) => root.classList.toggle('in-ride', self.isActive && self.progress < 0.995),
  });
  ScrollTrigger.create({
    trigger: section,
    start: 'top bottom',
    end: 'bottom top',
    onToggle: (self) => { visible = self.isActive; if (visible) start(); },
  });
  target = st.progress;
  progress = target;

  function resize() {
    const w = stage.clientWidth, h = stage.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    const scale = h * renderer.getPixelRatio() / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2));
    steam.uniforms.uScale.value = scale;
    mirrors.forEach((m) => { m.bulbUniforms.uScale.value = scale; });
    fog.resize(w, h);
  }
  new ResizeObserver(resize).observe(stage);
  resize();

  const tmp = {
    pos: new THREE.Vector3(), look: new THREE.Vector3(), up: new THREE.Vector3(),
    m: new THREE.Matrix4(), q: new THREE.Quaternion(), q2: new THREE.Quaternion(), q3: new THREE.Quaternion(),
    euler: new THREE.Euler(),
    a: { p: new THREE.Vector3(), t: new THREE.Vector3(), n: new THREE.Vector3(), b: new THREE.Vector3() },
    c: { p: new THREE.Vector3(), t: new THREE.Vector3(), n: new THREE.Vector3(), b: new THREE.Vector3() },
    v: new THREE.Vector3(),
  };
  // Framed with the logo above centre, leaving room for the welcome underneath.
  const FINAL_POS = new THREE.Vector3(LOGO.x, LOGO.y - 2.4, LOGO.z + 17);
  const FINAL_LOOK = new THREE.Vector3(LOGO.x, LOGO.y - 2.4, LOGO.z);
  const finalQ = new THREE.Quaternion().setFromRotationMatrix(
    new THREE.Matrix4().lookAt(FINAL_POS, FINAL_LOOK, new THREE.Vector3(0, 1, 0)),
  );
  // Off to one side and above, watching the ribbon stream past into the stroke.
  const WIDE_POS = new THREE.Vector3(LOGO.x + 22, LOGO.y + 7, LOGO.z + 24);
  const wideQ = new THREE.Quaternion().setFromRotationMatrix(
    new THREE.Matrix4().lookAt(WIDE_POS, new THREE.Vector3(LOGO.x - 3, LOGO.y - 2, LOGO.z + 13), new THREE.Vector3(0, 1, 0)),
  );
  let darkStage = false;
  let activeStop = -1;
  let rideSeen = false;

  function start() {
    if (running) return;
    running = true;
    clock.getDelta();
    requestAnimationFrame(tick);
  }

  function tick() {
    if (!visible) { running = false; return; }
    requestAnimationFrame(tick);
    const dt = Math.min(clock.getDelta(), 0.05);
    const time = clock.elapsedTime;

    progress += (target - progress) * (1 - Math.exp(-dt * 5));
    const p = progress;
    if (revealed) introClock = Math.min(1, introClock + dt / 1.6);

    const q = clamp((p - P_RIDE) / (P_FINALE - P_RIDE), 0, 1);
    const u = rideU(q);
    const fin = smooth(P_FINALE, 0.868, p);   // the camera leaves the track and pulls back wide
    const reel = smoother(smooth(0.855, 0.95, p)); // the ribbon runs off the end and into the swoosh
    const draw = smooth(0.915, 0.97, p);      // the A's legs
    const settle = smooth(0.93, 0.985, p);    // and the camera eases round to face the logo
    const story = p < P_FINALE ? u : U_END + (1.55 - U_END) * smooth(P_FINALE, 0.99, p);
    const portrait = camera.aspect < 0.9;

    speed = lerp(speed, (Math.abs(u - lastU) * LENGTH) / Math.max(dt, 1e-3), 1 - Math.exp(-dt * 6));
    lastU = u;

    // Air and light.
    airAt(story);
    sky.material.uniforms.uTop.value.copy(air.top);
    sky.material.uniforms.uBottom.value.copy(air.bottom);
    fogUniforms.uFogColor.value.lerpColors(air.bottom, air.top, 0.45);
    ribbon.material.uniforms.uReel.value = reel;
    ribbon.material.uniforms.uGlow.value = air.glow;
    ringMat.uniforms.uGlow.value = air.glow;
    haloMat.uniforms.uGlow.value = air.glow;
    steam.uniforms.uTime.value = time;
    steam.uniforms.uColor.value.copy(air.steam);
    steam.uniforms.uAlpha.value = air.steamAlpha * (1 - fin);
    steam.uniforms.uEmber.value = air.glow;
    legs[0].uniforms.uDraw.value = smooth(0, 0.55, draw);
    legs[1].uniforms.uDraw.value = smooth(0.3, 1, draw);

    // The rider: sitting on the ribbon, looking down the line.
    const a = frameAt(u, tmp.a);
    tmp.pos.copy(a.p).addScaledVector(a.n, CAM_H);
    const c = frameAt(Math.min(1, u + 7 / LENGTH), tmp.c);
    tmp.look.copy(c.p).addScaledVector(c.n, CAM_H * 0.85);
    tmp.up.copy(a.n);

    // Turn your head a little toward a mirror as you pass it, and with the pointer.
    let headTurn = 0;
    let lookAtMirror = null;
    mirrors.forEach((m) => {
      const w = smooth(m.u - 0.06, m.u - 0.01, u) * (1 - smooth(m.u + 0.006, m.u + 0.03, u));
      if (w > headTurn) { headTurn = w; lookAtMirror = m.group.position; }
    });
    if (lookAtMirror) tmp.look.lerp(lookAtMirror, headTurn * (portrait ? 0.5 : 0.3));
    pointer.x += (pointer.tx - pointer.x) * (1 - Math.exp(-dt * 3));
    pointer.y += (pointer.ty - pointer.y) * (1 - Math.exp(-dt * 3));
    tmp.look.addScaledVector(a.b, pointer.x * 1.4).addScaledVector(a.n, -pointer.y * 0.8);

    // Before the ride: a slow breath on the platform.
    const idle = 1 - smooth(0, P_RIDE, p);
    tmp.pos.y += Math.sin(time * 0.8) * 0.12 * idle;

    tmp.m.lookAt(tmp.pos, tmp.look, tmp.up);
    tmp.q.setFromRotationMatrix(tmp.m);

    // The finish: the car stops and the camera eases back to face the logo as it forms.
    if (fin > 0) {
      const e = smoother(fin);
      tmp.pos.lerp(WIDE_POS, e);
      tmp.q.slerp(wideQ, e);
      if (settle > 0) {
        const s = smoother(settle);
        tmp.pos.lerp(FINAL_POS, s);
        const fq = tmp.q2.copy(finalQ);
        if (finePointer) {
          fq.multiply(tmp.q3.setFromEuler(tmp.euler.set(pointer.y * -0.05, pointer.x * -0.08, 0)));
          tmp.pos.x += pointer.x * 1.2 * s;
          tmp.pos.y -= pointer.y * 0.6 * s;
        }
        tmp.q.slerp(fq, s);
      }
    }
    camera.position.copy(tmp.pos);
    camera.quaternion.copy(tmp.q);
    sky.position.copy(tmp.pos);

    // Speed opens the field of view; the ride feels faster than it scrolls.
    const baseFov = portrait ? 70 : 55;
    const fov = baseFov + clamp((speed - 6) * 0.35, 0, 16) * (1 - fin);
    if (Math.abs(camera.fov - fov) > 0.01) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }

    // Mirrors: placed ahead of each stop, beside the track, and swung open as you near.
    // Placed from where the rider sits at the stop, so the track's curves never push one off screen.
    const ahead = portrait ? 15 : 13;
    const offset = portrait ? 2.6 : 4.6;
    mirrors.forEach((m) => {
      const f = frameAt(m.u, tmp.c);
      tmp.v.copy(f.p).addScaledVector(f.n, CAM_H);
      m.group.position.copy(tmp.v)
        .addScaledVector(f.t, ahead)
        .addScaledVector(f.b, offset * m.side)
        .addScaledVector(f.n, m.h * 0.5 - 0.4);
      m.group.up.copy(f.n);
      m.group.lookAt(tmp.v);
      const open = smooth(m.u - 0.07, m.u - 0.025, u);
      m.pivot.rotation.y = (1 - smoother(open)) * 1.35 * m.side;
      m.pivot.scale.setScalar(0.75 + 0.25 * open);
      m.uniforms.uOpacity.value = smooth(m.u - 0.09, m.u - 0.05, u) * (1 - fin);
      m.bulbUniforms.uLit.value = smooth(m.u - 0.05, m.u - 0.012, u);
      m.bulbUniforms.uTime.value = time;
      m.uniforms.uGlint.value = lerp(-0.4, 1.8, smooth(m.u - 0.03, m.u + 0.03, u));
      m.group.visible = m.uniforms.uOpacity.value > 0.001;
    });

    fog.tick();
    renderer.render(scene, camera);

    // Overlays.
    const intro = (1 - smooth(0.004, 0.035, p)) * introClock;
    stage.style.setProperty('--intro', intro.toFixed(3));
    stage.style.setProperty('--fog', (1 - smooth(0.0, 0.04, p)).toFixed(3));
    stage.style.setProperty('--go', (smooth(0.03, 0.05, p) * (1 - smooth(0.07, 0.09, p))).toFixed(3));
    stage.style.setProperty('--hud', (smooth(0.03, 0.06, p) * (1 - smooth(P_FINALE - 0.02, P_FINALE + 0.01, p))).toFixed(3));
    const end = smooth(0.94, 0.985, p);
    stage.style.setProperty('--end', end.toFixed(3));
    endEl.classList.toggle('is-shown', end > 0.002);
    const nowGone = p > 0.04;
    if (nowGone !== fogGone) {
      fogGone = nowGone;
      stage.classList.toggle('is-clear', fogGone);
    }

    let current = -1;
    mirrors.forEach((m, i) => {
      const v = smooth(m.u - 0.042, m.u - 0.016, u) * (1 - smooth(m.u + 0.006, m.u + 0.026, u)) * (1 - fin);
      stopEls[i]?.style.setProperty('--v', v.toFixed(3));
      stopEls[i]?.classList.toggle('is-shown', v > 0.002);
      if (u > m.u - 0.045) current = i;
    });
    if (current !== activeStop) {
      activeStop = current;
      lineDots.forEach((dot, i) => {
        dot.classList.toggle('is-past', i < current);
        dot.classList.toggle('is-current', i === current);
      });
    }

    const dark = (air.top.r + air.top.g + air.top.b) / 3 < 0.45;
    if (dark !== darkStage) {
      darkStage = dark;
      stage.classList.toggle('is-dark', dark);
    }

    if (!rideSeen && p > 0.95) {
      rideSeen = true;
      try { sessionStorage.setItem(RIDE_KEY, '1'); } catch (e) { /* storage unavailable */ }
    }
  }

  visible = st.isActive || section.getBoundingClientRect().top < innerHeight;
  start();
}
