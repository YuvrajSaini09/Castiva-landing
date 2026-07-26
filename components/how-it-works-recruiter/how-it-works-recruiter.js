// How It Works Recruiter Component Animations
if (window.gsap && window.ScrollTrigger) {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '#how-it-works-recruiter',
      start: 'top 75%',
      toggleActions: 'play none none none'
    }
  });

  tl.fromTo('.gs-rec-step-center',
    { opacity: 0, scale: 0.9, y: 40 },
    { opacity: 1, scale: 1, y: 0, duration: 1, ease: 'power3.out' }
  );

  tl.fromTo('.gs-rec-step-left',
    { opacity: 0, x: -40, filter: 'blur(6px)' },
    { opacity: 1, x: 0, filter: 'blur(0px)', duration: 0.8, stagger: 0.15, ease: 'power2.out' },
    '-=0.6'
  );

  tl.fromTo('.gs-rec-step-right',
    { opacity: 0, x: 40, filter: 'blur(6px)' },
    { opacity: 1, x: 0, filter: 'blur(0px)', duration: 0.8, stagger: 0.15, ease: 'power2.out' },
    '-=0.8'
  );
}
