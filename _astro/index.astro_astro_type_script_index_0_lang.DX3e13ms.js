function e(e,t,n){let r=e.createShader(t);return r?(e.shaderSource(r,n),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS)?r:(console.error(e.getShaderInfoLog(r)),null)):null}function t(t){let n=t.getContext(`webgl2`,{antialias:!1,alpha:!1,powerPreference:`high-performance`});if(!n)return null;let r=e(n,n.VERTEX_SHADER,`#version 300 es
void main() {
  vec2 p = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`),i=e(n,n.FRAGMENT_SHADER,`#version 300 es
precision highp float;

out vec4 fragColor;

uniform vec2 uRes;
uniform float uDpr;
uniform float uTime;
uniform vec4 uObj;
uniform float uChaos;
uniform vec3 uMorph;
uniform float uElec;
uniform float uLevel;
uniform float uSurface;
uniform vec4 uDrops[14];

const vec3 ABYSS = vec3(0.012, 0.012, 0.020);
const vec3 TRENCH = vec3(0.004, 0.071, 0.161);
const vec3 DEEP = vec3(0.004, 0.212, 0.333);
const vec3 CURRENT = vec3(0.012, 0.353, 0.494);
const vec3 TIDE = vec3(0.078, 0.612, 0.757);
const vec3 SPARK = vec3(0.243, 0.796, 0.914);
const vec3 FOAM = vec3(0.914, 0.984, 1.0);
const vec3 SURFACE = vec3(0.918, 0.969, 0.984);

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1, 0)), f.x),
    mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x),
    f.y
  );
}

// Thin lines of light, the way sun lines move on a pool floor.
float caustic(vec2 uv, float t, float sharp) {
  const float TAU = 6.2831853;
  vec2 p = mod(uv * TAU, TAU) - 250.0;
  vec2 i = p;
  float c = 1.0;
  const float inten = 0.005;
  for (int n = 0; n < 5; n++) {
    float tt = t * (1.0 - 3.5 / float(n + 1));
    i = p + vec2(cos(tt - i.x) + sin(tt + i.y), sin(tt - i.y) + cos(tt + i.x));
    c += 1.0 / length(vec2(p.x / (sin(i.x + tt) / inten), p.y / (cos(i.y + tt) / inten)));
  }
  c /= 5.0;
  c = 1.17 - pow(c, 1.4);
  return clamp(pow(abs(c), sharp), 0.0, 1.0);
}

// Rings from the cursor. xy pushes the water, z lights the ring.
vec3 ripples(vec2 px) {
  vec3 o = vec3(0.0);
  for (int i = 0; i < 14; i++) {
    vec4 d = uDrops[i];
    if (d.w <= 0.0) continue;
    vec2 v = px - d.xy;
    float r = length(v) + 1.0;
    float front = d.z * 420.0;
    float env = exp(-d.z * 1.9) * exp(-abs(r - front) * 0.014);
    float w = sin((r - front) * 0.05) * env * d.w;
    o.xy += (v / r) * w;
    o.z += abs(w);
  }
  o.xy *= 0.03;
  return o;
}

vec3 deepWater(vec2 uv, vec3 rip, float t) {
  float low = noise(uv * 1.3 + t * 0.03);
  vec3 col = mix(ABYSS, TRENCH, smoothstep(0.15, 0.95, low) * 0.85);
  float speed = mix(0.1, 0.3, uChaos);
  float sharp = mix(13.0, 10.0, uChaos);
  float c = caustic(uv * 1.5 + rip.xy, t * speed, sharp);
  float c2 = caustic(uv * 0.85 - rip.xy + 3.1, t * speed * 0.7, sharp + 5.0);
  float mask = smoothstep(0.3, 0.74, noise(uv * 1.1 - t * 0.05));
  col += mix(TIDE, SPARK, c) * min(c, 0.8) * 0.95 * uElec * (0.14 + 0.86 * mask);
  col += TIDE * min(c2, 0.7) * uElec * 0.32 * (1.0 - mask * 0.8);
  col += CURRENT * pow(noise(uv * 1.8 + t * 0.06), 3.0) * uElec * 0.42;
  col += TIDE * rip.z * 0.42;
  return col;
}

float sdBox(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

float sdGear(vec2 p) {
  float a = atan(p.y, p.x) + uTime * 0.1;
  float s = cos(a * 9.0);
  float R = 0.76 + 0.17 * smoothstep(-0.3, 0.3, s);
  return max(length(p) - R, 0.3 - length(p));
}

float sdTruck(vec2 p) {
  vec2 back = vec2(-0.46, 0.44);
  vec2 front = vec2(0.52, 0.44);
  float box = sdBox(p - vec2(-0.26, -0.14), vec2(0.6, 0.44), 0.07);
  float cab = sdBox(p - vec2(0.6, 0.04), vec2(0.27, 0.26), 0.1);
  float glass = sdBox(p - vec2(0.66, -0.05), vec2(0.13, 0.1), 0.03);
  float axle = min(length(p - back), length(p - front));
  float body = max(max(min(box, cab), -glass), 0.27 - axle);
  return min(body, max(axle - 0.22, 0.08 - axle));
}

float sdBoxes(vec2 p) {
  float a = sdBox(p - vec2(-0.42, 0.42), vec2(0.38), 0.07);
  float b = sdBox(p - vec2(0.42, 0.42), vec2(0.38), 0.07);
  float c = sdBox(p - vec2(0.0, -0.4), vec2(0.38), 0.07);
  return min(min(a, b), c);
}

float sdCourt(vec2 p) {
  float d1 = p.y + 0.38;
  float d2 = (-0.92 + 0.56 * abs(p.x) - p.y) * 0.87;
  float roof = max(d1, d2);
  float base = sdBox(p - vec2(0.0, 0.74), vec2(0.92, 0.12), 0.05);
  float cols = min(
    sdBox(vec2(abs(p.x) - 0.56, p.y - 0.15), vec2(0.13, 0.42), 0.04),
    sdBox(p - vec2(0.0, 0.15), vec2(0.13, 0.42), 0.04)
  );
  return min(min(roof, base), cols);
}

float sdShield(vec2 p) {
  float y = clamp(p.y / 0.98, 0.0, 1.0);
  float w = 0.76 * sqrt(max(1.0 - y * y, 0.0));
  float d = (abs(p.x) - w) * 0.8;
  return max(d, max(-0.84 - p.y, p.y - 0.9)) - 0.04;
}

float sdCalc(vec2 p) {
  float body = sdBox(p, vec2(0.64, 0.92), 0.14);
  float screen = sdBox(p - vec2(0.0, -0.54), vec2(0.45, 0.2), 0.05);
  vec2 q = p - vec2(0.0, 0.26);
  vec2 id = clamp(round(q / 0.33), vec2(-1.0), vec2(1.0));
  float key = sdBox(q - id * 0.33, vec2(0.1), 0.03);
  return max(max(body, -screen), -key);
}

float sdOrb(vec2 p) {
  float a = atan(p.y, p.x);
  float t = uTime * 0.7;
  float wob = sin(a * 7.0 + t) * 0.5 + sin(a * 11.0 - t * 1.3) * 0.3 + sin(a * 17.0 + t * 0.6) * 0.2;
  return length(p) - 1.0 + wob * 0.03 * uChaos * smoothstep(0.3, 0.92, length(p));
}

#ifdef BAKE
float sdCrate(vec2 p) {
  float outer = sdBox(p, vec2(0.9, 0.78), 0.08);
  float inner = sdBox(p, vec2(0.7, 0.58), 0.03);
  float frame = max(outer, -inner);
  vec2 n = normalize(vec2(0.58, 0.7));
  float brace = min(abs(dot(p, n)), abs(dot(p, vec2(n.x, -n.y)))) - 0.078;
  return min(frame, max(brace, inner - 0.02));
}

float sdBucket(vec2 p) {
  p.y -= 0.12;
  p /= 0.94;
  float w = mix(0.74, 0.5, clamp((p.y + 0.3) / 1.2, 0.0, 1.0));
  float body = max(abs(p.x) - w, max(-0.3 - p.y, p.y - 0.9)) * 0.92 - 0.05;
  float rim = sdBox(p - vec2(0.0, -0.32), vec2(0.86, 0.1), 0.05);
  float arc = max(abs(length(p - vec2(0.0, -0.32)) - 0.76) - 0.06, p.y + 0.32);
  return min(min(body, rim), arc);
}

float sdClip(vec2 p) {
  float board = sdBox(p - vec2(0.0, 0.06), vec2(0.68, 0.86), 0.1);
  float clip = sdBox(p - vec2(0.0, -0.8), vec2(0.32, 0.15), 0.07);
  vec2 q = p - vec2(0.0, 0.14);
  float row = clamp(round(q.y / 0.32), -1.0, 1.0);
  float line = sdBox(q - vec2(0.0, row * 0.32), vec2(0.42, 0.055), 0.03);
  return min(max(board, -line), clip);
}

float sdWheel(vec2 p) {
  float r = length(p);
  float ring = abs(r - 0.8) - 0.14;
  float hub = r - 0.27;
  float bar = max(abs(p.y + 0.04) - 0.095, abs(p.x) - 0.8);
  float stem = max(abs(p.x) - 0.095, max(-p.y, p.y - 0.8));
  return min(ring, min(hub, min(bar, stem)));
}

float sdKey(vec2 p) {
  const float A = 0.785;
  p = mat2(cos(A), -sin(A), sin(A), cos(A)) * p;
  vec2 h = p - vec2(-0.56, 0.0);
  float head = max(length(h) - 0.42, 0.17 - length(h));
  float shaft = sdBox(p - vec2(0.3, 0.0), vec2(0.62, 0.095), 0.03);
  float tooth = min(sdBox(p - vec2(0.62, 0.2), vec2(0.075, 0.14), 0.02), sdBox(p - vec2(0.84, 0.2), vec2(0.075, 0.14), 0.02));
  return min(head, min(shaft, tooth));
}
#endif

float sdShape(float s, vec2 p) {
#ifdef BAKE
  if (s > 6.5 && s < 7.5) return sdCrate(p);
  if (s > 7.5 && s < 8.5) return sdBucket(p);
  if (s > 8.5 && s < 9.5) return sdClip(p);
  if (s > 9.5 && s < 10.5) return sdWheel(p);
  if (s > 10.5) return sdKey(p);
#endif
  if (s < 0.5) return sdOrb(p);
  if (s < 1.5) return sdGear(p);
  if (s < 2.5) return sdTruck(p);
  if (s < 3.5) return sdBoxes(p);
  if (s < 4.5) return sdCourt(p);
  if (s < 5.5) return sdShield(p);
  return sdCalc(p);
}

float sdObject(vec2 p) {
  float m = uMorph.z;
  float d = mix(sdShape(uMorph.x, p), sdShape(uMorph.y, p), m);
  d += 4.0 * m * (1.0 - m) * 0.07 * sin(p.x * 6.0 + uTime * 2.0) * sin(p.y * 5.0 - uTime * 1.7);
  return d;
}

float folds(vec2 p, float t, float amt) {
  for (int i = 1; i <= 4; i++) {
    float f = float(i);
    p += amt * vec2(sin(p.y * 1.5 * f + t * 0.9 + f * 1.7), sin(p.x * 1.3 * f - t * 0.8 + f * 2.3)) / (f + 0.5);
  }
  return 0.5 + 0.5 * sin(2.3 * p.x + 1.5 * p.y + t * 0.25);
}

vec3 ramp(float h) {
  vec3 c = mix(mix(TRENCH, DEEP, 0.6), CURRENT, smoothstep(0.0, 0.34, h));
  c = mix(c, TIDE, smoothstep(0.3, 0.62, h));
  return mix(c, SPARK, smoothstep(0.6, 0.92, h));
}

// The logo's calm side: dark above, bright below, one smooth wave.
vec3 calmBody(vec2 rp, float t, vec3 n) {
  float wave = 0.09 * sin(rp.x * 1.7 + 0.5 + t * 0.4) - 0.26 * rp.x + 0.08;
  float s = rp.y - wave;
  float below = smoothstep(-0.015, 0.03, s);
  vec3 top = mix(CURRENT, DEEP, smoothstep(-1.0, 0.1, -rp.y) * 0.55);
  vec3 low = mix(TIDE * 0.72, TIDE, smoothstep(0.0, 0.9, s));
  low = mix(low, SPARK, smoothstep(0.62, 1.05, rp.y + rp.x * 0.35));
  vec3 c = mix(top, low, below);
  float taper = smoothstep(-1.0, 0.8, rp.x);
  float band = exp(-abs(s - 0.012) * 90.0) + 0.75 * exp(-abs(s + 0.05 * taper) * 60.0 / (0.35 + taper))
    + 0.5 * exp(-abs(s + 0.11 * taper) * 70.0 / (0.25 + taper));
  return c + SPARK * band * (0.35 + 0.65 * taper) * 0.8;
}

vec4 shade(vec2 p, float size, float t) {
  float d = sdObject(p);
  float aa = 1.4 / size;
  float alpha = smoothstep(aa, -aa, d);
  if (alpha <= 0.0) return vec4(0.0);

  const float E = 0.004;
  vec2 g = vec2(sdObject(p + vec2(E, 0.0)) - d, sdObject(p + vec2(0.0, E)) - d);
  g /= length(g) + 1e-5;

  float m = uMorph.z;
  float bevA = uMorph.x < 0.5 ? 1.0 : 0.3;
  float bevB = uMorph.y < 0.5 ? 1.0 : 0.3;
  float bevel = mix(bevA, bevB, m);
  float k = 1.0 - clamp(-d / bevel, 0.0, 1.0);
  // Round shapes light from their true curve, so the wobbly edge can't streak the glass.
  vec2 sg = normalize(mix(g, p / (length(p) + 1e-4), smoothstep(0.35, 0.95, bevel)));
  vec3 n = normalize(vec3(sg * k, sqrt(max(1.0 - k * k, 1e-3))));

  vec2 rp = p + n.xy * 0.34 * k;
  vec2 fp = rp * 1.18 + vec2(0.3, -0.2);
  float amt = 0.92;
  const float S = 0.02;
  float h = folds(fp, t, amt);
  float hx = folds(fp + vec2(S, 0.0), t, amt);
  float hy = folds(fp + vec2(0.0, S), t, amt);
  vec2 slope = vec2(h - hx, h - hy) / S;
  vec3 nf = normalize(n + vec3(slope * 0.16, 0.0));

  vec3 L = normalize(vec3(-0.55, -0.64, 0.54));
  vec3 L2 = normalize(vec3(0.62, 0.5, 0.6));
  vec3 H = normalize(L + vec3(0.0, 0.0, 1.0));
  vec3 H2 = normalize(L2 + vec3(0.0, 0.0, 1.0));
  float dif = max(dot(nf, H), 0.0);
  float spec = pow(dif, 170.0) + 0.55 * pow(max(dot(nf, H2), 0.0), 90.0);
  float sheen = pow(dif, 14.0);
  float steep = smoothstep(0.6, 3.4, length(slope));

  float hs = smoothstep(0.08, 0.92, h);
  vec3 churn = mix(mix(TRENCH, DEEP, 0.8), CURRENT, hs);
  churn = mix(churn, TIDE, smoothstep(0.52, 0.96, hs));

  // Crisp sheet edges, the way folded liquid catches light.
  float e1 = exp(-abs(h - 0.5) * 44.0);
  float e2 = exp(-abs(h - 0.76) * 66.0);
  float e3 = exp(-abs(h - 0.26) * 66.0);
  churn += SPARK * (e1 * 0.85 + e2 * 0.5) + TIDE * e3 * 0.55;
  churn += SPARK * steep * 0.16;
  churn += FOAM * spec * 1.3 + SPARK * sheen * 0.14;
  churn += FOAM * caustic(rp * 1.1 + 1.7, t * 0.5, 30.0) * 0.22;

  vec3 still = calmBody(rp, t, n);

  vec3 c = mix(still, churn, uChaos);
  c *= mix(0.62, 1.05, smoothstep(0.05, 0.9, n.z));

  // Thick glass: a dark band just inside a thin bright rim.
  c *= 1.0 - 0.5 * smoothstep(0.55, 0.88, k) * (1.0 - smoothstep(0.9, 0.985, k));
  c += mix(SPARK, FOAM, 0.35) * pow(k, 26.0) * 0.82;

  // A crescent of window light high on the left.
  vec2 dir = n.xy / (length(n.xy) + 1e-4);
  float gate = smoothstep(0.76, 0.985, dot(dir, normalize(vec2(-0.62, -0.78))));
  float band = smoothstep(0.66, 0.8, k) * smoothstep(0.975, 0.87, k);
  c = mix(c, FOAM, gate * band * 0.92);
  float gate2 = smoothstep(0.82, 0.98, dot(dir, normalize(vec2(0.7, 0.72))));
  c += SPARK * gate2 * smoothstep(0.6, 0.8, k) * smoothstep(0.98, 0.9, k) * 0.45;
  return vec4(c, alpha);
}

#ifdef BAKE
void main() {
  vec2 px = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y);
#ifdef PANEL
  vec2 uv = (px - 0.5 * uRes) / uRes.y * 0.7;
  float g = smoothstep(-0.5, 0.6, uv.x * 0.7 - uv.y * 0.9 + 0.3 * noise(uv * 1.2));
  fragColor = vec4(mix(TRENCH, mix(DEEP, CURRENT, g), g) + deepWater(uv, vec3(0.0), uTime) * 0.8, 1.0);
#else
  float size = uRes.y * 0.46;
  fragColor = shade((px - 0.5 * uRes) / size, size, uTime * 0.5);
#endif
}
#else
void main() {
  vec2 res = uRes / uDpr;
  vec2 px = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y) / uDpr;
  vec2 uv = (px - 0.5 * res) / res.y;
  float t = uTime;
  vec3 rip = ripples(px);

  vec3 col = deepWater(uv, rip, t);

  if (uLevel > 0.0) {
    float y = mix(0.66, -0.74, uLevel) + 0.022 * sin(uv.x * 3.1 + t * 0.6) + 0.012 * sin(uv.x * 7.3 - t * 0.9) + rip.y;
    float d = uv.y - y;
    float body = smoothstep(-0.0016, 0.0016, d);
    vec3 w = mix(CURRENT, DEEP, smoothstep(0.0, 0.8, d));
    float c = caustic(uv * 0.7 + rip.xy + vec2(0.0, t * 0.02), t * 0.2, 9.0);
    w += SPARK * c * 0.5 * exp(-d * 1.4);
    w += SPARK * exp(-d * 18.0) * 0.55;
    col = mix(col, w, body);
    col += FOAM * exp(-abs(d) * 260.0) * 0.85;
    col += TIDE * exp(-abs(d) * 14.0) * (1.0 - body) * 0.3;
  }

  if (uSurface > 0.0) {
    float y = mix(0.7, -0.8, uSurface) + 0.03 * sin(uv.x * 2.2 - t * 0.5) + 0.014 * sin(uv.x * 5.7 + t * 0.8) + rip.y;
    float d = uv.y - y;
    float body = smoothstep(-0.0016, 0.0016, d);
    float c = caustic(uv * 0.75 + rip.xy, t * 0.1, 10.0);
    vec3 s = SURFACE + vec3(-0.05, -0.012, 0.0) * c * 0.5;
    s -= vec3(0.09, 0.04, 0.02) * rip.z * 0.4;
    s = mix(s, mix(SPARK, FOAM, 0.55), exp(-max(d, 0.0) * 20.0) * (1.0 - smoothstep(0.92, 1.0, uSurface)));
    col = mix(col, s, body);
    col += FOAM * exp(-abs(d) * 200.0) * 0.5 * (1.0 - body);
  }

  if (uObj.w > 0.002) {
    vec2 p = (px - uObj.xy) / uObj.z;
    p += rip.xy * 2.2 / (uObj.z / res.y);
    float dist = sdObject(p);
    float ambient = exp(-max(dist, 0.0) * 2.6);
    float dark = 1.0 - uSurface;
    col += TIDE * ambient * 0.12 * dark * uObj.w;
    col *= 1.0 - 0.14 * uSurface * uObj.w * exp(-length(vec2(p.x, (p.y - 1.12) * 3.2)) * 1.7);
    if (length(p) < 2.2) {
      vec4 o = shade(p, uObj.z, t * 0.5);
      col = mix(col, o.rgb, o.a * uObj.w);
    }
  }

  float grain = hash(gl_FragCoord.xy * 0.73 + fract(t) * 91.0) - 0.5;
  fragColor = vec4(col + grain * 0.011, 1.0);
}
#endif
`),a=n.createProgram();if(!r||!i||!a)return null;if(n.attachShader(a,r),n.attachShader(a,i),n.linkProgram(a),!n.getProgramParameter(a,n.LINK_STATUS))return console.error(n.getProgramInfoLog(a)),null;n.useProgram(a),n.bindVertexArray(n.createVertexArray());let o=e=>n.getUniformLocation(a,e),s={res:o(`uRes`),dpr:o(`uDpr`),time:o(`uTime`),obj:o(`uObj`),chaos:o(`uChaos`),morph:o(`uMorph`),elec:o(`uElec`),level:o(`uLevel`),surface:o(`uSurface`),drops:o(`uDrops`)},c={obj:[0,0,1,0],chaos:1,morph:[0,0,0],elec:1,level:0,surface:0},l=new URLSearchParams(location.search).has(`hq`),u=Math.min(window.devicePixelRatio||1,1.5),d=0,f=0,p=()=>{let e=t.clientWidth,r=t.clientHeight,i=Math.min(u,Math.sqrt(23e5/Math.max(e*r,1))),a=Math.round(e*i),o=Math.round(r*i);(a!==d||o!==f)&&(d=a,f=o,t.width=a,t.height=o,n.viewport(0,0,a,o))};new ResizeObserver(p).observe(t),p();let m=[],h=new Float32Array(56),g=0,_=16,v=0;return{state:c,drop(e,t,n){m.push({x:e,y:t,born:performance.now()/1e3,strength:n}),m.length>14&&m.shift()},render(e){if(!l&&g){let t=Math.min((e-g)*1e3,200);_+=(t-_)*.05,v=_>40?v+t:0,v>1100&&u>.55&&(u*=.8,v=0,_=24,p())}g=e;let r=performance.now()/1e3;for(;m.length&&r-m[0].born>3;)m.shift();h.fill(0),m.forEach((e,t)=>{h.set([e.x,e.y,r-e.born,e.strength],t*4)}),n.uniform2f(s.res,d,f),n.uniform1f(s.dpr,d/Math.max(t.clientWidth,1)),n.uniform1f(s.time,e),n.uniform4f(s.obj,...c.obj),n.uniform1f(s.chaos,c.chaos),n.uniform3f(s.morph,...c.morph),n.uniform1f(s.elec,c.elec),n.uniform1f(s.level,c.level),n.uniform1f(s.surface,c.surface),n.uniform4fv(s.drops,h),n.drawArrays(n.TRIANGLES,0,3)}}}var n=[{label:`Accounting firms`,logo:`calc`,shape:6},{label:`Law firms`,logo:`court`,shape:4},{label:`Manufacturers`,logo:`gear`,shape:1},{label:`Service companies`,logo:`truck`,shape:2},{label:`Distributors`,logo:`boxes`,shape:3},{label:`Insurance agencies`,logo:`shield`,shape:5}],r=2600;function i(e){let t=document.querySelector(`.kinds`),i=t?.querySelector(`[data-kind-now]`);if(!t||!i)return;let a=t.querySelector(`.poster-shape`),o=[...t.querySelectorAll(`[data-kind]`)],s=0,c=!1;new IntersectionObserver(([e])=>c=e.isIntersecting,{threshold:.15}).observe(t),window.setInterval(()=>{if(!c||document.hidden)return;let t=n[s];s=(s+1)%n.length;let r=n[s];i.classList.add(`swap`),window.setTimeout(()=>{i.textContent=r.label,i.classList.remove(`swap`)},170),o.forEach((e,t)=>e.classList.toggle(`on`,t===s));let l=o[s].querySelector(`img`);a&&l&&(a.src=l.src),e(r.shape,t.shape)},r)}var a=[`·`,`∙`,`•`,`⠂`,`⠆`,`⠇`,`⠧`,`⠿`],o=8,s=()=>a[Math.floor(Math.random()*a.length)];function c(e,t){let n=new Set,r=e.firstChild;if(!(r instanceof Text))return n;let i=document.createRange(),a=null;for(let e=0;e<t.length;e+=1){if(e>0&&!/\s/.test(t[e-1])||/\s/.test(t[e]))continue;i.setStart(r,e),i.setEnd(r,e+1);let o=i.getBoundingClientRect().top;a!==null&&o>a+2&&n.add(e),a=o}return n}function l(e){let t=e.textContent??``,n=performance.now(),r=Math.min(window.innerWidth<821?850:1500,460+t.length*22),i=c(e,t),a=document.createDocumentFragment(),l=[];[...t].forEach((e,t)=>{if(/\s/.test(e)){a.append(e);return}i.has(t)&&a.append(document.createElement(`br`));let n=document.createElement(`span`);n.className=`rz`,n.textContent=e,l.push(n),a.append(n)}),e.setAttribute(`aria-label`,t),e.style.whiteSpace=`nowrap`,e.replaceChildren(a),e.classList.add(`shown`);let u=0,d=0,f=()=>{e.textContent=t,e.style.whiteSpace=``,e.removeAttribute(`aria-label`)},p=t=>{if(e.classList.contains(`swap`)||!e.contains(l[0])){e.style.whiteSpace=``,e.removeAttribute(`aria-label`);return}let i=Math.floor((t-n)/r*l.length);if(i>=l.length)return f();for(;u<i;u+=1)l[u].className=`rz on`,l[u].removeAttribute(`data-g`);if(d+=1,d%2==0)for(let e=i;e<Math.min(i+o,l.length);e+=1)l[e].className=`rz dot`,l[e].dataset.g=s();requestAnimationFrame(p)};requestAnimationFrame(p)}function u(e){let t=[...document.querySelectorAll(`.reveal`)];if(e){t.forEach(e=>e.classList.add(`shown`));return}let n=new IntersectionObserver(e=>{e.forEach(e=>{if(!e.isIntersecting)return;n.unobserve(e.target);let t=e.target,r=Number(t.dataset.delay??0)*(window.innerWidth<821?.6:1);window.setTimeout(()=>l(t),r)})},{threshold:.4}),r=new Promise(e=>window.setTimeout(e,900));Promise.race([document.fonts.ready,r]).then(()=>t.forEach(e=>n.observe(e)))}var d=document.documentElement,f=window.matchMedia(`(prefers-reduced-motion: reduce)`).matches,p=navigator.connection?.saveData===!0,m=(e,t=0,n=1)=>Math.min(n,Math.max(t,e)),h=(e,t,n)=>{let r=m((n-e)/(t-e));return r*r*(3-2*r)},g=e=>document.querySelector(e),_=g(`#water`),v=null;f&&d.classList.add(`still`);function y(){_&&!f&&!p&&(d.classList.add(`gl`),v=t(_),v||d.classList.remove(`gl`)),v||d.classList.add(`no-gl`)}var b={a:n[0].shape,b:n[0].shape,m:1},x=0;u(f),requestAnimationFrame(()=>window.setTimeout(y,60));var S=g(`.bars`);if(S&&f&&S.classList.add(`in`),S&&!f){let e=new IntersectionObserver(([t])=>{t.isIntersecting&&(S.classList.add(`in`),e.disconnect())},{threshold:.35});e.observe(S)}f||i((e,t)=>{b.a=t,b.b=e,b.m=0,x=performance.now()});var C=g(`.hero-slot`),w=g(`.shape-slot`),T=g(`.calm-slot`),E=[...document.querySelectorAll(`.sheet`)],D=e=>E.some(t=>{let n=t.getBoundingClientRect();return n.top<=0&&n.bottom>=e});function O(){let e=E.filter(e=>{let t=e.getBoundingClientRect();return t.top<40&&t.bottom>40}),t=e[e.length-1],n=g(`.calm`)?.getBoundingClientRect().top??1/0;d.classList.toggle(`bright`,t?t.classList.contains(`sheet-light`):n<40)}var k=e=>e.top+e.height/2,A=(e,t)=>Math.min(e.width,e.height)*t;function j(){if(O(),!v||!C||!w||!T)return;let e=window.innerHeight,t=v.state,n=T.getBoundingClientRect(),r=n.top<e*1.5;if(t.level=+!!r,t.surface=+!!r,t.elec=.42,r){t.obj=[n.left+n.width/2,k(n),A(n,.47),h(e*1.02,e*.72,k(n))],t.morph=[0,0,0],t.chaos=0;return}let i=C.getBoundingClientRect(),a=h(e*.05,e*.35,k(i));if(a>0){t.obj=[i.left+i.width/2,k(i),A(i,.46),a],t.morph=[0,0,0],t.chaos=.5;return}let o=w.getBoundingClientRect(),s=h(e*.95,e*.6,k(o)),c=1-h(e*.12,-e*.12,k(o));b.m<1&&(b.m=m((performance.now()-x)/950)),t.obj=[o.left+o.width/2,k(o),A(o,.46)*(.72+.28*s),s*c],t.morph=s<1?[0,b.b,s]:[b.a,b.b,h(0,1,b.m)],t.chaos=.5}function M(e){j(),D(window.innerHeight)||v?.render(e/1e3),requestAnimationFrame(M)}f?(window.addEventListener(`scroll`,O,{passive:!0}),O()):requestAnimationFrame(M);