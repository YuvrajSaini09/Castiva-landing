// Talent split sections animation
if (window.gsap && window.ScrollTrigger) {
  gsap.utils.toArray('[data-talent-section]').forEach((section) => {
    const animatedElements = section.querySelectorAll('[data-talent-animate]');

    gsap.fromTo(
      animatedElements,
      { opacity: 0, y: 40, filter: 'blur(10px)' },
      {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 0.9,
        stagger: 0.12,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      }
    );
  });
}
