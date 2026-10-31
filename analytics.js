/* BL3 Labs: basic consent mode. No Google requests before opt-in. */
(() => {
  'use strict';
  const ID = 'G-1HLQ4F6M35';
  const KEY = 'bl3-analytics-consent-v1';
  const AGE = 180 * 24 * 60 * 60 * 1000;
  const allowedEvents = new Set(['contact_email_click', 'contact_phone_click', 'demo_open', 'demo_start', 'inquiry_open', 'generate_lead']);
  // Same-origin embedded demos use the top-level page's consent and tracker.
  try {
    if (window.parent !== window && window.parent.BL3Analytics) {
      window.BL3Analytics = {track: name => window.parent.BL3Analytics.track(name)};
      return;
    }
  } catch (_) { /* A separately embedded demo manages its own consent. */ }
  const titles = {'/': 'BL3 Labs', '/demo/': 'BL3 Labs Demo', '/pensionen/': 'BL3 Labs Pensionen', '/datenschutz.html': 'BL3 Labs Datenschutz', '/impressum.html': 'BL3 Labs Impressum'};
  let choice = readChoice();
  let loaded = false;
  let dialog;
  function readChoice() {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY));
      return saved && typeof saved.allowed === 'boolean' && Date.now() - saved.at >= 0 && Date.now() - saved.at < AGE ? saved : null;
    } catch (_) { return null; }
  }
  function track(name) {
    if (!loaded || !choice?.allowed || !allowedEvents.has(name)) return;
    window.gtag('event', name, {send_to: ID});
  }
  window.BL3Analytics = {track, openSettings: () => openSettings()};
  function cleanCookies() {
    const hostname = location.hostname;
    const domains = ['', hostname, '.' + hostname];
    const parts = hostname.split('.');
    if (parts.length > 2) domains.push('.' + parts.slice(-2).join('.'));
    document.cookie.split(';').forEach(cookie => {
      const name = cookie.split('=')[0].trim();
      if (!/^_ga(?:_|$)/.test(name)) return;
      domains.forEach(domain => {
        document.cookie = `${name}=; Max-Age=0; Path=/${domain ? '; Domain=' + domain : ''}; SameSite=Lax; Secure`;
      });
    });
  }
  function loadAnalytics() {
    if (loaded || !choice?.allowed) return;
    loaded = true;
    window['ga-disable-' + ID] = false;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('consent', 'default', {analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied'});
    window.gtag('consent', 'update', {analytics_storage: 'granted'});
    window.gtag('js', new Date());
    const url = new URL(location.origin + location.pathname);
    const query = new URLSearchParams(location.search);
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach(key => {
      const value = query.get(key);
      if (value && /^[a-zA-Z0-9_.-]{1,100}$/.test(value)) url.searchParams.set(key, value);
    });
    let referrer = '';
    try { referrer = new URL(document.referrer).origin + '/'; } catch (_) {}
    window.gtag('config', ID, {
      page_location: url.href, page_referrer: referrer,
      page_title: titles[location.pathname] || 'BL3 Labs',
      allow_google_signals: false, allow_ad_personalization_signals: false,
      cookie_expires: AGE / 1000, cookie_update: false
    });
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + ID;
    document.head.appendChild(script);
  }
  function save(allowed) {
    const wasLoaded = loaded;
    choice = {allowed, at: Date.now()};
    try { localStorage.setItem(KEY, JSON.stringify(choice)); } catch (_) {}
    dialog.close();
    if (allowed) loadAnalytics();
    else {
      window['ga-disable-' + ID] = true;
      cleanCookies();
      // A fresh document also stops Google's already running listeners.
      if (wasLoaded) location.reload();
    }
  }
  function openSettings() {
    if (!dialog.open) dialog.showModal();
  }
  const style = document.createElement('link');
  style.rel = 'stylesheet'; style.href = '/analytics.css';
  document.head.appendChild(style);
  dialog = document.createElement('dialog');
  dialog.id = 'bl3-analytics-dialog';
  dialog.setAttribute('aria-labelledby', 'bl3-analytics-title');
  dialog.setAttribute('aria-describedby', 'bl3-analytics-description');
  dialog.innerHTML = '<h2 id="bl3-analytics-title">Cookies</h2><p id="bl3-analytics-description">Wir nutzen Google Analytics für Besucherstatistiken – nur mit Ihrer Einwilligung.</p><p>Jederzeit unter „Datenschutzeinstellungen“ widerrufbar. <a href="/datenschutz.html#analytics">Datenschutzerklärung</a></p><div class="bl3-analytics-actions"><button type="button" data-choice="yes">Cookies akzeptieren</button><button type="button" data-choice="no">Cookies nicht akzeptieren</button></div><button type="button" class="bl3-analytics-close">Schließen</button>';
  document.body.appendChild(dialog);
  dialog.querySelector('[data-choice="no"]').addEventListener('click', () => save(false));
  dialog.querySelector('[data-choice="yes"]').addEventListener('click', () => save(true));
  dialog.querySelector('.bl3-analytics-close').addEventListener('click', () => dialog.close());
  const settings = document.createElement('button');
  settings.type = 'button'; settings.id = 'bl3-analytics-settings';
  settings.textContent = 'Datenschutzeinstellungen';
  settings.addEventListener('click', openSettings);
  document.body.appendChild(settings);
  document.addEventListener('click', event => {
    const link = event.target.closest?.('a[href]');
    if (!link) return;
    const href = link.getAttribute('href');
    if (href.startsWith('mailto:')) track('contact_email_click');
    if (href.startsWith('tel:')) track('contact_phone_click');
  });
  window.addEventListener('storage', event => {
    if (event.key !== KEY) return;
    const next = readChoice();
    if (!next?.allowed) {
      window['ga-disable-' + ID] = true;
      cleanCookies();
      if (loaded) location.reload();
    }
    choice = next;
    if (choice?.allowed) loadAnalytics();
  });
  if (choice?.allowed) loadAnalytics();
  else {
    window['ga-disable-' + ID] = true;
    cleanCookies();
    if (!choice) openSettings();
  }
})();
