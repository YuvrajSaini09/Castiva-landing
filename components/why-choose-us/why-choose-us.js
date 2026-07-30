// Why Choose Us Tab Switcher
let currentWhyTab = 'talent';

function updateWhyIndicator(activeTab) {
  const indicator = document.getElementById('why-tab-indicator');
  if (!activeTab || !indicator) return;
  indicator.style.width = `${activeTab.offsetWidth}px`;
  indicator.style.left = `${activeTab.offsetLeft}px`;
}

function switchWhy(type, clickedBtn) {
  if (currentWhyTab === type) return;
  currentWhyTab = type;

  const talentPanel = document.getElementById('why-talent-panel');
  const recruiterPanel = document.getElementById('why-recruiter-panel');
  const buttons = document.querySelectorAll('.why-choose-us-section .bento-tab');

  buttons.forEach(btn => btn.classList.remove('active'));
  if (clickedBtn) {
    clickedBtn.classList.add('active');
    updateWhyIndicator(clickedBtn);
  } else {
    const targetBtn = document.querySelector(`.why-choose-us-section .bento-tab[data-tab="${type}"]`);
    if (targetBtn) {
      targetBtn.classList.add('active');
      updateWhyIndicator(targetBtn);
    }
  }

  if (type === 'talent') {
    recruiterPanel.classList.add('opacity-0');
    setTimeout(() => {
      recruiterPanel.classList.add('hidden');
      talentPanel.classList.remove('hidden');
      setTimeout(() => talentPanel.classList.remove('opacity-0'), 50);
    }, 300);
  } else {
    talentPanel.classList.add('opacity-0');
    setTimeout(() => {
      talentPanel.classList.add('hidden');
      recruiterPanel.classList.remove('hidden');
      setTimeout(() => recruiterPanel.classList.remove('opacity-0'), 50);
    }, 300);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const activeTab = document.querySelector('.why-choose-us-section .bento-tab.active');
  if (activeTab) {
    setTimeout(() => updateWhyIndicator(activeTab), 200);
  }
  window.addEventListener('resize', () => {
    const tab = document.querySelector('.why-choose-us-section .bento-tab.active');
    if (tab) updateWhyIndicator(tab);
  });
});
