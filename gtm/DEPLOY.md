# Putting the Margin demo on a public URL

This gets the landing page and the live demo onto a real link you can send to prospects, with the founding-customer form delivering sign-ups to your inbox. Pick one host. All three are free for a site like this.

| Option | Best if | Time | Your URL |
|---|---|---|---|
| A. GitHub Pages | The repo is public, or you pay for GitHub | 5 min | `https://neildahan.github.io/Pdfreader/` |
| B. Netlify | You want the simplest dashboard | 5 min | `https://<name>.netlify.app` |
| C. Vercel | You already use Vercel | 5 min | `https://<name>.vercel.app` |

Do step 0 first, then one of A, B or C, then D (the form, 5 minutes) and, when you have a domain, E.

The site is fully static: no server, no database. PDFs opened in the demo stay in the visitor's browser. The only thing that leaves the page is the founding-customer form, and only once you connect it in step D.

---

## 0. Make `margin-demo` the default branch (do this first)

Right now the repository's default branch is `research/pdf-sdk-market`, which holds only the research files. The demo (the `app` folder) and the deploy workflow live on `margin-demo`, and there is no `main` branch yet. All three hosts look at the default branch first, so leaving it as is causes confusing failures: GitHub hides the **Run workflow** button and blocks `margin-demo` from publishing to Pages, and Vercel can't find the `app` folder when you import the repo.

1. Open `https://github.com/neildahan/Pdfreader` > **Settings** > **General**.
2. Under **Default branch**, click the switch-branches icon, choose `margin-demo`, click **Update**, and confirm.

Nothing is deleted; the research branch stays as it is. If you later merge everything into a `main` branch, make `main` the default instead. The workflow and the steps below work from either.

---

## A. GitHub Pages

The repo already contains the workflow that builds and publishes the site (`.github/workflows/deploy-pages.yml`). It runs on every push to `main` or `margin-demo`.

**Plan check:** GitHub Pages is free on public repositories. On a private repository it needs a paid plan (GitHub Pro, Team or Enterprise). If the repo is private and you don't want to pay or make it public, use Netlify or Vercel instead.

1. Open `https://github.com/neildahan/Pdfreader` and click **Settings**.
2. In the left sidebar click **Pages**.
3. Under **Build and deployment**, set **Source** to **GitHub Actions**. Nothing else on this page needs changing.
4. Check which branches may publish. GitHub only lets the default branch publish to Pages unless you add others. If you did step 0 before step 3, `margin-demo` is already allowed and you can skip this. Otherwise:
   - Left sidebar: **Environments** > **github-pages**.
   - Under **Deployment branches and tags**, click **Add deployment branch or tag rule**, type `margin-demo`, and save. Do the same for `main` if you deploy from it and it is not the default.
5. Click the **Actions** tab and choose **Deploy demo to GitHub Pages** on the left.
   - If a run is already listed with a red X, that is expected: it ran when the branch was pushed, before steps 3 and 4 were done. Open it and click **Re-run all jobs**.
   - Otherwise click **Run workflow** (top right of the list), pick `margin-demo`, and run it. If there is no **Run workflow** button, the workflow is not on the default branch yet; do step 0.
6. Wait about two minutes for both jobs (build, deploy) to go green. The deploy job shows the live link. It will be `https://neildahan.github.io/Pdfreader/`.

Every later push to `margin-demo` or `main` redeploys automatically.

**If the run fails** with "Branch ... is not allowed to deploy to github-pages due to environment protection rules", redo step 4 (or step 0). If it fails at "configure-pages" with "Not Found" or "Get Pages site failed", redo step 3. After fixing either, open the failed run and click **Re-run all jobs**.

## B. Netlify

1. Go to `https://app.netlify.com` and sign in with GitHub.
2. Click **Add new site** > **Import an existing project** > **GitHub**, and pick the `Pdfreader` repository. Grant access to it if asked.
3. On the settings screen:
   - **Branch to deploy:** `margin-demo` (or `main` once merged).
   - **Base directory:** `app`
   - Leave build command and publish directory as they appear. They are read from `app/netlify.toml` (`npm run build`, publishing `dist`, Node 22).
4. Click **Deploy**. It takes about a minute.
5. Rename the random URL: **Site configuration** > **Change site name**, for example `margin-pdf`, giving `https://margin-pdf.netlify.app`.

Netlify works with private repos on the free plan.

## C. Vercel

1. Go to `https://vercel.com` and sign in with GitHub.
2. Click **Add New** > **Project** and import the `Pdfreader` repository.
3. Next to **Root Directory**, click **Edit** and choose `app`. (If `app` isn't in the list, the default branch is still the research branch; do step 0 and start the import again.) Vercel detects Vite. Build settings come from `app/vercel.json` (`npm ci`, `npm run build`, output `dist`), so leave them alone.
4. Click **Deploy**.
5. Vercel deploys the repo's default branch to the main URL and gives every other branch a preview URL. If you did step 0, `margin-demo` is already the main site. Otherwise, to change it: **Settings** > **Environments** > **Production** > **Branch Tracking**, set it to `margin-demo`, then redeploy. Or simply merge to `main`.

Vercel's free Hobby plan is for non-commercial use. A pre-launch validation page is a grey area; if you want to be clean about it, use Netlify or Vercel Pro.

---

## D. Make the founding-customer form collect sign-ups (Formspree)

Without this step the form still works, but it opens the visitor's email app with a pre-filled message to the contact address. That loses people. Formspree turns it into a normal "submit and done" form and emails each sign-up to you. No code changes needed.

### 1. Create the form

1. Go to `https://formspree.io` and sign up (free) with the inbox where you want sign-ups.
2. Confirm your email address from the message Formspree sends.
3. Click **+ New Form**. Name it `Margin founding customers`, and set the destination email.
4. Copy the endpoint it shows. It looks like `https://formspree.io/f/abcdwxyz`.

The free plan has a monthly submission cap (50 per month at the time of writing; check their pricing page). That is enough for a 20-spot founding program. Sign-ups also appear in the Formspree dashboard, where you can export them as CSV.

### 2. Paste the endpoint into your host

You set two values. The names must be exactly these:

| Name | Value |
|---|---|
| `VITE_FORM_ENDPOINT` | your Formspree URL, e.g. `https://formspree.io/f/abcdwxyz` |
| `VITE_CONTACT_EMAIL` | the address shown on the site, e.g. `founders@yourdomain.com` |

Where to put them:

- **GitHub Pages:** repo **Settings** > **Secrets and variables** > **Actions** > **Variables** tab > **New repository variable**. Add both. Then **Actions** > **Deploy demo to GitHub Pages** > **Run workflow** to rebuild. (Use the Variables tab, not Secrets. These values are visible in the page anyway.)
- **Netlify:** **Site configuration** > **Environment variables** > **Add a variable**. Add both, then **Deploys** > **Trigger deploy** > **Deploy site**.
- **Vercel:** project **Settings** > **Environment Variables**. Add both (tick Production and Preview), then **Deployments** > the latest one > **Redeploy**.

The values are baked in at build time, which is why each host needs a rebuild after you add them.

If you'd rather put them in the code, edit `CONTACT` in `app/src/config.ts`. Host variables win over the file when both are set.

### 3. Test it

1. Open your live URL, scroll to the founding-customer form, and submit it with your own details.
2. You should see "You're on the list." on the page, and an email from Formspree within a minute.
3. The first submission to a new Formspree form may ask you to confirm the form by email. Do that once.

Each notification arrives with a subject like `Founding customer: Acme Legal (Business)`, and hitting Reply answers the person who signed up.

**Spam:** the form has a hidden "honeypot" field (`_gotcha`). Real visitors never see it; bots that fill it get a fake success and nothing is sent. Formspree also runs its own spam filtering.

**If you see "Something went wrong":** check the endpoint is copied exactly, with no trailing space, and that you rebuilt after adding it. In Formspree, open the form's **Settings** and make sure it is active and not restricted to a different domain. If submissions still fail, turn off reCAPTCHA in the form settings; it can block submissions sent from page code like this one.

---

## E. Custom domain (for example `margin.dev` or `getmargin.com`)

Buy the domain anywhere (Cloudflare, Namecheap, Porkbun, Google/Squarespace Domains). Check the name for trademark conflicts first; "Margin" is a working name. Then point it at your host. A subdomain like `demo.yourcompany.com` is the easiest because it only needs one DNS record.

### GitHub Pages

1. Repo **Settings** > **Pages** > **Custom domain**, enter the domain, **Save**.
2. At your domain registrar, add DNS records:
   - Subdomain (e.g. `demo.yourcompany.com`): one `CNAME` record, name `demo`, value `neildahan.github.io`.
   - Root domain (e.g. `getmargin.com`): four `A` records for `@` pointing to `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`, plus a `CNAME` for `www` pointing to `neildahan.github.io`.
3. Back in **Settings** > **Pages**, once the DNS check passes, tick **Enforce HTTPS**.

### Netlify

1. **Domain management** > **Add a domain**, enter it, and follow the prompts.
2. Netlify shows the exact DNS record to add at your registrar (usually a `CNAME` to `<name>.netlify.app` for a subdomain). HTTPS is set up automatically.

### Vercel

1. Project **Settings** > **Domains** > **Add**, enter it.
2. Vercel shows the exact record to add (a `CNAME` to `cname.vercel-dns.com` for subdomains, an `A` record for root domains). HTTPS is automatic.

DNS changes usually take a few minutes, occasionally a few hours. The site works on the new domain with no code changes because it uses relative paths.

---

## Before you send the link to anyone

- [ ] Form connected (step D) and tested with a real submission.
- [ ] `VITE_CONTACT_EMAIL` set to a real inbox you read. The default is the placeholder `founders@example.com`.
- [ ] Open the link on your phone and load the demo once.
- [ ] Open the link in a private window to confirm it works for people who aren't logged in to anything.
- [ ] Read the landing page once more for claims. The code sample is marked "API preview" because the npm packages don't exist yet; keep it that way.

## How it works (for whoever helps you later)

- `app/` is a Vite + React static site. `npm run build` writes `app/dist/`. Build uses `base: './'` and hash routing (`#/`, `#/demo`), so it runs from any sub-path, including `/Pdfreader/` on GitHub Pages, with no rewrites.
- `.github/workflows/deploy-pages.yml`: GitHub Pages build and deploy on push to `main` or `margin-demo`, or on demand. Node 22. Reads repository variables `VITE_FORM_ENDPOINT` and `VITE_CONTACT_EMAIL`.
- `app/netlify.toml` and `app/vercel.json`: host config, used when the base/root directory is `app`.
- `app/src/config.ts`: `CONTACT` reads the two env vars and falls back to the values in the file. The form in `app/src/site/Landing.tsx` POSTs JSON with `Accept: application/json` (what Formspree expects), adds a `_subject`, and drops the `_gotcha` honeypot client-side.
