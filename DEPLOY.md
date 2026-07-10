# Publishing the Prestige site (beta) on Railway

A private-ish preview link, no domain purchase needed. Railway gives you a free
`https://something.up.railway.app` URL. Two levels of privacy:

- **Link-only** (default): only people you send the link to will find it.
- **Password** (recommended for investors): add a username + password so the
  link alone isn't enough. (Set two variables in step 4.)

The repo already includes everything Railway needs: `server.js`, `package.json`,
and a `.gitignore` (which keeps the temporary working folders out of the deploy).

---

## 1. Put the site on GitHub

Use the contents of THIS `Site` folder as the repository (not the whole Prestige folder).

Easiest (GitHub Desktop):
1. Open GitHub Desktop → File → New Repository… or "Add Local Repository" and point it at this `Site` folder.
2. Create the repo as **Private**.
3. Click "Publish repository".

Command line alternative (run inside the `Site` folder):
```
git init
git add .
git commit -m "Prestige site beta"
git branch -M main
git remote add origin https://github.com/<your-username>/prestige-site.git
git push -u origin main
```
(Create the empty `prestige-site` repo on github.com first, set it to Private.)

## 2. Create the Railway project
1. Go to https://railway.app and sign in with GitHub.
2. **New Project → Deploy from GitHub repo** → pick `prestige-site`.
3. Railway auto-detects Node, runs `npm install` and `npm start`. Wait for the
   build to finish (green check).

## 3. Get the shareable link
1. Open the service → **Settings → Networking**.
2. Click **Generate Domain**.
3. You get a URL like `https://prestige-site-production.up.railway.app`.
   That's the link you share for feedback.

## 4. (Recommended) Turn on a password
1. In the service, open the **Variables** tab.
2. Add two variables:
   - `BASIC_AUTH_USER`  →  e.g. `prestige`
   - `BASIC_AUTH_PASS`  →  e.g. a phrase you share with reviewers
3. Railway redeploys automatically. Now the browser asks for that user/password
   before showing the site. Remove the two variables to make it open again.

## Updating the site later
Push changes to GitHub (or "Push origin" in GitHub Desktop). Railway redeploys
automatically within a minute.

## Notes
- Free usage: Railway's trial/hobby credit is plenty for a static preview.
- This is a static site; there is no database and nothing to configure.
- The contact form opens the visitor's email app (mailto) — it does not send
  mail from the server, so nothing extra is needed.

## Forms (contact, investors, careers, PQRS)
The site's forms use **Netlify Forms** (they have `data-netlify="true"`). If you host
on **Netlify**, submissions appear in your Netlify dashboard automatically — no email,
no backend, no config. If you host somewhere else (Cloudflare Pages, Railway, etc.),
point each form to a free form service instead (e.g. Formspree): set the form's
`action` to your Formspree endpoint and remove the `data-netlify` attribute.
