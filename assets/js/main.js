(function () {
  'use strict';

  document.documentElement.classList.add('js');

  /* ---------- Header: scrolled state ---------- */
  var header = document.querySelector('.site-header');
  function onScroll() {
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile navigation ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('primary-nav');

  function setNav(open) {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    nav.classList.toggle('is-open', open);
  }

  toggle.addEventListener('click', function () {
    setNav(toggle.getAttribute('aria-expanded') !== 'true');
  });
  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) setNav(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      setNav(false);
      toggle.focus();
    }
  });
  document.addEventListener('click', function (e) {
    if (nav.classList.contains('is-open') && !e.target.closest('.site-header')) setNav(false);
  });
  window.matchMedia('(min-width: 1024px)').addEventListener('change', function (mq) {
    if (mq.matches) setNav(false);
  });

  /* ---------- Reveal on scroll ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Contact form ---------- */
  var form = document.getElementById('contact-form');
  if (form) initForm(form);

  function initForm(form) {
    var submitBtn = document.getElementById('cf-submit');
    var status = document.getElementById('cf-status');
    var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    var rules = {
      name: function (v) { return v ? '' : 'Please enter your name.'; },
      email: function (v) {
        if (!v) return 'Please enter your email address.';
        return EMAIL_RE.test(v) ? '' : 'Please enter a valid email address (e.g. name@example.com).';
      },
      service: function (v) { return v ? '' : 'Please choose a service.'; },
      message: function (v) { return v ? '' : 'Please enter your message.'; }
    };

    function validateField(input) {
      var rule = rules[input.name];
      if (!rule) return true;
      var msg = rule(input.value.trim());
      var field = input.closest('.field');
      var err = document.getElementById(input.id + '-error');
      field.classList.toggle('has-error', !!msg);
      input.setAttribute('aria-invalid', msg ? 'true' : 'false');
      if (err) err.textContent = msg;
      return !msg;
    }

    function showStatus(type, text) {
      status.hidden = false;
      status.className = 'form-status is-' + type;
      status.textContent = text;
    }

    Object.keys(rules).forEach(function (name) {
      var input = form.elements[name];
      input.addEventListener('blur', function () {
        if (input.value.trim() || input.getAttribute('aria-invalid')) validateField(input);
      });
      input.addEventListener('input', function () {
        if (input.getAttribute('aria-invalid') === 'true') validateField(input);
      });
      input.addEventListener('change', function () {
        if (input.tagName === 'SELECT') validateField(input);
      });
    });

    var submitting = false;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (submitting) return;

      var firstInvalid = null;
      Object.keys(rules).forEach(function (name) {
        var input = form.elements[name];
        if (!validateField(input) && !firstInvalid) firstInvalid = input;
      });
      if (firstInvalid) {
        status.hidden = true;
        firstInvalid.focus();
        return;
      }

      // Bot honeypot: silently ignore
      if (form.elements._honey.value) return;

      submitting = true;
      submitBtn.disabled = true;
      submitBtn.setAttribute('aria-busy', 'true');
      submitBtn.querySelector('.btn-label').textContent = 'Sending…';
      status.hidden = true;

      var endpoint = form.action.replace('formsubmit.co/', 'formsubmit.co/ajax/');

      fetch(endpoint, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form)
      })
        .then(function (res) {
          return res.json().catch(function () { return {}; }).then(function (data) {
            if (!res.ok || String(data.success) !== 'true') {
              throw new Error(data.message || 'Request failed');
            }
            return data;
          });
        })
        .then(function () {
          form.reset();
          showStatus('success', 'Thank you! Your message has been sent. We will connect with you soon.');
        })
        .catch(function () {
          showStatus('error', 'Sorry, your message could not be sent right now. Please try again, or call +91 95389 69843.');
        })
        .then(function () {
          submitting = false;
          submitBtn.disabled = false;
          submitBtn.removeAttribute('aria-busy');
          submitBtn.querySelector('.btn-label').textContent = 'Send Message';
        });
    });
  }

  /* ---------- Video lightbox ---------- */
  var lightbox = document.getElementById('video-lightbox');
  if (lightbox) initLightbox(lightbox);

  function initLightbox(lightbox) {
    var frame = lightbox.querySelector('.lightbox-frame');
    var closeBtn = lightbox.querySelector('.lightbox-close');
    var lastTrigger = null;

    function openVideo(card) {
      var id = card.getAttribute('data-video-id');
      if (!/^[\w-]{11}$/.test(id)) return false;
      lastTrigger = card;
      lightbox.classList.toggle('is-short', card.hasAttribute('data-short'));
      var iframe = document.createElement('iframe');
      iframe.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0&playsinline=1';
      iframe.title = card.querySelector('img').alt;
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      iframe.allowFullscreen = true;
      frame.appendChild(iframe);
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      closeBtn.focus();
      return true;
    }

    function closeVideo() {
      if (lightbox.hidden) return;
      lightbox.hidden = true;
      frame.innerHTML = '';
      document.body.style.overflow = '';
      if (lastTrigger) lastTrigger.focus();
    }

    document.querySelectorAll('.video-card').forEach(function (card) {
      card.addEventListener('click', function (e) {
        // Let modified clicks open YouTube in a new tab as usual
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        if (openVideo(card)) e.preventDefault();
      });
    });

    lightbox.addEventListener('click', function (e) {
      if (e.target.closest('[data-close]')) closeVideo();
    });
    document.addEventListener('keydown', function (e) {
      if (lightbox.hidden) return;
      if (e.key === 'Escape') closeVideo();
      // Keep focus inside the dialog
      if (e.key === 'Tab') {
        var iframe = frame.querySelector('iframe');
        if (document.activeElement === closeBtn && iframe && !e.shiftKey) return;
        e.preventDefault();
        closeBtn.focus();
      }
    });
  }
})();
