// Hero Component Scripts

// Discover Button Nebula Script
(function() {
    const canvas = document.getElementById('nebulaCanvas');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    
    function resize() {
        const rect = canvas.parentElement.getBoundingClientRect();
        width = rect.width;
        height = rect.height;
        canvas.width = width * window.devicePixelRatio;
        canvas.height = height * window.devicePixelRatio;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.speedY = (Math.random() - 0.5) * 0.3;
            this.life = Math.random() * 100;
            this.maxLife = 100 + Math.random() * 100;
            this.alpha = 0;
            this.baseAlpha = Math.random() * 0.5 + 0.2;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.life++;

            if (this.life < 50) {
                this.alpha = (this.life / 50) * this.baseAlpha;
            } else if (this.life > this.maxLife - 50) {
                this.alpha = ((this.maxLife - this.life) / 50) * this.baseAlpha;
            } else {
                this.alpha = this.baseAlpha;
            }

            if (this.life >= this.maxLife || this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.life = 0;
                this.maxLife = 100 + Math.random() * 100;
                this.speedX = (Math.random() - 0.5) * 0.3;
                this.speedY = (Math.random() - 0.5) * 0.3;
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, this.alpha)})`;
            ctx.fill();
            ctx.shadowBlur = 5;
            ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
        }
    }

    for (let i = 0; i < 40; i++) {
        particles.push(new Particle());
    }

    const smokeLayer = document.getElementById('smokeLayer');
    let time = 0;

    function animate() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });

        time += 0.01;
        const offsetX = Math.sin(time) * 10;
        const offsetY = Math.cos(time * 0.8) * 10;
        if(smokeLayer) smokeLayer.style.transform = `translate(${offsetX}px, ${offsetY}px) rotate(${time * 5}deg)`;

        requestAnimationFrame(animate);
    }

    animate();
})();

// Sign Up Now WebGL Button Shader (Purple Theme)
(function(){
  const c=document.getElementById('gl-aura-emm8vx35y2vz3w6qc');
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

// Hero animations (GSAP)
if (window.gsap) {
  const tl = gsap.timeline();
  tl.fromTo('.gs-blur-reveal', 
    { opacity: 0, y: 35, filter: 'blur(12px)' }, 
    { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.1, stagger: 0.2, ease: 'power3.out' }
  );
  tl.fromTo('.gs-hero-btn',
    { opacity: 0, y: 20, filter: 'blur(8px)' },
    { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8, stagger: 0.15, ease: 'power2.out' },
    '-=0.6'
  );
}
