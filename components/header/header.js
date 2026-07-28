// Header Logic

// Mobile Menu Toggle
(function() {
  const btn = document.getElementById('mobile-menu-btn');
  const modal = document.getElementById('mobile-nav-modal');
  const openIcon = document.getElementById('menu-icon-open');
  const closeIcon = document.getElementById('menu-icon-close');
  const links = modal?.querySelectorAll('.mobile-nav-link');
  if (!btn || !modal) return;

  let open = false;

  function positionModal() {
    const rect = btn.getBoundingClientRect();
    modal.style.top = (rect.bottom + 20) + 'px';
    modal.style.right = (window.innerWidth - rect.right - 12) + 'px';
  }

  function openMenu() {
    open = true;
    positionModal();
    btn.classList.add('active');
    openIcon?.classList.add('scale-0', 'opacity-0', 'rotate-90');
    openIcon?.classList.remove('scale-100', 'opacity-100', 'rotate-0');
    closeIcon?.classList.remove('scale-0', 'opacity-0', '-rotate-90');
    closeIcon?.classList.add('scale-100', 'opacity-100', 'rotate-0');
    modal.classList.remove('pointer-events-none', 'opacity-0', 'scale-95');
  }

  function closeMenu() {
    open = false;
    btn.classList.remove('active');
    openIcon?.classList.remove('scale-0', 'opacity-0', 'rotate-90');
    openIcon?.classList.add('scale-100', 'opacity-100', 'rotate-0');
    closeIcon?.classList.add('scale-0', 'opacity-0', '-rotate-90');
    closeIcon?.classList.remove('scale-100', 'opacity-100', 'rotate-0');
    modal.classList.add('pointer-events-none', 'opacity-0', 'scale-95');
  }

  btn.addEventListener('click', (e) => { e.stopPropagation(); open ? closeMenu() : openMenu(); });
  links.forEach(l => l.addEventListener('click', closeMenu));
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
  document.addEventListener('click', (e) => { if (open && !modal.contains(e.target) && !btn.contains(e.target)) closeMenu(); });
  window.addEventListener('scroll', () => { if (open) closeMenu(); }, { passive: true });
  window.addEventListener('resize', () => { if (open) positionModal(); });
})();

// WebGL Button Shader (Purple Theme)
(function(){
  const c=document.getElementById('gl-aura-header');
  if(!c) return;
  const b=c.closest('button'),gl=c.getContext('webgl2',{antialias:true,alpha:true});
  if(!gl)return;
  const sh=(t,s)=>{const x=gl.createShader(t);gl.shaderSource(x,s);gl.compileShader(x);return x;},prg=gl.createProgram();
  gl.attachShader(prg,sh(gl.VERTEX_SHADER,`#version 300 es\nin vec2 aPos;out vec2 vUv;void main(){vUv=aPos*0.5+0.5;gl_Position=vec4(aPos,0.,1.);}`));
  gl.attachShader(prg,sh(gl.FRAGMENT_SHADER,`#version 300 es\nprecision highp float;in vec2 vUv;out vec4 o;uniform vec2 r;uniform float t;uniform vec2 p;uniform float h;float hsh(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}float n(vec2 p){vec2 i=floor(p),f=fract(p);float a=hsh(i),b=hsh(i+vec2(1.,0.)),c=hsh(i+vec2(0.,1.)),d=hsh(i+vec2(1.,1.));vec2 u=f*f*(3.-2.*f);return mix(a,b,u.x)+(c-a)*u.y*(1.-u.x)+(d-b)*u.x*u.y;}float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*n(p);p*=2.;a*=.5;}return v;}void main(){vec2 uv=vUv,px=uv-p;px.x*=r.x/r.y;float d=length(px),rip=sin(30.*d-t*5.)*exp(-8.*d)*h,bl=smoothstep(.4,.7,fbm(uv*3.+t*.1));vec2 dist=vec2(fbm(uv*4.+t*.2),fbm(uv*4.-t*.15))*.04+rip*.02;vec3 cA=vec3(0.7,0.2,1.0),cB=vec3(0.5,0.0,0.9),cC=vec3(0.3,0.0,0.6),col=mix(mix(cA,cB,smoothstep(.1,.9,uv.x+dist.x)),cC,smoothstep(.5,1.,uv.y+dist.y))+bl*.15+pow(1.-length(uv-.5)*1.5,3.)*.2;o=vec4(col,.95);}`));
  gl.linkProgram(prg);const buf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buf);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
  const pos=gl.getAttribLocation(prg,"aPos");gl.enableVertexAttribArray(pos);gl.vertexAttribPointer(pos,2,gl.FLOAT,false,0,0);
  const rL=gl.getUniformLocation(prg,"r"),tL=gl.getUniformLocation(prg,"t"),pL=gl.getUniformLocation(prg,"p"),hL=gl.getUniformLocation(prg,"h");
  let pt={x:.5,y:.5},hv=0,hvT=0;
  const res=()=>{c.width=c.clientWidth*devicePixelRatio;c.height=c.clientHeight*devicePixelRatio;gl.viewport(0,0,c.width,c.height);};
  window.addEventListener('resize',res);res();
  b.addEventListener('pointermove',e=>{const r=c.getBoundingClientRect();pt.x=(e.clientX-r.left)/r.width;pt.y=1.-(e.clientY-r.top)/r.height;});
  b.addEventListener('pointerenter',()=>hvT=1.);b.addEventListener('pointerleave',()=>hvT=0.);
  const l=t=>{hv+=(hvT-hv)*.1;gl.useProgram(prg);gl.uniform2f(rL,c.width,c.height);gl.uniform1f(tL,t*.001);gl.uniform2f(pL,pt.x,pt.y);gl.uniform1f(hL,hv);gl.drawArrays(gl.TRIANGLES,0,6);requestAnimationFrame(l);};
  requestAnimationFrame(l);
})();
