# Margin outreach kit

Everything needed to book 30 validation calls and collect 10 founding commitments in about four weeks. That target comes from the market report (`reports/PDF SDK market opportunity.md`). The day-by-day plan for the first 14 days, and which file to use when, is in `gtm/README.md`. Copy blocks are ready to paste. Swap the `{{merge_fields}}` and the `[bracketed notes]` before you send anything.

Contents:

1. [Before you send](#1-before-you-send)
2. [Warm message to your network](#2-warm-message-to-your-network)
3. [Cold email sequences (product track and engineering track)](#3-cold-email-sequences)
4. [LinkedIn](#4-linkedin)
5. [Engineering leaders vs product leaders: what changes](#5-engineering-leaders-vs-product-leaders)
6. [Reply handling](#6-reply-handling)
7. [Tracking sheet and targets](#7-tracking-sheet-and-targets)

---

## 1. Before you send

### Merge fields

| Field | What goes in it | Example |
|---|---|---|
| `{{first_name}}` | First name only | Dana |
| `{{company}}` | Company name as they write it | TrialView |
| `{{hook}}` | One sentence on something real and specific to them. Start from the `hook` column in `gtm/prospects/all-prospects.csv` (the merged, ranked list; see `gtm/prospects/README.md`), keep only the observation (see below), then open the source URL and check it. | "Your help center says comments can't be pinned to a spot in an uploaded PDF." |
| `{{demo_url}}` | The deployed demo, ideally the full-screen viewer (`.../#/demo`). For the landing page with pricing, use `{{site_url}}`. | https://neildahan.github.io/Pdfreader/#/demo (if you deploy to GitHub Pages; see `gtm/DEPLOY.md`) |
| `{{sender_name}}` | Your name | |
| `{{site_url}}` | The landing page with pricing and FAQ (the demo URL without `#/demo`) | https://neildahan.github.io/Pdfreader/ |

### How to write `{{hook}}`

The hook is the only part of the email the prospect can tell was written for them. It decides the reply rate more than anything else in the email.

- **Good:** names something they shipped or wrote. "You shipped text-level citation highlighting across 1,000-page records in December." "Your plan reviewers mark up drawings live in the browser."
- **Good:** names a known vendor relationship from a public source. "Apryse's case study says you've used their SDK since 2013."
- **Bad:** flattery or filler. "I love what {{company}} is doing in legal tech."
- **Bad:** guesses stated as facts. If the SDK is "Unknown" in the prospect file, don't say "since you use Apryse." Ask instead: "If that runs on a commercial viewer..."
- Keep it to one sentence, under 20 words. Every cold email is written to stay under 110 words with a 20-word hook. Don't quote a source you haven't opened. The prospect files warn that some facts come from search snippets.
- **Don't paste the CSV hook as-is.** Most run 20-40 words and add a second, pitch sentence ("We sell that viewer layer at a public price..."). Keep the first sentence, the observation, and cut the rest. The email body already covers price, and "we sell" is false: nothing is on sale yet.
- Rows whose hook says "Interview target", "Not a buyer" or "Not a fit" have no hook. Use the warm or intro route for them, or skip them.

### Claims you can and can't make

The brand is honesty, so this list is strict.

| You can say | You can't say |
|---|---|
| A working demo exists and runs fully in the browser | That it's available, GA or production-ready |
| Highlight, underline, strikeout, pen, shapes, arrows, text boxes, sticky notes, drawn signatures, threaded comments with resolve, search, thumbnails, undo/redo, dark mode, mobile | Redaction or form filling (on the Business plan, not in the demo yet) |
| Exports real PDF annotations that open in Acrobat, Preview and Chrome; opens existing annotations (e.g. from Acrobat) as editable; JSON export | That you have customers, users, logos, testimonials or a waitlist count |
| Public prices: $0 Developer, $5k Startup, $12k Business, $25k+ Enterprise | That there's an npm package. `@margin/*` doesn't exist yet. |
| Founding offer: 50% off for life, $500 refundable deposit, plan starts at go-live, 20 spots | SOC 2, ISO 27001, a DPA template, or an SLA in force today |
| The demo's JavaScript is about 2.5MB uncompressed, about 0.8MB gzipped, including the pdf.js worker and the landing page (measured on the current build, not optimized) | Vue/Angular wrappers. The demo is React. Wrappers are a plan, not a product. |
| Apryse's own docs put the extracted WebViewer folder at 265MB (that's files on disk, not what a browser downloads) | "0.8MB vs 265MB". It compares a download to a folder, and anyone who runs WebViewer will know it. |
| Rendering is pdf.js; the annotation layer, comments, signatures and export are Margin's | Any delivery date you don't believe yourself |

### Fix before the first send

- [ ] **The $30k quote.** Check that your employer's Apryse quote wasn't covered by an NDA. If you're unsure, write "a large PDF SDK vendor" instead of "Apryse". Every message below works either way.
- [ ] **Your employment agreement.** Read the outside-work and IP-assignment clauses before you email anyone. Don't send from your employer's domain, laptop or working hours, and decide now how you'll answer "is this your employer's product?" (section 6).
- [ ] **The landing page claims.** Fixed on 4 Oct 2026: the FAQ and developer section no longer claim Vue, Angular, plain JS, TypeScript types or `npm install`; unbuilt pricing-card items (redaction and forms, security review package, collaboration server, SOC 2) are marked "planned"; the availability answer says "not generally available yet". Every email links to that page, so re-read the live version once before the first send.
- [ ] **Your timeline** in the "Is it production ready?" reply, and a **postal address** in the cold email footer.
- [ ] **The deposit link and the one-page founding agreement** (see `gtm/discovery-calls.md`, section 3). Don't ask for a deposit you have no way to take.

### Sending basics

- Send from your own name, as plain text. No images, no tracking pixels, at most one link (the demo). Plain emails get replies. Designed emails get filtered.
- Send cold email from a mailbox on a domain you own, never your employer's. A brand-new domain needs two to three weeks of light use before it sends cold mail reliably, so set it up now or use one you already have. Keep it to 20-30 new contacts a day, written by hand.
- Cold commercial email in the US needs a working opt-out and a postal address (CAN-SPAM). UK and EU recipients (Juro, TrialView and others in the prospect files) fall under PECR/GDPR, and Australian ones under the Spam Act. The footer below carries the opt-out line and your address, so keep it on every cold email, not just the last one. Check with counsel if you scale past a few hundred contacts.
- Put one contact per company in a sequence at a time. If the product lead says no, don't start the engineering track at the same company the next day. Ask for a referral instead.

---

## 2. Warm message to your network

For fellow product and engineering leaders who know you. This goes out first: these people are the most likely to reply, and their intros are worth more than any cold email.

### Email or long DM

**Subject:** 20 minutes of your judgment?

```text
Hi {{first_name}},

Asking a favor, and it's a small one.

When we were picking a PDF viewer for [product], Apryse quoted us about $30k a year. There was no price on the website, the add-ons were priced separately, and the number only arrived after a few calls. I asked around and kept hearing the same story.

So I built a working demo of what I wished I could buy: an embeddable PDF viewer and annotation SDK with public prices ($5k a year for one app, $12k for three), no per-document fees and no revenue audits. Here it is: {{demo_url}}

Two asks:

1. 20 minutes to tell me whether this is a real problem or just mine. Blunt is better.
2. If you know someone who has shipped PDF review or markup in their product (legal tech, construction, insurance, health tech), an intro would help a lot. There's a blurb below you can forward as-is.

I'm not selling you anything here. No hard feelings if the answer is "don't build this."

Thanks,
{{sender_name}}

---
Forwardable:
{{sender_name}} is validating Margin, a web PDF viewer and annotation SDK with public, flat pricing ($5k-$12k a year, no per-document or per-user fees). There's a working demo, and they want 20 minutes with people who have bought or built PDF annotation, to learn what it really cost and what hurt. Mostly questions; if it's a fit, they'll mention a founding-customer offer at the end, and that's it.
```

[Edit the third paragraph so it matches what actually happened. If there were no add-ons or extra calls, cut that clause. A specific true detail beats a general one.]

### Short version (Slack, WhatsApp, text)

```text
Hey {{first_name}}, quick one. We got quoted ~$30k/yr for a PDF SDK at [company], so I built a demo of the version I wanted: viewer + annotations, public pricing, $5-12k/yr. Would you give me 20 min to poke holes in it? And if you know anyone who's shipped PDF markup in their product, I'd love an intro. {{demo_url}}
```

### Follow-up to a warm contact who said yes to an intro

```text
Thank you. Here's a two-line version to paste:

"{{sender_name}} is a product VP who got a $30k PDF SDK quote and is now validating a version with public pricing. Worth 20 minutes if you've ever bought or built PDF annotation."

I'll keep it to one email to them, and I'll tell you what I learn.
```

---

## 3. Cold email sequences

There are two tracks with the same rhythm: day 0, day 3, day 8. The **product track** leads with cost, procurement and time to market. The **engineering track** leads with integration, bundle weight and annotation fidelity. Choose by the person's title, not by company (see section 5).

The founding offer shows up exactly once in each track, in email 2. Every email asks for a 20-minute call or a try of the demo, never a purchase. Each body is under 110 words, sign-off included, assuming a hook of 20 words or fewer. The footer (opt-out and address) goes on every email and isn't counted.

Send emails 2 and 3 as replies in the same thread. For a new thread, use the second subject line.

### Product track (VP/Head/Director of Product, founders, GMs)

#### Email 1, day 0

**Subject A:** PDF SDK pricing at {{company}}
**Subject B:** the $30k PDF viewer quote

```text
Hi {{first_name}},

{{hook}}

When I was choosing a PDF SDK for my own product, Apryse quoted us about $30k a year. So I built a demo of the alternative: an embeddable PDF viewer and annotation SDK with prices on the website. $5k a year for one app, $12k for three. No per-document fees, no revenue audits.

Demo: {{demo_url}}

Could I have 20 minutes on what you pay today and what would make switching worth it? I'm still deciding whether to build this, so a blunt no helps too.

{{sender_name}}
```

#### Email 2, day 3

**Subject A:** Re: PDF SDK pricing at {{company}}
**Subject B:** what we'd put in the contract

```text
Hi {{first_name}},

One more detail, then I'll leave it with you.

Margin isn't generally available yet, so I'm taking 20 founding customers. They get 50% off for life: Business is $6,000 a year instead of $12,000. It takes a $500 deposit, refundable until you go live, and the plan only starts then. Renewals are capped at 5% in the contract.

If the timing is wrong, I'd still value 20 minutes on how you bought your current viewer: who signed, how long it took, what surprised you.

{{demo_url}}

{{sender_name}}
```

#### Email 3, day 8

**Subject A:** Re: PDF SDK pricing at {{company}}
**Subject B:** right person?

```text
Hi {{first_name}},

Last note from me.

If PDF viewing isn't yours at {{company}}, who owns it? A name would help a lot.

If it is yours and now is the wrong time, reply "later" and I'll check back in three months. Nothing from me until then.

The demo stays up: {{demo_url}}. Open a contract or drawing, mark it up, export it, and open the file in Acrobat. Nothing gets uploaded.

Thanks either way,
{{sender_name}}
```

### Engineering track (VP/Head/Director of Engineering, CTO, frontend leads, staff engineers)

#### Email 1, day 0

**Subject A:** PDF annotations that survive Acrobat
**Subject B:** {{company}}'s document viewer

```text
Hi {{first_name}},

{{hook}}

I'm building Margin, a web PDF viewer and annotation SDK. The demo runs fully client-side: highlights, ink, shapes, notes, signatures, threaded comments. It exports real PDF annotations that Acrobat and Preview open, or JSON for your database.

The whole demo is about 0.8MB of gzipped JavaScript, pdf.js worker included. No server, no upload.

Try it with your ugliest PDF: {{demo_url}}

Would you give me 20 minutes on where your current viewer hurts? I'm validating before I build further.

{{sender_name}}
```

#### Email 2, day 3

**Subject A:** Re: PDF annotations that survive Acrobat
**Subject B:** what breaks first?

```text
Hi {{first_name}},

A question I'm asking every engineering lead: what breaks first in your PDF stack? Annotation round-trips, large files, mobile Safari memory, or bending the UI to fit your product?

Your answer decides what I build next. It isn't GA yet, so the first 20 teams to commit get 50% off for life, with a $500 refundable deposit and a plan that starts only when you ship. Prices are public: $5k a year for one app, $12k for three.

Demo: {{demo_url}}. If you break it, I want to hear how.

{{sender_name}}
```

#### Email 3, day 8

**Subject A:** Re: PDF annotations that survive Acrobat
**Subject B:** who owns the viewer?

```text
Hi {{first_name}},

Last one from me. If someone else at {{company}} owns the document viewer, I'd be grateful for their name.

If it's you and now is the wrong time, reply "later" and I'll check back in three months.

One thing worth two minutes even if you never reply: drop a PDF that someone marked up in Acrobat into {{demo_url}}. The existing annotations load as editable objects, and the file never leaves your browser.

{{sender_name}}
```

### Footer for every cold email

```text
--
{{sender_name}} · Margin (working name) · [postal address]
Not relevant? Reply "no" and I won't write again.
```

---

## 4. LinkedIn

Use LinkedIn for people with no findable email, and as a second channel two to three days after email 1 for your highest-fit prospects (fit 4-5 in the prospect files). Don't run the full email sequence and the full LinkedIn sequence on the same person at the same time.

### Connection note (under 200 characters)

Free LinkedIn accounts cap invitation notes at 200 characters and allow only a handful of personalized notes a month; Premium allows 300. Both notes below fit the free limit with a long name and company in place (about 170-180 characters), so they work on either.

**Product leader:**

```text
Hi {{first_name}}, a PDF SDK vendor quoted my team ~$30k/yr, so I'm testing one with public pricing. {{company}} ships PDF review in-app. Could I ask you a few questions?
```

**Engineering leader:**

```text
Hi {{first_name}}, I'm building a client-side PDF annotation SDK that round-trips with Acrobat. {{company}} ships PDF review in-app, so I'd value notes from someone who's built it.
```

Don't promise "no pitch" in the note. The follow-up mentions prices, and a broken promise in message two ends the conversation.

### Follow-up DM after they accept

Send it within a day of the accept, and keep it to one message. If they don't answer, send at most one nudge a week later, then stop.

**Product leader:**

```text
Thanks for connecting, {{first_name}}.

The short version: we were quoted about $30k a year for a PDF viewer with annotations. I built a demo of what I wanted to buy instead: public prices ($5k a year for one app, $12k for three), no per-document fees, no revenue audits, renewals capped at 5%. It isn't generally available yet.

{{demo_url}}

Would you be open to 20 minutes on how {{company}} bought its viewer, and whether a public price would have changed anything? Happy to share what I'm hearing from other teams in return.
```

**Engineering leader:**

```text
Thanks for connecting, {{first_name}}.

Here's the demo: {{demo_url}}. It's pdf.js and pdf-lib under a custom annotation layer. Highlights, ink, shapes, notes and signatures export as real PDF annotations that Acrobat opens and edits, and markups made in Acrobat load back in as editable. All client-side. It's a demo, not a package yet.

I'm trying to learn where teams like yours get stuck: round-trips, large files, mobile, or customization. Would you give me 20 minutes? If it's not a fit, I'll tell you so.
```

**One nudge, a week later (either persona):**

```text
No worries if this isn't a priority. If you ever open the demo, one line on what felt off would be more useful to me than a call.
```

---

## 5. Engineering leaders vs product leaders

Same product, different pains. Choose the track by title. At companies under 30 people, the CTO or founder is often both, so use the product track for founders and the engineering track for CTOs.

| | Product leaders | Engineering leaders |
|---|---|---|
| What they're judged on | Shipping roadmap features, gross margin, vendor spend | Reliability, page weight, maintenance load, integration time |
| Pain to lead with | Opaque quotes, add-on creep, revenue-based pricing, 3-year lock-ins, renewal hikes, weeks of procurement before a single line of code | Heavy SDK setup (Apryse's WebViewer folder is 265MB before you trim it), slow first load, annotations that don't round-trip, PDF.js missing annotation editing, mobile Safari canvas limits, hard-to-customize UI |
| Proof point that lands | Public price page, 5% renewal cap, plan starts at go-live, no metering | Open the demo, drop in their own file, export, open in Acrobat |
| Words to use | budget, procurement, renewal, time to market, contract | bundle, worker, round-trip, client-side, JSON, appearance streams |
| Words to avoid | API detail, library names | "honest pricing" as the lead (true, but it reads as marketing to engineers; put it second) |
| Best question on a call | "Walk me through how you bought your current viewer. Who signed, and what surprised you?" | "What's the last PDF bug that cost you a sprint?" |
| What a yes looks like | Willing to put down a $500 deposit, or to bring procurement in early | Willing to test their own documents in the demo and share what broke, then introduce the budget owner |

**Swap lines** for when you have to write to a mixed audience, or you're unsure of someone's role:

- Product line: "Prices are on the website, renewals are capped at 5%, and there's no per-document or per-user metering."
- Engineering line: "It runs fully client-side and exports annotations Acrobat can open and edit."

If you use only one, use the one that matches the title. Using both makes the email longer and weaker.

---

## 6. Reply handling

Answer within four business hours if you can. Speed signals a real person more than anything you write. Each reply below is short on purpose, with one question or one ask.

### "Send more info"

Often a polite brush-off. Give them something useful and lightweight, and make the next step easy.

```text
Sure. The short version:

- What it is: an embeddable web PDF viewer with annotations, comment threads and signatures. It exports real PDF annotations Acrobat can open, or JSON. Fully client-side.
- What it costs: $5k a year for one app, $12k for three, $25k+ for enterprise. No per-document or per-user fees.
- Where it stands: a working demo and a founding-customer program. Not generally available yet.

Demo: {{demo_url}}. Pricing and FAQ are on the landing page: {{site_url}}.

What would be most useful to see next? If it's easier, 20 minutes on a call covers it faster than a deck.
```

### "We already use Apryse"

These are your best interviews. They hold the real numbers. Don't argue and don't trash the vendor.

```text
That's exactly who I want to learn from. Apryse is a strong product, and if you use the broader platform (Office conversion, server SDKs, lots of platforms), we're honestly not a replacement.

If you mostly use viewing and annotation on the web, two questions: roughly when does your contract renew, and has the price moved since you signed?

Even if you stay, a public price next to your renewal quote is useful in that conversation. Happy to do 20 minutes whenever suits.
```

[If they say a 10-25% discount at renewal would solve it, write that in the sheet. Per the market report, it's a kill signal when it's the majority answer.]

### "Not now"

```text
Understood, thanks for telling me. When would be a better time: next quarter, or nearer your renewal?

One question in the meantime, if you have 30 seconds: what would have to be true for you to look at a different PDF SDK?
```

[Set `next_action_date` in the sheet to whatever they say, or 90 days by default. Then actually follow up.]

### "How much?"

Answer in the first line. A vague answer here contradicts the whole positioning.

```text
Development is free (Developer plan, watermark in production). Startup is $5,000 a year for one production app. Business is $12,000 a year for up to three apps. Enterprise starts at $25k. All plans have unlimited users and documents, with annotations, comments and signatures included. Annual terms, renewals capped at 5%.

Founding customers (20 spots) get 50% off for life. It takes a $500 refundable deposit, and the plan starts only when you go live.

To be clear on scope: redaction and form filling are on the Business plan but not in the demo yet. Which features would you need on day one?
```

### "Is it production ready?"

Say no in the first word. A credible no wins more trust than a stretched yes.

```text
No, not yet. Here's exactly where it stands.

Working today, in the demo: the viewer, every annotation tool, threaded comments, signatures, search, and export/import of real PDF annotations, all client-side.

Not done yet: a published npm package and docs, framework wrappers beyond React, redaction and forms, a SOC 2 report.

That's why founding customers pay nothing until go-live. The $500 deposit is refundable, and the plan starts the day you ship. [Add your honest timeline here, or say: "I'll give you a date once I trust it, not before."]

Would you test it against your own documents? That tells us both quickly whether it's close enough.
```

### Other replies you'll get

| They say | You say |
|---|---|
| "Unsubscribe" or "no" | "Done, sorry for the noise." Mark them `do_not_contact` in the sheet the same day. |
| "We built our own on PDF.js" | "Makes sense. Which parts do you maintain that you wish you didn't? Annotation editing and Acrobat round-trips are where most teams tell me it gets expensive." |
| "Is this your employer's product?" | "No. It's my own project, separate from [employer], and I'm validating it before deciding whether to go full time." [Adjust to what's true. If the honest answer is complicated, say so in one sentence rather than dodge.] |
| "Are you SOC 2?" | "Not yet, and I won't give you a date I can't stand behind. Everything runs in the browser, so we never receive your documents, which leaves less for a review to cover. What does your security review need to see?" |
| "Who else is using it?" | "Nobody in production yet. You'd be one of the first 20, which is why the founding price is half off for life." |
| "Can we get a trial?" | "Not inside your app yet: there's no installable package. What you can do today is run your own documents through the demo, and the deposit is refundable until you go live. What would you need to see working to call it a pass?" |
| "Isn't this just PDF.js?" | "The rendering is, yes. pdf.js is solid and free. What we add is the part teams end up building themselves: annotation tools, comment threads, signatures, and export that Acrobat reads back. Which of those have you built in-house?" |
| "What happens if you shut down?" | "Fair worry, and I'd ask it too. Before go-live you risk nothing: the deposit is refundable. After go-live the SDK runs inside your app with no server calls to us, so it keeps working if we disappear. What would you need in the contract to be comfortable?" [Don't offer source escrow unless you've decided to provide it.] |

---

## 7. Tracking sheet and targets

Use one row per person, in a Google Sheet or Airtable. Every reply, call and deposit gets logged the same day. The analysis is only as good as the sheet.

### Column spec

| Column | Type / allowed values | Notes |
|---|---|---|
| `id` | Number | |
| `first_name`, `last_name` | Text | |
| `title` | Text | |
| `persona` | `product` / `engineering` / `founder` | Decides the track |
| `company` | Text | |
| `segment` | `legal` / `construction` / `insurance` / `health` / `other` | |
| `size_stage` | Text | From the prospect files |
| `fit_score` | 1-5 | From the prospect files, or your own judgment |
| `source` | `warm` / `intro` / `cold_email` / `linkedin` / `inbound` | |
| `referred_by` | Text | Who made the intro |
| `email`, `linkedin_url` | Text | |
| `hook` | Text | Exactly what you sent |
| `hook_source_url` | URL | Proof that the hook is true |
| `current_sdk` | `apryse` / `nutrient` / `pdfjs` / `pdfjs_express` / `embedpdf` / `in_house` / `other` / `unknown` | |
| `sdk_confidence` | `confirmed` / `likely` / `unknown` | Confirmed means they told you or a case study says so |
| `stage` | See stage definitions below | One value only |
| `first_touch_date`, `last_touch_date` | Date | |
| `touches` | Number | Messages sent, all channels |
| `reply_type` | `positive` / `referral` / `not_now` / `info_request` / `no` / `unsubscribe` / `bounce` / `none` | First substantive reply |
| `next_action`, `next_action_date` | Text, date | Every open row has one |
| `call_date` | Date | |
| `annual_spend` | Number (USD) | What they pay or were quoted. Ask on every call. |
| `renewal_month` | Month | Your best timing signal |
| `pricing_model_pain` | `quote_opacity` / `add_ons` / `revenue_based` / `lock_in` / `renewal_hike` / `none` | Top one they named |
| `technical_pain` | `bundle_size` / `round_trip` / `large_files` / `mobile` / `customization` / `none` | Top one they named |
| `must_have_missing` | Text | Features they need that the demo lacks (redaction, forms, Vue...) |
| `discount_would_solve` | `yes` / `no` / `unclear` | Kill-criterion signal |
| `free_tool_acceptable` | `yes` / `no` / `unclear` | Would EmbedPDF plus in-house work do? Kill-criterion signal. |
| `plan_interest` | `startup` / `business` / `enterprise` / `none` | |
| `commitment` | `none` / `verbal` / `loi` / `deposit` | Only `deposit` and `loi` count toward the 10 |
| `deposit_date`, `deposit_amount` | Date, number | |
| `do_not_contact` | `yes` / blank | |
| `notes` | Text | Direct quotes are gold. Copy their exact words. |

### Stage definitions

`not_contacted` -> `contacted` -> `replied` -> `call_booked` -> `call_done` -> `committed` (LOI or deposit), plus `nurture` (not now, with a date) and `closed_lost` (no, unfit, unsubscribed).

### Targets

**Per batch of 50 contacts** (a mix of about 15 warm/intro and 35 cold):

| Step | Target | Rate |
|---|---|---|
| Contacts | 50 | |
| Replies (any) | 15 | 30% |
| Calls held | 8 | about half of replies |
| Deposits or LOIs | 3-5 | 40-60% of calls |

Two caveats on these numbers. A 30% blended reply rate only works if warm intros carry it: expect 40-60% from warm and intro contacts and 8-15% from good cold email. And 3-5 deposits from 8 calls is an ambitious close rate. It's realistic only because the deposit is refundable and the plan starts at go-live, so a "yes" costs the buyer almost nothing. Don't treat that close rate as evidence of willingness to pay full price. A deposit is a strong signal, not a renewal.

**For the four-week program** (30 calls, 10 commitments):

| Week | New contacts | Focus |
|---|---|---|
| 1 | 30 warm + 30 cold | Warm network first. Ask everyone for intros. Fix the hook and copy based on the first replies. |
| 2 | 50 cold + intros | Fit 4-5 prospects from the prospect files. Start LinkedIn on non-responders. |
| 3 | 50 cold + intros | Calls peak. Send a short written recap after each call and ask for the deposit if they fit. |
| 4 | 20-30 cold | Follow up on every `nurture` and every open call. Make the go/no-go read. |

For the first two weeks, `gtm/README.md` sets week 1 cold volume lower (about 11 verified companies, then 55-80 cold by day 14), because the prospect list has 36 contact-first companies and a new sending domain needs warm-up. That's about 200 contacts in total over four weeks. At the blended rates above, it gives roughly 35-50 replies, 30 calls and 8-12 commitments. If you're short on commitments by the end of week 2, the problem is usually the offer or the segment, not the volume.

### What the reply rates mean

**Cold email reply rate** (any reply, excluding bounces and auto-replies), read after 50 or more sends:

| Rate | Read | Action |
|---|---|---|
| Under 3% | Delivery or list problem, not a message problem | Check spam placement and bounces, confirm the titles are right, check hooks are specific |
| 3-8% | Normal for cold. The message isn't landing hard. | Rewrite the hooks first, then subject lines. Test the $30k story against an engineering-led opener. |
| 8-15% | Good. The pain is real for this list. | Keep going and push volume in the segment with the best rate. |
| Over 15% | Strong signal that the segment has a live problem | Double down on the segment. Ask every responder for two more names. |

**Warm and intro reply rate:** under 40% usually means the ask feels like a sales pitch. Make it more personal and shorter.

**The ratios that matter more than reply rate:**

- **Positive replies divided by all replies.** Under a third means they're replying to say no. Read the "no" reasons for a pattern: wrong persona, already happy, or price not the issue.
- **Calls with a named dollar figure.** If most people won't say what they pay, or they pay under $5k, the pain isn't where we think.
- **`discount_would_solve` = yes on more than half of calls.** This is a kill criterion from the market report. Buyers want leverage, not a new vendor.
- **`free_tool_acceptable` = yes on more than half of calls.** Also a kill criterion. EmbedPDF plus in-house work is good enough for them.
- **`must_have_missing` repeats.** If redaction or forms comes up on more than a third of calls, that's the build priority, and it may also explain lost deposits.

**Go/no-go at the end of week 4**, per the market report: **10 or more** deposits or LOIs is a go. **Fewer than 5** is a stop or a rethink. **5-9** means narrow to the segment that converted and run another four weeks before committing engineering.

### Weekly review (30 minutes, every Friday)

1. Funnel counts by stage, source and persona.
2. Reply rate per email step, persona and segment. At this volume you can't A/B test subject lines: 40 sends at a 5% reply rate is two replies. Pick one subject per email, and change it only if a whole step sits under 3% after 100 sends. With no tracking pixels you won't see opens, and that's fine.
3. Top three verbatim quotes of the week, on pricing pain and on technical pain.
4. Kill-signal tally: `discount_would_solve`, `free_tool_acceptable`, `must_have_missing`.
5. Next week's list: who's due a follow-up, and which segment gets the most new contacts.
