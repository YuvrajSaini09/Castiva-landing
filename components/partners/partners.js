const PARTNERS_API_BASE = 'https://backend.castiva.in/api/v1';
let currentPartnerCategory = 'talent';
let currentSubcategory = null;
const partnersDataCache = {};
let allTalentProfiles = [];
let talentSubcategories = [];
let recruiterSubcategories = [];

const COUNTRY_FLAGS = {
  'india': 'in', 'usa': 'us', 'united states': 'us', 'uk': 'gb', 'united kingdom': 'gb',
  'australia': 'au', 'canada': 'ca', 'germany': 'de', 'france': 'fr', 'japan': 'jp',
  'china': 'cn', 'brazil': 'br', 'south korea': 'kr', 'singapore': 'sg', 'uae': 'ae',
  'dubai': 'ae', 'italy': 'it', 'spain': 'es', 'netherlands': 'nl', 'sweden': 'se',
  'norway': 'no', 'denmark': 'dk', 'switzerland': 'ch', 'thailand': 'th', 'vietnam': 'vn',
  'indonesia': 'id', 'malaysia': 'my', 'philippines': 'ph', 'new zealand': 'nz',
  'south africa': 'za', 'nigeria': 'ng', 'kenya': 'ke', 'egypt': 'eg', 'turkey': 'tr',
  'russia': 'ru', 'mexico': 'mx', 'argentina': 'ar', 'chile': 'cl', 'colombia': 'co',
  'pakistan': 'pk', 'bangladesh': 'bd', 'sri lanka': 'lk', 'nepal': 'np',
};

const CELEBRITY_ROLES = ['actor', 'model', 'singer', 'dancer'];

function getCountryCode(country) {
  if (!country) return '';
  const key = country.toLowerCase().trim();
  return COUNTRY_FLAGS[key] || key.slice(0, 2).toLowerCase();
}

function extractPartnerData(raw) {
  if (Array.isArray(raw)) return raw;
  if (raw && raw.data && Array.isArray(raw.data.hits)) return raw.data.hits;
  if (raw && raw.data && Array.isArray(raw.data.profiles)) return raw.data.profiles;
  if (raw && Array.isArray(raw.data)) return raw.data;
  if (raw && Array.isArray(raw.profiles)) return raw.profiles;
  if (raw && Array.isArray(raw.results)) return raw.results;
  return [];
}

function flattenSubcategories(categories) {
  const subs = [];
  categories.forEach(cat => {
    (cat.children || []).forEach(child => {
      if (child.name && !subs.some(s => s.name === child.name)) {
        subs.push({ name: child.name, slug: child.slug || child.name });
      }
    });
  });
  return subs;
}

function createPartnerCard(profile, categoryId, subcategoryName) {
  const name = profile.fullName || profile.name || 'Talent';
  const avatar = profile.avatar || profile.image || profile.profileImage || profile.photo || profile.photoUrl || '';
  const city = profile.city || '';
  const country = profile.country || '';
  const countryCode = getCountryCode(country);
  const initial = name.charAt(0).toUpperCase();
  const location = [city, country].filter(Boolean).join(', ') || '';

  let role = profile.primaryCategory || 'Talent';
  if (subcategoryName) {
    role = subcategoryName;
  } else if (categoryId === 'celebrities') {
    const subs = (profile.subTalents || []).map(s => s.toLowerCase());
    for (const r of CELEBRITY_ROLES) {
      if (subs.includes(r)) { role = r.charAt(0).toUpperCase() + r.slice(1); break; }
    }
  }

  const flagHtml = countryCode
    ? `<img src="https://flagcdn.com/${countryCode}.svg" alt="${country}" class="absolute top-4 right-4 w-7 h-auto rounded-sm shadow-md z-20" loading="lazy" onerror="this.style.display='none'">`
    : '';

  const avatarHtml = avatar
    ? `<img src="${avatar}" alt="${name}" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" onerror="this.style.display='none'">`
    : '';

  return `<div class="inline-block shrink-0 w-[240px] h-[320px] rounded-3xl overflow-hidden relative group shadow-sm hover:shadow-lg transition-all duration-300">
    <div class="absolute inset-0 bg-gradient-to-br from-purple-900 via-purple-800 to-slate-900 group-hover:scale-105 transition-transform duration-500"></div>
    ${avatarHtml}
    <div class="absolute inset-0 flex items-center justify-center">
      <div class="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-3xl font-bold text-white/80 backdrop-blur-sm">${initial}</div>
    </div>
    ${flagHtml}
    <div class="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent flex flex-col justify-end p-5">
      <h4 class="font-bold text-white text-base leading-tight whitespace-normal font-sans">${name}</h4>
      <p class="text-xs text-purple-300 font-medium mt-1 font-sans">${role}</p>
      ${location ? `<p class="text-[11px] text-slate-400 font-medium mt-1 font-sans">${location}</p>` : ''}
    </div>
  </div>`;
}

function filterProfilesBySubcategory(profiles, subcategoryName) {
  if (!profiles || profiles.length === 0) return [];
  if (!subcategoryName) return profiles;
  return profiles.filter(p =>
    (p.subTalents || []).some(s => s.toLowerCase() === subcategoryName.toLowerCase())
  );
}

function comingSoonHtml() {
  return `<div class="w-full flex flex-col items-center justify-center py-16 text-center">
    <div class="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-4">
      <svg class="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
    </div>
    <p class="text-slate-500 text-base font-medium">Recruiter profiles are being onboarded. Check back soon!</p>
  </div>`;
}

function renderPartnerCards(profiles, categoryId, subcategoryName) {
  if (!profiles || profiles.length === 0) {
    if (categoryId === 'recruiter') return { leftCards: comingSoonHtml(), rightCards: '' };
    return { leftCards: `<div class="text-center text-slate-500 py-10 w-full">No profiles found.</div>`, rightCards: '' };
  }

  const mid = Math.ceil(profiles.length / 2);
  const leftSet = profiles.slice(0, mid);
  const rightSet = profiles.slice(mid);

  const leftCards = leftSet.map(p => createPartnerCard(p, categoryId, subcategoryName)).join('') + leftSet.map(p => createPartnerCard(p, categoryId, subcategoryName)).join('');
  const rightCards = rightSet.map(p => createPartnerCard(p, categoryId, subcategoryName)).join('') + rightSet.map(p => createPartnerCard(p, categoryId, subcategoryName)).join('');

  return { leftCards, rightCards };
}

function renderContent(profiles, categoryId, subcategoryName) {
  const cacheKey = subcategoryName ? categoryId + '-' + subcategoryName : categoryId;
  const result = renderPartnerCards(profiles, categoryId, subcategoryName);
  partnersDataCache[cacheKey] = result;
  document.getElementById('partners-marquee-left').innerHTML = result.leftCards;
  document.getElementById('partners-marquee-right').innerHTML = result.rightCards;
}

function renderSubcategoryPills(subcategories, activeSub, categoryId) {
  const container = document.getElementById('partners-subcategories-scroll');
  if (!container) return;

  let html = `<button class="sub-pill ${!activeSub ? 'active' : ''}" data-sub="">All</button>`;
  subcategories.forEach(s => {
    const isActive = activeSub === s.name;
    html += `<button class="sub-pill ${isActive ? 'active' : ''}" data-sub="${s.name}">${s.name}</button>`;
  });
  container.innerHTML = html;

  container.querySelectorAll('.sub-pill').forEach(btn => {
    btn.addEventListener('click', function () {
      const sub = this.dataset.sub || null;
      currentSubcategory = sub;
      loadTalentSubcategory(sub);
      renderSubcategoryPills(subcategories, sub, categoryId);
    });
  });
}

function loadTalentSubcategory(subcategoryName) {
  const cacheKey = subcategoryName ? 'talent-' + subcategoryName : 'talent';

  if (partnersDataCache[cacheKey]) {
    const data = partnersDataCache[cacheKey];
    document.getElementById('partners-marquee-left').innerHTML = data.leftCards;
    document.getElementById('partners-marquee-right').innerHTML = data.rightCards;
    return;
  }

  const profiles = filterProfilesBySubcategory(allTalentProfiles, subcategoryName);
  renderContent(profiles, 'talent', subcategoryName);
}

function updatePartnersIndicator(activeTab) {
  const indicator = document.getElementById('partners-tab-indicator');
  if (!activeTab || !indicator) return;
  indicator.style.width = activeTab.offsetWidth + 'px';
  indicator.style.left = activeTab.offsetLeft + 'px';
}

function switchPartnerCategory(categoryId, clickedBtn) {
  if (currentPartnerCategory === categoryId) return;
  currentPartnerCategory = categoryId;
  currentSubcategory = null;

  document.querySelectorAll('#partners-section .bento-tab').forEach(btn => btn.classList.remove('active'));
  if (clickedBtn) {
    clickedBtn.classList.add('active');
    updatePartnersIndicator(clickedBtn);
  }

  const loadingEl = document.getElementById('partners-loading');
  const contentEl = document.getElementById('partners-content');
  const subcatsContainer = document.getElementById('partners-subcategories');
  const errorEl = document.getElementById('partners-error');
  errorEl.classList.add('hidden');

  const cacheKey = categoryId;

  if (partnersDataCache[cacheKey]) {
    const data = partnersDataCache[cacheKey];
    document.getElementById('partners-marquee-left').innerHTML = data.leftCards;
    document.getElementById('partners-marquee-right').innerHTML = data.rightCards;
    if (categoryId === 'talent') {
      subcatsContainer.classList.remove('hidden');
      renderSubcategoryPills(talentSubcategories, null, 'talent');
    } else if (categoryId === 'recruiter') {
      subcatsContainer.classList.remove('hidden');
      renderSubcategoryPills(recruiterSubcategories, null, 'recruiter');
    } else {
      subcatsContainer.classList.add('hidden');
    }
    loadingEl.classList.add('hidden');
    contentEl.classList.remove('hidden');
    return;
  }

  if (categoryId === 'talent') {
    subcatsContainer.classList.remove('hidden');
    renderSubcategoryPills(talentSubcategories, null, 'talent');
    loadTalentSubcategory(null);
    loadingEl.classList.add('hidden');
    contentEl.classList.remove('hidden');
  } else if (categoryId === 'recruiter') {
    loadingEl.classList.remove('hidden');
    contentEl.classList.add('hidden');
    subcatsContainer.classList.remove('hidden');

    if (recruiterSubcategories.length === 0) {
      fetch(`${PARTNERS_API_BASE}/cms/categories/tree?scope=recruiter`)
        .then(res => res.ok ? res.json() : null)
        .then(json => {
          if (json) recruiterSubcategories = flattenSubcategories(extractPartnerData(json));
          renderSubcategoryPills(recruiterSubcategories, null, 'recruiter');
        })
        .catch(() => renderSubcategoryPills(recruiterSubcategories, null, 'recruiter'));
    } else {
      renderSubcategoryPills(recruiterSubcategories, null, 'recruiter');
    }

    fetch(`${PARTNERS_API_BASE}/home/featured-recruiters`)
      .then(res => {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(json => {
        renderContent(extractPartnerData(json), 'recruiter', null);
        loadingEl.classList.add('hidden');
        contentEl.classList.remove('hidden');
      })
      .catch(() => {
        renderContent([], 'recruiter', null);
        loadingEl.classList.add('hidden');
        contentEl.classList.remove('hidden');
      });
  } else {
    subcatsContainer.classList.add('hidden');
    loadingEl.classList.remove('hidden');
    contentEl.classList.add('hidden');

    fetch(`${PARTNERS_API_BASE}/celebrity/list?status=&page=&limit=`)
      .then(res => {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(json => {
        let data = extractPartnerData(json);
        if (!data || data.length === 0) {
          data = allTalentProfiles.filter(p =>
            (p.subTalents || []).some(s => CELEBRITY_ROLES.includes(s.toLowerCase()))
          );
        }
        renderContent(data, 'celebrities', null);
        loadingEl.classList.add('hidden');
        contentEl.classList.remove('hidden');
      })
      .catch(() => {
        const data = allTalentProfiles.filter(p =>
          (p.subTalents || []).some(s => CELEBRITY_ROLES.includes(s.toLowerCase()))
        );
        renderContent(data, 'celebrities', null);
        loadingEl.classList.add('hidden');
        contentEl.classList.remove('hidden');
      });
  }
}

async function initPartners() {
  const loadingEl = document.getElementById('partners-loading');
  const contentEl = document.getElementById('partners-content');
  const errorEl = document.getElementById('partners-error');

  loadingEl.classList.remove('hidden');
  contentEl.classList.add('hidden');
  errorEl.classList.add('hidden');

  const activeTab = document.querySelector('#partners-section .bento-tab.active');
  if (activeTab) {
    setTimeout(() => updatePartnersIndicator(activeTab), 200);
  }

  window.addEventListener('resize', () => {
    const tab = document.querySelector('#partners-section .bento-tab.active');
    if (tab) updatePartnersIndicator(tab);
  });

  document.querySelectorAll('#partners-section .bento-tab').forEach(btn => {
    btn.addEventListener('click', function () {
      switchPartnerCategory(this.dataset.category, this);
    });
  });

  try {
    const [profilesRes, talentCatRes] = await Promise.all([
      fetch(`${PARTNERS_API_BASE}/talent/profiles`),
      fetch(`${PARTNERS_API_BASE}/cms/categories/tree?scope=talent`),
    ]);

    if (profilesRes.ok) {
      const json = await profilesRes.json();
      allTalentProfiles = extractPartnerData(json);
    }

    if (talentCatRes.ok) {
      const json = await talentCatRes.json();
      talentSubcategories = flattenSubcategories(extractPartnerData(json));
    }
  } catch (err) {
    console.error('Partners init error:', err);
  }

  const subcatsContainer = document.getElementById('partners-subcategories');
  subcatsContainer.classList.remove('hidden');
  renderSubcategoryPills(talentSubcategories, null, 'talent');
  loadTalentSubcategory(null);
  currentPartnerCategory = 'talent';
  loadingEl.classList.add('hidden');
  contentEl.classList.remove('hidden');
}

document.addEventListener('DOMContentLoaded', initPartners);
