#!/usr/bin/env node
/*
 * Shared header + footer for the static pages.
 *
 * Each page contains marker comments:
 *   <!-- partial:header -->  ...  <!-- /partial:header -->
 *   <!-- partial:footer -->  ...  <!-- /partial:footer -->
 * Running `node _partials/sync.js` rewrites everything between the markers,
 * so the navigation and footer stay identical across pages.
 * (Underscore folders are not published by GitHub Pages' Jekyll build.)
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

// key -> [file, path prefix to site root]
const PAGES = {
  home: ['index.html', ''],
  about: ['about/index.html', '../'],
  services: ['e-books/index.html', '../'],
  counseling: ['courses/index.html', '../'],
  contact: ['contact/index.html', '../'],
};

const PHONE_HREF = 'tel:+919538969843';
const PHONE = '+91 95389 69843';
const EMAIL = 'mymentor581@gmail.com';
const WHATSAPP = 'https://wa.me/919538969843';

const TRADITIONAL = [
  ['astrology', 'Astrology'],
  ['vastu', 'Vastu'],
];
const HOLISTIC = [
  ['personality-analysis', 'Personality Analysis'],
  ['handwriting-analysis', 'Handwriting Analysis'],
  ['mannerisms-re-engineering', 'Mannerisms Re-Engineering'],
  ['business-consultation', 'Business Consultation'],
  ['graphology', 'Graphology for Holistic Development'],
];
const COUNSELING = [
  ['children-pattern', 'Children Pattern Counseling'],
  ['individual-patterns', 'Individual Patterns Counseling'],
  ['career', 'Career Counseling'],
  ['young-parent', 'Young Parent Counseling'],
  ['marital', 'Pre-Marital &amp; Post-Marital Counseling'],
];

const icon = {
  phone: (s = 16) => `<svg aria-hidden="true" viewBox="0 0 24 24" width="${s}" height="${s}"><path fill="currentColor" d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.46.57 3.58a1 1 0 0 1-.25 1z"/></svg>`,
  mail: (s = 16) => `<svg aria-hidden="true" viewBox="0 0 24 24" width="${s}" height="${s}"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" d="M3.5 6.5h17v11h-17zM3.5 7l8.5 6.5L20.5 7"/></svg>`,
  whatsapp: (s = 16) => `<svg aria-hidden="true" viewBox="0 0 32 32" width="${s}" height="${s}"><path fill="currentColor" d="M16 3a13 13 0 0 0-11.2 19.6L3 29l6.6-1.7A13 13 0 1 0 16 3zm0 23.7a10.7 10.7 0 0 1-5.5-1.5l-.4-.2-3.9 1 1-3.8-.2-.4A10.7 10.7 0 1 1 16 26.7zm5.9-8c-.3-.2-1.9-1-2.2-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7 0a8.8 8.8 0 0 1-4.4-3.8c-.3-.6.3-.5 1-1.7.1-.2 0-.4 0-.6l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6a1.2 1.2 0 0 0-.9.4 3.6 3.6 0 0 0-1.1 2.7 6.3 6.3 0 0 0 1.3 3.3 14.4 14.4 0 0 0 5.5 4.9c2 .9 2.9 1 3.9.8a3.3 3.3 0 0 0 2.2-1.5 2.7 2.7 0 0 0 .2-1.5c-.1-.2-.3-.3-.6-.4z"/></svg>`,
  chevron: '<svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="m6 9 6 6 6-6"/></svg>',
  arrowUp: '<svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M12 19V5M6 11l6-6 6 6"/></svg>',
};

function current(key, page) {
  return key === page ? ' aria-current="page"' : '';
}

function subLinks(P, base, items) {
  return items.map(([id, label]) =>
    `                  <li><a class="submenu-link" href="${P}${base}#${id}">${label}</a></li>`).join('\n');
}

function header(page, P) {
  const home = P || './';
  return `
  <div class="topbar">
    <div class="container topbar-inner">
      <p class="topbar-tag">Re-constructing Patterns</p>
      <ul class="topbar-contact">
        <li><a href="${PHONE_HREF}">${icon.phone(14)}${PHONE}</a></li>
        <li class="topbar-email"><a href="mailto:${EMAIL}">${icon.mail(14)}${EMAIL}</a></li>
      </ul>
    </div>
  </div>

  <header class="site-header" id="top">
    <div class="container header-inner">
      <a class="brand" href="${home}" aria-label="Kramaha — Home">
        <img class="brand-mark" src="${P}assets/images/logo.png" width="134" height="148" alt="Kramaha emblem">
        <span class="brand-text">
          <span class="brand-name">Kramaha</span>
          <span class="brand-tagline">Re-constructing Patterns</span>
        </span>
      </a>

      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="primary-nav" aria-label="Open menu">
        <span class="nav-toggle-bar"></span>
        <span class="nav-toggle-bar"></span>
        <span class="nav-toggle-bar"></span>
      </button>

      <nav class="primary-nav" id="primary-nav" aria-label="Primary">
        <ul class="nav-list">
          <li class="nav-item"><a class="nav-link" href="${home}"${current('home', page)}>Home</a></li>
          <li class="nav-item"><a class="nav-link" href="${P}about/"${current('about', page)}>About</a></li>
          <li class="nav-item has-sub">
            <a class="nav-link" href="${P}e-books/"${current('services', page)}>Services</a>
            <button class="sub-toggle" type="button" aria-expanded="false" aria-controls="sub-services" aria-label="Services menu">${icon.chevron}</button>
            <div class="submenu submenu--wide" id="sub-services">
              <div class="submenu-panel">
                <div class="submenu-col">
                  <p class="submenu-label"><a href="${P}e-books/#traditional">Traditional Services</a></p>
                  <ul>
${subLinks(P, 'e-books/', TRADITIONAL)}
                  </ul>
                </div>
                <div class="submenu-col">
                  <p class="submenu-label"><a href="${P}e-books/#holistic">Holistic Services</a></p>
                  <ul>
${subLinks(P, 'e-books/', HOLISTIC)}
                  </ul>
                </div>
              </div>
            </div>
          </li>
          <li class="nav-item has-sub">
            <a class="nav-link" href="${P}courses/"${current('counseling', page)}>Counseling</a>
            <button class="sub-toggle" type="button" aria-expanded="false" aria-controls="sub-counseling" aria-label="Counseling menu">${icon.chevron}</button>
            <div class="submenu" id="sub-counseling">
              <div class="submenu-panel">
                <div class="submenu-col">
                  <ul>
${subLinks(P, 'courses/', COUNSELING)}
                  </ul>
                </div>
              </div>
            </div>
          </li>
          <li class="nav-item"><a class="nav-link" href="${P}contact/"${current('contact', page)}>Contact</a></li>
          <li class="nav-item nav-cta-item"><a class="btn btn-primary nav-cta" href="${P}contact/#conversation" data-open-advice aria-haspopup="dialog">Need Advice?</a></li>
        </ul>
      </nav>
    </div>
  </header>
  `;
}

function footLinks(P, base, items) {
  return items.map(([id, label]) =>
    `          <li><a href="${P}${base}#${id}">${label}</a></li>`).join('\n');
}

function footer(page, P) {
  const home = P || './';
  return `
  <footer class="site-footer">
    <div class="container footer-grid">
      <div class="footer-brand">
        <a class="brand" href="${home}" aria-label="Kramaha — Home">
          <img class="brand-mark" src="${P}assets/images/logo.png" width="134" height="148" alt="Kramaha emblem" loading="lazy">
          <span class="brand-text">
            <span class="brand-name">Kramaha</span>
            <span class="brand-tagline">Re-constructing Patterns</span>
          </span>
        </a>
        <p>Kramaha is built on the belief that clarity leads to action, and action leads to transformation.</p>
      </div>

      <nav class="footer-col" aria-label="Footer">
        <h2 class="footer-title">Quick Links</h2>
        <ul class="footer-links">
          <li><a href="${home}">Home</a></li>
          <li><a href="${P}about/">About</a></li>
          <li><a href="${P}e-books/">Services</a></li>
          <li><a href="${P}courses/">Counseling</a></li>
          <li><a href="${P}contact/">Contact</a></li>
        </ul>
      </nav>

      <div class="footer-col">
        <h2 class="footer-title">Services</h2>
        <ul class="footer-links">
${footLinks(P, 'e-books/', TRADITIONAL.concat(HOLISTIC))}
        </ul>
      </div>

      <div class="footer-col">
        <h2 class="footer-title">Counseling</h2>
        <ul class="footer-links">
${footLinks(P, 'courses/', COUNSELING)}
        </ul>
      </div>

      <div class="footer-col footer-col--contact">
        <h2 class="footer-title">Contact</h2>
        <ul class="footer-links footer-contact">
          <li>${icon.phone(16)}<a href="${PHONE_HREF}">${PHONE}</a></li>
          <li>${icon.mail(16)}<a href="mailto:${EMAIL}">${EMAIL}</a></li>
          <li class="is-whatsapp">${icon.whatsapp(16)}<a href="${WHATSAPP}" target="_blank" rel="noopener" aria-label="WhatsApp ${PHONE}">${PHONE}</a></li>
        </ul>
      </div>
    </div>

    <div class="container footer-bottom">
      <div class="footer-meta">
        <p>Copyright © <span data-year>2026</span> Kramaha</p>
      </div>
    </div>
  </footer>

  <!-- Need Advice? popup form (same fields + FormSubmit endpoint as the contact form) -->
  <dialog class="advice-modal" id="advice-modal" aria-labelledby="am-title">
    <div class="advice-modal-head">
      <div>
        <h2 id="am-title">Need Advice?</h2>
        <p>Sometimes all it takes is one thoughtful conversation to bring clarity.</p>
      </div>
      <button class="advice-modal-close" type="button" aria-label="Close" data-close-advice>
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M6 6l12 12M18 6 6 18"/></svg>
      </button>
    </div>
    <form class="contact-form" id="advice-form" action="https://formsubmit.co/${EMAIL}" method="POST" novalidate>
      <input type="hidden" name="_captcha" value="false">
      <input type="hidden" name="_subject" value="New Website Contact Form Submission">
      <input type="hidden" name="_template" value="table">
      <input type="text" name="_honey" class="visually-hidden" tabindex="-1" autocomplete="off" aria-hidden="true">

      <div class="form-row">
        <div class="field">
          <label for="am-name">Your Name (required)</label>
          <input id="am-name" type="text" name="name" autocomplete="name" required aria-describedby="am-name-error">
          <p class="field-error" id="am-name-error" aria-live="polite"></p>
        </div>
        <div class="field">
          <label for="am-email">Your Email (required)</label>
          <input id="am-email" type="email" name="email" autocomplete="email" required aria-describedby="am-email-error">
          <p class="field-error" id="am-email-error" aria-live="polite"></p>
        </div>
      </div>

      <div class="form-row">
        <div class="field">
          <label for="am-service">Select Service</label>
          <div class="select-wrap">
            <select id="am-service" name="service" required aria-describedby="am-service-error">
              <option value="">Choose a Service</option>
              <option value="Personality Analysis">Personality Analysis</option>
              <option value="Handwriting Analysis">Handwriting Analysis</option>
              <option value="Mannerisms Re-Engineering">Mannerisms Re-Engineering</option>
              <option value="Business Consultation">Business Consultation</option>
              <option value="Graphology for Holistic Development">Graphology for Holistic Development</option>
            </select>
          </div>
          <p class="field-error" id="am-service-error" aria-live="polite"></p>
        </div>
        <div class="field">
          <label for="am-subject">Subject</label>
          <input id="am-subject" type="text" name="subject">
        </div>
      </div>

      <div class="field">
        <label for="am-message">Your Message</label>
        <textarea id="am-message" name="message" rows="4" required aria-describedby="am-message-error"></textarea>
        <p class="field-error" id="am-message-error" aria-live="polite"></p>
      </div>

      <button type="submit" class="btn btn-primary btn-block">
        <span class="btn-label">Send Message</span>
      </button>
      <div class="form-status" role="status" aria-live="polite" hidden></div>
    </form>
  </dialog>

  <button class="to-top" type="button" aria-label="Back to top">${icon.arrowUp}</button>

  <!-- WhatsApp chat (existing click-to-chat number) -->
  <a class="whatsapp-fab" href="${WHATSAPP}" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">
    <span class="whatsapp-fab-label" aria-hidden="true">Chat with us</span>
    ${icon.whatsapp(28)}
  </a>
  `;
}

function replaceBlock(html, name, content, file) {
  const re = new RegExp(`(<!-- partial:${name} -->)[\\s\\S]*?(<!-- /partial:${name} -->)`);
  if (!re.test(html)) throw new Error(`${file}: missing partial:${name} markers`);
  return html.replace(re, `$1${content}$2`);
}

for (const [page, [file, P]] of Object.entries(PAGES)) {
  const full = path.join(ROOT, file);
  let html = fs.readFileSync(full, 'utf8');
  html = replaceBlock(html, 'header', header(page, P), file);
  html = replaceBlock(html, 'footer', footer(page, P), file);
  fs.writeFileSync(full, html);
  console.log('synced', file);
}
