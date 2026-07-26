// Purple Tabs Component Logic
document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.bento-tab');
  const indicator = document.querySelector('.bento-tab-indicator');
  const panels = document.querySelectorAll('.tab-content');

  const updateIndicator = (activeTab) => {
    if (!activeTab || !indicator) return;
    indicator.style.width = `${activeTab.offsetWidth}px`;
    indicator.style.left = `${activeTab.offsetLeft}px`;
  };

  const switchTab = (tabId) => {
    const targetTab = document.querySelector(`.bento-tab[data-tab="${tabId}"]`);
    if (!targetTab) return;

    // Toggle active state on tabs
    tabs.forEach(t => t.classList.remove('active'));
    targetTab.classList.add('active');
    
    // Slide indicator pill
    updateIndicator(targetTab);

    // Show corresponding panel content
    panels.forEach(panel => {
      if (panel.id === `content-${tabId}`) {
        panel.classList.remove('hidden');
        panel.classList.add('block');
      } else {
        panel.classList.remove('block');
        panel.classList.add('hidden');
      }
    });
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const tabId = tab.getAttribute('data-tab');
      switchTab(tabId);
    });
  });

  // Handle URL deep-linking and initial positioning
  const urlParams = new URLSearchParams(window.location.search);
  const initialTab = urlParams.get('tab') || 'terms';
  
  // Timeout ensures styling is fully computed in DOM before sliding indicator
  setTimeout(() => {
    switchTab(initialTab);
  }, 150);

  // Recalculate position on window resize
  window.addEventListener('resize', () => {
    const activeTab = document.querySelector('.bento-tab.active');
    if (activeTab) {
      updateIndicator(activeTab);
    }
  });
});
