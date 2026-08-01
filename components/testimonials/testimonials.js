// Testimonials Component Logic

(function () {
  var apiBase = 'https://backend.castiva.in/api/v1';

  function buildTestimonialCard(t) {
    var card = document.createElement('div');
    card.className = 'tp-card inline-block align-top shrink-0';

    var filled = Math.max(1, Math.min(5, t.starsCount || 5));
    var starSvg = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>';
    var stars = '';
    for (var i = 0; i < 5; i++) {
      stars += '<span class="' + (i < filled ? 'text-amber-400' : 'text-slate-200') + '">' + starSvg + '</span>';
    }

    var avatarInner;
    if (t.imageUrl) {
      avatarInner = '<img src="' + t.imageUrl + '" alt="' + (t.name || '') + '" loading="lazy" class="tp-avatar-img" onerror="this.style.display=\'none\'">';
    } else {
      avatarInner = '<span class="tp-fallback">' + (t.name ? t.name.charAt(0).toUpperCase() : 'C') + '</span>';
    }

    card.innerHTML =
      '<div class="tp-glow"></div>' +
      '<div class="tp-quote">&ldquo;</div>' +
      '<div class="tp-head">' +
        '<div class="tp-avatar">' +
          avatarInner +
          '<span class="tp-badge"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg></span>' +
        '</div>' +
        '<div class="tp-info">' +
          '<h3>' + (t.name || 'Castiva Talent') + '</h3>' +
          '<p class="tp-role">Verified Talent</p>' +
        '</div>' +
      '</div>' +
      '<div class="tp-stars">' + stars + '</div>' +
      '<p class="tp-text">&ldquo;' + (t.content || '') + '&rdquo;</p>';

    return card;
  }

  function populateTrack(trackId, items) {
    var track = document.getElementById(trackId);
    if (!track) return;
    items.forEach(function (t) {
      track.appendChild(buildTestimonialCard(t));
    });
    items.forEach(function (t) {
      track.appendChild(buildTestimonialCard(t));
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var loading = document.getElementById('testimonials-loading');
    var errorEl = document.getElementById('testimonials-error');
    var wrapper = document.getElementById('testimonials-wrapper');
    var wrapper2 = document.getElementById('testimonials-wrapper-2');

    if (!wrapper) return;

    fetch(apiBase + '/testimonials?_=' + Date.now())
      .then(function (res) { return res.json(); })
      .then(function (json) {
        if (!json.success || !Array.isArray(json.data)) {
          throw new Error('Invalid response');
        }

        var items = json.data.sort(function (a, b) {
          return (a.sortOrder || 0) - (b.sortOrder || 0);
        });

        if (items.length === 0) {
          loading.style.display = 'none';
          return;
        }

        populateTrack('testimonials-track', items);
        populateTrack('testimonials-track-2', items);

        loading.style.display = 'none';
        wrapper.style.display = 'block';
        if (wrapper2) wrapper2.style.display = 'block';

        requestAnimationFrame(function () {
          var track = document.getElementById('testimonials-track');
          var track2 = document.getElementById('testimonials-track-2');
          if (track) track.classList.add('animate-marquee-testimonials');
          if (track2) track2.classList.add('animate-marquee-testimonials-reverse');
        });
      })
      .catch(function (err) {
        console.error('Testimonials fetch error:', err);
        loading.style.display = 'none';
        errorEl.classList.remove('hidden');
      });
  });
})();
