/* Michael Friedl · Finanzberatung, Seitenlogik
   Aufbau: Einstellungen, Kopfleiste, Jahreszahl, Fragebogen. */

const EINSTELLUNGEN = {
  formularSchluessel: "e6cdadea-4baa-4026-b41a-848de0389c26",
  terminLink: "https://outlook.office.com/book/Buchungsseite-MichaelFriedlFinanzberatung@tecis.de/",
  betreff: "Neue Anfrage über michael-friedl.com"
};

const hole  = (wahl, wo = document) => wo.querySelector(wahl);
const alle  = (wahl, wo = document) => Array.from(wo.querySelectorAll(wahl));

/* ---------------- Kopfleiste ---------------- */

function kopfleisteEinrichten(){
  const leiste = hole("#kopfleiste");
  const klappe = hole(".klappe");
  const lade   = hole("#schublade");
  if (!leiste) return;

  const beimScrollen = () => leiste.dataset.gescrollt = window.scrollY > 10 ? "ja" : "nein";
  beimScrollen();
  window.addEventListener("scroll", beimScrollen, { passive:true });

  if (klappe && lade){
    const umschalten = (auf) => {
      lade.dataset.offen = auf ? "ja" : "nein";
      klappe.setAttribute("aria-expanded", String(auf));
    };
    klappe.addEventListener("click", () => umschalten(lade.dataset.offen !== "ja"));
    alle("a, .taste", lade).forEach(el => el.addEventListener("click", () => umschalten(false)));
    window.addEventListener("resize", () => { if (window.innerWidth >= 1000) umschalten(false); });
  }

  /* Der Punkt in der Navigation folgt dem sichtbaren Bereich */
  const ziele = alle(".wegweiser a")
    .map(a => ({ a, bereich: hole(a.getAttribute("href")) }))
    .filter(z => z.bereich);
  if (!ziele.length || !("IntersectionObserver" in window)) return;

  const beobachter = new IntersectionObserver(eintraege => {
    eintraege.forEach(e => {
      const treffer = ziele.find(z => z.bereich === e.target);
      if (treffer) treffer.a.setAttribute("aria-current", e.isIntersecting ? "true" : "false");
    });
  }, { rootMargin: "-40% 0px -50% 0px" });
  ziele.forEach(z => beobachter.observe(z.bereich));
}

/* ---------------- Fragebogen ---------------- */

const SCHRITTE = [
  {
    schluessel: "thema",
    frage: "Worum geht es Ihnen gerade?",
    hilfe: "Wählen Sie den Bereich, der Sie am meisten interessiert.",
    antworten: [
      "Vermögen am Kapitalmarkt aufbauen",
      "Immobilie finanzieren (Eigenheim)",
      "Immobilie als Kapitalanlage",
      "Altersvorsorge & Zukunft sichern",
      "Einkommen & Familie absichern",
      "Überblick über meine gesamten Finanzen"
    ]
  },
  {
    schluessel: "situation",
    frage: "Wie ist Ihre aktuelle Situation?",
    hilfe: "Das hilft mir, unser Gespräch passend vorzubereiten.",
    antworten: ["Angestellt", "Selbstständig / Unternehmer:in", "Beamt:in / öffentlicher Dienst", "In Ausbildung / Studium"]
  },
  {
    schluessel: "alter",
    frage: "In welcher Altersgruppe sind Sie?",
    antworten: ["Unter 25", "25 bis 39", "40 bis 55", "Über 55"]
  },
  {
    schluessel: "kapital",
    frage: "Wie viel möchten Sie monatlich investieren oder zurücklegen?",
    hilfe: "Eine grobe Einschätzung genügt, es geht nur um die Richtung.",
    antworten: ["Bis 250 €", "250 bis 750 €", "750 bis 1.500 €", "Mehr als 1.500 € / Einmalbetrag vorhanden"]
  },
  {
    schluessel: "dringlichkeit",
    frage: "Wie schnell möchten Sie starten?",
    antworten: ["So bald wie möglich", "In den nächsten Wochen", "Ich informiere mich erst einmal"]
  },
  { schluessel: "kontakt", art: "formular" }
];

const bogen = {
  stand: 0,
  antworten: {},
  vorhang: null,
  leib: null,
  balken: null,
  letzterFokus: null
};

function bogenOeffnen(){
  bogen.letzterFokus = document.activeElement;
  bogen.stand = 0;
  bogen.antworten = {};
  bogen.vorhang.dataset.offen = "ja";
  document.body.style.overflow = "hidden";
  schrittZeichnen();
}

function bogenSchliessen(){
  bogen.vorhang.dataset.offen = "nein";
  document.body.style.overflow = "";
  if (bogen.letzterFokus) bogen.letzterFokus.focus();
}

function balkenSetzen(){
  const anteil = Math.round((bogen.stand / SCHRITTE.length) * 100);
  bogen.balken.style.width = anteil + "%";
}

function schrittZeichnen(){
  const schritt = SCHRITTE[bogen.stand];
  balkenSetzen();
  bogen.leib.textContent = "";

  if (!schritt) return;
  if (schritt.art === "formular"){ formularZeichnen(); return; }

  const titel = document.createElement("h3");
  titel.id = "bogen-titel";
  titel.textContent = schritt.frage;
  bogen.leib.appendChild(titel);

  if (schritt.hilfe){
    const hilfe = document.createElement("p");
    hilfe.className = "bogen-hilfe";
    hilfe.textContent = schritt.hilfe;
    bogen.leib.appendChild(hilfe);
  }

  const liste = document.createElement("div");
  liste.className = "antwortliste";
  schritt.antworten.forEach(text => {
    const knopf = document.createElement("button");
    knopf.type = "button";
    knopf.textContent = text;
    knopf.addEventListener("click", () => {
      bogen.antworten[schritt.schluessel] = text;
      bogen.stand++;
      schrittZeichnen();
    });
    liste.appendChild(knopf);
  });
  bogen.leib.appendChild(liste);
  fussZeichnen();
  const erster = hole("button", liste);
  if (erster) erster.focus();
}

function fussZeichnen(){
  if (bogen.stand === 0) return;
  const fuss = document.createElement("div");
  fuss.className = "bogen-fuss";
  const zurueck = document.createElement("button");
  zurueck.type = "button";
  zurueck.className = "zurueck";
  zurueck.textContent = "← Zurück";
  zurueck.addEventListener("click", () => { bogen.stand--; schrittZeichnen(); });
  fuss.appendChild(zurueck);
  bogen.leib.appendChild(fuss);
}

function feldBauen(name, beschriftung, art, pflichttext, mehrzeilig){
  const huelle = document.createElement("div");
  huelle.className = "bogen-feld";
  huelle.dataset.feld = name;
  const marke = document.createElement("label");
  marke.htmlFor = "feld-" + name;
  marke.textContent = beschriftung;
  const eingabe = document.createElement(mehrzeilig ? "textarea" : "input");
  eingabe.id = "feld-" + name;
  eingabe.name = name;
  if (!mehrzeilig) eingabe.type = art;
  if (mehrzeilig) eingabe.rows = 3;
  if (art === "tel") eingabe.autocomplete = "tel";
  if (art === "email") eingabe.autocomplete = "email";
  if (name === "name") eingabe.autocomplete = "name";
  const hinweis = document.createElement("span");
  hinweis.className = "hinweis";
  hinweis.textContent = pflichttext || "";
  huelle.append(marke, eingabe, hinweis);
  return huelle;
}

function formularZeichnen(){
  balkenSetzen();
  const titel = document.createElement("h3");
  titel.id = "bogen-titel";
  titel.textContent = "Fast geschafft";
  const hilfe = document.createElement("p");
  hilfe.className = "bogen-hilfe";
  hilfe.textContent = "Wie erreiche ich Sie? Ich melde mich persönlich für Ihr Erstgespräch.";
  bogen.leib.append(titel, hilfe);

  const form = document.createElement("form");
  form.noValidate = true;
  form.append(
    feldBauen("name", "Ihr Name", "text", "Bitte tragen Sie Ihren Namen ein."),
    feldBauen("email", "E-Mail", "email", "Bitte prüfen Sie die E-Mail-Adresse."),
    feldBauen("telefon", "Telefon (freiwillig)", "tel"),
    feldBauen("nachricht", "Möchten Sie mir noch etwas mitgeben? (freiwillig)", "text", "", true)
  );

  const falle = document.createElement("input");
  falle.className = "honigtopf"; falle.name = "firma"; falle.tabIndex = -1; falle.autocomplete = "off";
  falle.setAttribute("aria-hidden", "true");
  form.appendChild(falle);

  const fuss = document.createElement("div");
  fuss.className = "bogen-fuss";
  const zurueck = document.createElement("button");
  zurueck.type = "button"; zurueck.className = "zurueck"; zurueck.textContent = "← Zurück";
  zurueck.addEventListener("click", () => { bogen.stand--; schrittZeichnen(); });
  const senden = document.createElement("button");
  senden.type = "submit"; senden.className = "taste taste--voll"; senden.textContent = "Anfrage senden";
  fuss.append(zurueck, senden);
  form.appendChild(fuss);

  const klein = document.createElement("p");
  klein.className = "bogen-klein";
  klein.innerHTML = 'Ihre Angaben nutze ich allein zur Vorbereitung unseres Gesprächs. ' +
                    'Mehr dazu in der <a href="datenschutz.html">Datenschutzerklärung</a>.';
  form.appendChild(klein);

  form.addEventListener("submit", ereignis => absenden(ereignis, form, senden, klein));
  bogen.leib.appendChild(form);
  hole("#feld-name", form).focus();
}

function feldMarkieren(form, name, schlecht){
  const huelle = hole('[data-feld="' + name + '"]', form);
  if (huelle) huelle.dataset.fehler = schlecht ? "ja" : "nein";
  return !schlecht;
}

async function absenden(ereignis, form, knopf, klein){
  ereignis.preventDefault();
  const daten = new FormData(form);
  if (daten.get("firma")) return;              /* Falle für automatische Eintragungen */

  const name  = (daten.get("name")  || "").toString().trim();
  const email = (daten.get("email") || "").toString().trim();
  let inOrdnung = true;
  inOrdnung = feldMarkieren(form, "name", name.length < 2) && inOrdnung;
  inOrdnung = feldMarkieren(form, "email", !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) && inOrdnung;
  if (!inOrdnung) return;

  knopf.disabled = true;
  knopf.textContent = "Wird gesendet …";

  const paket = {
    access_key: EINSTELLUNGEN.formularSchluessel,
    subject: EINSTELLUNGEN.betreff,
    from_name: "michael-friedl.com",
    replyto: email,
    Name: name,
    "E-Mail": email,
    Telefon: (daten.get("telefon") || "").toString().trim() || "nicht angegeben",
    Nachricht: (daten.get("nachricht") || "").toString().trim() || "nicht angegeben"
  };
  SCHRITTE.forEach(s => {
    if (s.art !== "formular" && bogen.antworten[s.schluessel]) paket[s.frage] = bogen.antworten[s.schluessel];
  });

  try {
    const antwort = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(paket)
    });
    const ergebnis = await antwort.json().catch(() => ({}));
    if (!antwort.ok || ergebnis.success === false) throw new Error(ergebnis.message || "Senden fehlgeschlagen");
    erfolgZeichnen(name);
  } catch (fehler) {
    knopf.disabled = false;
    knopf.textContent = "Erneut senden";
    klein.innerHTML = 'Das Senden hat gerade nicht geklappt. Schreiben Sie mir gern direkt an ' +
      '<a href="mailto:michael.friedl@tecis.de">michael.friedl@tecis.de</a> oder rufen Sie an: ' +
      '<a href="tel:+4915225658310">0152 25658310</a>.';
  }
}

function erfolgZeichnen(name){
  bogen.balken.style.width = "100%";
  bogen.leib.textContent = "";
  const vorname = name.split(" ")[0] || "";
  const kasten = document.createElement("div");
  kasten.className = "gelungen";
  const haken = document.createElement("div");
  haken.className = "haken-gross";
  const titel = document.createElement("h3");
  titel.id = "bogen-titel";
  titel.textContent = vorname ? "Danke, " + vorname + "!" : "Vielen Dank!";
  const text = document.createElement("p");
  text.className = "bogen-hilfe";
  text.style.marginTop = ".5rem";
  text.textContent = "Ihre Anfrage ist bei mir angekommen. Ich melde mich persönlich bei Ihnen, meist noch am selben Tag.";
  const reihe = document.createElement("div");
  reihe.style.cssText = "display:flex; gap:.7rem; justify-content:center; flex-wrap:wrap; margin-top:1.4rem";
  const termin = document.createElement("a");
  termin.className = "taste taste--voll";
  termin.href = EINSTELLUNGEN.terminLink;
  termin.target = "_blank"; termin.rel = "noopener";
  termin.textContent = "Gleich Termin wählen";
  const zu = document.createElement("button");
  zu.type = "button"; zu.className = "taste taste--rand"; zu.textContent = "Schließen";
  zu.addEventListener("click", bogenSchliessen);
  reihe.append(termin, zu);
  kasten.append(haken, titel, text, reihe);
  bogen.leib.appendChild(kasten);
  zu.focus();
}

function fragebogenEinrichten(){
  bogen.vorhang = hole("#vorhang");
  bogen.leib    = hole("#bogen-leib");
  bogen.balken  = hole("#fortschritt-balken");
  if (!bogen.vorhang) return;

  alle("[data-bogen-auf]").forEach(el => el.addEventListener("click", bogenOeffnen));
  alle("[data-bogen-zu]").forEach(el => el.addEventListener("click", bogenSchliessen));
  bogen.vorhang.addEventListener("click", e => { if (e.target === bogen.vorhang) bogenSchliessen(); });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && bogen.vorhang.dataset.offen === "ja") bogenSchliessen();
  });
}

/* ---------------- Start ---------------- */

kopfleisteEinrichten();
fragebogenEinrichten();
const jahr = hole("#jahr");
if (jahr) jahr.textContent = String(new Date().getFullYear());
