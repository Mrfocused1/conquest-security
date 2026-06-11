/* Conquest Security — live content hydration + page-view tracking.
 * Progressive enhancement: if Supabase is unreachable the static markup stands.
 */
(function () {
  var URL = 'https://pcpvshepcdahfrmvzxcy.supabase.co';
  var KEY = 'sb_publishable_F56AK9IgrvFxJZ6aHXy3Ag_PAleGBrb';
  var H = { apikey: KEY, Authorization: 'Bearer ' + KEY };

  function get(path) {
    return fetch(URL + '/rest/v1/' + path, { headers: H })
      .then(function (r) { return r.ok ? r.json() : null; })
      .catch(function () { return null; });
  }

  // Record a page view (fire-and-forget).
  fetch(URL + '/rest/v1/page_views', {
    method: 'POST',
    headers: Object.assign({ 'Content-Type': 'application/json', Prefer: 'return=minimal' }, H),
    body: JSON.stringify({ path: location.pathname, referrer: document.referrer || null }),
  }).catch(function () {});

  function setText(el, t) { if (el && t != null) el.textContent = t; }
  function setBtn(el, t) {
    if (el && t != null && el.firstChild && el.firstChild.nodeType === 3) el.firstChild.textContent = t + ' ';
  }

  // ----- Hero + CTA (sections table) -----
  get('sections?select=slug,content,design&slug=in.(hero,cta)').then(function (rows) {
    if (!rows) return;
    var bySlug = {};
    var design = {};
    rows.forEach(function (r) { bySlug[r.slug] = r.content || {}; if (r.slug === 'hero') design = r.design || {}; });

    // Custom uploaded logo overrides every logo image on the page.
    if (design.logo_url) {
      document.querySelectorAll('.hero-logo .shield, .hero-logo-m, .cta-mark, .brand .mark').forEach(function (img) {
        img.setAttribute('src', design.logo_url);
      });
    }

    var hero = bySlug.hero;
    if (hero) {
      var h1 = document.querySelector('.hero h1');
      if (h1 && hero.heading)
        h1.innerHTML = hero.heading.split('\n').map(function (l) {
          return l.replace(/[&<>]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]; });
        }).join('<br />');
      setText(document.querySelector('.hero-content > p'), hero.description);
      var btns = document.querySelectorAll('.hero-cta .btn');
      setBtn(btns[0], hero.primary_text);
      setBtn(btns[1], hero.secondary_text);
      if (btns[0] && hero.primary_link) btns[0].setAttribute('href', hero.primary_link);
      if (btns[1] && hero.secondary_link) btns[1].setAttribute('href', hero.secondary_link);
    }

    var cta = bySlug.cta;
    if (cta) {
      var ctaH = document.querySelector('.cta-banner h2');
      if (ctaH && cta.heading) ctaH.textContent = cta.heading;
      setText(document.querySelector('.cta-banner .sub'), cta.subtext);
      setBtn(document.querySelector('.cta-banner .cta-btn'), cta.button_text);
    }
  });

  // ----- Services -----
  get('services?select=title,description&order=sort_order').then(function (rows) {
    if (!rows) return;
    var cards = document.querySelectorAll('.services-grid .card');
    rows.forEach(function (s, i) {
      if (!cards[i]) return;
      setText(cards[i].querySelector('h3'), s.title);
      setText(cards[i].querySelector('.desc'), s.description);
    });
  });

  // ----- Impact metrics (feed the count-up) -----
  get('impact_metrics?select=value,label&order=sort_order').then(function (rows) {
    if (!rows) return;
    var metrics = document.querySelectorAll('.metric');
    rows.forEach(function (m, i) {
      if (!metrics[i]) return;
      var num = metrics[i].querySelector('.num');
      var match = (m.value || '').match(/^(\d+)(.*)$/);
      if (num && match) {
        num.setAttribute('data-target', match[1]);
        num.setAttribute('data-suffix', match[2]);
        var val = num.querySelector('.val');
        if (val) val.textContent = '0';
      }
      setText(metrics[i].querySelector('.lbl'), m.label);
    });
  });

  // ----- Trusted logos (update both marquee copies) -----
  get('trusted_logos?select=name&order=sort_order').then(function (rows) {
    if (!rows) return;
    document.querySelectorAll('.marquee-track .logos').forEach(function (group) {
      var spans = group.querySelectorAll('.logo');
      rows.forEach(function (l, i) {
        if (spans[i] && spans[i].lastChild) spans[i].lastChild.textContent = l.name;
      });
    });
  });

  // ----- Navigation labels -----
  get('nav_items?select=label,href&location=eq.header&order=sort_order').then(function (rows) {
    if (!rows) return;
    document.querySelectorAll('.nav-links, #mobileMenu').forEach(function (container) {
      var links = container.querySelectorAll('a:not(.btn)');
      rows.forEach(function (n, i) {
        if (!links[i]) return;
        links[i].textContent = n.label;
        if (n.href) links[i].setAttribute('href', n.href);
      });
    });
  });

  // ----- Footer link columns -----
  get('footer_links?select=column_title,label,href&order=column_title,sort_order').then(function (rows) {
    if (!rows) return;
    var byCol = {};
    rows.forEach(function (r) { (byCol[r.column_title] = byCol[r.column_title] || []).push(r); });
    document.querySelectorAll('footer .footer-col').forEach(function (col) {
      var h4 = col.querySelector('h4');
      if (!h4 || !byCol[h4.textContent.trim()]) return;
      col.querySelectorAll('a').forEach(function (a) { a.remove(); });
      byCol[h4.textContent.trim()].forEach(function (link) {
        var a = document.createElement('a');
        a.href = link.href || '#';
        a.textContent = link.label;
        col.appendChild(a);
      });
    });
  });
})();

/* ----- Consultation enquiry form ----- */
(function () {
  var form = document.getElementById('enquiryForm');
  if (!form) return;
  var URL = 'https://pcpvshepcdahfrmvzxcy.supabase.co';
  var KEY = 'sb_publishable_F56AK9IgrvFxJZ6aHXy3Ag_PAleGBrb';

  // Fade-in on scroll
  var grid = document.querySelector('.enquiry-grid');
  if (grid && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (e) {
      if (e[0].isIntersecting) { grid.classList.add('visible'); io.disconnect(); }
    }, { threshold: 0.12 });
    io.observe(grid);
  } else if (grid) {
    grid.classList.add('visible');
  }

  // Character counter
  var ta = document.getElementById('ef-message');
  var count = document.getElementById('ef-count');
  if (ta && count) ta.addEventListener('input', function () { count.textContent = ta.value.length; });

  function fieldOf(el) { return el.closest('.field'); }
  function setInvalid(el, bad) { var f = fieldOf(el); if (f) f.classList.toggle('invalid', bad); }

  var submitBtn = document.getElementById('ef-submit');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = document.getElementById('ef-name');
    var email = document.getElementById('ef-email');
    var message = document.getElementById('ef-message');
    var agree = document.getElementById('ef-agree');

    var ok = true;
    var emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
    [[name, !name.value.trim()], [email, !emailValid], [message, !message.value.trim()], [agree, !agree.checked]]
      .forEach(function (p) { if (p[1]) ok = false; setInvalid(p[0], p[1]); });
    if (!ok) return;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting…';

    var payload = {
      form_type: 'consultation',
      name: name.value.trim(),
      email: email.value.trim(),
      company: document.getElementById('ef-company').value.trim() || null,
      job_title: document.getElementById('ef-title').value.trim() || null,
      phone: document.getElementById('ef-phone').value.trim() || null,
      company_size: document.getElementById('ef-size').value || null,
      service: document.getElementById('ef-service').value || null,
      message: message.value.trim(),
    };

    fetch(URL + '/rest/v1/form_submissions', {
      method: 'POST',
      headers: { apikey: KEY, Authorization: 'Bearer ' + KEY, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
      body: JSON.stringify(payload),
    })
      .then(function (r) {
        if (!r.ok) throw new Error('submit failed');
        form.hidden = true;
        var ok = document.getElementById('enquirySuccess');
        if (ok) ok.hidden = false;
      })
      .catch(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Enquiry';
        submitBtn.insertAdjacentHTML('afterend',
          '<p style="color:#EF4444;font-size:13.5px;text-align:center;margin-top:12px">Something went wrong. Please try again or email us directly.</p>');
      });
  });

  // Clear invalid state as the user corrects fields
  form.addEventListener('input', function (e) {
    if (e.target.closest('.field.invalid')) setInvalid(e.target, false);
  });
})();
