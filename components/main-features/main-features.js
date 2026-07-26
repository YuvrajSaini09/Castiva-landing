// Main Features Component JS logic
(function initMainFeaturesComponent() {
  // Option selection logic
  document.addEventListener('click', (e) => {
    const card = e.target.closest('.main-features-section .space-y-3 > div');
    if (card) {
      document.querySelectorAll('.main-features-section .space-y-3 > div').forEach(el => {
        el.classList.remove('ring-2', 'ring-blue-500');
      });
      card.classList.add('ring-2', 'ring-blue-500');
    }
  });
})();
