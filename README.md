# Codici JS Sito Web Avantir

Script e snippet HTML/JS/CSS per il sito Avantir (Webflow).

## Caricare da GitHub (solo link) – le modifiche si propagano al sito

In Webflow **Project Settings → Custom Code** incolla **solo** questi link. Quando aggiorni i file su GitHub e fai push, il sito caricherà la versione più recente (può servire qualche minuto o un refresh con cache svuotata).

### CTA pulse (bottone che pulsa)

- **Head Code:**  
  `<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/propleaderOFFICIAL/codici-js-avantir@main/cta-pulse/cta_button_pulse_shadow.css">`
- **Footer Code (Before </body>):**  
  `<script src="https://cdn.jsdelivr.net/gh/propleaderOFFICIAL/codici-js-avantir@main/cta-pulse/cta_button_pulse_shadow.js"></script>`

### Cookie consent

- **Head Code:**  
  `<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/propleaderOFFICIAL/codici-js-avantir@main/cookie-consent/cookie_consent.css">`
- **Footer Code (Before </body>):**  
  `<script src="https://cdn.jsdelivr.net/gh/propleaderOFFICIAL/codici-js-avantir@main/cookie-consent/cookie_consent.js"></script>`
- **Importante:** l’HTML del banner (il blocco con `cookie-consent-wrapper`, `cookie-consent-banner`, ecc.) va incollato **una volta** in un Embed su Webflow. Lo trovi in `cookie-consent/cookie_consent.html` (la parte tra `</style>` e `<script>`). CSS e JS invece si aggiornano da GitHub.

Usiamo **jsDelivr** (`cdn.jsdelivr.net/gh/...`) così il sito può caricare i file da GitHub; dopo ogni push su `main` la CDN si aggiorna in breve.

---

## Struttura del repo (per funzione)

```
cta-pulse/                    → CTA con ombra pulsante
  cta_button_pulse_shadow.html
  cta_button_pulse_shadow.css
  cta_button_pulse_shadow.js

cookie-consent/               → Banner cookie / consenso
  cookie_consent.html
  cookie_consent.css
  cookie_consent.js
```

| Cartella / file | Uso |
|-----------------|-----|
| **cta-pulse/** | Ombra pulsante sul bottone CTA; `.html` per copy-paste, `.css`/`.js` caricabili da link |
| **cookie-consent/** | Banner cookie; `.html` per copy-paste (HTML da incollare una volta), `.css`/`.js` caricabili da link |

## Uso classico (copia e incolla)

1. Apri il file che ti serve (es. `.html`).
2. Copia il contenuto (tag `<style>`, `<script>`, eventuale HTML).
3. In Webflow: aggiungi un **Embed** o **Project Settings → Custom Code** e incolla dove serve.

## Clona il repo

```bash
git clone https://github.com/propleaderOFFICIAL/codici-js-avantir.git
cd codici-js-avantir
```
