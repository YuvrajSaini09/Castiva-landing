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

const CARD_PHOTOS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=500&auto=format&fit=crop&q=80',
];

const CARD_GRADIENTS = [
  'linear-gradient(110deg, #c7d2fe 0%, #fbcfe8 45%, #fed7aa 100%)',
  'linear-gradient(110deg, #bae6fd 0%, #ddd6fe 50%, #fbcfe8 100%)',
  'linear-gradient(110deg, #fde68a 0%, #fca5a5 55%, #f9a8d4 100%)',
  'linear-gradient(110deg, #a7f3d0 0%, #bae6fd 50%, #c4b5fd 100%)',
  'linear-gradient(110deg, #e9d5ff 0%, #fbcfe8 50%, #fecaca 100%)',
  'linear-gradient(110deg, #fecdd3 0%, #fdba74 50%, #fef08a 100%)',
];

function hashId(id) {
  var hash = 0;
  for (var i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  return Math.abs(hash);
}

function getGradient(id) {
  return CARD_GRADIENTS[hashId(id) % CARD_GRADIENTS.length];
}

function getPhoto(id) {
  return CARD_PHOTOS[hashId(id) % CARD_PHOTOS.length];
}

function getCountryCode(country) {
  if (!country) return '';
  var key = country.toLowerCase().trim();
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
  var subs = [];
  categories.forEach(function(cat) {
    var children = cat.children || [];
    if (children.length > 0) {
      children.forEach(function(child) {
        if (child.name && !subs.some(function(s) { return s.name === child.name; })) {
          subs.push({ name: child.name, slug: child.slug || child.name });
        }
      });
    } else {
      if (cat.name && !subs.some(function(s) { return s.name === cat.name; })) {
        subs.push({ name: cat.name, slug: cat.slug || cat.name });
      }
    }
  });
  return subs;
}

function getProfileName(profile, categoryId) {
  if (categoryId === 'recruiter') return profile.companyName || profile.fullName || 'Recruiter';
  return profile.screenName || profile.fullName || profile.name || 'Talent';
}

function getProfileCategory(profile, categoryId, subcategoryName) {
  if (subcategoryName) return subcategoryName;
  if (categoryId === 'recruiter') return profile.recruiterCategory || 'Recruiter';
  if (categoryId === 'celebrities') {
    if (profile.category) return profile.category;
    var subs = (profile.subTalents || []).map(function(s) { return s.toLowerCase(); });
    for (var i = 0; i < CELEBRITY_ROLES.length; i++) {
      if (subs.indexOf(CELEBRITY_ROLES[i]) !== -1) {
        return CELEBRITY_ROLES[i].charAt(0).toUpperCase() + CELEBRITY_ROLES[i].slice(1);
      }
    }
  }
  return profile.primaryCategory || profile.recruiterCategory || 'Professional';
}

function getProfileLocation(profile) {
  var city = profile.city;
  var state = profile.state;
  var country = profile.country;
  
  if (typeof city === 'string' && city.trim().startsWith('{')) {
    try {
      var parsed = JSON.parse(city.replace(/'/g, '"'));
      city = parsed.city || city;
      if (parsed.state) state = parsed.state;
      if (parsed.country) country = parsed.country;
    } catch(e) {}
  }
  
  var parts = [city, state, country].filter(Boolean);
  var loc = parts.join(', ') || '';
  if (loc.indexOf('{') !== -1) {
    loc = loc.replace(/[\{\}"]/g, '').replace(/\b(city|state|country)\s*:\s*/gi, '').trim();
  }
  return loc;
}

function getProfileTagline(profile) {
  if (profile.bio) {
    return profile.bio.length > 80 ? profile.bio.slice(0, 80) + '...' : profile.bio;
  }
  return null;
}

function getProfileRate(profile, categoryId) {
  if (categoryId === 'recruiter') return profile.recruiterType || '';
  if (profile.experienceLevel) {
    var level = profile.experienceLevel.charAt(0).toUpperCase() + profile.experienceLevel.slice(1);
    return level;
  }
  return '';
}

function getAvatar(profile) {
  return profile.avatar || profile.photo || profile.image || profile.profileImage || profile.photo || profile.photoUrl || profile.companyLogoUrl || '';
}

function createPartnerCard(profile, categoryId, subcategoryName) {
  var id = profile.id || 'default';
  var name = getProfileName(profile, categoryId);
  var category = getProfileCategory(profile, categoryId, subcategoryName);
  var location = getProfileLocation(profile);
  var avatar = getAvatar(profile);
  var gradient = getGradient(id);
  var initial = name ? name.charAt(0).toUpperCase() : '?';
  var clickHandler = "void(function(){if(localStorage.getItem('_cv')==='1'){window.open('https://castiva.in/auth','_blank')}else{localStorage.setItem('_cv','1');window.open('https://castiva.in/welcome','_blank')}}())";

  var locationPillHtml = '<div class="location-pill-wrapper">' +
    '<div class="relative inline-block group text-sm rounded-full">' +
      '<button class="group relative inline-flex min-w-[120px] cursor-default transition-all duration-[1000ms] ease-[cubic-bezier(0.15,0.83,0.66,1)] text-xs font-semibold text-white/70 tracking-tight rounded-full items-center justify-center text-center" style="height:32px;box-shadow:inset 0 0 0 1px rgba(255,255,255,0.1);background:radial-gradient(ellipse at bottom,rgba(55,55,55,1) 0%,rgba(0,0,0,1) 100%);">' +
        '<span class="relative z-10 font-normal rounded-full text-xs whitespace-nowrap">' +
          (location ? '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline;vertical-align:-1px;margin-right:4px"><path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"/><circle cx="12" cy="10" r="3"/></svg>' + location : 'UnKnown') +
        '</span>' +
        '<span aria-hidden="true" class="absolute bottom-0 left-1/2 h-[1px] w-[70%] -translate-x-1/2 opacity-20 transition-all duration-[1000ms] ease-[cubic-bezier(0.15,0.83,0.66,1)] group-hover:opacity-80 rounded-full text-xs" style="background:linear-gradient(90deg,rgba(255,255,255,0) 0%,rgba(255,255,255,1) 50%,rgba(255,255,255,0) 100%);"></span>' +
      '</button>' +
    '</div>' +
  '</div>';

  var avatarHtml = avatar
    ? '<img src="' + avatar + '" alt="' + name + '" class="celebrity-avatar" loading="lazy" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'"><div class="partner-avatar-placeholder celebrity-avatar" style="display:none;background:' + gradient + '">' + initial + '</div>'
    : '<div class="partner-avatar-placeholder celebrity-avatar" style="background:' + gradient + '">' + initial + '</div>';

  return '<div class="partner-card celebrity-card" onclick="' + clickHandler + '" style="background: ' + gradient + '">' +
    '<div class="celebrity-inner-card">' +
      '<div class="celebrity-avatar-wrapper">' + avatarHtml + '</div>' +
      '<h4 class="celebrity-name">' + name + '</h4>' +
      '<p class="celebrity-role">' + category + '</p>' +
      locationPillHtml +
    '</div>' +
  '</div>';
}


function filterProfilesBySubcategory(profiles, subcategoryName) {
  if (!profiles || profiles.length === 0) return [];
  if (!subcategoryName) return profiles;
  return profiles.filter(function(p) {
    return (p.subTalents || []).some(function(s) { return s.toLowerCase() === subcategoryName.toLowerCase(); });
  });
}

function comingSoonHtml() {
  return '<div class="w-full flex flex-col items-center justify-center py-6 text-center">' +
    '<div class="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-3">' +
      '<svg class="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>' +
    '</div>' +
    '<p class="text-slate-500 text-base font-medium">Profiles are being onboarded. Check back soon!</p>' +
  '</div>';
}

function renderPartnerCards(profiles, categoryId, subcategoryName) {
  if (!profiles || profiles.length === 0) {
    if (categoryId === 'recruiter') return { leftCards: comingSoonHtml(), rightCards: '' };
    if (categoryId === 'celebrities') return { leftCards: '<div class="w-full flex flex-col items-center justify-center py-6 text-center"><img src="icons/howitworks-talent/Discivery.png" alt="No celebrities" class="w-32 h-32 mb-3"><p class="text-slate-600 text-base font-semibold">No celebrity profiles found.</p></div>', rightCards: '' };
    return { leftCards: '<div class="text-center text-slate-500 py-6 w-full">No profiles found.</div>', rightCards: '' };
  }

  var mid = Math.ceil(profiles.length / 2);
  var leftSet = profiles.slice(0, mid);
  var rightSet = profiles.slice(mid);

  var leftCards = leftSet.map(function(p) { return createPartnerCard(p, categoryId, subcategoryName); }).join('') +
                  leftSet.map(function(p) { return createPartnerCard(p, categoryId, subcategoryName); }).join('');
  var rightCards = rightSet.map(function(p) { return createPartnerCard(p, categoryId, subcategoryName); }).join('') +
                   rightSet.map(function(p) { return createPartnerCard(p, categoryId, subcategoryName); }).join('');

  return { leftCards: leftCards, rightCards: rightCards };
}

function renderContent(profiles, categoryId, subcategoryName) {
  var cacheKey = subcategoryName ? categoryId + '-' + subcategoryName : categoryId;
  var result = renderPartnerCards(profiles, categoryId, subcategoryName);
  var hasProfiles = profiles && profiles.length > 0;
  result.hasProfiles = hasProfiles;
  partnersDataCache[cacheKey] = result;

  var marqueeLeft = document.getElementById('partners-marquee-left');
  var marqueeRight = document.getElementById('partners-marquee-right');

  marqueeLeft.innerHTML = result.leftCards;
  marqueeRight.innerHTML = result.rightCards;

  if (hasProfiles) {
    marqueeLeft.classList.add('animate-marquee-left');
    marqueeRight.classList.add('animate-marquee-right');
  } else {
    marqueeLeft.classList.remove('animate-marquee-left');
    marqueeRight.classList.remove('animate-marquee-right');
  }
}

function renderSubcategoryPills(subcategories, activeSub, categoryId) {
  var container = document.getElementById('partners-subcategories-scroll');
  if (!container) return;

  var html = '<button class="sub-pill' + (!activeSub ? ' active' : '') + '" data-sub="">All</button>';
  subcategories.forEach(function(s) {
    var isActive = activeSub === s.name;
    html += '<button class="sub-pill' + (isActive ? ' active' : '') + '" data-sub="' + s.name + '">' + s.name + '</button>';
  });
  container.innerHTML = html;

  container.querySelectorAll('.sub-pill').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var sub = this.dataset.sub || null;
      currentSubcategory = sub;
      loadTalentSubcategory(sub);
      renderSubcategoryPills(subcategories, sub, categoryId);
    });
  });
}

function loadTalentSubcategory(subcategoryName) {
  var cacheKey = subcategoryName ? 'talent-' + subcategoryName : 'talent';

  if (partnersDataCache[cacheKey]) {
    var data = partnersDataCache[cacheKey];
    document.getElementById('partners-marquee-left').innerHTML = data.leftCards;
    document.getElementById('partners-marquee-right').innerHTML = data.rightCards;
    return;
  }

  var profiles = filterProfilesBySubcategory(allTalentProfiles, subcategoryName);
  renderContent(profiles, 'talent', subcategoryName);
}

function updatePartnersIndicator(activeTab) {
  var indicator = document.getElementById('partners-tab-indicator');
  if (!activeTab || !indicator) return;
  indicator.style.width = activeTab.offsetWidth + 'px';
  indicator.style.left = activeTab.offsetLeft + 'px';
}

function switchPartnerCategory(categoryId, clickedBtn) {
  if (currentPartnerCategory === categoryId) return;
  currentPartnerCategory = categoryId;
  currentSubcategory = null;

  document.querySelectorAll('#partners-section .bento-tab').forEach(function(btn) { btn.classList.remove('active'); });
  if (clickedBtn) {
    clickedBtn.classList.add('active');
    updatePartnersIndicator(clickedBtn);
  }

  var loadingEl = document.getElementById('partners-loading');
  var contentEl = document.getElementById('partners-content');
  var subcatsContainer = document.getElementById('partners-subcategories');
  var errorEl = document.getElementById('partners-error');
  errorEl.classList.add('hidden');

  var cacheKey = categoryId;

  if (partnersDataCache[cacheKey]) {
    var data = partnersDataCache[cacheKey];
    var marqueeLeft = document.getElementById('partners-marquee-left');
    var marqueeRight = document.getElementById('partners-marquee-right');
    marqueeLeft.innerHTML = data.leftCards;
    marqueeRight.innerHTML = data.rightCards;

    if (data.hasProfiles) {
      marqueeLeft.classList.add('animate-marquee-left');
      marqueeRight.classList.add('animate-marquee-right');
    } else {
      marqueeLeft.classList.remove('animate-marquee-left');
      marqueeRight.classList.remove('animate-marquee-right');
    }

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
      fetch(PARTNERS_API_BASE + '/cms/categories/tree?scope=recruiter')
        .then(function(res) { return res.ok ? res.json() : null; })
        .then(function(json) {
          if (json) recruiterSubcategories = flattenSubcategories(extractPartnerData(json));
          renderSubcategoryPills(recruiterSubcategories, null, 'recruiter');
        })
        .catch(function() { renderSubcategoryPills(recruiterSubcategories, null, 'recruiter'); });
    } else {
      renderSubcategoryPills(recruiterSubcategories, null, 'recruiter');
    }

    fetch(PARTNERS_API_BASE + '/recruiter/profiles')
      .then(function(res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function(json) {
        renderContent(extractPartnerData(json), 'recruiter', null);
        loadingEl.classList.add('hidden');
        contentEl.classList.remove('hidden');
      })
      .catch(function() {
        renderContent([], 'recruiter', null);
        loadingEl.classList.add('hidden');
        contentEl.classList.remove('hidden');
      });
  } else {
    subcatsContainer.classList.add('hidden');
    loadingEl.classList.remove('hidden');
    contentEl.classList.add('hidden');

    fetch(PARTNERS_API_BASE + '/home/celebrities')
      .then(function(res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function(json) {
        var data = extractPartnerData(json);
        if (!data || data.length === 0) {
          data = allTalentProfiles.filter(function(p) {
            return (p.subTalents || []).some(function(s) {
              return CELEBRITY_ROLES.indexOf(s.toLowerCase()) !== -1;
            });
          });
        }
        renderContent(data, 'celebrities', null);
        loadingEl.classList.add('hidden');
        contentEl.classList.remove('hidden');
      })
      .catch(function() {
        var data = allTalentProfiles.filter(function(p) {
          return (p.subTalents || []).some(function(s) {
            return CELEBRITY_ROLES.indexOf(s.toLowerCase()) !== -1;
          });
        });
        renderContent(data, 'celebrities', null);
        loadingEl.classList.add('hidden');
        contentEl.classList.remove('hidden');
      });
  }
}

async function initPartners() {
  var loadingEl = document.getElementById('partners-loading');
  var contentEl = document.getElementById('partners-content');
  var errorEl = document.getElementById('partners-error');

  loadingEl.classList.remove('hidden');
  contentEl.classList.add('hidden');
  errorEl.classList.add('hidden');

  var activeTab = document.querySelector('#partners-section .bento-tab.active');
  if (activeTab) {
    setTimeout(function() { updatePartnersIndicator(activeTab); }, 200);
  }

  window.addEventListener('resize', function() {
    var tab = document.querySelector('#partners-section .bento-tab.active');
    if (tab) updatePartnersIndicator(tab);
  });

  document.querySelectorAll('#partners-section .bento-tab').forEach(function(btn) {
    btn.addEventListener('click', function() {
      switchPartnerCategory(this.dataset.category, this);
    });
  });

  try {
    var profilesRes = await fetch(PARTNERS_API_BASE + '/talent/profiles');
    var talentCatRes = await fetch(PARTNERS_API_BASE + '/cms/categories/tree?scope=talent');

    if (profilesRes.ok) {
      var json = await profilesRes.json();
      allTalentProfiles = extractPartnerData(json);
    }

    if (talentCatRes.ok) {
      var json = await talentCatRes.json();
      talentSubcategories = flattenSubcategories(extractPartnerData(json));
    }
  } catch (err) {
    console.error('Partners init error:', err);
  }

  var subcatsContainer = document.getElementById('partners-subcategories');
  subcatsContainer.classList.remove('hidden');
  renderSubcategoryPills(talentSubcategories, null, 'talent');
  loadTalentSubcategory(null);
  currentPartnerCategory = 'talent';
  loadingEl.classList.add('hidden');
  contentEl.classList.remove('hidden');
}

document.addEventListener('DOMContentLoaded', initPartners);
