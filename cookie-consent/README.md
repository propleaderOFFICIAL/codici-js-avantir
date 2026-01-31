# Cookie consent

Banner cookie / consenso (Google, Meta, ecc.).

- **cookie_consent.html** – Versione completa (HTML + stili + script) per copy-paste in Webflow Embed.
- **cookie_consent.css** / **cookie_consent.js** – Caricabili da link (vedi README principale).

## Generare .css e .js da .html

Se hai già `cookie_consent.html` e ti servono i file separati per i link jsDelivr, dalla cartella `cookie-consent` esegui:

```bash
chmod +x extract-css-js.sh
./extract-css-js.sh
```

Verranno creati `cookie_consent.css` e `cookie_consent.js`.

## Ripristinare i file da git

In questa cartella dovrebbero esserci `cookie_consent.html`, `cookie_consent.css` e `cookie_consent.js`. Se mancano, dalla **root del repo** (cartella `Codici JS Sito Web Avantir`) esegui:

```bash
# Opzione 1: script automatico
chmod +x cookie-consent/restore-from-git.sh
./cookie-consent/restore-from-git.sh
```

Oppure a mano (sempre dalla root del repo):

```bash
# Ripristina l’HTML dal primo commit
git show d53951c:cookie_consent.html > cookie-consent/cookie_consent.html

# Estrai CSS (linee 20–692) e JS (linee 789–1506)
sed -n '20,692p' cookie-consent/cookie_consent.html > cookie-consent/cookie_consent.css
sed -n '789,1506p' cookie-consent/cookie_consent.html > cookie-consent/cookie_consent.js
```
