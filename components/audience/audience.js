const API_BASE = 'https://backend.castiva.in/api/v1';

let currentAudienceTab = 'talent';

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

const FALLBACK_COLORS = [
  'bg-blue-100 text-blue-600', 'bg-pink-100 text-pink-600', 'bg-amber-100 text-amber-600',
  'bg-emerald-100 text-emerald-600', 'bg-indigo-100 text-indigo-600', 'bg-rose-100 text-rose-600',
  'bg-violet-100 text-violet-600', 'bg-teal-100 text-teal-600', 'bg-orange-100 text-orange-600',
  'bg-sky-100 text-sky-600'
];

function fallbackColor(name) {
  if (!name) return FALLBACK_COLORS[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return FALLBACK_COLORS[Math.abs(hash) % FALLBACK_COLORS.length];
}

function extractIconUrl(item) {
  if (!item) return '';
  if (typeof item === 'string') {
    if (item.startsWith('<svg')) return item;
    return item;
  }
  return item.imageUrl || item.icon || item.image || item.url || '';
}

function getChildren(item) {
  return item.children || item.subcategories || item.subCategories || item.items || [];
}

function imgError(img) {
  img.onerror = null;
  const name = img.getAttribute('data-name') || '';
  const circle = document.createElement('div');
  const color = fallbackColor(name);
  const initial = name.charAt(0).toUpperCase() || '?';
  circle.className = `w-24 h-24 rounded-full ${color} flex items-center justify-center shrink-0 text-3xl font-bold`;
  circle.textContent = initial;
  img.replaceWith(circle);
}

function createCategoryCard(sub) {
  const url = extractIconUrl(sub);
  let iconHtml;
  if (url && !url.startsWith('<svg')) {
    iconHtml = `<img src="${url}" alt="" class="w-24 h-24 object-contain shrink-0" loading="lazy" data-name="${sub.name || ''}" onerror="imgError(this)" />`;
  } else {
    const initial = (sub.name || '?').charAt(0).toUpperCase();
    const color = fallbackColor(sub.name);
    iconHtml = `<div class="w-24 h-24 rounded-full ${color} flex items-center justify-center shrink-0 text-3xl font-bold">${initial}</div>`;
  }

  return `<div class="group flex flex-col items-center gap-3 px-2 pt-4 pb-3 bg-white border border-slate-100 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_20px_rgba(161,40,255,0.06)] hover:border-purple-200 transition-all duration-300 cursor-pointer text-center">
    ${iconHtml}
    <span class="font-semibold text-slate-900 text-sm leading-tight">${sub.name}</span>
  </div>`;
}

function flattenAudienceSubcategories(categories) {
  const items = [];
  categories.forEach(cat => {
    const children = getChildren(cat);
    children.forEach(child => items.push(child));
  });
  return items;
}

/*
// ---- OLD: Category-grouped layout ----
function buildCategoryGroupHtml(category, isLastRow) {
  const children = getChildren(category);
  if (children.length === 0) return '';
  const isSingleItem = children.length === 1;
  let gridCols = 'grid-cols-1 sm:grid-cols-2';
  if (isLastRow) {
    gridCols = isSingleItem ? 'grid-cols-1 sm:grid-cols-1 md:grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3';
  }
  let html = '<div>';
  html += `<h4 class="text-sm font-extrabold text-slate-900 mb-6 flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-purple-600"></span> ${category.name}</h4>`;
  html += `<div class="grid ${gridCols} gap-4">`;
  children.forEach(child => { html += createCategoryCard(child, isLastRow); });
  html += '</div></div>';
  return html;
}

function buildCategoryPanel(categories, scope) {
  if (!categories || categories.length === 0) {
    return '<p class="text-center text-slate-500 py-8">No categories available.</p>';
  }
  const alwaysVisible = categories.slice(0, 2);
  const extended = categories.slice(2);
  let html = '<div class="space-y-12">';
  if (alwaysVisible.length > 0) {
    html += '<div class="grid grid-cols-1 lg:grid-cols-2 gap-12">';
    alwaysVisible.forEach(cat => { html += buildCategoryGroupHtml(cat, false); });
    html += '</div>';
  }
  if (extended.length > 0) {
    const extendedId = `extended-${scope}-categories`;
    html += `<div id="${extendedId}" class="hidden space-y-12">`;
    for (let i = 0; i < extended.length; i += 2) {
      const cat1 = extended[i];
      const cat2 = extended[i + 1];
      const isOdd = !cat2;
      if (isOdd) {
        html += `<div class="max-w-2xl mx-auto">${buildCategoryGroupHtml(cat1, true)}</div>`;
      } else {
        html += '<div class="grid grid-cols-1 lg:grid-cols-2 gap-12">';
        html += buildCategoryGroupHtml(cat1, false);
        html += buildCategoryGroupHtml(cat2, false);
        html += '</div>';
      }
    }
    html += '</div>';
  }
  html += '</div>';
  return html;
}
*/

function buildCategoryPanel(categories, scope) {
  const items = flattenAudienceSubcategories(categories);
  if (items.length === 0) return '<p class="text-center text-slate-500 py-8">No categories available.</p>';

  const INITIAL_COUNT = 14;
  const visibleItems = items.slice(0, INITIAL_COUNT);
  const hiddenItems = items.slice(INITIAL_COUNT);
  const hasMore = hiddenItems.length > 0;
  const gridClasses = 'grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-x-6 gap-y-10';

  let html = `<div class="${gridClasses}">`;
  visibleItems.forEach(sub => { html += createCategoryCard(sub); });
  html += '</div>';

  if (hasMore) {
    const hiddenId = `extended-${scope}-subcategories`;
    html += `<div id="${hiddenId}" class="hidden mt-10"><div class="${gridClasses}">`;
    hiddenItems.forEach(sub => { html += createCategoryCard(sub); });
    html += '</div></div>';

    html += `<div class="flex justify-center mt-10">
      <button onclick="toggleSubcategories('${scope}')" id="expand-${scope}-btn" class="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-3.5 rounded-full transition-all duration-300 flex items-center gap-2 shadow-lg shadow-purple-500/20 hover:scale-[1.03]">
        <span id="expand-${scope}-text">View All Categories</span>
        <svg id="expand-${scope}-icon" class="w-4 h-4 transform transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"/></svg>
      </button>
    </div>`;
  }

  return html;
}

function toggleSubcategories(scope) {
  const hidden = document.getElementById(`extended-${scope}-subcategories`);
  const btn = document.getElementById(`expand-${scope}-btn`);
  const text = document.getElementById(`expand-${scope}-text`);
  const icon = document.getElementById(`expand-${scope}-icon`);
  if (!hidden) return;

  const isHidden = hidden.classList.contains('hidden');
  if (isHidden) {
    hidden.classList.remove('hidden');
    text.innerText = 'Show Less Categories';
    if (icon) icon.classList.add('rotate-180');
  } else {
    hidden.classList.add('hidden');
    text.innerText = 'View All Categories';
    if (icon) icon.classList.remove('rotate-180');
    document.getElementById('audience-section').scrollIntoView({ behavior: 'smooth' });
  }
}

function extractData(raw) {
  if (Array.isArray(raw)) return raw;
  if (raw && Array.isArray(raw.data)) return raw.data;
  if (raw && Array.isArray(raw.results)) return raw.results;
  if (raw && Array.isArray(raw.categories)) return raw.categories;
  if (raw && typeof raw === 'object') {
    const firstVal = Object.values(raw)[0];
    if (Array.isArray(firstVal)) return firstVal;
  }
  return [];
}

async function fetchCategories(scope) {
  const url = `${API_BASE}/cms/categories/tree?scope=${scope}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  return extractData(json);
}

async function initAudienceSection() {
  const loadingEl = document.getElementById('audience-loading');
  const talentPanel = document.getElementById('talent-categories-panel');
  const recruiterPanel = document.getElementById('recruiter-categories-panel');

  try {
    const [talentData, recruiterData] = await Promise.all([
      fetchCategories('talent'),
      fetchCategories('recruiter')
    ]);

    talentPanel.innerHTML = buildCategoryPanel(talentData, 'talent');
    recruiterPanel.innerHTML = buildCategoryPanel(recruiterData, 'recruiter');

    loadingEl.style.display = 'none';
    talentPanel.classList.remove('hidden', 'opacity-0');
    talentPanel.classList.add('opacity-100', 'block');
    recruiterPanel.classList.add('hidden');
  } catch (err) {
    console.error('Audience fetch error:', err);
    loadingEl.innerHTML = `<p class="text-red-500">Failed to load categories. Please try again later.</p>
      <button onclick="initAudienceSection()" class="mt-4 px-6 py-2 bg-purple-600 text-white rounded-full font-semibold hover:bg-purple-700 transition-colors">Retry</button>`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const activeTab = document.querySelector('#audience-section .bento-tab.active');
  if (activeTab) {
    setTimeout(() => updateAudienceIndicator(activeTab), 200);
  }

  window.addEventListener('resize', () => {
    const tab = document.querySelector('#audience-section .bento-tab.active');
    if (tab) updateAudienceIndicator(tab);
  });

  initAudienceSection();
});
