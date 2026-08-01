const PARTNERS_API_BASE = 'https://backend.castiva.in/api/v1';
let currentPartnerCategory = 'talent';
let currentSubcategory = null;
const partnersDataCache = {};
let allTalentProfiles = [];
let allRecruiterProfiles = [];
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
  'linear-gradient(110deg, #EDE9FE 0%, #DDD6FE 100%)',
  'linear-gradient(110deg, #FCE7F3 0%, #FBCFE8 100%)',
  'linear-gradient(110deg, #DBEAFE 0%, #BFDBFE 100%)',
  'linear-gradient(110deg, #D1FAE5 0%, #A7F3D0 100%)',
  'linear-gradient(110deg, #FFEDD5 0%, #FED7AA 100%)',
  'linear-gradient(110deg, #CCFBF1 0%, #99F6E4 100%)',
  'linear-gradient(110deg, #FEF9C3 0%, #FDE68A 100%)',
  'linear-gradient(110deg, #FFE4E6 0%, #FECDD3 100%)',
];

const DIAL_CODE_FLAGS = {
  '1': 'us', '7': 'ru', '20': 'eg', '27': 'za', '30': 'gr', '31': 'nl',
  '32': 'be', '33': 'fr', '34': 'es', '36': 'hu', '39': 'it', '40': 'ro',
  '41': 'ch', '43': 'at', '44': 'gb', '45': 'dk', '46': 'se', '47': 'no',
  '48': 'pl', '49': 'de', '51': 'pe', '52': 'mx', '53': 'cu', '54': 'ar',
  '55': 'br', '56': 'cl', '57': 'co', '58': 've', '60': 'my', '61': 'au',
  '62': 'id', '63': 'ph', '64': 'nz', '65': 'sg', '66': 'th', '81': 'jp',
  '82': 'kr', '84': 'vn', '86': 'cn', '90': 'tr', '91': 'in', '92': 'pk',
  '93': 'af', '94': 'lk', '95': 'mm', '98': 'ir', '212': 'ma', '213': 'dz',
  '216': 'tn', '218': 'ly', '220': 'gm', '221': 'sn', '234': 'ng', '254': 'ke',
  '255': 'tz', '256': 'ug', '260': 'zm', '263': 'zw', '351': 'pt', '352': 'lu',
  '353': 'ie', '354': 'is', '355': 'al', '356': 'mt', '357': 'cy', '358': 'fi',
  '359': 'bg', '370': 'lt', '371': 'lv', '372': 'ee', '373': 'md', '374': 'am',
  '375': 'by', '380': 'ua', '381': 'rs', '385': 'hr', '386': 'si', '387': 'ba',
  '420': 'cz', '421': 'sk', '852': 'hk', '853': 'mo', '880': 'bd', '886': 'tw',
  '962': 'jo', '963': 'sy', '964': 'iq', '965': 'kw', '966': 'sa', '967': 'ye',
  '968': 'om', '971': 'ae', '972': 'il', '973': 'bh', '974': 'qa', '975': 'bt',
  '976': 'mn', '977': 'np', '992': 'tj', '993': 'tm', '994': 'az', '995': 'ge',
  '996': 'kg', '998': 'uz',
};

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

function getCountryFromPhone(phone) {
  if (!phone) return '';
  var digits = String(phone).replace(/\D/g, '');
  var keys = Object.keys(DIAL_CODE_FLAGS).sort(function(a, b) { return b.length - a.length; });
  for (var i = 0; i < keys.length; i++) {
    if (digits.indexOf(keys[i]) === 0) {
      return DIAL_CODE_FLAGS[keys[i]];
    }
  }
  return '';
}

function getProfileMobile(profile) {
  var nested = profile.user || {};
  return profile.mobile || profile.phone || profile.phoneNumber || profile.mobileNumber ||
         profile.contactNumber || nested.mobile || nested.phone || nested.phoneNumber || '';
}

function getProfileCountry(profile) {
  var country = profile.country;
  if (typeof country === 'string' && country.trim().startsWith('{')) {
    try {
      var parsed = JSON.parse(country.replace(/'/g, '"'));
      country = parsed.country || country;
    } catch (e) {}
  }
  if (typeof country === 'string' && country.trim()) return country.trim();
  var city = profile.city;
  if (typeof city === 'string' && city.trim().startsWith('{')) {
    try {
      var pc = JSON.parse(city.replace(/'/g, '"'));
      if (pc.country) return pc.country.trim();
    } catch (e) {}
  }
  return '';
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

  var roleTagHtml = '<span class="celebrity-tag">' + category + '</span>';
  var tagsHtml = '<div class="celebrity-tags">' + roleTagHtml + '</div>';

  var viewProfileBtnHtml = '<div class="view-profile-wrapper">' +
    '<button class="view-profile-btn" style="height:36px;box-shadow:inset 0 0 0 1px rgba(255,255,255,0.1);background:radial-gradient(ellipse at bottom,rgba(55,55,55,1) 0%,rgba(0,0,0,1) 100%);">' +
      '<span class="view-profile-label">View Profile</span>' +
      '<span aria-hidden="true" class="view-profile-glow"></span>' +
    '</button>' +
  '</div>';

  var countryCode = getCountryFromPhone(getProfileMobile(profile)) || getCountryCode(getProfileCountry(profile)) || 'in';
  var flagHtml = countryCode
    ? '<div class="celebrity-flag-wrap"><img src="https://flagcdn.com/w80/' + countryCode.toLowerCase() + '.png" alt="Flag" class="celebrity-flag" loading="lazy" onerror="this.style.display=\'none\'"></div>'
    : '';

  var description = getProfileTagline(profile);
  var descriptionHtml = '<p class="celebrity-desc">' + (description || '') + '</p>';

  var stockPhoto = getPhoto(id);
  var avatarHtml = avatar
    ? '<img src="' + avatar + '" alt="' + name + '" class="celebrity-avatar" loading="lazy" onerror="this.onerror=null;this.src=\'' + stockPhoto + '\'">'
    : '<img src="' + stockPhoto + '" alt="' + name + '" class="celebrity-avatar" loading="lazy">';

  var bottomRowHtml = '<div class="celebrity-bottom-row">' +
    tagsHtml +
    viewProfileBtnHtml +
  '</div>';

  return '<div class="partner-card celebrity-card" onclick="' + clickHandler + '" style="background: ' + gradient + '">' +
    flagHtml +
    '<div class="celebrity-inner-card">' +
      '<div class="celebrity-avatar-wrapper">' + avatarHtml + '</div>' +
      '<h4 class="celebrity-name">' + name + '</h4>' +
      descriptionHtml +
      bottomRowHtml +
    '</div>' +
  '</div>';
}


function filterProfilesBySubcategory(categoryId, subcategoryName) {
  var profiles = categoryId === 'recruiter' ? allRecruiterProfiles : allTalentProfiles;
  if (!profiles || profiles.length === 0) return [];
  if (!subcategoryName) return profiles;
  var needle = subcategoryName.toLowerCase();
  return profiles.filter(function(p) {
    if (categoryId === 'recruiter') {
      return [p.recruiterType, p.recruiterCategory]
        .filter(Boolean)
        .some(function(v) { return v.toLowerCase() === needle; });
    }
    return (p.subTalents || []).some(function(s) { return s.toLowerCase() === needle; });
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

function buildMarqueeBlock(set, categoryId, subcategoryName, minCards) {
  if (!set || set.length === 0) return '';
  var repeats = Math.max(1, Math.ceil(minCards / set.length));
  var html = '';
  for (var r = 0; r < repeats; r++) {
    html += set.map(function(p) { return createPartnerCard(p, categoryId, subcategoryName); }).join('');
  }
  return html;
}

function renderPartnerCards(profiles, categoryId, subcategoryName) {
  if (!profiles || profiles.length === 0) {
    if (categoryId === 'recruiter') return { leftCards: comingSoonHtml(), rightCards: '' };
    if (categoryId === 'celebrities') return { leftCards: '<div class="w-full flex flex-col items-center justify-center py-6 text-center"><img src="icons/howitworks-talent/Discivery.png" alt="No celebrities" class="w-32 h-32 mb-3"><p class="text-slate-600 text-base font-semibold">No celebrity profiles found.</p></div>', rightCards: '' };
    return { leftCards: '<div class="text-center text-slate-500 py-6 w-full">No profiles found.</div>', rightCards: '' };
  }

  var leftSet, rightSet;
  if (profiles.length <= 4) {
    leftSet = profiles;
    rightSet = profiles;
  } else {
    var mid = Math.ceil(profiles.length / 2);
    leftSet = profiles.slice(0, mid);
    rightSet = profiles.slice(mid);
  }

  var leftBlock = buildMarqueeBlock(leftSet, categoryId, subcategoryName, 6);
  var rightBlock = buildMarqueeBlock(rightSet, categoryId, subcategoryName, 6);

  return { leftCards: leftBlock + leftBlock, rightCards: rightBlock + rightBlock };
}

function applyPartnersContent(data) {
  var marqueeLeft = document.getElementById('partners-marquee-left');
  var marqueeRight = document.getElementById('partners-marquee-right');
  marqueeLeft.innerHTML = data.leftCards;
  marqueeRight.innerHTML = data.rightCards;

  var rightRow = marqueeRight.closest('.partners-marquee-row');
  var hasRight = data.rightCards && data.rightCards.trim() !== '';

  if (data.hasProfiles) {
    marqueeLeft.classList.add('animate-marquee-left');
    if (hasRight) {
      marqueeRight.classList.add('animate-marquee-right');
      if (rightRow) rightRow.style.display = '';
    } else {
      marqueeRight.classList.remove('animate-marquee-right');
      if (rightRow) rightRow.style.display = 'none';
    }
  } else {
    marqueeLeft.classList.remove('animate-marquee-left');
    marqueeRight.classList.remove('animate-marquee-right');
    if (rightRow) rightRow.style.display = 'none';
  }
}

function renderContent(profiles, categoryId, subcategoryName) {
  var cacheKey = subcategoryName ? categoryId + '-' + subcategoryName : categoryId;
  var result = renderPartnerCards(profiles, categoryId, subcategoryName);
  var hasProfiles = profiles && profiles.length > 0;
  result.hasProfiles = hasProfiles;
  partnersDataCache[cacheKey] = result;

  applyPartnersContent(result);
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
      loadSubcategory(categoryId, sub);
      renderSubcategoryPills(subcategories, sub, categoryId);
    });
  });
}

function loadSubcategory(categoryId, subcategoryName) {
  var cacheKey = subcategoryName ? categoryId + '-' + subcategoryName : categoryId;

  if (partnersDataCache[cacheKey]) {
    applyPartnersContent(partnersDataCache[cacheKey]);
    return;
  }

  var profiles = filterProfilesBySubcategory(categoryId, subcategoryName);
  renderContent(profiles, categoryId, subcategoryName);
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
    applyPartnersContent(partnersDataCache[cacheKey]);

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
    loadSubcategory('talent', null);
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
        allRecruiterProfiles = extractPartnerData(json);
        renderContent(allRecruiterProfiles, 'recruiter', null);
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
  loadSubcategory('talent', null);
  currentPartnerCategory = 'talent';
  loadingEl.classList.add('hidden');
  contentEl.classList.remove('hidden');
}

document.addEventListener('DOMContentLoaded', initPartners);
