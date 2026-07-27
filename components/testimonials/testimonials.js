// Testimonials Component Logic

(function () {
  var apiBase = 'https://backend.castiva.in/api/v1';

  function createFallbackEl(name) {
    var el = document.createElement('div');
    el.className = 'w-full h-full flex items-center justify-center text-white font-bold text-xl bg-purple-600';
    el.textContent = name.charAt(0).toUpperCase();
    return el;
  }

  function buildTestimonialCard(t) {
    var card = document.createElement('div');
    card.className = 'inline-block shrink-0 w-[350px] bg-white border border-slate-100 p-8 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow';

    var top = document.createElement('div');
    top.className = 'flex items-center gap-4 mb-6';

    var imgWrapper = document.createElement('div');
    imgWrapper.className = 'w-14 h-14 rounded-full overflow-hidden shrink-0 bg-slate-100';

    if (t.imageUrl) {
      var img = document.createElement('img');
      img.className = 'w-full h-full object-cover';
      img.src = t.imageUrl;
      img.alt = t.name;
      img.loading = 'lazy';
      img.onerror = function () {
        img.style.display = 'none';
        imgWrapper.appendChild(createFallbackEl(t.name));
      };
      imgWrapper.appendChild(img);
    } else {
      imgWrapper.appendChild(createFallbackEl(t.name));
    }

    var info = document.createElement('div');
    info.className = 'flex-1 min-w-0';

    var nameRow = document.createElement('div');
    nameRow.className = 'flex items-center gap-1.5';

    var nameEl = document.createElement('h4');
    nameEl.className = 'font-bold text-slate-900 text-base';
    nameEl.textContent = t.name;

    var starsEl = document.createElement('span');
    starsEl.className = 'text-yellow-400 text-xs shrink-0 font-semibold';
    starsEl.textContent = '(' + (t.starsCount || 0) + '\u00a0\u2605)';

    nameRow.appendChild(nameEl);
    nameRow.appendChild(starsEl);
    info.appendChild(nameRow);

    top.appendChild(imgWrapper);
    top.appendChild(info);

    var quote = document.createElement('p');
    quote.className = 'text-slate-600 text-sm leading-relaxed whitespace-normal font-sans';
    quote.textContent = '\u201C' + t.content + '\u201D';

    card.appendChild(top);
    card.appendChild(quote);
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
