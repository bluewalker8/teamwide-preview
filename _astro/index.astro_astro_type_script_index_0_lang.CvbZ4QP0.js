var e=`1.3.27`;function t(e,t,n){return Math.max(e,Math.min(t,n))}function n(e,t,n){return(1-n)*e+n*t}function r(e,t,r,i){return n(e,t,1-Math.exp(-r*i))}function i(e,t){return(e%t+t)%t}var a=class{isRunning=!1;value=0;from=0;to=0;currentTime=0;lerp;duration;easing;onUpdate;advance(e){if(!this.isRunning)return;let n=!1;if(this.duration&&this.easing){this.currentTime+=e;let r=t(0,this.currentTime/this.duration,1);n=r>=1;let i=n?1:this.easing(r);this.value=this.from+(this.to-this.from)*i}else this.lerp?(this.value=r(this.value,this.to,this.lerp*60,e),Math.round(this.value)===Math.round(this.to)&&(this.value=this.to,n=!0)):(this.value=this.to,n=!0);n&&this.stop(),this.onUpdate?.(this.value,n)}stop(){this.isRunning=!1}fromTo(e,t,{lerp:n,duration:r,easing:i,onStart:a,onUpdate:o}){this.from=this.value=e,this.to=t,this.lerp=n,this.duration=r,this.easing=i,this.currentTime=0,this.isRunning=!0,a?.(),this.onUpdate=o}};function o(e,t){let n;return function(...r){clearTimeout(n),n=setTimeout(()=>{n=void 0,e.apply(this,r)},t)}}var s=class{width=0;height=0;scrollHeight=0;scrollWidth=0;debouncedResize;wrapperResizeObserver;contentResizeObserver;constructor(e,t,{autoResize:n=!0,debounce:r=250}={}){this.wrapper=e,this.content=t,n&&(this.debouncedResize=o(this.resize,r),this.wrapper instanceof Window?window.addEventListener(`resize`,this.debouncedResize):(this.wrapperResizeObserver=new ResizeObserver(this.debouncedResize),this.wrapperResizeObserver.observe(this.wrapper)),this.contentResizeObserver=new ResizeObserver(this.debouncedResize),this.contentResizeObserver.observe(this.content)),this.resize()}destroy(){this.wrapperResizeObserver?.disconnect(),this.contentResizeObserver?.disconnect(),this.wrapper===window&&this.debouncedResize&&window.removeEventListener(`resize`,this.debouncedResize)}resize=()=>{this.onWrapperResize(),this.onContentResize()};onWrapperResize=()=>{this.wrapper instanceof Window?(this.width=window.innerWidth,this.height=window.innerHeight):(this.width=this.wrapper.clientWidth,this.height=this.wrapper.clientHeight)};onContentResize=()=>{this.wrapper instanceof Window?(this.scrollHeight=this.content.scrollHeight,this.scrollWidth=this.content.scrollWidth):(this.scrollHeight=this.wrapper.scrollHeight,this.scrollWidth=this.wrapper.scrollWidth)};get limit(){return{x:this.scrollWidth-this.width,y:this.scrollHeight-this.height}}},c=class{events={};emit(e,...t){let n=this.events[e]||[];for(let e=0,r=n.length;e<r;e++)n[e]?.(...t)}on(e,t){return this.events[e]?this.events[e].push(t):this.events[e]=[t],()=>{this.events[e]=this.events[e]?.filter(e=>t!==e)}}off(e,t){this.events[e]=this.events[e]?.filter(e=>t!==e)}destroy(){this.events={}}},l=100/6,u={passive:!1};function d(e,t){return e===1?l:e===2?t:1}var f=class{touchStart={x:0,y:0};lastDelta={x:0,y:0};window={width:0,height:0};emitter=new c;constructor(e,t={wheelMultiplier:1,touchMultiplier:1}){this.element=e,this.options=t,window.addEventListener(`resize`,this.onWindowResize),this.onWindowResize(),this.element.addEventListener(`wheel`,this.onWheel,u),this.element.addEventListener(`touchstart`,this.onTouchStart,u),this.element.addEventListener(`touchmove`,this.onTouchMove,u),this.element.addEventListener(`touchend`,this.onTouchEnd,u)}on(e,t){return this.emitter.on(e,t)}destroy(){this.emitter.destroy(),window.removeEventListener(`resize`,this.onWindowResize),this.element.removeEventListener(`wheel`,this.onWheel,u),this.element.removeEventListener(`touchstart`,this.onTouchStart,u),this.element.removeEventListener(`touchmove`,this.onTouchMove,u),this.element.removeEventListener(`touchend`,this.onTouchEnd,u)}onTouchStart=e=>{let{clientX:t,clientY:n}=e.targetTouches?e.targetTouches[0]:e;this.touchStart.x=t,this.touchStart.y=n,this.lastDelta={x:0,y:0},this.emitter.emit(`scroll`,{deltaX:0,deltaY:0,event:e})};onTouchMove=e=>{let{clientX:t,clientY:n}=e.targetTouches?e.targetTouches[0]:e,r=-(t-this.touchStart.x)*this.options.touchMultiplier,i=-(n-this.touchStart.y)*this.options.touchMultiplier;this.touchStart.x=t,this.touchStart.y=n,this.lastDelta={x:r,y:i},this.emitter.emit(`scroll`,{deltaX:r,deltaY:i,event:e})};onTouchEnd=e=>{this.emitter.emit(`scroll`,{deltaX:this.lastDelta.x,deltaY:this.lastDelta.y,event:e})};onWheel=e=>{let{deltaX:t,deltaY:n,deltaMode:r}=e,i=d(r,this.window.width),a=d(r,this.window.height);t*=i,n*=a,t*=this.options.wheelMultiplier,n*=this.options.wheelMultiplier,this.emitter.emit(`scroll`,{deltaX:t,deltaY:n,event:e})};onWindowResize=()=>{this.window={width:window.innerWidth,height:window.innerHeight}}},p=e=>Math.min(1,1.001-2**(-10*e)),m=class{_isScrolling=!1;_isStopped=!1;_isLocked=!1;_preventNextNativeScrollEvent=!1;_resetVelocityTimeout=null;_rafId=null;_isDraggingSelection=!1;reducedMotionMediaQuery=window.matchMedia(`(prefers-reduced-motion: reduce)`);isTouching;isIos;time=0;userData={};lastVelocity=0;velocity=0;direction=0;options;targetScroll;animatedScroll;animate=new a;emitter=new c;dimensions;virtualScroll;constructor({wrapper:t=window,content:n=document.documentElement,eventsTarget:r=t,smoothWheel:i=!0,syncTouch:a=!1,syncTouchLerp:o=.075,touchInertiaExponent:c=1.7,duration:l,easing:u,lerp:d=.1,infinite:m=!1,orientation:h=`vertical`,gestureOrientation:g=h===`horizontal`?`both`:`vertical`,touchMultiplier:_=1,wheelMultiplier:v=1,autoResize:y=!0,prevent:b,virtualScroll:x,overscroll:S=!0,autoRaf:C=!1,anchors:w=!1,autoToggle:T=!1,allowNestedScroll:E=!1,__experimental__naiveDimensions:ee=!1,naiveDimensions:te=ee,stopInertiaOnNavigate:ne=!1,respectReducedMotion:re=!0}={}){window.lenisVersion=e,window.lenis||(window.lenis={}),window.lenis.version=e,h===`horizontal`&&(window.lenis.horizontal=!0),a===!0&&(window.lenis.touch=!0),this.isIos=/(iPad|iPhone|iPod)/g.test(navigator.userAgent),t&&t!==document.documentElement||(t=window),typeof l==`number`&&typeof u!=`function`?u=p:typeof u==`function`&&typeof l!=`number`&&(l=1),this.options={wrapper:t,content:n,eventsTarget:r,smoothWheel:i,syncTouch:a,syncTouchLerp:o,touchInertiaExponent:c,duration:l,easing:u,lerp:d,infinite:m,gestureOrientation:g,orientation:h,touchMultiplier:_,wheelMultiplier:v,autoResize:y,prevent:b,virtualScroll:x,overscroll:S,autoRaf:C,anchors:w,autoToggle:T,allowNestedScroll:E,naiveDimensions:te,stopInertiaOnNavigate:ne,respectReducedMotion:re},this.dimensions=new s(t,n,{autoResize:y}),this.updateClassName(),this.targetScroll=this.animatedScroll=this.actualScroll,this.options.wrapper.addEventListener(`scroll`,this.onNativeScroll),this.options.wrapper.addEventListener(`scrollend`,this.onScrollEnd,{capture:!0}),(this.options.anchors||this.options.stopInertiaOnNavigate)&&this.options.wrapper.addEventListener(`click`,this.onClick),this.options.wrapper.addEventListener(`pointerdown`,this.onPointerDown),this.virtualScroll=new f(r,{touchMultiplier:_,wheelMultiplier:v}),this.virtualScroll.on(`scroll`,this.onVirtualScroll),this.options.autoToggle&&(this.checkOverflow(),this.rootElement.addEventListener(`transitionend`,this.onTransitionEnd)),this.options.autoRaf&&(this._rafId=requestAnimationFrame(this.raf))}destroy(){this.emitter.destroy(),this._resetVelocityTimeout!==null&&(clearTimeout(this._resetVelocityTimeout),this._resetVelocityTimeout=null),this.options.wrapper.removeEventListener(`scroll`,this.onNativeScroll),this.options.wrapper.removeEventListener(`scrollend`,this.onScrollEnd,{capture:!0}),this.options.wrapper.removeEventListener(`pointerdown`,this.onPointerDown),(this.options.anchors||this.options.stopInertiaOnNavigate)&&this.options.wrapper.removeEventListener(`click`,this.onClick),this.virtualScroll.destroy(),this.dimensions.destroy(),this.cleanUpClassName(),this._rafId&&cancelAnimationFrame(this._rafId)}on(e,t){return this.emitter.on(e,t)}off(e,t){return this.emitter.off(e,t)}onScrollEnd=e=>{e instanceof CustomEvent||(this.isScrolling===`smooth`||this.isScrolling===!1)&&e.stopPropagation()};dispatchScrollendEvent=()=>{this.options.wrapper.dispatchEvent(new CustomEvent(`scrollend`,{bubbles:this.options.wrapper===window,detail:{lenisScrollEnd:!0}}))};get overflow(){let e=this.isHorizontal?`overflow-x`:`overflow-y`;return getComputedStyle(this.rootElement)[e]}checkOverflow(){[`hidden`,`clip`].includes(this.overflow)?this.internalStop():this.internalStart()}onTransitionEnd=e=>{e.propertyName?.includes(`overflow`)&&e.target===this.rootElement&&this.checkOverflow()};setScroll(e){this.isHorizontal?this.options.wrapper.scrollTo({left:e,behavior:`instant`}):this.options.wrapper.scrollTo({top:e,behavior:`instant`})}onClick=e=>{let t=e.composedPath().filter(e=>e instanceof HTMLAnchorElement&&e.href).map(e=>new URL(e.href)),n=new URL(window.location.href);if(this.options.anchors){let e=t.find(e=>n.host===e.host&&n.pathname===e.pathname&&e.hash);if(e){let t=typeof this.options.anchors==`object`&&this.options.anchors?this.options.anchors:void 0,n=decodeURIComponent(e.hash);this.scrollTo(n,t);return}}this.options.stopInertiaOnNavigate&&t.some(e=>n.host===e.host&&n.pathname!==e.pathname)&&this.reset()};onPointerDown=e=>{e.button===1&&this.reset()};isTouchOnSelectionHandle(e){let t=window.getSelection();if(!t||t.isCollapsed||t.rangeCount===0)return!1;let n=e.targetTouches[0]??e.changedTouches[0];if(!n)return!1;let r=t.getRangeAt(0).getClientRects();if(r.length===0)return!1;let i=r[0],a=r[r.length-1],o=Math.hypot(n.clientX-i.left,n.clientY-i.top)<=40,s=Math.hypot(n.clientX-a.right,n.clientY-a.bottom)<=40;return o||s}onVirtualScroll=e=>{if(typeof this.options.virtualScroll==`function`&&this.options.virtualScroll(e)===!1)return;let{deltaX:t,deltaY:n,event:r}=e;if(this.emitter.emit(`virtual-scroll`,{deltaX:t,deltaY:n,event:r}),r.ctrlKey||r.lenisStopPropagation)return;let i=r.type.includes(`touch`),a=r.type.includes(`wheel`);if(i&&this.isIos&&(r.type===`touchstart`&&(this._isDraggingSelection=this.isTouchOnSelectionHandle(r)),this._isDraggingSelection)){r.type===`touchend`&&(this._isDraggingSelection=!1);return}this.isTouching=r.type===`touchstart`||r.type===`touchmove`;let o=t===0&&n===0;if(this.options.syncTouch&&i&&r.type===`touchstart`&&o&&!this.isStopped&&!this.isLocked){this.reset();return}let s=this.options.gestureOrientation===`vertical`&&n===0||this.options.gestureOrientation===`horizontal`&&t===0;if(o||s)return;let c=r.composedPath();c=c.slice(0,c.indexOf(this.rootElement));let l=this.options.prevent,u=Math.abs(t)>=Math.abs(n)?`horizontal`:`vertical`;if(c.find(e=>e instanceof HTMLElement&&(typeof l==`function`&&l?.(e)||e.hasAttribute?.(`data-lenis-prevent`)||u===`vertical`&&e.hasAttribute?.(`data-lenis-prevent-vertical`)||u===`horizontal`&&e.hasAttribute?.(`data-lenis-prevent-horizontal`)||i&&e.hasAttribute?.(`data-lenis-prevent-touch`)||a&&e.hasAttribute?.(`data-lenis-prevent-wheel`)||this.options.allowNestedScroll&&this.hasNestedScroll(e,{deltaX:t,deltaY:n}))))return;if(this.isStopped||this.isLocked){r.cancelable&&r.preventDefault();return}if(!(this.options.syncTouch&&i||this.options.smoothWheel&&a)){this.isScrolling=`native`,this.animate.stop(),r.lenisStopPropagation=!0;return}let d=n;this.options.gestureOrientation===`both`?d=Math.abs(n)>Math.abs(t)?n:t:this.options.gestureOrientation===`horizontal`&&(d=t),(!this.options.overscroll||this.options.infinite||this.options.wrapper!==window&&this.limit>0&&(this.animatedScroll>0&&this.animatedScroll<this.limit||this.animatedScroll===0&&n>0||this.animatedScroll===this.limit&&n<0))&&(r.lenisStopPropagation=!0),r.cancelable&&r.preventDefault();let f=i&&this.options.syncTouch,p=i&&r.type===`touchend`;p&&(d=Math.sign(d)*Math.abs(this.velocity)**this.options.touchInertiaExponent),this.scrollTo(this.targetScroll+d,{programmatic:!1,...f?{lerp:p?this.options.syncTouchLerp:1}:{lerp:this.options.lerp,duration:this.options.duration,easing:this.options.easing}})};resize(){this.dimensions.resize(),this.animatedScroll=this.targetScroll=this.actualScroll,this.emit()}emit(){this.emitter.emit(`scroll`,this)}onNativeScroll=()=>{if(this._resetVelocityTimeout!==null&&(clearTimeout(this._resetVelocityTimeout),this._resetVelocityTimeout=null),this._preventNextNativeScrollEvent)this._preventNextNativeScrollEvent=!1;else if(this.isScrolling===!1||this.isScrolling===`native`){let e=this.animatedScroll;this.animatedScroll=this.targetScroll=this.actualScroll,this.lastVelocity=this.velocity,this.velocity=this.animatedScroll-e,this.direction=Math.sign(this.animatedScroll-e),this.isStopped||(this.isScrolling=`native`),this.emit(),this.velocity!==0&&(this._resetVelocityTimeout=setTimeout(()=>{this.lastVelocity=this.velocity,this.velocity=0,this.isScrolling=!1,this.emit()},400))}};reset(){this.isLocked=!1,this.isScrolling=!1,this.animatedScroll=this.targetScroll=this.actualScroll,this.lastVelocity=this.velocity=0,this.animate.stop()}start(){this.isStopped&&(this.options.autoToggle?this.rootElement.style.removeProperty(`overflow`):this.internalStart())}internalStart(){this.isStopped&&(this.reset(),this.isStopped=!1,this.emit())}stop(){this.isStopped||(this.options.autoToggle?this.rootElement.style.setProperty(`overflow`,`clip`):this.internalStop())}internalStop(){this.isStopped||(this.reset(),this.isStopped=!0,this.emit())}raf=e=>{let t=e-(this.time||e);this.time=e,this.animate.advance(t*.001),this.options.autoRaf&&(this._rafId=requestAnimationFrame(this.raf))};scrollTo(e,{offset:n=0,immediate:r=!1,lock:i=!1,programmatic:a=!0,lerp:o=a?this.options.lerp:void 0,duration:s=a?this.options.duration:void 0,easing:c=a?this.options.easing:void 0,onStart:l,onComplete:u,force:d=!1,userData:f}={}){if(this.prefersReducedMotion&&(a?r=!0:(o=1,s=void 0,c=void 0)),(this.isStopped||this.isLocked)&&!d)return;let m=e,h=n;if(typeof m==`string`&&[`top`,`left`,`start`,`#`].includes(m))m=0;else if(typeof m==`string`&&[`bottom`,`right`,`end`].includes(m))m=this.limit;else{let e=null;if(typeof m==`string`?(e=m.startsWith(`#`)?document.getElementById(m.slice(1)):document.querySelector(m),e||(m===`#top`?m=0:console.warn(`Lenis: Target not found`,m))):m instanceof Element&&(e=m),e){if(this.options.wrapper!==window){let e=this.rootElement.getBoundingClientRect();h-=this.isHorizontal?e.left:e.top}let t=e.getBoundingClientRect(),n=getComputedStyle(e),r=this.isHorizontal?Number.parseFloat(n.scrollMarginLeft):Number.parseFloat(n.scrollMarginTop),i=getComputedStyle(this.rootElement),a=this.isHorizontal?Number.parseFloat(i.scrollPaddingLeft):Number.parseFloat(i.scrollPaddingTop);m=(this.isHorizontal?t.left:t.top)+this.animatedScroll-(Number.isNaN(r)?0:r)-(Number.isNaN(a)?0:a)}}if(typeof m==`number`){if(m+=h,this.options.infinite){if(a){this.targetScroll=this.animatedScroll=this.scroll;let e=m-this.animatedScroll;e>this.limit/2?m-=this.limit:e<-this.limit/2&&(m+=this.limit)}}else m=t(0,m,this.limit);m===this.targetScroll?(l?.(this),u?.(this)):(this.userData=f??{},r?(this.animatedScroll=this.targetScroll=m,this.setScroll(this.scroll),this.reset(),this.preventNextNativeScrollEvent(),this.emit(),u?.(this),this.userData={},requestAnimationFrame(()=>{this.dispatchScrollendEvent()})):(a||(this.targetScroll=m),typeof s==`number`&&typeof c!=`function`?c=p:typeof c==`function`&&typeof s!=`number`&&(s=1),this.animate.fromTo(this.animatedScroll,m,{duration:s,easing:c,lerp:o,onStart:()=>{i&&(this.isLocked=!0),this.isScrolling=`smooth`,l?.(this)},onUpdate:(e,t)=>{this.isScrolling=`smooth`,this.lastVelocity=this.velocity,this.velocity=e-this.animatedScroll,this.direction=Math.sign(this.velocity),this.animatedScroll=e,this.setScroll(this.scroll),a&&(this.targetScroll=e),t||this.emit(),t&&(this.reset(),this.emit(),u?.(this),this.userData={},requestAnimationFrame(()=>{this.dispatchScrollendEvent()}),this.preventNextNativeScrollEvent())}})))}}preventNextNativeScrollEvent(){this._preventNextNativeScrollEvent=!0,requestAnimationFrame(()=>{this._preventNextNativeScrollEvent=!1})}hasNestedScroll(e,{deltaX:t,deltaY:n}){let r=Date.now();e._lenis||={};let i=e._lenis,a,o,s,c,l,u,d,f,p,m;if(r-(i.time??0)>2e3){i.time=Date.now();let t=window.getComputedStyle(e);if(i.computedStyle=t,a=[`auto`,`overlay`,`scroll`].includes(t.overflowX),o=[`auto`,`overlay`,`scroll`].includes(t.overflowY),l=[`auto`].includes(t.overscrollBehaviorX),u=[`auto`].includes(t.overscrollBehaviorY),i.hasOverflowX=a,i.hasOverflowY=o,!(a||o))return!1;d=e.scrollWidth,f=e.scrollHeight,p=e.clientWidth,m=e.clientHeight,s=d>p,c=f>m,i.isScrollableX=s,i.isScrollableY=c,i.scrollWidth=d,i.scrollHeight=f,i.clientWidth=p,i.clientHeight=m,i.hasOverscrollBehaviorX=l,i.hasOverscrollBehaviorY=u}else s=i.isScrollableX,c=i.isScrollableY,a=i.hasOverflowX,o=i.hasOverflowY,d=i.scrollWidth,f=i.scrollHeight,p=i.clientWidth,m=i.clientHeight,l=i.hasOverscrollBehaviorX,u=i.hasOverscrollBehaviorY;if(!(a&&s||o&&c))return!1;let h=Math.abs(t)>=Math.abs(n)?`horizontal`:`vertical`,g,_,v,y,b,x;if(h===`horizontal`)g=Math.round(e.scrollLeft),_=d-p,v=t,y=a,b=s,x=l;else if(h===`vertical`)g=Math.round(e.scrollTop),_=f-m,v=n,y=o,b=c,x=u;else return!1;return!x&&(g>=_||g<=0)||(v>0?g<_:g>0)&&y&&b}get rootElement(){return this.options.wrapper===window?document.documentElement:this.options.wrapper}get limit(){return this.options.naiveDimensions?this.isHorizontal?this.rootElement.scrollWidth-this.rootElement.clientWidth:this.rootElement.scrollHeight-this.rootElement.clientHeight:this.dimensions.limit[this.isHorizontal?`x`:`y`]}get isHorizontal(){return this.options.orientation===`horizontal`}get actualScroll(){let e=this.options.wrapper;return this.isHorizontal?e.scrollX??e.scrollLeft:e.scrollY??e.scrollTop}get scroll(){return this.options.infinite?i(this.animatedScroll,this.limit):this.animatedScroll}get progress(){return this.limit===0?1:this.scroll/this.limit}get isScrolling(){return this._isScrolling}set isScrolling(e){this._isScrolling!==e&&(this._isScrolling=e,this.updateClassName())}get isStopped(){return this._isStopped}set isStopped(e){this._isStopped!==e&&(this._isStopped=e,this.updateClassName())}get isLocked(){return this._isLocked}set isLocked(e){this._isLocked!==e&&(this._isLocked=e,this.updateClassName())}get isSmooth(){return this.isScrolling===`smooth`}get prefersReducedMotion(){return this.options.respectReducedMotion&&this.reducedMotionMediaQuery.matches}get className(){let e=`lenis`;return this.options.autoToggle&&(e+=` lenis-autoToggle`),this.isStopped&&(e+=` lenis-stopped`),this.isLocked&&(e+=` lenis-locked`),this.isScrolling&&(e+=` lenis-scrolling`),this.isScrolling===`smooth`&&(e+=` lenis-smooth`),e}updateClassName(){this.cleanUpClassName(),this.className.split(` `).forEach(e=>{this.rootElement.classList.add(e)})}cleanUpClassName(){for(let e of Array.from(this.rootElement.classList))(e===`lenis`||e.startsWith(`lenis-`))&&this.rootElement.classList.remove(e)}},h=`#version 300 es
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
`,g=`#version 300 es
void main() {
  vec2 p = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`,_=14,v=23e5;function y(e,t,n){let r=e.createShader(t);return r?(e.shaderSource(r,n),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS)?r:(console.error(e.getShaderInfoLog(r)),null)):null}function b(e){let t=e.getContext(`webgl2`,{antialias:!1,alpha:!1,powerPreference:`high-performance`});if(!t)return null;let n=y(t,t.VERTEX_SHADER,g),r=y(t,t.FRAGMENT_SHADER,h),i=t.createProgram();if(!n||!r||!i)return null;if(t.attachShader(i,n),t.attachShader(i,r),t.linkProgram(i),!t.getProgramParameter(i,t.LINK_STATUS))return console.error(t.getProgramInfoLog(i)),null;t.useProgram(i),t.bindVertexArray(t.createVertexArray());let a=e=>t.getUniformLocation(i,e),o={res:a(`uRes`),dpr:a(`uDpr`),time:a(`uTime`),obj:a(`uObj`),chaos:a(`uChaos`),morph:a(`uMorph`),elec:a(`uElec`),level:a(`uLevel`),surface:a(`uSurface`),drops:a(`uDrops`)},s={obj:[0,0,1,0],chaos:1,morph:[0,0,0],elec:1,level:0,surface:0},c=new URLSearchParams(location.search).has(`hq`),l=Math.min(window.devicePixelRatio||1,1.5),u=0,d=0,f=()=>{let n=e.clientWidth,r=e.clientHeight,i=Math.min(l,Math.sqrt(v/Math.max(n*r,1))),a=Math.round(n*i),o=Math.round(r*i);(a!==u||o!==d)&&(u=a,d=o,e.width=a,e.height=o,t.viewport(0,0,a,o))};new ResizeObserver(f).observe(e),f();let p=[],m=new Float32Array(56),b=0,x=16,S=0;return{state:s,drop(e,t,n){p.push({x:e,y:t,born:performance.now()/1e3,strength:n}),p.length>_&&p.shift()},render(n){if(!c&&b){let e=Math.min((n-b)*1e3,200);x+=(e-x)*.05,S=x>40?S+e:0,S>1100&&l>.55&&(l*=.8,S=0,x=24,f())}b=n;let r=performance.now()/1e3;for(;p.length&&r-p[0].born>3;)p.shift();m.fill(0),p.forEach((e,t)=>{m.set([e.x,e.y,r-e.born,e.strength],t*4)}),t.uniform2f(o.res,u,d),t.uniform1f(o.dpr,u/Math.max(e.clientWidth,1)),t.uniform1f(o.time,n),t.uniform4f(o.obj,...s.obj),t.uniform1f(o.chaos,s.chaos),t.uniform3f(o.morph,...s.morph),t.uniform1f(o.elec,s.elec),t.uniform1f(o.level,s.level),t.uniform1f(o.surface,s.surface),t.uniform4fv(o.drops,m),t.drawArrays(t.TRIANGLES,0,3)}}}var x=`You get one page, in writing, on where your data goes, who sees it and how long it’s kept.`,S=`Anything marked ITAR, CUI or export controlled goes to a person, untouched. ${x}`,C=(e,t)=>`One page on what ${e}, next to 3 ${t} nearby. Public info only.`,w={gauges:[{value:19.8,label:`Used AI lately`}],text:`19.8% of US firms used AI in the past two weeks.`,source:`US Census Bureau BTOS, May 2026`},T={gauges:[{value:73,label:`Want the help`}],text:`73% of small businesses want more AI training and setup help.`,source:`Goldman Sachs`},E={gauges:[{value:23,label:`Never responded`}],text:`In a study of 2,241 firms, the first response took 42 hours on average. 23% never responded.`,source:`Harvard Business Review`},ee={gauges:[{value:51,label:`Quote within a day`},{value:41,label:`Slower shops`}],text:`Modern Machine Shop’s 2026 Top Shops survey found shops that quote within a day report a 51% win rate on new business, vs 41% for slower shops.`,source:`Modern Machine Shop, 2026 Top Shops`},te={gauges:[{value:64,label:`Spreadsheets or manual`}],text:`64% of the small and mid size manufacturers surveyed still use spreadsheets or manual tracking.`,source:`Manufacturers Resource Center, 2026`},ne={gauges:[{value:75,label:`Stuck on where to start`}],text:`75% say finding where AI creates value is a top barrier.`,source:`Manufacturers Resource Center, 2026`},re={title:`What stops manufacturers from using AI`,note:`Cost comes last. The real problem is having someone to do it.`,rows:[{label:`No one inside who knows how`,value:60},{label:`No time`,value:53},{label:`Hooking it up to what they run`,value:40},{label:`Worried about data`,value:30},{label:`Not sure it pays`,value:28},{label:`Team not ready`,value:28},{label:`Cost`,value:18}],source:`Manufacturers Resource Center, 2026 AI assessment, 139 responses. Pooled survey, pick all that apply.`},D={title:`Why firms with no AI plan say no`,note:`Most think it doesn’t apply to them. Almost nobody says it costs too much.`,rows:[{label:`Doesn’t apply to this business`,value:62},{label:`Don’t know what it can do`,value:22},{label:`Privacy or security`,value:21},{label:`Not ready yet`,value:13},{label:`No skilled staff`,value:7},{label:`Too expensive`,value:7}],source:`US Census Bureau BTOS, via Bipartisan Policy Center, 2026. Firms with no plan to use AI.`},ie={any:{key:`any`,label:`Any company`,shape:0,t:{heroTwo:`Your\xA0business will.`,heroSub:`You’ve built a company that does over $1M a year. We add light AI systems to how it already runs, so you can grow without a big software project.`,readingAs:`Written for any company over $1M a year.`,sameTitle:`No two companies run the same.`,firstAt:`Where we’d look first`,leakSub:`Most companies lose time and work in the same five places.`,limitTitle:`AI can’t run your company.`,limitSub:`It can take the busy work off the people who do.`,deskName:`The front desk`,deskText:`Every call, form and email gets logged the same day. Missing details get asked for. A reply gets drafted. Open work gets followed up. Your team checks it and sends it.`,wontOneTitle:`It won’t run your company.`,wontOneText:`You and your people make the calls. Every time.`,wontDataTitle:`It won’t be a black box.`,wontDataText:x,notFor:`You probably don’t need us if you’re under $1M a year. Or if you want a chatbot and no training.`,mapText:`We walk through your company with you and whoever runs the office. You pick what gets built.`,biz:`company`},jobs:[`Following up on every lead and open quote`,`Moving the spreadsheet only one person understands`,`Answering what your team gets asked all day`],leaks:[`Nobody has time to find new customers, so sales ride on the same few names.`,`Calls and web forms sit. The customer goes with whoever answers first.`,`The work lives in one person’s head, or in a spreadsheet only they understand.`,`Invoices go out late, and somebody has to chase them.`,`You can’t see the numbers without asking someone, so you run it from your inbox.`],demo:{label:`New request`,subject:`Pricing for 3 locations`,body:`Can you send pricing for our 3 locations? We’d like to start next month.`,fields:[{name:`Asking for`,value:`Pricing`},{name:`Locations`,value:`3`},{name:`Start`,value:`Next month`},{name:`Details`,value:`Addresses missing.`,missing:!0}],reply:`Got it, thanks. You’ll have pricing by Thursday. Can you send the 3 addresses when you get a chance?`,approve:`Your team checks it and hits send`}},shop:{key:`shop`,label:`Manufacturer`,shape:1,t:{heroTwo:`Quotes out the door will.`,heroSub:`We set up AI for the office side of your shop. Every RFQ gets logged and answered the same day, and open quotes get followed up. Your estimator still does the pricing.`,readingAs:`Reading this as a manufacturer.`,sameTitle:`No two shops run the same.`,firstAt:`Where we’d look first at a manufacturer`,leakSub:`Every shop loses time and work in the same five places.`,limitTitle:`AI can’t price your parts.`,limitSub:`It can do the inbox work around the price.`,deskName:`The quote desk`,deskText:`Every RFQ gets logged the same day. Missing prints and quantities get asked for. A got it reply gets drafted. Open quotes get followed up. Your team checks it and sends it.`,wontOneTitle:`It won’t price your parts.`,wontOneText:`Your estimator does that. Every time.`,wontDataTitle:`It won’t touch ITAR or CUI.`,wontDataText:S,notFor:`You probably don’t need us if every RFQ already gets a same day answer. Or if you want a chatbot and no training.`,mapText:`We walk through your shop with you and whoever runs the office. You pick what gets built.`,biz:`shop`},jobs:[`Logging every RFQ the day it comes in`,`Chasing missing prints and quantities`,`Following up on open quotes`],leaks:[`Nobody has time to find new buyers, so sales ride on the same few accounts.`,`RFQs sit in the inbox. The buyer goes with whoever answers first.`,`Prints go missing, POs get typed in by hand, and the phone rings with where’s my order.`,`Net 30 turns into net 60, and somebody has to chase it.`,`You quote at night and check email on vacation.`],demo:{label:`New RFQ`,subject:`RFQ: 250 brackets, 6061`,body:`Can you quote 250 of the attached bracket in 6061? We need them by the 14th.`,fields:[{name:`Part`,value:`Bracket`},{name:`Quantity`,value:`250`},{name:`Material`,value:`6061 aluminum`},{name:`Needed by`,value:`The 14th`},{name:`Files`,value:`PDF only. STEP file missing.`,missing:!0}],reply:`Got it, thanks. You’ll have a quote by Thursday. Can you send the STEP file when you get a chance?`,approve:`Your estimator prices it and hits send`}},svc:{key:`svc`,label:`Service company`,shape:2,t:{heroTwo:`Booked jobs will.`,heroSub:`We set up AI for the office side of your company. Every call and web form gets answered, open estimates get followed up, and dispatch gets off the spreadsheet. Your techs still do the work.`,readingAs:`Reading this as a service company.`,sameTitle:`No two service companies run the same.`,firstAt:`Where we’d look first at a service company`,leakSub:`Every service company loses time and work in the same five places.`,limitTitle:`AI can’t do the job.`,limitSub:`It can do everything around the truck.`,deskName:`The call desk`,deskText:`Every call and web form gets logged. New leads get a text back. Open estimates get followed up. Reviews get a drafted reply. Your team checks it and sends it.`,wontOneTitle:`It won’t price your jobs.`,wontOneText:`Your people do that. Every time.`,wontDataTitle:`It won’t be a black box.`,wontDataText:x,notFor:`You probably don’t need us if every call already gets a same day answer. Or if you want a chatbot and no training.`,mapText:`We walk through your company with you and whoever runs dispatch. You pick what gets built.`,biz:`company`},jobs:[`Texting back every new lead`,`Following up on open estimates`,`Getting dispatch off the spreadsheet`],leaks:[`Nobody has time to find new work, so you ride whatever calls come in.`,`Calls go to voicemail. The customer books whoever calls back first.`,`One person runs dispatch off a spreadsheet, and the phone rings with when’s my tech coming.`,`Invoices go out late, and somebody has to chase them.`,`Reviews go unanswered, and you check email on vacation.`],demo:{label:`New web form`,subject:`No heat in the back office`,body:`Our heat is out in the back office. Can someone come this week?`,fields:[{name:`Problem`,value:`No heat`},{name:`Where`,value:`Back office`},{name:`When`,value:`This week`},{name:`Address`,value:`Address missing.`,missing:!0}],reply:`Got it, thanks. We can get someone out Thursday. What’s the address?`,approve:`Your dispatcher books it and hits send`}},dist:{key:`dist`,label:`Distributor`,shape:3,t:{heroTwo:`Quotes out the door will.`,heroSub:`We set up AI for the office side of your business. Every quote request and emailed order gets logged and answered the same day. Your reps still own the customer.`,readingAs:`Reading this as a distributor.`,sameTitle:`No two distributors run the same.`,firstAt:`Where we’d look first at a distributor`,leakSub:`Every distributor loses time and work in the same five places.`,limitTitle:`AI can’t run your accounts.`,limitSub:`It can do the typing around them.`,deskName:`The order desk`,deskText:`Emailed orders get typed into your system. Stock and price questions get a drafted answer. Open quotes get followed up. Your team checks it and sends it.`,wontOneTitle:`It won’t set your prices.`,wontOneText:`Your reps and your price book do that. Every time.`,wontDataTitle:`It won’t be a black box.`,wontDataText:x,notFor:`You probably don’t need us if every order and quote request already gets a same day answer. Or if you want a chatbot and no training.`,mapText:`We walk through your business with you and whoever runs the office. You pick what gets built.`,biz:`business`},jobs:[`Typing emailed orders into your system`,`Answering stock and price questions`,`Following up on open quotes`],leaks:[`Reps stay busy with the accounts they have, so nobody goes after new ones.`,`Quote requests sit in the inbox. The buyer goes with whoever answers first.`,`Emailed orders get typed in by hand, one line at a time.`,`Invoices go out late, and somebody has to chase them.`,`Stock and price questions eat the whole day.`],demo:{label:`New order`,subject:`Order: 40 cases, ship Tuesday`,body:`Please ship 40 cases of the usual to our Dallas location by Tuesday.`,fields:[{name:`Quantity`,value:`40 cases`},{name:`Ship to`,value:`Dallas location`},{name:`Ship by`,value:`Tuesday`},{name:`Item number`,value:`Missing. Matched to last order, needs a check.`,missing:!0}],reply:`Got it, thanks. 40 cases going out for Tuesday. Same item as your last order?`,approve:`Your rep checks it and hits send`}},law:{key:`law`,label:`Law firm`,shape:4,t:{heroTwo:`New clients called back will.`,heroSub:`We set up AI for the office side of your firm. Every new inquiry gets logged and answered the same day, and consults get followed up. Your attorneys still give the advice.`,readingAs:`Reading this as a law firm.`,sameTitle:`No two firms run the same.`,firstAt:`Where we’d look first at a law firm`,leakSub:`Every firm loses time and work in the same five places.`,limitTitle:`AI can’t give legal advice.`,limitSub:`It can do the inbox work around it.`,deskName:`The intake desk`,deskText:`Every inquiry gets logged the same day and sorted. A reply gets drafted. Consults get followed up. Clients get chased for documents. Your team checks it and sends it.`,wontOneTitle:`It won’t give legal advice.`,wontOneText:`Your attorneys do that. Every time.`,wontDataTitle:`It won’t be a black box.`,wontDataText:x,notFor:`You probably don’t need us if every inquiry already gets a same day answer. Or if you want a chatbot and no training.`,mapText:`We walk through your firm with you and whoever runs intake. You pick what gets built.`,biz:`firm`},jobs:[`Logging and answering every new inquiry`,`Following up after consults`,`Chasing clients for documents`],leaks:[`Past clients never hear from you, so referrals go quiet.`,`A new inquiry waits until morning. By then they’ve called the next firm.`,`Clients call to ask where their case stands.`,`Time gets entered late, and invoices go out later.`,`You do intake at night and answer email on vacation.`],demo:{label:`New inquiry`,subject:`Website inquiry: contract dispute`,body:`A supplier broke our contract and I need to know my options. Can someone call me?`,fields:[{name:`Type`,value:`Contract dispute`},{name:`Wants`,value:`A call back`},{name:`Conflict check`,value:`Not run yet`},{name:`Phone`,value:`Missing`,missing:!0}],reply:`Thanks for reaching out. What is the best number and time to reach you?`,approve:`Your intake person checks it and hits send`}},ins:{key:`ins`,label:`Insurance agency`,shape:5,t:{heroTwo:`Quotes out the door will.`,heroSub:`We set up AI for the office side of your agency. Every quote and COI request gets logged and answered the same day, and old quotes get followed up. Your producers still advise the client.`,readingAs:`Reading this as an insurance agency.`,sameTitle:`No two agencies run the same.`,firstAt:`Where we’d look first at an agency`,leakSub:`Every agency loses time and work in the same five places.`,limitTitle:`AI can’t advise your clients.`,limitSub:`It can do the inbox work around it.`,deskName:`The service desk`,deskText:`Quote and COI requests get logged the same day. Renewal reminders get drafted ahead of the date. Old quotes get followed up. Your team checks it and sends it.`,wontOneTitle:`It won’t advise your clients.`,wontOneText:`Your producers do that. Every time.`,wontDataTitle:`It won’t be a black box.`,wontDataText:x,notFor:`You probably don’t need us if every quote request already gets a same day answer. Or if you want a chatbot and no training.`,mapText:`We walk through your agency with you and whoever runs service. You pick what gets built.`,biz:`agency`},jobs:[`Handling quote and COI requests`,`Renewal reminders ahead of the date`,`Following up on old quotes`],leaks:[`Nobody has time to round the account, so cross sell never happens.`,`Quote requests wait while the team works renewals.`,`COI requests stop everything, all day.`,`Renewal paperwork gets chased by hand.`,`The whole book lives in your head.`],demo:{label:`New request`,subject:`COI needed for new job site`,body:`Our client needs a certificate for the new site by Friday. Can you send one over?`,fields:[{name:`Request`,value:`Certificate of insurance`},{name:`Insured`,value:`Existing client`},{name:`Needed by`,value:`Friday`},{name:`Certificate holder`,value:`Missing`,missing:!0}],reply:`Got it, thanks. We’ll get that to you before Friday. Who should the certificate holder be?`,approve:`Your CSR checks it and hits send`}},acct:{key:`acct`,label:`Accounting firm`,shape:6,t:{heroTwo:`Work out the door will.`,heroSub:`We set up AI for the office side of your firm. Client email gets sorted the same day and missing documents get chased. Your CPAs still make the calls.`,readingAs:`Reading this as an accounting firm.`,sameTitle:`No two firms run the same.`,firstAt:`Where we’d look first at an accounting firm`,leakSub:`Every firm loses time and work in the same five places.`,limitTitle:`AI can’t sign the return.`,limitSub:`It can do the chasing around it.`,deskName:`The client inbox`,deskText:`Client email gets sorted the same day. Missing documents get chased. What comes back gets read and filed. Proposals get followed up. Your team checks it and sends it.`,wontOneTitle:`It won’t sign anything.`,wontOneText:`Your CPAs do that. Every time.`,wontDataTitle:`It won’t be a black box.`,wontDataText:x,notFor:`You probably don’t need us if your clients already send everything on time. Or if you want a chatbot and no training.`,mapText:`We walk through your firm with you and whoever runs the office. You pick what gets built.`,biz:`firm`},jobs:[`Sorting client email`,`Chasing missing documents`,`Following up on proposals`],leaks:[`Past clients drift, and proposals never get followed up.`,`New client inquiries wait until after tax season.`,`You hound clients for documents, then hound them again.`,`Engagement letters and invoices go out late.`,`You work nights from January to April.`],demo:{label:`Client email`,subject:`Re: missing documents`,body:`Here’s my W-2. Is that everything you need?`,fields:[{name:`Client`,value:`Existing client`},{name:`Received`,value:`W-2`},{name:`Still missing`,value:`1099 and mortgage statement`,missing:!0}],reply:`Thanks, got the W-2. We still need your 1099 and your mortgage statement.`,approve:`Your team checks it and hits send`}}},ae=[`any`,`shop`,`svc`,`dist`,`law`,`ins`,`acct`],oe=`AI is the same. It can do a lot, but somebody has to rig it, wire it in and train the operator. That’s the job we do.`,O=`AI is the same. It can do a lot, but somebody has to set it up, wire it in and train your people. That’s the job we do.`,k=`Check its work the way you’d check a new hire’s.`,A={any:{t:{change:`See it for your trade`,crateTitle:`A tool in the box does no work.`,crateText:O,appTitle:`AI is the new hire. Your best people still make the call.`,appText:`It gets the busy work ready first. They decide what goes out. ${k}`,auditText:C(`a customer sees when they try to reach you`,`companies`)},stats:[E,T,w],chart:D},shop:{t:{crateTitle:`A 5 axis in the crate makes no parts.`,crateText:oe,appTitle:`AI is the apprentice. Your estimator is the journeyman.`,appText:`It pulls the print, logs the job and gets everything ready. They make the call. ${k}`,auditText:C(`a buyer sees when they try to get a quote from you`,`shops`)},stats:[ee,te,ne],chart:re},svc:{t:{crateTitle:`A new truck with no driver runs no calls.`,crateText:O,appTitle:`AI is the new office helper. Your dispatcher still runs the board.`,appText:`It logs the call, fills in what it can and gets everything ready. They make the call. ${k}`,auditText:C(`a customer sees when they try to reach you`,`companies`)},stats:[E,T,w],chart:D},dist:{t:{crateTitle:`A forklift on the truck moves no pallets.`,crateText:O,appTitle:`AI is the new order clerk. Your reps still own the account.`,appText:`It types the order, checks the item and gets everything ready. They make the call. ${k}`,auditText:C(`a buyer sees when they try to get a quote from you`,`distributors`)},stats:[E,T,w],chart:D},law:{t:{crateTitle:`A law library nobody opens wins no cases.`,crateText:O,appTitle:`AI is the new paralegal. You’re still the attorney.`,appText:`It logs the inquiry, pulls the file and gets everything ready. You make the call. ${k}`,auditText:C(`a new client sees when they try to reach you`,`firms`)},stats:[{gauges:[{value:67,label:`Never answered`}],text:`67% of law firms never answered a prospect email.`,source:`Clio secret shop`},E,T],chart:D},ins:{t:{crateTitle:`A carrier you never quote writes no policies.`,crateText:O,appTitle:`AI is the new CSR. Your producers still own the account.`,appText:`It logs the request, fills in what it can and gets everything ready. They make the call. ${k}`,auditText:C(`a new client sees when they try to get a quote`,`agencies`)},stats:[{gauges:[{value:34,label:`Never answered`},{value:6,label:`Within 5 minutes`}],text:`In a test of 150 agencies, 34% never answered a quote request. 6% answered within 5 minutes.`,source:`AgencyZoom test`},E,T],chart:D},acct:{t:{crateTitle:`Tax software nobody set up files no returns.`,crateText:O,appTitle:`AI is the first year staff. Your CPAs still sign.`,appText:`It sorts the email, chases the documents and gets everything ready. They make the call. ${k}`,auditText:C(`a new client sees when they try to reach you`,`firms`)},stats:[{gauges:[{value:21,label:`More billable hours`}],text:`In a study of 277 accountants, AI gave 21% more billable hours.`,source:`Stanford and MIT`},E,T],chart:D}},j=Object.fromEntries(ae.map(e=>[e,{...ie[e],t:{change:`Change it`,auditName:`The outside look`,...ie[e].t,...A[e].t},stats:A[e].stats,chart:A[e].chart}])),se=`teamwide-business`;function ce(){try{let e=localStorage.getItem(se);return e&&e in j?e:null}catch{return null}}function le(e){try{localStorage.setItem(se,e)}catch{}}function M(e,t,n){e.textContent!==t&&(n?(e.classList.add(`swap`),window.setTimeout(()=>{e.textContent=t,e.classList.remove(`swap`)},170)):e.textContent=t)}function ue(e){let t=new URLSearchParams(location.search).get(`for`),n=t&&t in j?t:ce()??`any`,r=j.any,i=[...document.querySelectorAll(`[data-biz]`)],a=(t,n)=>{let a=r;r=j[t],document.querySelectorAll(`[data-t]`).forEach(e=>{let t=r.t[e.dataset.t??``];t&&M(e,t,n)}),document.querySelectorAll(`[data-job]`).forEach((e,t)=>M(e,r.jobs[t],n)),document.querySelectorAll(`[data-leak]`).forEach((e,t)=>M(e,r.leaks[t],n)),i.forEach(e=>e.setAttribute(`aria-pressed`,String(e.dataset.biz===t))),e(r,a)};return i.forEach(e=>{e.addEventListener(`click`,()=>{let t=e.dataset.biz;t!==r.key&&(le(t),a(t,!0))})}),n!==`any`&&a(n,!1),{current:()=>r,order:ae}}var de=[900,1500,900,2400,3200];function fe(e,t){let n=e.querySelector(`[data-fields]`),r=e.querySelector(`[data-reply]`);if(!n||!r)return{set(){}};let i=null,a=0,o=0,s=!1,c=()=>{window.clearTimeout(a),window.clearInterval(o)},l=()=>{r.style.minHeight=``,r.style.minHeight=`${r.offsetHeight}px`},u=t=>{e.querySelectorAll(`[data-demo]`).forEach(e=>{e.textContent=t[e.dataset.demo]}),n.replaceChildren(...t.fields.map(e=>{let t=document.createElement(`div`);t.className=e.missing?`field missing`:`field`;let n=document.createElement(`dt`),r=document.createElement(`dd`);return n.textContent=e.name,r.textContent=e.value,t.append(n,r),t})),r.textContent=t.reply,l()},d=t=>{if(e.dataset.step=String(t),t===3&&i){let e=i.reply,t=document.createElement(`span`),n=document.createElement(`span`);n.style.visibility=`hidden`,n.textContent=e,r.replaceChildren(t,n),r.style.minHeight=`${Math.max(r.offsetHeight,parseFloat(r.style.minHeight)||0)}px`;let a=0;o=window.setInterval(()=>{a+=2,t.textContent=e.slice(0,a),n.textContent=e.slice(a),a>=e.length&&window.clearInterval(o)},24)}a=window.setTimeout(()=>{s&&d(t===4?0:t+1)},de[t])},f=()=>{c(),t?e.dataset.step=`4`:s&&d(0)};return new IntersectionObserver(([e])=>{let t=s;s=e.isIntersecting,s&&!t&&f(),s||c()},{threshold:.3}).observe(e),{set(e){i=e,u(e),f()}}}var pe=(e,t=0,n=1)=>Math.min(n,Math.max(t,e));function me(e){let t=e.querySelector(`svg`),n=[...e.querySelectorAll(`path`)],r=e.querySelector(`[data-flow]`),i=e.querySelector(`[data-glow]`),a=[...e.querySelectorAll(`.leak`)],o=1,s=0,c=1,l=()=>{if(!t||!a.length)return;let l=e.getBoundingClientRect();t.setAttribute(`viewBox`,`0 0 ${l.width} ${l.height}`);let u=a.map(e=>{let t=e.querySelector(`.leak-dot`)?.getBoundingClientRect();return t?{x:t.left+t.width/2-l.left,y:t.top+t.height/2-l.top}:{x:0,y:0}}),d=u[0],f=u[u.length-1],p=`M ${d.x} 0 L ${d.x} ${d.y}`;for(let e=1;e<u.length;e++){let t=u[e-1],n=u[e],r=(t.y+n.y)/2;p+=` C ${t.x} ${r}, ${n.x} ${r}, ${n.x} ${n.y}`}p+=` L ${f.x} ${l.height}`,n.forEach(e=>e.setAttribute(`d`,p)),o=r?.getTotalLength()??1,[r,i].forEach(e=>e?.setAttribute(`stroke-dasharray`,`${o} ${o}`)),s=l.top+window.scrollY,c=l.height};return l(),new ResizeObserver(l).observe(e),document.fonts?.ready.then(l),{update(e,t){let n=e+t*.62-s,l=pe(n/c),u=String(o*(1-l));r?.setAttribute(`stroke-dashoffset`,u),i?.setAttribute(`stroke-dashoffset`,u),a.forEach((e,t)=>{let r=e.offsetTop+e.offsetHeight/2,i=a[t+1];e.classList.toggle(`on`,n>=r),e.classList.toggle(`sealed`,i?n>=i.offsetTop+i.offsetHeight/2:n>=c)})}}}var he=null;function ge(e){return e.map(e=>`<article class="stat">
  <div class="gauges">${e.gauges.map(e=>`<div class="gauge-wrap"><div class="gauge" style="--n:${e.value}"><i></i><b>${e.value}%</b></div><span>${e.label}</span></div>`).join(``)}</div>
  <p>${e.text}</p>
  <cite>${e.source}</cite>
</article>`).join(``)}function _e(e){return`<figcaption><h3>${e.title}</h3><p>${e.note}</p></figcaption>
<div class="bars">${e.rows.map((e,t)=>`<div class="bar" style="--w:${e.value};--i:${t}"><span>${e.label}</span><div class="bar-track"><i></i></div><b>${e.value}%</b></div>`).join(``)}</div>
<cite>${e.source}</cite>`}function ve(e){let t=document.querySelectorAll(`.gauge, .bars, .funnel, .gap-rows`);e?t.forEach(e=>e.classList.add(`in`)):(he??=new IntersectionObserver(e=>{e.forEach(e=>{e.isIntersecting&&e.target.classList.add(`in`)})},{threshold:.35}),t.forEach(e=>he?.observe(e)))}function ye(e,t,n){let r=document.querySelector(`[data-stats]`),i=document.querySelector(`[data-chart]`);r&&(r.innerHTML=ge(e)),i&&(i.innerHTML=_e(t)),ve(n)}var be=[`·`,`∙`,`•`,`⠂`,`⠆`,`⠇`,`⠧`,`⠿`],xe=8,Se=()=>be[Math.floor(Math.random()*be.length)];function Ce(e,t){let n=new Set,r=e.firstChild;if(!(r instanceof Text))return n;let i=document.createRange(),a=null;for(let e=0;e<t.length;e+=1){if(e>0&&!/\s/.test(t[e-1])||/\s/.test(t[e]))continue;i.setStart(r,e),i.setEnd(r,e+1);let o=i.getBoundingClientRect().top;a!==null&&o>a+2&&n.add(e),a=o}return n}function we(e){let t=e.textContent??``,n=performance.now(),r=Math.min(window.innerWidth<821?850:1500,460+t.length*22),i=Ce(e,t),a=document.createDocumentFragment(),o=[];[...t].forEach((e,t)=>{if(/\s/.test(e)){a.append(e);return}i.has(t)&&a.append(document.createElement(`br`));let n=document.createElement(`span`);n.className=`rz`,n.textContent=e,o.push(n),a.append(n)}),e.setAttribute(`aria-label`,t),e.style.whiteSpace=`nowrap`,e.replaceChildren(a),e.classList.add(`shown`);let s=0,c=0,l=()=>{e.textContent=t,e.style.whiteSpace=``,e.removeAttribute(`aria-label`)},u=t=>{if(e.classList.contains(`swap`)||!e.contains(o[0])){e.style.whiteSpace=``,e.removeAttribute(`aria-label`);return}let i=Math.floor((t-n)/r*o.length);if(i>=o.length)return l();for(;s<i;s+=1)o[s].className=`rz on`,o[s].removeAttribute(`data-g`);if(c+=1,c%2==0)for(let e=i;e<Math.min(i+xe,o.length);e+=1)o[e].className=`rz dot`,o[e].dataset.g=Se();requestAnimationFrame(u)};requestAnimationFrame(u)}function Te(e){let t=[...document.querySelectorAll(`.reveal`)];if(e){t.forEach(e=>e.classList.add(`shown`));return}let n=new IntersectionObserver(e=>{e.forEach(e=>{if(!e.isIntersecting)return;n.unobserve(e.target);let t=e.target,r=Number(t.dataset.delay??0)*(window.innerWidth<821?.6:1);window.setTimeout(()=>we(t),r)})},{threshold:.4}),r=new Promise(e=>window.setTimeout(e,900));Promise.race([document.fonts.ready,r]).then(()=>t.forEach(e=>n.observe(e)))}function Ee(){document.querySelectorAll(`[data-swipe]`).forEach(e=>{let t=document.createElement(`div`);t.className=`swipe-dots`,t.setAttribute(`aria-hidden`,`true`),e.after(t);let n=()=>{let n=[...e.children];t.childElementCount!==n.length&&t.replaceChildren(...n.map(()=>document.createElement(`i`)));let r=n[1]?n[1].offsetLeft-n[0].offsetLeft:1,i=e.scrollLeft+e.clientWidth>=e.scrollWidth-4?n.length-1:Math.round(e.scrollLeft/r);[...t.children].forEach((e,t)=>e.classList.toggle(`on`,t===i))};e.addEventListener(`scroll`,n,{passive:!0}),window.addEventListener(`resize`,n),new MutationObserver(n).observe(e,{childList:!0}),n()})}var N=document.documentElement,P=window.matchMedia(`(prefers-reduced-motion: reduce)`).matches,De=navigator.connection?.saveData===!0,F=(e,t=0,n=1)=>Math.min(n,Math.max(t,e)),I=(e,t,n)=>e+(t-e)*n,L=(e,t,n)=>{let r=F((n-e)/(t-e));return r*r*(3-2*r)},R=e=>document.querySelector(e),Oe=R(`#water`),z=null;P&&N.classList.add(`still`);function ke(){Oe&&!P&&!De&&(N.classList.add(`gl`),z=b(Oe),z||N.classList.remove(`gl`)),z||N.classList.add(`no-gl`)}var Ae=R(`.demo`),je=Ae?fe(Ae,P):null,B={a:1,b:1,m:1},Me=0,V=ue((e,t)=>{je?.set(e.demo),ye(e.stats,e.chart,P),window.setTimeout(Z,200),B.a=t.shape,B.b=e.shape,B.m=0,Me=performance.now();let n=R(`.shape-slot`)?.getBoundingClientRect();n&&z?.drop(n.left+n.width/2,n.top+n.height/2,1.4)});je?.set(j[V.current().key].demo),ye(V.current().stats,V.current().chart,P),Te(P),Ee(),requestAnimationFrame(()=>window.setTimeout(ke,60)),B.a=B.b=V.current().shape,B.m=1;var H=P||window.matchMedia(`(pointer: coarse)`).matches?null:new m({lerp:.11});document.addEventListener(`click`,e=>{let t=e.target.closest(`a[href^="#"]`);t&&H&&(e.preventDefault(),H.scrollTo(t.getAttribute(`href`)??0))});var U={x:-999,y:-999};window.addEventListener(`pointermove`,e=>{!z||Math.hypot(e.clientX-U.x,e.clientY-U.y)<70||(U={x:e.clientX,y:e.clientY},z.drop(e.clientX,e.clientY,.6))},{passive:!0}),window.addEventListener(`pointerdown`,e=>z?.drop(e.clientX,e.clientY,1.5),{passive:!0});var Ne=R(`.pipe`),W=Ne?me(Ne):null,G=R(`.hero-wrap`),K=R(`.hero`),q=R(`.hero-copy`),Pe=R(`.honest-wrap`),J=[...document.querySelectorAll(`.honest .w`)],Fe=R(`.honest-end`),Ie=R(`.fit`),Le=R(`.shape-slot`),Y=R(`.days-wrap`),X=R(`.days`),Re=R(`[data-day]`),ze=[...document.querySelectorAll(`.day`)],Be=R(`.calm-slot`),Ve=[[`.hero-wrap`,.72],[`.honest-wrap`,.78],[`.fit`,.42],[`.days-wrap`,.4]].map(([e,t])=>({el:R(e),elec:t})).filter(e=>e.el!==null);function Z(){if(!K||!q||P||(K.style.setProperty(`--h1-fit`,`1`),window.matchMedia(`(max-height: 500px)`).matches))return;let e=getComputedStyle(K),t=K.clientHeight-parseFloat(e.paddingTop)-parseFloat(e.paddingBottom),n=q.offsetHeight-t,r=q.querySelector(`h1`)?.offsetHeight??0;n>0&&r&&K.style.setProperty(`--h1-fit`,Math.max(.62,1-n/r).toFixed(3))}window.addEventListener(`resize`,Z),document.fonts.ready.then(Z),Z();var He=[...document.querySelectorAll(`.sheet`)],Ue=[...document.querySelectorAll(`.nav nav a`)],We=e=>He.some(t=>{let n=t.getBoundingClientRect();return n.top<=0&&n.bottom>=e}),Ge=()=>{let e=He.filter(e=>{let t=e.getBoundingClientRect();return t.top<40&&t.bottom>40});return e[e.length-1]?.classList.contains(`sheet-light`)??!1},Ke=new IntersectionObserver(e=>{e.forEach(e=>{if(!e.isIntersecting)return;let t=e.target,n=`#${t.dataset.nav??t.id}`;Ue.forEach(e=>e.setAttribute(`aria-current`,String(e.getAttribute(`href`)===n)))})},{rootMargin:`-45% 0px -50% 0px`});document.querySelectorAll(`[data-section]`).forEach(e=>Ke.observe(e));var Q=(e,t)=>{let n=e.getBoundingClientRect();return F(-n.top/Math.max(n.height-t,1))};function qe(e){let t=Ve.map(t=>{let n=t.el.getBoundingClientRect();return{y:n.top+n.height/2-e/2,elec:t.elec}});for(let e=0;e<t.length-1;e++){let n=t[e],r=t[e+1];if(n.y<=0&&r.y>0)return I(n.elec,r.elec,L(n.y,r.y,0))}return t[0].y>0?t[0].elec:t[t.length-1].elec}function Je(){let e=window.innerWidth,t=window.innerHeight,n=e<820,r=window.scrollY;W?.update(r,t);let i=0;if(G&&(i=Q(G,t),K&&(K.style.setProperty(`--fade`,String(1-(n?L(.4,.98,i):L(.05,.42,i)))),K.style.setProperty(`--lift`,`${-i*(n?36:160)}px`))),Pe){let e=Q(Pe,t),r=(n?.16+e*1.9:e*1.5)*J.length;J.forEach((e,t)=>e.classList.toggle(`lit`,t<r)),Fe&&(Fe.style.opacity=String(n?L(.42,.56,e):L(.72,.84,e)))}let a=0;if(Y){a=Q(Y,t);let e=Y.getBoundingClientRect().bottom<=t,n=L(.02,.74,a),r=Math.max(1,Math.round(n*30));Re&&(Re.textContent=String(r)),ze.forEach(e=>e.classList.toggle(`now`,r>=Number(e.dataset.at))),X&&(X.style.opacity=String(1-L(.76,.84,a))),N.classList.toggle(`bright`,a>.86||e||Ge())}if(!z)return;let o=z.state;if(o.elec=qe(t),o.level=L(.02,.74,a),o.surface=L(.78,.98,a),o.chaos=1-L(.12,.72,F(r/Math.max(document.documentElement.scrollHeight-t,1))),o.obj[3]=0,i<1&&G&&G.getBoundingClientRect().bottom>0){let r=Math.max((q?.getBoundingClientRect().top??t*.4)-64,0),a=(n?F(r/2-8,22,e*.31):Math.min(t*.34,e*.235))+i**3.4*Math.max(e,t)*3.2,s=L(0,.6,i);o.obj=[I(n?e*.5:e*.73,e*.5,s),I(n?64+r/2:t*.5,t*.5,s),a,1-L(.7,.97,i)],o.morph=[0,0,0],o.chaos=1}else{if(Ie&&Le){let e=Le.getBoundingClientRect();if(e.bottom>-80&&e.top<t+80){let n=L(t*1.1,t*.62,e.top+e.height*.5),r=1-L(t*.12,-t*.12,e.top+e.height*.5);B.m<1&&(B.m=F((performance.now()-Me)/950));let i=L(0,1,B.m);o.obj=[e.left+e.width/2,e.top+e.height/2,Math.min(e.width,e.height)*.46*I(.72,1,n),n*r],o.morph=n<1?[0,B.b,n]:[B.a,B.b,i],o.chaos=.8;return}}if(Be){let e=Be.getBoundingClientRect();e.bottom>-40&&e.top<t+40&&(o.obj=[e.left+e.width/2,e.top+e.height/2,Math.min(e.width,e.height)*.47,L(t*1.02,t*.72,e.top+e.height*.5)],o.morph=[0,0,0],o.chaos=0)}}}function $(e){H?.raf(e),Je(),We(window.innerHeight)||z?.render(e/1e3),requestAnimationFrame($)}P?(J.forEach(e=>e.classList.add(`lit`)),ze.forEach(e=>e.classList.add(`now`)),window.addEventListener(`scroll`,()=>W?.update(window.scrollY,window.innerHeight),{passive:!0}),W?.update(window.scrollY,window.innerHeight)):requestAnimationFrame($);