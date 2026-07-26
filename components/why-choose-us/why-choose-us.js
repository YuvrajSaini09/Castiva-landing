// Why Choose Us Tab Switcher
function switchWhy(tab, btn) {
  // Hide all panels
  document.querySelectorAll('.why-panel').forEach(p => {
    p.classList.add('opacity-0', 'hidden');
    p.classList.remove('opacity-100', 'block');
  });

  // Show target panel
  const panel = document.getElementById('why-' + tab + '-panel');
  if (panel) {
    panel.classList.remove('opacity-0', 'hidden');
    panel.classList.add('opacity-100', 'block');
  }

  // Update tab active state
  btn.closest('.bento-tab-container').querySelectorAll('.bento-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');

  // Slide indicator
  const indicator = document.getElementById('why-tab-indicator');
  if (indicator) {
    indicator.style.left = btn.offsetLeft + 'px';
    indicator.style.width = btn.offsetWidth + 'px';
  }
}

// Init indicator on load
document.addEventListener('DOMContentLoaded', () => {
  const activeBtn = document.querySelector('#why-choose-us .bento-tab.active');
  const indicator = document.getElementById('why-tab-indicator');
  if (activeBtn && indicator) {
    indicator.style.left = activeBtn.offsetLeft + 'px';
    indicator.style.width = activeBtn.offsetWidth + 'px';
  }
});
