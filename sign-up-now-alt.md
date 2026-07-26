use this button instead of "sign up now" button, just make one change, change the button theme from blue to purple:
<button class="group sm:w-auto overflow-hidden transition-all duration-700 ease-out hover:scale-[1.02] border-none flex cursor-pointer w-full h-[64px] z-10 rounded-full pt-0 pr-0 pb-0 pl-0 relative items-center justify-center" style="filter: drop-shadow(0 15px 30px rgba(0,0,0,0.35)); background: #f8fafc">
  <!-- Volumetric Under-glow -->
  <div class="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[140%] h-32 bg-sky-400/25 blur-[60px] rounded-full opacity-60 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
  
  <!-- WebGL Core Container -->
  <div class="absolute inset-[4px] rounded-full overflow-hidden bg-white/5 backdrop-blur-xl border border-white/40 shadow-[inset_0_2px_12px_rgba(255,255,255,0.7)]">
    <canvas class="w-full h-full block" id="gl-aura-emm8vx35y2vz3w6qc" width="444" height="108"></canvas>
  </div>

  <!-- Glossy Glass Shell -->
  <div class="absolute inset-[4px] rounded-full overflow-hidden pointer-events-none">
     <div class="absolute inset-0 bg-gradient-to-tr from-white/40 via-transparent to-white/10 opacity-70"></div>
     <div class="absolute inset-0 rounded-full border border-white/90 shadow-[inset_0_6px_12px_rgba(255,255,255,0.4),inset_0_-6px_12px_rgba(0,0,0,0.15)]"></div>
  </div>

  <!-- Content Layer -->
  <div class="z-10 flex text-white pr-10 pl-10 relative drop-shadow-md gap-x-3 gap-y-x-3 items-center">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="play" aria-hidden="true" class="lucide lucide-play w-5 h-5 opacity-90 fill-white"><path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z" class=""></path></svg>
    <span class="text-base font-medium tracking-tight">Listen to Sample</span>
  </div>

  <script class="">
    (function(){
      const c=document.getElementById('gl-aura-emm8vx35y2vz3w6qc'),b=c.closest('button'),gl=c.getContext('webgl2',{antialias:true,alpha:true});
      if(!gl)return;
      const sh=(t,s)=>{const x=gl.createShader(t);gl.shaderSource(x,s);gl.compileShader(x);return x;},prg=gl.createProgram();
      gl.attachShader(prg,sh(gl.VERTEX_SHADER,`#version 300 es\nin vec2 aPos;out vec2 vUv;void main(){vUv=aPos*0.5+0.5;gl_Position=vec4(aPos,0.,1.);}`));
      gl.attachShader(prg,sh(gl.FRAGMENT_SHADER,`#version 300 es\nprecision highp float;in vec2 vUv;out vec4 o;uniform vec2 r;uniform float t;uniform vec2 p;uniform float h;float hsh(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}float n(vec2 p){vec2 i=floor(p),f=fract(p);float a=hsh(i),b=hsh(i+vec2(1.,0.)),c=hsh(i+vec2(0.,1.)),d=hsh(i+vec2(1.,1.));vec2 u=f*f*(3.-2.*f);return mix(a,b,u.x)+(c-a)*u.y*(1.-u.x)+(d-b)*u.x*u.y;}float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*n(p);p*=2.;a*=.5;}return v;}void main(){vec2 uv=vUv,px=uv-p;px.x*=r.x/r.y;float d=length(px),rip=sin(30.*d-t*5.)*exp(-8.*d)*h,bl=smoothstep(.4,.7,fbm(uv*3.+t*.1));vec2 dist=vec2(fbm(uv*4.+t*.2),fbm(uv*4.-t*.15))*.04+rip*.02;vec3 cA=vec3(0.,.8,1.),cB=vec3(0.,.3,.9),cC=vec3(0.,.1,.6),col=mix(mix(cA,cB,smoothstep(.1,.9,uv.x+dist.x)),cC,smoothstep(.5,1.,uv.y+dist.y))+bl*.15+pow(1.-length(uv-.5)*1.5,3.)*.2;o=vec4(col,.95);}`));
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
      if(typeof lucide!=='undefined')lucide.createIcons();
    })();
  </script>
</button>