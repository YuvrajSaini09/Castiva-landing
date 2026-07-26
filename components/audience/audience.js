// Audience Categories Selector & Expander Logic
let currentAudienceTab = 'talent';
let categoriesExpanded = false;

function updateAudienceIndicator(activeTab) {
  const indicator = document.getElementById('audience-tab-indicator');
  if (!activeTab || !indicator) return;
  indicator.style.width = `${activeTab.offsetWidth}px`;
  indicator.style.left = `${activeTab.offsetLeft}px`;
}

function switchAudience(type, clickedBtn) {
  if (currentAudienceTab === type) return;
  currentAudienceTab = type;
  
  const talentPanel = document.getElementById('talent-categories-panel');
  const recruiterPanel = document.getElementById('recruiter-categories-panel');
  const buttons = document.querySelectorAll('#audience-section .bento-tab');
  
  // Update active class on buttons
  buttons.forEach(btn => btn.classList.remove('active'));
  if (clickedBtn) {
    clickedBtn.classList.add('active');
    updateAudienceIndicator(clickedBtn);
  } else {
    const targetBtn = document.querySelector(`#audience-section .bento-tab[data-tab="${type}"]`);
    if (targetBtn) {
      targetBtn.classList.add('active');
      updateAudienceIndicator(targetBtn);
    }
  }
  
  // Handle Panel visibility transitions
  if (type === 'talent') {
    recruiterPanel.classList.add('opacity-0');
    setTimeout(() => {
      recruiterPanel.classList.add('hidden');
      talentPanel.classList.remove('hidden');
      setTimeout(() => {
        talentPanel.classList.remove('opacity-0');
      }, 50);
    }, 300);
  } else {
    talentPanel.classList.add('opacity-0');
    setTimeout(() => {
      talentPanel.classList.add('hidden');
      recruiterPanel.classList.remove('hidden');
      setTimeout(() => {
        recruiterPanel.classList.remove('opacity-0');
      }, 50);
    }, 300);
  }
}

function toggleCategories() {
  categoriesExpanded = !categoriesExpanded;
  
  const talentExtended = document.getElementById('extended-talent-categories');
  const recruiterExtended = document.getElementById('extended-recruiter-categories');
  const btnText = document.getElementById('expand-btn-text');
  const btnIcon = document.getElementById('expand-btn-icon');
  
  if (categoriesExpanded) {
    talentExtended.classList.remove('hidden');
    recruiterExtended.classList.remove('hidden');
    btnText.innerText = "Show Less Categories";
    btnIcon.classList.add('rotate-180');
  } else {
    talentExtended.classList.add('hidden');
    recruiterExtended.classList.add('hidden');
    btnText.innerText = "View All Categories";
    btnIcon.classList.remove('rotate-180');
    
    // Scroll smoothly to section top on collapse
    document.getElementById('audience-section').scrollIntoView({ behavior: 'smooth' });
  }
}

// Initial positioning on load and window resize
document.addEventListener('DOMContentLoaded', () => {
  const activeTab = document.querySelector('#audience-section .bento-tab.active');
  if (activeTab) {
    setTimeout(() => {
      updateAudienceIndicator(activeTab);
    }, 200);
  }

  window.addEventListener('resize', () => {
    const currentActiveTab = document.querySelector('#audience-section .bento-tab.active');
    if (currentActiveTab) {
      updateAudienceIndicator(currentActiveTab);
    }
  });
});
