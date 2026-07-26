// Bento Talents Logic
if (window.gsap && window.ScrollTrigger) {
  gsap.fromTo('#bento-talents > div', 
    { opacity: 0, y: 50, filter: 'blur(10px)' },
    { 
      opacity: 1, 
      y: 0, 
      filter: 'blur(0px)', 
      duration: 0.9, 
      stagger: 0.15, 
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '#bento-talents',
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    }
  );
}
