let currentPartnersTab = 'actors';

function updatePartnersIndicator(activeTab) {
  const indicator = document.getElementById('partners-tab-indicator');
  if (!activeTab || !indicator) return;
  indicator.style.width = `${activeTab.offsetWidth}px`;
  indicator.style.left = `${activeTab.offsetLeft}px`;
}

function switchPartners(type, clickedBtn) {
  if (currentPartnersTab === type) return;
  currentPartnersTab = type;
  
  const buttons = document.querySelectorAll('#partners-section .bento-tab');
  buttons.forEach(btn => btn.classList.remove('active'));
  if (clickedBtn) {
    clickedBtn.classList.add('active');
    updatePartnersIndicator(clickedBtn);
  }
  
  const panels = ['actors', 'recruiters', 'celebrities', 'influencers'];
  panels.forEach(p => {
    const panel = document.getElementById(`partners-${p}-panel`);
    if (!panel) return;
    if (p === type) {
      panel.classList.remove('hidden');
      setTimeout(() => {
        panel.classList.remove('opacity-0');
      }, 50);
    } else {
      panel.classList.add('opacity-0');
      setTimeout(() => {
        panel.classList.add('hidden');
      }, 300);
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const activePartnersTab = document.querySelector('#partners-section .bento-tab.active');
  if (activePartnersTab) {
    setTimeout(() => {
      updatePartnersIndicator(activePartnersTab);
    }, 200);
  }

  window.addEventListener('resize', () => {
    const currentActivePartnersTab = document.querySelector('#partners-section .bento-tab.active');
    if (currentActivePartnersTab) {
      updatePartnersIndicator(currentActivePartnersTab);
    }
  });
});
