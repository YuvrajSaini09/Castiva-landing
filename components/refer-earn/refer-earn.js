// Refer & Earn GSAP Animations
if (window.gsap && window.ScrollTrigger) {
  const referTl = gsap.timeline({
    scrollTrigger: {
      trigger: '#refer-earn-section',
      start: 'top 78%',
      toggleActions: 'play none none none'
    }
  });

  referTl.fromTo('.refer-earn-content h2',
    { opacity: 0, y: 40, filter: 'blur(8px)' },
    { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.9, ease: 'power3.out' }
  );

  referTl.fromTo('.refer-earn-content p',
    { opacity: 0, y: 30, filter: 'blur(6px)' },
    { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8, ease: 'power2.out' },
    '-=0.5'
  );

  referTl.fromTo('.refer-earn-content a',
    { opacity: 0, y: 20, filter: 'blur(4px)' },
    { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.7, ease: 'power2.out' },
    '-=0.4'
  );

  referTl.fromTo('.refer-earn-phone',
    { opacity: 0, x: 60, filter: 'blur(10px)' },
    { opacity: 1, x: 0, filter: 'blur(0px)', duration: 1, ease: 'power3.out' },
    '-=0.7'
  );
}
