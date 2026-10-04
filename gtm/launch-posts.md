# Margin launch posts

Ready-to-post drafts for Hacker News, Reddit, LinkedIn, X, Indie Hackers and Product Hunt, plus a two-week posting schedule and a plan for handling replies.

The goal of these posts is the same as the outreach kit (`gtm/outreach.md`): book validation calls and collect founding commitments (target from the market report: 30 interviews, 10 paid commitments in about four weeks). Upvotes don't count toward that. A post with 12 points that leads to three calls with legal-tech engineering leads is worth more than a front-page post that leads to none.

Contents:

0. [Before you post anything](#0-before-you-post-anything)
1. [Show HN](#1-show-hn)
2. [Reddit: r/webdev, r/reactjs, r/SaaS](#2-reddit)
3. [LinkedIn founder post](#3-linkedin-founder-post)
4. [X thread](#4-x-thread)
5. [Indie Hackers and Product Hunt](#5-indie-hackers-and-product-hunt)
6. [Posting order, timing, and what to do with replies](#6-posting-order-timing-and-replies)

Placeholders used throughout, with the same names as `gtm/outreach.md`: `{{demo_url}}` (full-screen viewer, `.../#/demo`), `{{site_url}}` (landing page with pricing), `{{sender_name}}`, and `{{N}}` (a real count, filled in on the day). The schedule in section 6 is the same one used in the 14-day plan in `gtm/README.md`.

---

## 0. Before you post anything

Public posts get checked harder than cold emails. One false claim found by a commenter costs more than the whole launch earns, and "honest pricing" makes it worse because honesty is the pitch. Fix these first.

**Must fix**

- [x] **Landing page claims (fixed on 4 Oct 2026).** The FAQ and developer section no longer claim Vue, Angular, plain JS, TypeScript types or `npm install`; the developer section is titled "What the API will look like" and keeps the "API preview" badge. The comparison table now says "Annual terms, no multi-year lock-in" and "Open the demo, drop in your own PDF". The features grid no longer says "instantly" or "small bundle". Pricing cards mark redaction and forms, the security review package, the collaboration server and the SOC 2 report as "planned", and Startup no longer says "Buy it online". The pricing section says these are launch prices and Margin is a demo plus a founding program today. Re-read the deployed page once before posting; if anyone edits `Landing.tsx` or `config.ts` again, check it again.
- [ ] **Contact details.** `CONTACT.email` falls back to the placeholder `founders@example.com` unless you set `VITE_CONTACT_EMAIL` on your host. Set a real address and the Formspree endpoint (see `gtm/DEPLOY.md`, step D) and send yourself a test sign-up.
- [ ] **Deploy and test the demo** on a phone, in Safari, and with a 200+ page PDF. HN readers will drop in their own worst files within minutes. Know where it breaks before they do.
- [ ] **Name check.** "Margin" is a working name. Do a quick trademark and search-collision check before it appears in a public title you can't edit. If it isn't cleared by Wednesday, use HN title option 2, which leaves the name out.

- [ ] **Story check.** Every post tells your quote story. Keep to what actually happened: the drafts only state that you got a ~$30k/yr quote, with no public price and a sales call first. Buyers widely report add-on pricing, revenue questions and multi-year pressure, but say those happened to you only if they did. The LinkedIn post has a bracketed line for this. The general pattern is backed by public sources (see the market report) and can be cited as "buyers report".

- [ ] **"I built" vs "we built".** The drafts say "I built". HN, r/webdev and r/reactjs will ask detailed technical follow-ups (appearance streams, text-layer alignment, bundle size). If someone else wrote most of the code, say "we" and bring that person into the thread, or read `app/README.md` and the code map until you can answer with confidence.

**Decide before posting**

- **Do you name the vendor?** Price quotes often come with confidentiality language in the order form or the quote email. The drafts below say "a large PDF SDK vendor" for your own quote, and only name Apryse and Nutrient when citing public procurement data (Vendr: Apryse median about $24k/yr, Nutrient median about $31k/yr). If someone asks "which vendor?", see the reply guidance in section 6.
- **Employer.** If this is separate from your day job, make sure your employer is fine with you telling the story of a quote your company received. Keep the company unnamed either way.
- **Who answers.** Block out the first four hours after each post. On HN and Reddit, a post where the author answers every question in the first hour does far better than one where the author shows up the next morning.

**What not to say anywhere**

- No customers, users, "teams using it", testimonials, logos or download counts. There aren't any yet.
- No `npm install` line presented as real. The `@margin/*` packages don't exist. The landing page labels its code sample "API preview"; keep that framing.
- No SOC 2, no "enterprise-ready", no performance numbers you haven't measured.
- No "Acrobat alternative". It's an SDK for developers, not an end-user app. Mixing those up gets you the wrong audience.

---

## 1. Show HN

HN rules that matter here: a Show HN must be something people can try now (the demo qualifies), sign-up pages and landing pages alone don't qualify, and the title should be plain. No superlatives, no exclamation marks, no "honest" in the title (it reads as a marketing claim and invites a pile-on). Never ask anyone to upvote, and don't share the direct link in Slack groups asking for votes; HN detects voting rings and kills the post.

**Submit as a URL post pointing at the demo, then post the text below as the first comment right away.** Pointing at `{{demo_url}}` instead of the landing page keeps it a "try this" post, not a "buy this" post. Pricing goes in the comment, upfront, so nobody can say it was hidden.

### Title (pick one, all under 80 characters)

```text
Show HN: Margin – an embeddable PDF annotation viewer that runs in the browser
```

```text
Show HN: A client-side PDF annotation SDK with public pricing
```

```text
Show HN: I got a $30k/yr quote for a PDF viewer, so I built a demo of one
```

Recommendation: the first. It says what it is. The third gets more clicks but sets up a fight about the price of the quote instead of a conversation about the product, and it'll attract people who want a free tool rather than people who buy SDKs.

### First comment

```text
Hi HN. I'm a product VP. A while ago my team needed an in-app PDF viewer with annotations: highlights, comments, signatures, the usual review workflow. We went to one of the big PDF SDK vendors and got a quote of about $30k a year. Vendr's public data puts the median contract for the two biggest vendors at roughly $24k and $31k a year, so that wasn't unusual.

Free options (PDF.js, react-pdf, EmbedPDF) are great at rendering, but the annotation and review layer is where you end up building a lot yourself. So I built a demo of the thing I wanted to buy, to find out whether other teams want it too.

What works in the demo (drop in your own PDF, nothing is uploaded):

- Highlight, underline and strikeout on selected text; pen, rectangle, ellipse, arrow, text box, sticky note, drawn signature
- Move, resize, recolor, undo/redo, keyboard shortcuts
- A comment thread on every annotation, with replies and resolve
- Export as a PDF with real annotation objects (they open and stay editable in Acrobat, Preview and Chrome), as a flattened PDF, or as JSON
- Imports annotations that already exist in a PDF, e.g. from Acrobat
- Search, thumbnails, zoom, dark mode, works on a phone

It's built on pdf.js for rendering and pdf-lib for writing annotations, with React on top. Everything runs client-side.

What it isn't yet: there's no npm package. The code sample on the site is an API preview. No redaction, no form filling, no real-time collaboration, no server-side processing, no Office conversion. If you need those today, the big vendors are the right answer.

Pricing, since that's the whole point: free for development, $5k/yr for one production app, $12k/yr for up to three, enterprise from $25k. No per-document or per-user fees, no revenue-based pricing, renewals capped at 5%. I'm taking up to 20 "founding" teams at 50% off for life, with a $500 deposit that's refundable until you go to production, and billing starts only when you ship.

What I'd like from you:

1. Try it with the ugliest PDF you have and tell me what breaks.
2. If you've bought or evaluated a PDF SDK: what did you pay, and what made you pick (or walk away from) a vendor?
3. If you rolled your own on top of pdf.js: what was the part that took longest?

Pricing page: {{site_url}}
```

### Prepared answers to the comments you will get

Write your replies fresh, but have the substance ready. Keep each to a few sentences, concede the fair points, and never argue with tone.

| Comment | Substance of your reply |
|---|---|
| "This is just a pdf.js wrapper. Why would I pay $5k?" | Fair. pdf.js does rendering and does it well. What you'd pay for is the annotation layer, writing real PDF annotations that Acrobat can read back, comment threads, and someone maintaining it. If your team would rather build that, you should. Ask what they'd estimate it would take. That answer is useful data. |
| "$5k is still expensive for a startup." | The free tier covers development. $5k is aimed at teams that got $20k+ quotes. If a team needs something cheaper, ask what they'd pay and why. Don't drop the price in the thread. |
| "Why should I trust a pre-launch SDK in production?" | You shouldn't, yet. That's why the deposit is refundable until go-live and billing only starts when you ship. Founding teams get direct access to the person building it. |
| "Which vendor quoted you?" | See section 6. Short version: "I'd rather not name them over a private quote. Public data on Vendr shows the big two's medians around $24k and $31k, which matches what I saw." |
| "Open source it." | Say you're thinking about what's open and what's paid, and ask which part they'd want open. Don't commit in the thread. |
| "PDF is a nightmare format, you'll drown in edge cases." | Agree. Ask them for the files that broke other tools. Log every one they send. |
| "What about EmbedPDF / react-pdf-viewer / PDF.js Express?" | Name what they do well, and check their current sites before you describe their features or prices; they change. The gap you're testing is the full annotation and review workflow at a flat public price. Don't trash competitors. |
| "How big is the bundle?" / "How fast is it on a 500-page file?" | Give the measured number: about 0.8MB gzipped JavaScript including the pdf.js worker and the landing page, not optimized yet. For large files, say what you saw in your own pre-flight test and nothing more. Never estimate a performance number in a thread. |
| Someone from a competitor shows up | Be gracious. Thank them. Never reply to bait. |
| A real bug report | Thank them, reproduce it, reply when it's fixed ("Fixed, thanks. It was X."). That reply often gets more goodwill than the original post. |

---

## 2. Reddit

General rules for all three subreddits:

- **Read the sidebar and the pinned posts on the day you post.** Self-promotion rules change, and each subreddit enforces them differently. If unsure, message the moderators first and ask whether the post is OK. Mods almost always answer and almost never mind being asked.
- **Use an account with real history.** A new account whose first post links to its own product gets filtered or removed. If your account is thin, spend the week before commenting helpfully in these subs (questions about PDF rendering, react-pdf, file viewers come up often).
- **Disclose that it's yours** in the first line. Reddit forgives self-promotion far more than hidden self-promotion.
- **Lead with something useful**, not the product: what you learned, the technical problem, the pricing data.
- **One subreddit per day.** Don't cross-post the same text; it gets flagged as spam and annoys people who read more than one sub.
- **Reply to every comment in the first few hours.** Don't delete and repost a post that's doing badly.

### r/webdev

Etiquette: r/webdev restricts self-promotion to **Showoff Saturday** (posts sharing your own project go up on Saturdays, and the title is usually prefixed with `[Showoff Saturday]`). Check the current rule before posting. Readers are working web developers who are skeptical of anything that looks like a pitch and enthusiastic about technical detail. Lead with how it works. Keep pricing to one honest paragraph near the end.

**Title**

```text
[Showoff Saturday] I built a client-side PDF annotation viewer that exports real Acrobat-compatible annotations
```

**Body**

```text
Disclosure: this is my project, and I'm planning to sell it as an SDK. It's early. Here's the demo: {{demo_url}}

Background: my team needed in-app PDF review (highlights, comments, signatures) and the commercial quote we got was about $30k a year. The free options render well, but the annotation layer is DIY. So I built the annotation layer to see how hard it actually is.

How it works, for the curious:

- Rendering is pdf.js, lazily loaded per page, with the text layer on top so text selection drives highlight/underline/strikeout.
- Annotations live in an SVG layer above each page canvas, stored in page coordinates so they survive zoom.
- Export writes real PDF annotation objects with pdf-lib, including appearance streams, so Acrobat, Preview and Chrome show them and they stay editable. There's also a flattened export and plain JSON.
- Import goes the other way: annotations already in a PDF (e.g. made in Acrobat) load in as editable objects. Margin's own exports round-trip with comment threads intact.
- State is a small store with undo/redo and per-document autosave in the browser. Nothing is uploaded anywhere.

The hardest parts so far were appearance streams (each viewer interprets them a bit differently) and getting text-markup quads to line up with pdf.js's text layer across zoom levels.

What doesn't exist yet: an npm package, redaction, forms, real-time collaboration.

Pricing, since I'd rather say it upfront: free in development, $5k/yr for one production app. No per-document or per-user fees.

I'd love feedback on two things: files that break it, and whether the export opens correctly in whatever PDF tool you use.
```

### r/reactjs

Etiquette: r/reactjs is friendlier to people sharing projects than r/webdev, but it expects the post to be about React. Check the sidebar for the current rules on self-promotion and whether project posts should use a specific flair (e.g. "Show /r/reactjs") or go in a weekly thread. Talk about component design and state, not the business. Readers will ask what the API looks like, so be clear the API is a preview.

**Title**

```text
Building a PDF annotation component in React: pdf.js + SVG overlay + undo/redo. Demo and lessons inside
```

**Body**

```text
Disclosure: I'm building this as a commercial SDK. Demo here: {{demo_url}}. The code isn't published as a package yet, so this is a "how I built it" post, not an "npm install" post.

A few React-specific things I ran into that might help anyone building something similar:

1. Don't render every page. Each page is its own component that mounts its canvas and text layer only when it's near the viewport. Thumbnails do the same at low resolution. Big documents stay responsive.

2. Group annotations by page and memoize the page component. All annotations live in one reducer, but each page only receives its own slice, and pages are wrapped in React.memo. Dragging a shape on page 40 doesn't re-render page 1.

3. Snapshot-based undo/redo is simpler than it sounds. Annotations are immutable arrays, so history is just past/future stacks of arrays (capped at 100). The trick is drags: a drag fires dozens of updates, so it records one "checkpoint" at the start and the moves after it skip history. One drag, one undo step. Autosave is a debounced effect on the same state.

4. Store coordinates in PDF page space, not screen pixels. Convert at render time. Zoom, rotation and export then all use the same numbers.

5. Pointer events, not mouse events. One code path for mouse, pen and touch, and the drawing tools work on a phone.

What the component does today: text highlight/underline/strikeout, pen, shapes, arrows, text boxes, sticky notes, drawn signatures, comment threads with replies, search, thumbnails, zoom, dark mode, and export to a PDF with real annotations that open in Acrobat.

The API I'm planning looks roughly like <Viewer document={url} onAnnotationsChange={...} />, with annotations as plain JSON you can store anywhere. I'd really like opinions here: controlled vs uncontrolled annotations, how you'd want to plug in your own comment backend, what you'd expect from the toolbar.

(Pricing for the curious: free in development, paid per production app. Happy to talk about it in the comments, but this post is mainly about the React side.)
```

The numbered points match the code in `app/src/viewer/` as of this draft (`store.ts`, `PageView.tsx`, `AnnotationLayer.tsx`). If the code changes before you post, re-check them. A React subreddit will notice a mismatch between the post and the demo's behavior.

### r/SaaS

Etiquette: r/SaaS gets a lot of thinly disguised promotion and its readers are tired of it. Check the sidebar; most promotion belongs in a designated thread, while posts that share real lessons or numbers are welcome. The post that works here is a story about pricing with a question at the end, and no link in the body. Put the link in a comment only if someone asks for it, or if the rules allow it in the post.

**Title**

```text
A vendor quoted us ~$30k/yr for a PDF viewer. I'm testing whether "public pricing, no metering" is enough of a reason to switch
```

**Body**

```text
I'm a product VP. Disclosure upfront: I'm validating a product, and this post is partly about it. Mostly I want to pressure-test the pricing idea with people who run SaaS businesses.

What happened: we needed PDF viewing and annotation inside our app. The established SDK vendors don't publish prices. We got a quote of about $30k a year. Vendr's public data says that's normal: median contracts for the two biggest vendors are around $24k and $31k a year. Buyers also report revenue-based pricing, financial audits to check license compliance, and pressure toward multi-year terms.

The hypothesis I'm testing: there's a set of Series A-C SaaS companies (legal tech, construction, insurance, health tech) that need solid in-app PDF review, got a $20k+ quote, and would rather pay a known price.

The pricing I'm testing:
- Free in development
- $5k/yr for one production app
- $12k/yr for up to three apps
- Enterprise from $25k
- No per-document or per-user fees, no revenue-based pricing, renewals capped at 5%

To test it, I'm asking for a $500 deposit, refundable until go-live, in exchange for 50% off for life, with billing starting only when the customer ships. 20 spots. The target is 10 commitments in about four weeks. If I can't get there, that tells me something too.

Questions for people here:

1. Would a refundable deposit tell you anything about real demand, or would you want a non-refundable pre-sale?
2. Is "50% off for life" a mistake I'll regret at renewal? What founding offers have worked for you?
3. Has anyone here moved a product from quote-only to public pricing? What happened to deal size?

I'll share the results here whether it works or not.
```

That last line is a commitment. Keep it: a week-4 follow-up post with real numbers ("I asked for 10 commitments and got N") is often the best-performing post in a series like this.

---

## 3. LinkedIn founder post

LinkedIn notes:

- The first two lines show before "see more". They have to make someone stop scrolling.
- Posts with outbound links in the body tend to get less reach. Put `{{site_url}}` in the first comment and say "link in the comments" in the post.
- Don't name your employer or the vendor. The story works without them.
- Post from your personal profile, not a company page. Tuesday to Thursday morning in your main timezone.
- Reply to every comment within the first two hours; LinkedIn shows a post to more people when it gets early conversation.

### The post

```text
We got a quote of about $30,000 a year for a PDF viewer.

Not a document platform. A viewer, with highlights, comments and signatures, inside our app.

The number wasn't the only problem. The process was.

There was no public price, so the first step was a sales call. Then a quote. [Add only what actually happened to you: add-ons for features you assumed were included, questions about your revenue, a push toward a multi-year term. If none of it did, cut this bracket and keep the next line.]

So I built a working demo of the PDF SDK I wanted to buy:

- View, highlight, comment, sign, inside your own product
- Documents never leave the browser
- Exports that open correctly in Acrobat

And pricing on a public page:

- Free to develop with
- $5k a year for one app, $12k for three
- No per-document or per-user fees
- No revenue questions
- Renewals capped at 5%

It's early. There's no package to install yet. Before I go further, I want to find out whether other teams feel the same way, so I'm talking to 30 of them this month.

If you've bought, evaluated or built a PDF viewer for your product, I'd love 20 minutes of your experience. What you paid, what you'd change, what nearly made you build it yourself.

And if your team is about to sign a PDF SDK contract, I'm taking 20 founding teams at half price for life. Billing starts only when you go live.

Demo and pricing in the comments. Comments and DMs open.
```

**First comment (post right after):**

```text
Demo (try it with your own PDF, nothing is uploaded): {{demo_url}}
Pricing and the founding offer: {{site_url}}
```

**Variant opening lines** if the first doesn't fit your voice:

```text
"How much for a PDF viewer?" "About $30k a year." That answer is why I built one. [Add how long it took only if you'll stand behind the number.]
```

```text
The most expensive line item in our last product spec wasn't the AI feature. It was the PDF viewer.
```

The second variant is only usable if it's literally true for your spec. Don't use it otherwise.

---

## 4. X thread

Five posts, each under 280 characters (checked). Put the link in post 4, not post 1: replies with links get less distribution than plain text, and the first post's job is to get people to read the second. Pin the thread to your profile for the two weeks of the launch.

```text
1/
We got quoted ~$30k a year for a PDF viewer. A viewer with highlights, comments and signatures, inside our app.

No public price. Talk to sales first. Get a quote.

So I built a demo of the PDF SDK I wanted to buy. Thread on what it does and what I'm testing.
```

```text
2/
Public data backs this up. The two big PDF SDK vendors have median contracts around $24k and $31k a year.

Free tools like PDF.js render well. The annotation and review layer is where teams end up building, or paying.
```

```text
3/
The demo runs fully in the browser: highlight, pen, shapes, notes, signatures, comment threads, search.

It exports real PDF annotations that stay editable in Acrobat and Preview. Your documents never touch a server.
```

```text
4/
Pricing is on a public page:
Free to develop
$5k/yr for one app
$12k/yr for three
No per-doc or per-user fees, no revenue audits, renewals capped at 5%

It's early: no npm package yet. Try it with your own PDF:
{{demo_url}}
```

```text
5/
I'm looking for 20 founding teams: 50% off for life, refundable $500 deposit, billing starts only when you ship.

Mostly I want to hear from anyone who's bought or built a PDF viewer. What did you pay? What would you change? DMs open.
```

Measured lengths: 262, 220, 219, 237 and 237 characters. X counts any link as 23 characters, so post 4 stays at 237 whatever the real URL is. Recount if you edit the wording.

---

## 5. Indie Hackers and Product Hunt

### Indie Hackers

Indie Hackers readers like process, numbers and honesty about what isn't working. Post in the main feed (or the most relevant group, e.g. one on SaaS or developer tools), framed as building in public. Commit to updates.

**Title**

```text
Validating a $5k/yr PDF SDK after a $30k quote: the plan, the pricing, and the kill criteria
```

**Body**

```text
I'm a product VP. We got quoted about $30k a year for an embeddable PDF viewer with annotations, and the buying process (no public price, sales call first, quote-only) made me wonder whether there's room for an SDK with a public price list.

Before writing much more code, I'm testing demand:

- Working demo: {{demo_url}} (client-side pdf.js + pdf-lib, real Acrobat-compatible annotation export)
- Public pricing: free in development, $5k/yr per app, $12k/yr for three
- Founding offer: 20 spots, 50% off for life, $500 deposit refundable until go-live
- Goal: 30 conversations and 10 deposits in about four weeks
- Kill criteria: fewer than 5 deposits after 30 real conversations, and I stop or rethink

What I know so far: buyers complain more about how PDF SDKs are sold than about what they do. What I don't know: whether "honest pricing" moves anyone to switch vendors, or only gets nods.

I'll post weekly updates with the numbers, including if they're bad. Questions and pushback welcome, especially on the deposit mechanics.
```

Only publish the kill criteria if you mean them. Discuss the threshold with whoever owns the decision before this goes up, and change "fewer than 5" if you've agreed a different number.

### Product Hunt

**Recommendation: don't launch on Product Hunt yet.** A PH launch is a one-shot event, and the audience expects to sign up or install on the day. Without a package to install, you spend your one launch on a demo and a deposit form. Launch on PH when a developer can install the SDK and get a watermarked build running in ten minutes. In the meantime, have the copy ready and, if PH offers a pre-launch or "coming soon" page at the time, use it to collect followers.

**Name:** Margin

**Tagline** (PH limit is 60 characters):

```text
Embeddable PDF annotation SDK with public pricing
```

(49 characters.) Alternative: `PDF viewing and annotation for your app, priced in public` (57 characters).

**Short description** (under 260 characters):

```text
Add PDF viewing, highlights, comments and signatures to your web app. Runs fully in the browser and exports annotations Acrobat can read. Free to develop, $5k/yr per production app. No per-document fees, no revenue-based pricing, renewals capped at 5%.
```

**Maker's first comment** (for launch day, once installable):

```text
Hi Product Hunt. I'm {{sender_name}}. We were quoted ~$30k a year for a PDF viewer for our product, priced by quote only, so I built the SDK I wanted to buy and put the price on the website.

[Update this paragraph with what's true on launch day: what's installable, which frameworks, what founding teams have shipped with it, if they agree to be named.]

I'll be here all day. Tell me what breaks.
```

---

## 6. Posting order, timing, and replies

### Principles

- **Warm before cold.** LinkedIn goes first because your network will be kind about rough edges and will give you the first round of feedback and fixes before strangers see it.
- **One channel per day.** You need to be present for the first hours of each post. Two launches on one day means doing both badly.
- **Fix between posts.** Every bug report from day 2 should be fixed before day 4. Mention the fixes in later posts; it shows the product is alive.
- **Highest risk in the middle of week 1**, once the obvious bugs are gone but while you still have energy and a clear calendar.
- **Week 2 uses week 1's learnings.** The r/SaaS post and the LinkedIn follow-up are better with real numbers.

### Schedule

Today is Sunday 4 October 2026. The plan assumes the pre-flight checklist in section 0 is done by Monday, and that cold outreach from `gtm/outreach.md` runs in parallel. Times are US Eastern; most of the target buyers (US Series A-C SaaS) are on US time.

| Day | Date | Channel | Time (ET) | Notes |
|---|---|---|---|---|
| Mon | Oct 5 | Final checks | | Deploy, test on phone and Safari, test the sign-up form end to end, real email set. Draft replies for section 1's table in your own words. |
| Tue | Oct 6 | **LinkedIn post** | 8:00-9:00 | Link in first comment. Stay on it for two hours. DM everyone who comments with substance and ask for a call. |
| Wed | Oct 7 | **Show HN** | 8:00-10:00 | The biggest day. Clear your calendar until early afternoon. First comment immediately after submitting. If it doesn't get traction, the moderators sometimes offer a second chance; don't resubmit yourself within a few days. |
| Wed | Oct 7 | **X thread** | Afternoon | After the HN rush. Don't tweet the HN link asking for votes. |
| Thu | Oct 8 | Fix day | | Fix everything HN found. Reply to late HN comments. Book calls from week 1 inbound. |
| Fri | Oct 9 | **r/reactjs** | 9:00-11:00 | Check the rules and flair the morning of. Mention fixes from HN feedback if relevant. |
| Sat | Oct 10 | **r/webdev** (Showoff Saturday) | 9:00-11:00 | Only on Saturday. |
| Sun | Oct 11 | Rest, write up week 1 | | Count: visits, demo sessions if tracked, sign-ups, calls booked, deposits, top 5 objections. |
| Mon | Oct 12 | **Indie Hackers** | 9:00-11:00 | Include week-1 numbers, honestly, even if they're small. |
| Tue | Oct 13 | **r/SaaS** | 9:00-11:00 | Use the draft above, and add one or two real things you learned in week 1 (e.g. "three teams told me the deposit is the wrong signal because..."). |
| Wed | Oct 14 | Follow-up on every warm lead | | Every person who said "interesting" in week 1 gets a direct message asking for a call. |
| Thu | Oct 15 | **LinkedIn follow-up post** | 8:00-9:00 | "What {{N}} conversations about PDF SDK pricing taught me", with N as the real count of calls held, not booked. Share real patterns (anonymized), not a sales pitch. Repeat the ask at the end. |
| Fri | Oct 16 | Review | | Decide what worked. Double down on the channel that produced calls, not the one that produced upvotes. |

If HN goes very well (front page, lots of inbound), push the Reddit posts back a few days and spend the time on calls. Conversations with buyers matter more than sticking to the schedule.

### What to do with replies

**Respond fast, then move qualified people off the platform.** Public threads are for answering questions. Calls are where validation happens. Each channel should end in a booked conversation.

**Sort every reply into one of five buckets** and log it the same day in the tracking sheet from `gtm/outreach.md` section 7, adding a `source` column (hn, reddit-webdev, reddit-reactjs, reddit-saas, linkedin, x, ih).

| Bucket | Example | What to do |
|---|---|---|
| **Buyer signal** | "We're paying Apryse and renewing in March." "We need exactly this for our claims tool." | Reply publicly with thanks, then DM or email within an hour: ask for a 20-minute call, using the call script in `gtm/discovery-calls.md`. These are the most valuable replies you'll get. Note company, role, current vendor, renewal date, quote amount if shared. |
| **Practitioner insight** | "We built ours on pdf.js, appearance streams took us two months." "We picked Nutrient because of X." | Thank them and ask one follow-up question in public. Ask if they'd do a short call; people who built it themselves are great interviews even if they never buy. |
| **Bug or file that breaks it** | "My 600-page drawing set crashes it on iPad." | Thank them, ask for the file if they can share it, fix, reply with "fixed" and what it was. Keep a folder of breaking files as your test suite. |
| **Feature request** | "Need redaction." "Vue please." | Log it with a count. Don't promise dates. Reply: "Logged. Can I ask what you'd use it for?" Requests from buyer-signal people weigh much more than drive-by requests. |
| **Skeptic or critic** | "This is a pdf.js wrapper." "No one will pay for this." | Concede what's right, answer once, then let it go. Log the objection; if it shows up more than three times, it's a positioning problem to fix on the site. Never argue twice in the same thread. |

**When someone asks which vendor quoted you:**

```text
I'd rather not name them over a private quote. Public numbers on Vendr show the two biggest vendors' median contracts at about $24k and $31k a year, which matches what we were quoted. If you've been through a quote recently, I'd honestly love to compare notes.
```

**When someone asks "is it ready for production?":**

```text
Not yet. The demo is the real viewer, but there's no installable package yet. That's why the founding deposit is refundable until you go live and billing only starts when you ship. If you have a date in mind, tell me and I'll be honest about whether we can make it.
```

**When someone asks for a discount below the founding price:** don't negotiate in public. "Happy to talk. What would make it work for you?" in a DM, then log what they said. Don't cut the price in a thread.

**What not to do with replies**

- Don't delete critical comments or posts that went badly.
- Don't ask friends to reply or upvote. On HN and Reddit it's against the rules and gets detected; on LinkedIn it's visible and looks bad.
- Don't move people to email with a sales sequence. One personal message, one follow-up a week later, then stop.

### How to tell if the launch worked

At the end of two weeks, count:

1. **Calls booked from launch posts** (target: 8-10 of the 30 interviews)
2. **Deposits** from people who first heard about Margin through a post
3. **Buyer-signal replies** by segment (legal, construction/AEC, insurance, health tech, other)
4. **Top five objections** and how often each came up
5. **Breaking files collected**

Upvotes, likes, impressions and followers go in a footnote. If HN gave you 300 points and zero calls, the message is reaching developers who like the demo but don't buy SDKs. Shift the next round toward the product-leader angle (LinkedIn, direct outreach). If LinkedIn gave you five calls from legal tech and Reddit gave you nothing, put week 3 into legal tech.
