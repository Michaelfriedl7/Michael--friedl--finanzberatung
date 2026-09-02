/* ============================================================
   Michael Friedl · Finanzberatung mit tecis — Interaktion
   ============================================================ */

/* ------------------------------------------------------------------
   KONFIGURATION — hier die echten Werte eintragen
   ------------------------------------------------------------------ */
// 1) Lead-Zustellung per E-Mail über Web3Forms (kostenlos):
//    → https://web3forms.com  →  E-Mail michael.friedl@tecis.de eintragen
//    → Access-Key kommt per Mail  →  hier einsetzen. Danach landen alle
//      Fragebogen-Anfragen automatisch im Postfach von Michael.
const WEB3FORMS_ACCESS_KEY = "e6cdadea-4baa-4026-b41a-848de0389c26";
const LEAD_EMPFAENGER      = "michael.friedl@tecis.de";

// 2) Microsoft-Bookings-Buchungsseite (online & vor Ort, synchron mit Outlook):
//    Die "Buchungsseite veröffentlichen"-URL aus Microsoft Bookings hier eintragen.
const BOOKINGS_URL = "https://outlook.office.com/book/Buchungsseite-MichaelFriedlFinanzberatung@tecis.de/";

// 3) Vorstellungs-Video: Datei als assets/vorstellung.mp4 ablegen — der Play-Button im
//    Abschnitt "Über mich" erscheint dann automatisch. Alternativ hier einen Pfad setzen.
const VIDEO_SRC = ""; // leer = automatische Erkennung von "assets/vorstellung.mp4"
/* ------------------------------------------------------------------ */

document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- Sticky header ---------- */
const header = document.getElementById('siteHeader');
const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 8);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

/* ---------- Mobile nav ---------- */
const navToggle = document.getElementById('navToggle');
const mobileNav = document.getElementById('mobileNav');
navToggle.addEventListener('click', () => {
  const open = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!open));
  if (open) { mobileNav.removeAttribute('data-open'); mobileNav.hidden = true; }
  else { mobileNav.hidden = false; mobileNav.setAttribute('data-open', ''); }
});
mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  navToggle.setAttribute('aria-expanded', 'false');
  mobileNav.removeAttribute('data-open'); mobileNav.hidden = true;
}));

/* ---------- Reveal on scroll ---------- */
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

/* ---------- Microsoft Bookings einbetten ---------- */
(function initBooking() {
  const embed = document.getElementById('bookingEmbed');
  if (!embed) return;
  const url = (embed.dataset.bookingsUrl || BOOKINGS_URL || '').trim();
  if (!url) return; // Platzhalter bleibt stehen, bis eine URL gesetzt ist
  const iframe = document.createElement('iframe');
  iframe.src = url;
  iframe.title = 'Termin bei Michael Friedl buchen';
  iframe.loading = 'lazy';
  iframe.setAttribute('allow', 'fullscreen');
  embed.innerHTML = '';
  embed.appendChild(iframe);
})();

/* ---------- Vorstellungs-Video (auto-erkannt) ---------- */
(function initVideo() {
  const fig = document.getElementById('aboutMedia');
  if (!fig) return;
  const src = VIDEO_SRC || 'assets/vorstellung.mp4';
  const probe = document.createElement('video');
  probe.preload = 'metadata';
  probe.muted = true;
  probe.onloadedmetadata = () => {
    const btn = document.getElementById('playVideo');
    const cap = document.getElementById('mediaCap');
    if (btn) btn.hidden = false;
    if (cap) cap.hidden = false;
    if (btn) btn.addEventListener('click', () => {
      const video = document.createElement('video');
      video.src = src;
      video.controls = true;
      video.autoplay = true;
      video.playsInline = true;
      fig.appendChild(video);
      btn.remove();
      if (cap) cap.remove();
      video.play().catch(() => {});
    });
  };
  probe.onerror = () => {}; // keine Datei → Play-Button bleibt verborgen
  probe.src = src;
})();

/* ============================================================
   FUNNEL
   ============================================================ */
const STEPS = [
  {
    key: 'thema',
    q: 'Worum geht es Ihnen gerade?',
    help: 'Wählen Sie den Bereich, der Sie am meisten interessiert.',
    options: [
      { label: 'Vermögen am Kapitalmarkt aufbauen' },
      { label: 'Immobilie finanzieren (Eigenheim)' },
      { label: 'Immobilie als Kapitalanlage' },
      { label: 'Altersvorsorge & Zukunft sichern' },
      { label: 'Einkommen & Familie absichern' },
      { label: 'Überblick über meine gesamten Finanzen' },
    ],
  },
  {
    key: 'situation',
    q: 'Wie ist Ihre aktuelle Situation?',
    help: 'Das hilft mir, unser Gespräch passend vorzubereiten.',
    options: [
      { label: 'Angestellt' },
      { label: 'Selbstständig / Unternehmer:in' },
      { label: 'Beamt:in / öffentlicher Dienst' },
      { label: 'In Ausbildung / Studium' },
    ],
  },
  {
    key: 'alter',
    q: 'In welcher Altersgruppe sind Sie?',
    help: null,
    options: [
      { label: 'Unter 25' },
      { label: '25 – 39' },
      { label: '40 – 55' },
      { label: 'Über 55' },
    ],
  },
  {
    key: 'kapital',
    q: 'Wie viel möchten Sie monatlich investieren oder zurücklegen?',
    help: 'Eine grobe Einschätzung genügt – es geht nur um die Richtung.',
    options: [
      { label: 'Bis 250 €' },
      { label: '250 – 750 €' },
      { label: '750 – 1.500 €' },
      { label: 'Mehr als 1.500 € / Einmalbetrag vorhanden' },
    ],
  },
  {
    key: 'dringlichkeit',
    q: 'Wie schnell möchten Sie starten?',
    help: null,
    options: [
      { label: 'So schnell wie möglich' },
      { label: 'In den nächsten Wochen' },
      { label: 'Ich möchte mich in Ruhe informieren' },
    ],
  },
  {
    key: 'kontakt',
    type: 'form',
    q: 'Sehr gut – wohin darf ich Ihre Antwort schicken?',
    help: 'Ich melde mich persönlich für Ihr kostenloses Erstgespräch. Ihre Daten bleiben bei mir.',
  },
];

const funnel = {
  el: document.getElementById('funnel'),
  body: document.getElementById('funnelBody'),
  bar: document.getElementById('funnelBar'),
  stepNum: document.getElementById('funnelStepNum'),
  stepTotal: document.getElementById('funnelStepTotal'),
  backBtn: document.getElementById('funnelBack'),
  nextBtn: document.getElementById('funnelNext'),
  nav: document.querySelector('.funnel-nav'),
  index: 0,
  answers: {},
  lastFocus: null,
};
funnel.stepTotal.textContent = STEPS.length;

function openFunnel() {
  funnel.lastFocus = document.activeElement;
  funnel.el.hidden = false;
  funnel.el.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  funnel.nav.style.display = '';
  funnel.stepNum.parentElement.style.visibility = '';
  funnel.index = 0;
  funnel.answers = {};
  renderStep();
}
function closeFunnel() {
  funnel.el.hidden = true;
  funnel.el.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if (funnel.lastFocus) funnel.lastFocus.focus();
}

document.querySelectorAll('[data-open-funnel]').forEach(b => b.addEventListener('click', openFunnel));
document.querySelectorAll('[data-close-funnel]').forEach(b => b.addEventListener('click', closeFunnel));
document.addEventListener('keydown', (e) => {
  if (funnel.el.hidden) return;
  if (e.key === 'Escape') closeFunnel();
});

function renderStep() {
  const step = STEPS[funnel.index];
  funnel.stepNum.textContent = funnel.index + 1;
  funnel.bar.style.width = `${((funnel.index + 1) / STEPS.length) * 100}%`;
  funnel.backBtn.hidden = funnel.index === 0;
  if (step.type === 'form') renderForm(step); else renderOptions(step);
  const first = funnel.body.querySelector('button, input');
  if (first) first.focus();
}

function renderOptions(step) {
  const selected = funnel.answers[step.key];
  funnel.body.innerHTML = `
    <h3 class="funnel-q">${step.q}</h3>
    ${step.help ? `<p class="funnel-help">${step.help}</p>` : ''}
    <div class="funnel-options" role="listbox" aria-label="${step.q}">
      ${step.options.map((o) => `
        <button class="funnel-option${selected === o.label ? ' selected' : ''}" role="option"
                aria-selected="${selected === o.label}" data-value="${o.label}">
          <span class="opt-label">${o.label}</span>
          <span class="opt-check" aria-hidden="true"></span>
        </button>`).join('')}
    </div>`;
  funnel.nextBtn.textContent = 'Weiter';
  funnel.nextBtn.disabled = !selected;
  funnel.nextBtn.onclick = goNext;
  funnel.body.querySelectorAll('.funnel-option').forEach(btn => {
    btn.addEventListener('click', () => {
      funnel.body.querySelectorAll('.funnel-option').forEach(b => { b.classList.remove('selected'); b.setAttribute('aria-selected', 'false'); });
      btn.classList.add('selected'); btn.setAttribute('aria-selected', 'true');
      funnel.answers[step.key] = btn.dataset.value;
      funnel.nextBtn.disabled = false;
      clearTimeout(funnel._t);
      funnel._t = setTimeout(goNext, 260);
    });
  });
}

function renderForm(step) {
  const a = funnel.answers;
  funnel.body.innerHTML = `
    <h3 class="funnel-q">${step.q}</h3>
    <p class="funnel-help">${step.help}</p>
    <div class="funnel-summary">
      Ihr Thema: <b>${a.thema || '–'}</b> &middot; Start: <b>${a.dringlichkeit || '–'}</b>
    </div>
    <div class="funnel-fields">
      <div class="field" data-field="name">
        <label for="f-name">Name *</label>
        <input id="f-name" type="text" name="name" autocomplete="name" placeholder="Vor- und Nachname" />
        <span class="err">Bitte geben Sie Ihren Namen ein.</span>
      </div>
      <div class="field" data-field="email">
        <label for="f-email">E-Mail *</label>
        <input id="f-email" type="email" name="email" autocomplete="email" inputmode="email" placeholder="name@beispiel.de" />
        <span class="err">Bitte geben Sie eine gültige E-Mail-Adresse ein.</span>
      </div>
      <div class="field" data-field="phone">
        <label for="f-phone">Telefon (optional)</label>
        <input id="f-phone" type="tel" name="phone" autocomplete="tel" inputmode="tel" placeholder="Für eine schnelle Rückmeldung" />
      </div>
      <label class="consent" data-field="consent">
        <input id="f-consent" type="checkbox" />
        <span>Ich bin einverstanden, dass meine Angaben zur Kontaktaufnahme und Vorbereitung des Erstgesprächs verarbeitet werden. (<a href="datenschutz.html" target="_blank" rel="noopener">Datenschutz</a>)</span>
      </label>
    </div>`;
  funnel.nextBtn.textContent = 'Erstgespräch anfragen';
  funnel.nextBtn.disabled = false;
  funnel.nextBtn.onclick = submitForm;
}

function goNext() {
  clearTimeout(funnel._t);
  if (funnel.index < STEPS.length - 1) { funnel.index++; renderStep(); }
}
funnel.backBtn.addEventListener('click', () => {
  clearTimeout(funnel._t);
  if (funnel.index > 0) { funnel.index--; renderStep(); }
});

async function submitForm() {
  const nameEl = document.getElementById('f-name');
  const emailEl = document.getElementById('f-email');
  const consentEl = document.getElementById('f-consent');
  let ok = true;

  const setErr = (sel, bad) => {
    const field = funnel.body.querySelector(`[data-field="${sel}"]`);
    field.classList.toggle('show-err', bad);
    const input = field.querySelector('input');
    if (input) input.classList.toggle('invalid', bad);
  };

  const nameBad = !nameEl.value.trim();
  setErr('name', nameBad); if (nameBad) ok = false;
  const emailBad = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value.trim());
  setErr('email', emailBad); if (emailBad) ok = false;
  const consentBad = !consentEl.checked;
  funnel.body.querySelector('[data-field="consent"]').style.color = consentBad ? '#C43325' : '';
  if (consentBad) ok = false;

  if (!ok) {
    const firstBad = funnel.body.querySelector('.invalid') || (consentBad ? consentEl : null);
    if (firstBad) firstBad.focus();
    return;
  }

  const a = funnel.answers;
  a.name = nameEl.value.trim();
  a.email = emailEl.value.trim();
  a.phone = (document.getElementById('f-phone').value || '').trim();

  funnel.nextBtn.disabled = true;
  funnel.nextBtn.textContent = 'Wird gesendet …';

  const payload = {
    access_key: WEB3FORMS_ACCESS_KEY,
    subject: `Neue Erstgespräch-Anfrage: ${a.name}`,
    from_name: 'Website Michael Friedl',
    to: LEAD_EMPFAENGER,
    Name: a.name,
    'E-Mail': a.email,
    Telefon: a.phone || '—',
    Thema: a.thema || '—',
    Situation: a.situation || '—',
    Altersgruppe: a.alter || '—',
    'Monatlich': a.kapital || '—',
    Start: a.dringlichkeit || '—',
  };

  try {
    if (WEB3FORMS_ACCESS_KEY && WEB3FORMS_ACCESS_KEY !== 'DEIN-WEB3FORMS-ACCESS-KEY') {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Fehler bei der Übermittlung');
    } else {
      // Demo-Modus: kein Key gesetzt → Anfrage wird nur protokolliert.
      console.log('[Demo] Lead erfasst (Web3Forms-Key noch nicht gesetzt):', payload);
    }
    showSuccess();
  } catch (err) {
    funnel.nextBtn.disabled = false;
    funnel.nextBtn.textContent = 'Erneut senden';
    let note = funnel.body.querySelector('.submit-error');
    if (!note) {
      note = document.createElement('p');
      note.className = 'submit-error';
      note.style.cssText = 'color:#C43325;font-size:14px;margin-top:14px;';
      funnel.body.appendChild(note);
    }
    note.textContent = 'Das Senden hat gerade nicht geklappt. Bitte versuchen Sie es erneut oder rufen Sie an: 0152 25658310.';
  }
}

function showSuccess() {
  funnel.bar.style.width = '100%';
  funnel.stepNum.parentElement.style.visibility = 'hidden';
  funnel.nav.style.display = 'none';
  const first = (funnel.answers.name || '').split(' ')[0] || '';
  funnel.body.innerHTML = `
    <div class="funnel-success">
      <div class="success-check">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
      </div>
      <h3>Vielen Dank${first ? ', ' + escapeHtml(first) : ''}!</h3>
      <p>Ihre Angaben sind bei mir angekommen. Ich melde mich <strong>innerhalb von 24&nbsp;Stunden</strong> persönlich bei Ihnen.</p>
      <p style="margin-top:12px;">Mögen Sie direkt einen Termin wählen?</p>
      <div class="funnel-success-actions">
        <a class="btn btn-primary btn-lg" href="#termin" id="successToBooking">Jetzt Termin buchen</a>
        <button class="btn btn-ghost btn-lg" data-close-funnel>Schließen</button>
      </div>
    </div>`;
  funnel.body.querySelector('#successToBooking').addEventListener('click', () => { closeFunnelReset(); });
  funnel.body.querySelector('[data-close-funnel]').addEventListener('click', closeFunnelReset);
}

function closeFunnelReset() {
  funnel.nav.style.display = '';
  funnel.stepNum.parentElement.style.visibility = '';
  closeFunnel();
}

function escapeHtml(s) { return String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c])); }

/* ---------- Focus trap ---------- */
funnel.el.addEventListener('keydown', (e) => {
  if (e.key !== 'Tab' || funnel.el.hidden) return;
  const list = Array.from(funnel.el.querySelectorAll('button:not([hidden]):not([disabled]), input, a[href]')).filter(el => el.offsetParent !== null);
  if (!list.length) return;
  const first = list[0], last = list[list.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
});
