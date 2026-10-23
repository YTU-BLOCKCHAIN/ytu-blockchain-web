/**
 * Sticker'ları holografik + simli vinil olarak çizen WebGL sahnesi
 * (Three.js + custom shader). Dokular `assets.ts`'de hazırlanır.
 *
 * - Fragment shader: laminat parlaması, bakış açısına göre renk değiştiren
 *   holo foil ve her biri ayrı açıda duran glitter pulları.
 * - Vertex shader: sticker kenarından soyulabiliyor (peel: katlama
 *   çizgisinden sonrası bir silindirin etrafından dolanıp üstüne yatar);
 *   hızlı çevrilince de hafifçe esniyor (bend).
 * - Etkileşim: imleç sticker'ı yay (spring) fiziğiyle eğer. Kenardan
 *   tutup çekmek soyar; yarıdan fazla soyulan sticker çıkar ve yerine
 *   sıradaki yapışır. Ortadan tutup fırlatınca döner ve öne bakarak yerine
 *   oturur. `go()` ile geçişte de sticker yandan soyulup çıkar.
 *
 * `three` ağır olduğu için bu modül yalnızca istemcide, dinamik import ile
 * yüklenir (bkz. `landing-sticker.tsx`).
 */
import {
  DoubleSide,
  Mesh,
  PerspectiveCamera,
  Plane,
  PlaneGeometry,
  Raycaster,
  Scene,
  ShaderMaterial,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three';

import { loadSticker, type StickerAsset } from './assets';
import { STICKERS } from './list';

const PEEL_RADIUS = 0.11;

const VERT = /* glsl */ `
  uniform float uBend;       // esneme miktarı (dönme hızından gelir)
  uniform vec2 uBendDir;     // esnemenin yönü, düzlemde birim vektör
  uniform float uEdge;       // merkezden die-cut kenarına uzaklık
  uniform float uPeel;       // katlama çizgisinin kenardan ne kadar içeri girdiği
  uniform vec2 uPeelDir;     // merkezden soyulan kenara doğru birim vektör
  uniform float uPeelRadius; // kıvrımın yarıçapı

  varying vec2 vUv;
  varying vec3 vViewPos;
  varying vec3 vNormal;
  varying vec3 vTangent;
  varying vec3 vBitangent;
  varying float vPeelS;

  void main() {
    vUv = uv;
    vec3 p = position;
    // z = k * s^2 : sticker'ın dönme yönünde hafif bir kavis
    float sb = dot(p.xy, uBendDir);
    p.z += uBend * sb * sb;
    vec2 grad = 2.0 * uBend * sb * uBendDir;
    vec3 T = normalize(vec3(1.0, 0.0, grad.x));
    vec3 B = normalize(vec3(0.0, 1.0, grad.y));

    // Soyma: katlama çizgisini geçen kısım yarıçapı uPeelRadius olan bir
    // silindirin etrafından dolanıp sticker'ın üstüne geri yatar.
    float fold = uEdge - uPeel;
    float s = dot(p.xy, uPeelDir) - fold;
    vPeelS = uPeel > 0.0 ? s : -10.0;
    if (uPeel > 0.0 && s > 0.0) {
      float R = uPeelRadius;
      float th = s / R;
      float along;
      vec3 t;
      if (th < 3.14159265) {
        along = fold + R * sin(th);
        p.z += R * (1.0 - cos(th));
        t = vec3(cos(th) * uPeelDir, sin(th));
      } else {
        along = fold - (s - 3.14159265 * R);
        p.z += 2.0 * R;
        t = vec3(-uPeelDir, 0.0);
      }
      p.xy += (along - dot(p.xy, uPeelDir)) * uPeelDir;
      // Düzlemin x/y eksenlerini (katlama yönü, ona dik yön) tabanında yaz
      vec3 e = vec3(-uPeelDir.y, uPeelDir.x, 0.0);
      T = uPeelDir.x * t - uPeelDir.y * e;
      B = uPeelDir.y * t + uPeelDir.x * e;
    }

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vViewPos = mv.xyz;
    vNormal = normalMatrix * normalize(cross(T, B));
    vTangent = normalMatrix * T;
    vBitangent = normalMatrix * B;
    gl_Position = projectionMatrix * mv;
  }
`;

const FRAG = /* glsl */ `
  uniform sampler2D uMap;
  uniform sampler2D uFx;
  uniform vec2 uTexel;
  uniform vec2 uLight;   // imleç ışıkları biraz kaydırır
  uniform float uTime;
  uniform float uAlpha;
  uniform vec2 uAspect;  // düzlem boyu / 2, glitter hücreleri kare kalsın

  varying vec2 vUv;
  varying vec3 vViewPos;
  varying vec3 vNormal;
  varying vec3 vTangent;
  varying vec3 vBitangent;
  varying float vPeelS;

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  vec3 rainbow(float x) {
    return 0.5 + 0.5 * cos(6.2831853 * (x + vec3(0.0, 0.33, 0.67)));
  }

  void main() {
    vec4 base = texture2D(uMap, vUv);
    if (base.a < 0.02) discard;
    vec3 fx = texture2D(uFx, vUv).rgb;

    vec3 N = normalize(vNormal);
    vec3 T = normalize(vTangent);
    vec3 B = normalize(vBitangent);
    vec3 V = normalize(-vViewPos);

    // Arka yüz: soyulmuş liner kağıdı gibi düz, mat beyaz
    if (!gl_FrontFacing) {
      N = -N;
      float d = max(dot(N, normalize(vec3(-0.4, 0.6, 1.0))), 0.0);
      float a = base.a * uAlpha;
      gl_FragColor = vec4(vec3(0.86, 0.86, 0.84) * (0.55 + 0.45 * d) * a, a);
      return;
    }

    // Kabartma: mürekkep ve sim zeminden biraz yüksekte
    float hx = texture2D(uFx, vUv + vec2(uTexel.x, 0.0)).b - texture2D(uFx, vUv - vec2(uTexel.x, 0.0)).b;
    float hy = texture2D(uFx, vUv + vec2(0.0, uTexel.y)).b - texture2D(uFx, vUv - vec2(0.0, uTexel.y)).b;
    vec3 Nb = normalize(N - (T * hx + B * hy) * 1.4);

    // Işıklar: sol üstte büyük softbox, sağda şerit ışık
    vec3 L1 = normalize(vec3(-0.55 + uLight.x * 0.6, 0.65 + uLight.y * 0.5, 0.9));
    vec3 L2 = normalize(vec3(0.9, -0.2 + uLight.y * 0.3, 0.6));

    float diff = 0.62 + 0.38 * max(dot(Nb, L1), 0.0);
    vec3 col = base.rgb * diff;

    // Holo foil: renk, yüzey normali ve bakış açısıyla kayar
    float ndv = max(dot(Nb, V), 0.0);
    float hue = dot(Nb.xy, vec2(1.3, 0.9)) + (vUv.x * 0.6 + vUv.y * 0.35) + (1.0 - ndv) * 0.8 + uTime * 0.015;
    vec3 holo = rainbow(hue);
    float holoSpec = pow(max(dot(reflect(-L1, Nb), V), 0.0), 6.0);
    float holoAmt = fx.r * (0.45 + 0.55 * holoSpec);
    col = mix(col, holo * (0.75 + 0.5 * holoSpec) , holoAmt);

    // Glitter: her hücrede rastgele açıda bir pul, ışığı yakalayınca parlar
    vec2 cellUv = vUv * uAspect * 190.0;
    vec2 cell = floor(cellUv);
    vec2 f = fract(cellUv) - 0.5;
    float r1 = hash(cell);
    float r2 = hash(cell + 17.1);
    float r3 = hash(cell + 31.7);
    vec2 jit = vec2(r1, r2) - 0.5;
    float flake = 1.0 - smoothstep(0.28, 0.42, length(f - jit * 0.2));
    vec3 Ng = normalize(Nb + (T * (r1 - 0.5) + B * (r2 - 0.5)) * 1.3);
    float sp1 = pow(max(dot(reflect(-L1, Ng), V), 0.0), 40.0);
    float sp2 = pow(max(dot(reflect(-L2, Ng), V), 0.0), 40.0);
    float sparkle = (sp1 + 0.7 * sp2) * flake * fx.g;
    vec3 flakeCol = mix(vec3(1.0), rainbow(r3 + hue * 0.5), 0.55);
    col += flakeCol * sparkle * 2.2;
    col += flakeCol * flake * fx.g * 0.08;

    // Laminat: tüm yüzeyde ince, keskin bir parlama
    vec3 H1 = normalize(L1 + V);
    vec3 H2 = normalize(L2 + V);
    float spec = pow(max(dot(Nb, H1), 0.0), 90.0) * 0.55 + pow(max(dot(Nb, H2), 0.0), 60.0) * 0.25;
    float fres = pow(1.0 - ndv, 4.0) * 0.18;
    col += vec3(spec + fres);

    // Kalkan kısmın dibine düşen yumuşak gölge
    if (vPeelS < 0.0) col *= 1.0 - 0.35 * (1.0 - smoothstep(0.0, 0.22, -vPeelS));

    // Canvas premultiplied alpha bekliyor
    float a = base.a * uAlpha;
    gl_FragColor = vec4(clamp(col, 0.0, 1.0) * a, a);
  }
`;

const SHADOW_FRAG = /* glsl */ `
  uniform sampler2D uShadow;
  uniform float uOpacity;
  varying vec2 vUv;
  void main() {
    float a = texture2D(uShadow, vUv).a * uOpacity;
    gl_FragColor = vec4(0.0, 0.0, 0.0, a);
  }
`;

const SHADOW_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

type Spring = { x: number; v: number };
function stepSpring(
  s: Spring,
  target: number,
  k: number,
  c: number,
  dt: number,
) {
  s.v += (k * (target - s.x) - c * s.v) * dt;
  s.x += s.v * dt;
}

export type StickerScene = {
  /** Önceki (-1) / sonraki (+1) sticker'a geç. */
  go(delta: number): void;
  goTo(index: number): void;
  dispose(): void;
};

export async function createStickerScene(
  canvas: HTMLCanvasElement,
  {
    reducedMotion = false,
    onChange,
  }: { reducedMotion?: boolean; onChange?: (index: number) => void } = {},
): Promise<StickerScene> {
  // İlk sticker hazır olunca başla, diğerleri arkada yüklensin
  const assets: (StickerAsset | undefined)[] = [];
  let disposed = false;
  assets[0] = await loadSticker(STICKERS[0]!);
  STICKERS.slice(1).forEach((def, i) => {
    loadSticker(def)
      .then((a) => {
        if (disposed) a.dispose();
        else assets[i + 1] = a;
      })
      .catch(() => {});
  });

  const renderer = new WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
  });
  renderer.setClearColor(0x000000, 0);

  const scene = new Scene();
  const camera = new PerspectiveCamera(28, 1, 0.1, 20);
  camera.position.set(0, 0, 4.4);

  const first = assets[0];
  const uniforms = {
    uMap: { value: first.map },
    uFx: { value: first.fx },
    uTexel: { value: first.texel.clone() },
    uAspect: { value: first.size.clone().multiplyScalar(0.5) },
    uLight: { value: new Vector2() },
    uTime: { value: 0 },
    uAlpha: { value: 1 },
    uBend: { value: 0 },
    uBendDir: { value: new Vector2(1, 0) },
    uEdge: { value: 1 },
    uPeel: { value: 0 },
    uPeelDir: { value: new Vector2(Math.SQRT1_2, Math.SQRT1_2) },
    uPeelRadius: { value: PEEL_RADIUS },
  };
  const sticker = new Mesh(
    new PlaneGeometry(2, 2, 1, 1),
    new ShaderMaterial({
      uniforms,
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      premultipliedAlpha: true,
      side: DoubleSide,
    }),
  );
  scene.add(sticker);

  const shadowUniforms = {
    uShadow: { value: first.shadow },
    uOpacity: { value: 0.3 },
  };
  const shadow = new Mesh(
    new PlaneGeometry(2, 2),
    new ShaderMaterial({
      uniforms: shadowUniforms,
      vertexShader: SHADOW_VERT,
      fragmentShader: SHADOW_FRAG,
      transparent: true,
      premultipliedAlpha: true,
      depthWrite: false,
    }),
  );
  shadow.position.z = -0.6;
  shadow.renderOrder = -1;
  scene.add(shadow);

  let current = 0;
  let asset = first;
  function showAsset(i: number) {
    const a = assets[i]!;
    current = i;
    asset = a;
    const { x: w, y: h } = a.size;
    sticker.geometry.dispose();
    sticker.geometry = new PlaneGeometry(
      w,
      h,
      Math.round(64 * w),
      Math.round(64 * h),
    );
    uniforms.uMap.value = a.map;
    uniforms.uFx.value = a.fx;
    uniforms.uTexel.value.copy(a.texel);
    uniforms.uAspect.value.copy(a.size).multiplyScalar(0.5);
    shadow.geometry.dispose();
    // Gölge dokusu her kenarda %12 boşluk bırakıyor
    shadow.geometry = new PlaneGeometry(w * 1.24, h * 1.24);
    shadowUniforms.uShadow.value = a.shadow;
  }
  showAsset(0);

  // --- Etkileşim durumu ---
  const rotX: Spring = { x: 0, v: 0 };
  const rotY: Spring = { x: 0, v: 0 };
  const scale: Spring = { x: 1, v: 0 };
  const pointer = { nx: 0, ny: 0, active: false };
  const drag = {
    on: false,
    mode: 'spin' as 'spin' | 'peel',
    id: -1,
    x: 0,
    y: 0,
    moved: 0,
    lastT: 0,
  };
  let restY = 0; // bırakılınca öne bakan en yakın tam tur

  // Soyma durumu. `rest`: yapışık (hover'da kenar hafifçe kalkar),
  // `drag`: kenardan tutulmuş, `off`: bırakıldı ve tamamen soyuluyor,
  // `gone`: soyulan sticker uçup gidiyor, ardından sıradaki yapışıyor.
  const peel = {
    mode: 'rest' as 'rest' | 'drag' | 'off' | 'gone',
    amt: { x: 0, v: 0 } as Spring,
    target: 0,
    dir: new Vector2(Math.SQRT1_2, Math.SQRT1_2),
    targetDir: new Vector2(Math.SQRT1_2, Math.SQRT1_2),
    edge: new Vector2(), // tutulan kenar noktası (sticker düzleminde)
    offset: new Vector2(), // imleç ile kenar noktası arasındaki fark
    goneT: 0,
    spawnT: 1,
  };
  let pending: number | null = null; // soyulan sticker'ın yerine gelecek
  let hoverEdge = false;
  let teaserT = reducedMotion ? Infinity : -0.9; // ilk görünümde kısa bir ipucu

  const fullPeel = () =>
    asset.support(peel.dir.x, peel.dir.y) +
    asset.support(-peel.dir.x, -peel.dir.y) +
    Math.PI * PEEL_RADIUS;

  // İmleci sticker düzlemine (yerel koordinatlara) izdüşürür
  const raycaster = new Raycaster();
  const plane = new Plane();
  const hit = new Vector3();
  const ndc = new Vector2();
  const local = new Vector2();
  function toLocal(nx: number, ny: number, out: Vector2) {
    ndc.set(nx, ny);
    raycaster.setFromCamera(ndc, camera);
    sticker.updateMatrixWorld();
    plane.setFromNormalAndCoplanarPoint(
      hit.set(0, 0, 1).applyQuaternion(sticker.quaternion),
      sticker.position,
    );
    if (!raycaster.ray.intersectPlane(plane, hit)) return false;
    sticker.worldToLocal(hit);
    out.set(hit.x, hit.y);
    return true;
  }

  /** Nokta, tutulup soyulabilecek kenar bandında mı? */
  // Kenar bandı merkezden değil en yakın kenar noktasından ölçülür; kedinin
  // kolu gibi girintili şekillerde de kenardan tutulabilsin
  const nearest = new Vector2();
  function onEdge(v: Vector2) {
    const d = asset.nearestEdge(v.x, v.y, nearest);
    return asset.contains(v.x, v.y) ? d < 0.24 : d < 0.08;
  }

  function setPointer(e: PointerEvent) {
    const r = canvas.getBoundingClientRect();
    pointer.nx = ((e.clientX - r.left) / r.width) * 2 - 1;
    pointer.ny = -(((e.clientY - r.top) / r.height) * 2 - 1);
    // Sticker'ın biraz dışında da tepki versin
    pointer.active = Math.abs(pointer.nx) < 1.6 && Math.abs(pointer.ny) < 1.6;
  }

  function updatePeelTarget() {
    if (!toLocal(pointer.nx, pointer.ny, local)) return;
    // Kenar noktası imleçle birlikte hareket eder; katlama çizgisi kenar
    // noktası ile imlecin ortasından geçen dik çizgidir (kağıt katlar gibi).
    const px = local.x + peel.offset.x;
    const py = local.y + peel.offset.y;
    const dx = peel.edge.x - px;
    const dy = peel.edge.y - py;
    const len = Math.hypot(dx, dy);
    const inward =
      (dx * peel.edge.x + dy * peel.edge.y) /
      Math.max(peel.edge.length(), 1e-6);
    if (len < 1e-4 || inward < 0.02) {
      // Dışarı çekiliyor: kenar yalnızca hafifçe kalksın
      peel.targetDir.copy(peel.edge).normalize();
      peel.target = 0.06;
      return;
    }
    peel.targetDir.set(dx / len, dy / len);
    const mid =
      ((peel.edge.x + px) / 2) * peel.targetDir.x +
      ((peel.edge.y + py) / 2) * peel.targetDir.y;
    const edge = asset.support(peel.targetDir.x, peel.targetDir.y);
    peel.target = Math.min(Math.max(edge - mid, 0.06), fullPeel());
  }

  function onMove(e: PointerEvent) {
    setPointer(e);
    if (drag.on && e.pointerId === drag.id) {
      const now = performance.now();
      const dt = Math.max((now - drag.lastT) / 1000, 1 / 240);
      const dx = e.clientX - drag.x;
      const dy = e.clientY - drag.y;
      drag.moved += Math.abs(dx) + Math.abs(dy);
      if (drag.mode === 'spin') {
        rotY.x += dx * 0.012;
        rotX.x += dy * 0.008;
        rotY.v = (dx * 0.012) / dt;
        rotX.v = (dy * 0.008) / dt;
      } else {
        updatePeelTarget();
      }
      drag.x = e.clientX;
      drag.y = e.clientY;
      drag.lastT = now;
      return;
    }
    if (peel.mode !== 'rest') return;
    hoverEdge =
      pointer.active && toLocal(pointer.nx, pointer.ny, local) && onEdge(local);
    if (hoverEdge) peel.targetDir.copy(nearest).normalize();
  }

  function onDown(e: PointerEvent) {
    setPointer(e);
    if (peel.mode === 'off' || peel.mode === 'gone') return;
    drag.on = true;
    drag.id = e.pointerId;
    drag.x = e.clientX;
    drag.y = e.clientY;
    drag.moved = 0;
    drag.lastT = performance.now();
    try {
      canvas.setPointerCapture(e.pointerId);
    } catch {}
    canvas.style.cursor = 'grabbing';
    teaserT = Infinity;

    if (toLocal(pointer.nx, pointer.ny, local) && onEdge(local)) {
      drag.mode = 'peel';
      peel.mode = 'drag';
      asset.nearestEdge(local.x, local.y, peel.edge);
      peel.offset.copy(peel.edge).sub(local);
      peel.dir.copy(peel.edge).normalize();
      updatePeelTarget();
    } else {
      drag.mode = 'spin';
      scale.v -= 1.2;
    }
  }

  function onUp(e: PointerEvent) {
    if (!drag.on || e.pointerId !== drag.id) return;
    drag.on = false;
    canvas.style.cursor = '';
    if (drag.mode === 'peel') {
      // Yarıdan fazla soyulduysa tamamen çıksın ve sıradaki gelsin,
      // yoksa geri yapışsın
      if (peel.amt.x > fullPeel() * 0.45) {
        pending ??= (current + 1) % STICKERS.length;
        onChange?.(pending);
        peel.mode = 'off';
      } else {
        peel.mode = 'rest';
        peel.target = 0;
      }
      return;
    }
    // Fırlatma hızına göre birkaç tur dönüp öne bakarak dursun
    const projected = rotY.x + rotY.v * 0.35;
    restY = Math.round(projected / (Math.PI * 2)) * Math.PI * 2;
    // Sürüklemeden tıklandıysa küçük bir "boop"
    if (drag.moved < 6) scale.v += 3.5;
    else scale.v += 1.2;
  }

  function onLeave() {
    pointer.active = false;
    hoverEdge = false;
  }

  window.addEventListener('pointermove', onMove, { passive: true });
  canvas.addEventListener('pointerdown', onDown);
  window.addEventListener('pointerup', onUp);
  window.addEventListener('pointercancel', onUp);
  document.documentElement.addEventListener('pointerleave', onLeave);

  // --- Boyut ---
  function resize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  // --- Döngü (ekranda değilken durur) ---
  let raf = 0;
  let last = performance.now();
  let t = 0;
  let slideDir = 1; // butonla geçişte soyulacak taraf

  function stepPeel(dt: number) {
    if (peel.mode === 'rest') {
      canvas.style.cursor = drag.on ? 'grabbing' : hoverEdge ? 'grab' : '';
      peel.target = hoverEdge ? 0.09 : 0;
      // Butonla geçiş: sticker yandan soyulup çıkar
      if (pending !== null && !drag.on) {
        peel.mode = 'off';
        peel.targetDir.set(slideDir, 0.35).normalize();
        peel.dir.copy(peel.targetDir);
        peel.amt.x = Math.max(peel.amt.x, 0.02);
      }
      // İlk görünümde köşe bir kez kalkıp geri yapışır: "soyulabilirim" ipucu
      else if (teaserT < 1.2) {
        teaserT += dt;
        if (teaserT > 0 && teaserT < 0.75) {
          peel.targetDir.set(0.55, 0.83).normalize();
          peel.target = 0.5;
        }
      }
    }

    const dirRate = peel.mode === 'drag' ? 0.35 : 0.15;
    peel.dir.lerp(peel.targetDir, dirRate).normalize();

    if (peel.mode === 'drag') stepSpring(peel.amt, peel.target, 500, 38, dt);
    else if (peel.mode === 'off')
      stepSpring(peel.amt, fullPeel() + 0.5, 90, 11, dt);
    else if (peel.mode === 'rest') {
      stepSpring(peel.amt, peel.target, 220, 13, dt);
      // Geri yapışırken yüzeyden aşağı geçmesin; küçük bir "şap" sekmesi
      if (peel.amt.x < 0) {
        peel.amt.x = 0;
        peel.amt.v = -peel.amt.v * 0.25;
      }
    }

    if (peel.mode === 'off' && peel.amt.x >= fullPeel()) {
      peel.mode = 'gone';
      peel.goneT = 0;
    }

    if (peel.mode === 'gone') {
      // Tamamen soyulan sticker savrulup kaybolur
      peel.goneT += dt;
      const k = Math.min(peel.goneT / 0.4, 1);
      sticker.position.set(
        -peel.dir.x * k * 1.2,
        -peel.dir.y * k * 1.2 + k * k * 0.8,
        k * 1.1,
      );
      uniforms.uAlpha.value = 1 - k;
      const next = pending ?? current;
      // Sıradaki henüz yüklenmediyse görünmez halde bekle
      if (k >= 1 && assets[next]) {
        pending = null;
        showAsset(next);
        onChange?.(next);
        peel.mode = 'rest';
        peel.amt.x = peel.amt.v = 0;
        peel.target = 0;
        hoverEdge = false;
        sticker.position.set(0, 0, 0);
        scale.x = 1.35;
        scale.v = 0;
        peel.spawnT = 0;
      }
    } else if (peel.spawnT < 1) {
      peel.spawnT = Math.min(peel.spawnT + dt / 0.18, 1);
      uniforms.uAlpha.value = peel.spawnT;
    }

    uniforms.uPeel.value = Math.max(peel.amt.x, 0);
    uniforms.uPeelDir.value.copy(peel.dir);
    uniforms.uEdge.value = asset.support(peel.dir.x, peel.dir.y);
  }

  function frame(now: number) {
    raf = requestAnimationFrame(frame);
    const dt = Math.min((now - last) / 1000, 1 / 30);
    last = now;
    t += dt;

    const idle = reducedMotion ? 0 : 1;
    // Soyarken sticker'ı az eğ ki imleç kenarın altında kalsın
    const tilt = drag.on && drag.mode === 'peel' ? 0.3 : 1;
    const tx = pointer.active
      ? -pointer.ny * 0.16 * tilt
      : Math.sin(t * 0.7) * 0.12 * idle;
    const ty = pointer.active
      ? pointer.nx * 0.2 * tilt
      : Math.sin(t * 0.5 + 1.3) * 0.18 * idle;

    if (!drag.on || drag.mode === 'peel') {
      stepSpring(rotX, tx, 90, 9, dt);
      stepSpring(rotY, restY + ty, 60, 5.5, dt);
    }
    stepSpring(scale, 1, 260, 14, dt);

    sticker.rotation.set(rotX.x, rotY.x, 0, 'YXZ');
    sticker.scale.setScalar(scale.x);

    stepPeel(dt);

    // Dönme hızı sticker'ı esnetir
    const w = Math.hypot(rotX.v, rotY.v);
    const bendTarget = Math.min(w * 0.012, 0.16);
    uniforms.uBend.value += (bendTarget - uniforms.uBend.value) * 0.2;
    if (w > 0.05) uniforms.uBendDir.value.set(rotY.v, rotX.v).normalize();

    uniforms.uLight.value.set(
      pointer.active ? pointer.nx : Math.sin(t * 0.3) * 0.3 * idle,
      pointer.active ? pointer.ny : 0,
    );
    uniforms.uTime.value = t;

    // Gölge eğime göre kayar ve dönerken incelir
    shadow.position.x = 0.12 + Math.sin(rotY.x) * 0.35;
    shadow.position.y = -0.14 - Math.sin(rotX.x) * 0.3;
    shadow.scale.set(
      Math.max(Math.abs(Math.cos(rotY.x)), 0.08) * scale.x,
      Math.max(Math.abs(Math.cos(rotX.x)), 0.08) * scale.x,
      1,
    );
    shadowUniforms.uOpacity.value = 0.3 * uniforms.uAlpha.value;

    renderer.render(scene, camera);
  }

  function start() {
    if (raf) return;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  }
  function stop() {
    cancelAnimationFrame(raf);
    raf = 0;
  }

  const io = new IntersectionObserver(([entry]) => {
    if (entry?.isIntersecting) start();
    else stop();
  });
  io.observe(canvas);
  start();

  function goTo(index: number, dir?: number) {
    const n = STICKERS.length;
    const i = ((index % n) + n) % n;
    const from = pending ?? current;
    if (i === from) return;
    slideDir = dir ?? (i > from ? 1 : -1);
    pending = i;
    teaserT = Infinity;
    onChange?.(i);
  }

  return {
    go(delta) {
      goTo((pending ?? current) + delta, Math.sign(delta));
    },
    goTo(index) {
      goTo(index);
    },
    dispose() {
      disposed = true;
      stop();
      io.disconnect();
      ro.disconnect();
      window.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      for (const a of assets) a?.dispose();
      sticker.geometry.dispose();
      (sticker.material as ShaderMaterial).dispose();
      shadow.geometry.dispose();
      (shadow.material as ShaderMaterial).dispose();
      renderer.dispose();
    },
  };
}
