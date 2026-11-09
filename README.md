# Cryol Accounts
Static pages, no build step. Data is saved in your browser (localStorage).
- `index.html` – home
- `accounts.html` – accounts dashboard
- `estimates.html` – estimates dashboard

## Publish with GitHub Pages
Repo → Settings → Pages → Source: "Deploy from a branch" → `main` / root → Save.
Your site will be at `https://<username>.github.io/<repo>/`.

## Install as a desktop app
Open the live link in Chrome or Edge → click the Install icon in the address bar (or menu → Install) → it gets its own window and a desktop/Start menu shortcut.

## Backup and restore
Each dashboard has Export backup (JSON), Export CSV (for Excel or your accountant) and Import backup (restores a JSON backup; replaces current data).

## Security
Data is encrypted in the browser (AES-256-GCM, key from your passphrase via PBKDF2). Auto-locks after 5 minutes idle. Backups are encrypted with a passphrase you choose at export. A lost passphrase cannot be recovered.
