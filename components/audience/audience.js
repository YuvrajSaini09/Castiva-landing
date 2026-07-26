// Audience Categories Switcher and Expander Logic
let currentAudienceTab = 'talent';
let categoriesExpanded = false;

function switchAudience(type) {
  if (currentAudienceTab === type) return;
  currentAudienceTab = type;
  
  const talentPanel = document.getElementById('talent-categories-panel');
  const recruiterPanel = document.getElementById('recruiter-categories-panel');
  const talentBtn = document.getElementById('toggle-talent-btn');
  const recruiterBtn = document.getElementById('toggle-recruiter-btn');
  
  if (type === 'talent') {
    // Reset toggle button styles
    talentBtn.className = "px-8 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 relative z-10 text-white bg-gradient-to-r from-purple-600 to-indigo-600 shadow-sm";
    recruiterBtn.className = "px-8 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 relative z-10 text-slate-600 hover:text-slate-900";
    
    // Panel visibility
    recruiterPanel.classList.add('opacity-0');
    setTimeout(() => {
      recruiterPanel.classList.add('hidden');
      talentPanel.classList.remove('hidden');
      setTimeout(() => {
        talentPanel.classList.remove('opacity-0');
      }, 50);
    }, 300);
  } else {
    // Reset toggle button styles
    recruiterBtn.className = "px-8 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 relative z-10 text-white bg-gradient-to-r from-purple-600 to-indigo-600 shadow-sm";
    talentBtn.className = "px-8 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 relative z-10 text-slate-600 hover:text-slate-900";
    
    // Panel visibility
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
